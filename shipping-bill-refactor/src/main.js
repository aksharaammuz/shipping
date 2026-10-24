import { getShippingBillOptions, submitShippingBill } from "./services/shippingBillService.js";
import { validateShippingBill } from "./utils/validation.js";

const form = document.querySelector("#shipping-form");
const loadingState = document.querySelector("#loading-state");
const errorState = document.querySelector("#error-state");
const notice = document.querySelector("#notice");
const submitButton = document.querySelector("#submit-button");
const modal = document.querySelector("#success-modal");
const requiredFields = [...form.querySelectorAll("[required]")];
let formOptions = null;

function showNotice(message, type = "info") {
  notice.textContent = message;
  notice.className = `notice ${type}`;
  notice.hidden = false;
}
function hideNotice() { notice.hidden = true; }

function populateSelect(id, values, getValue = (item) => item, getLabel = (item) => item) {
  const select = document.getElementById(id);
  const placeholder = select.options[0].textContent;
  select.replaceChildren(new Option(placeholder, ""));
  for (const item of values) select.add(new Option(getLabel(item), getValue(item)));
}
function populateOptions(options) {
  populateSelect("exporterCountry", options.countries);
  populateSelect("destinationCountry", options.countries);
  populateSelect("port", options.ports);
  populateSelect("transportMode", options.transportModes);
  populateSelect("currency", options.currencies, (item) => item.code, (item) => item.label);
}
async function loadFormOptions() {
  loadingState.hidden = false;
  errorState.hidden = true;
  form.hidden = true;
  hideNotice();
  try {
    formOptions = await getShippingBillOptions();
    if (!formOptions.countries.length || !formOptions.ports.length) {
      throw new Error("No reference options are available.");
    }
    populateOptions(formOptions);
    loadingState.hidden = true;
    form.hidden = false;
  } catch (error) {
    loadingState.hidden = true;
    errorState.hidden = false;
    console.error("Form options could not be loaded:", error);
  }
}

function readFormData() {
  return Object.fromEntries(new FormData(form).entries());
}
function clearFieldError(field) {
  field.removeAttribute("aria-invalid");
  const message = field.closest(".field")?.querySelector(".field-error");
  if (message) message.textContent = "";
}
function setFieldError(name, message) {
  const field = form.elements.namedItem(name);
  if (!field) return;
  field.setAttribute("aria-invalid", "true");
  const error = field.closest(".field")?.querySelector(".field-error");
  if (error) error.textContent = message;
}
function renderErrors(errors) {
  for (const field of form.querySelectorAll("input, select, textarea")) clearFieldError(field);
  for (const [name, message] of Object.entries(errors)) setFieldError(name, message);
  const firstInvalid = form.querySelector('[aria-invalid="true"]');
  if (firstInvalid) firstInvalid.focus();
}
function updateProgress() {
  const filled = requiredFields.filter((field) => String(field.value).trim() !== "").length;
  const percent = Math.round((filled / requiredFields.length) * 100);
  document.querySelector("#progress-label").textContent = `${percent}% complete`;
  document.querySelector("#progress-bar").style.width = `${percent}%`;
  const groups = {
    exporter: ["exporterName", "iec", "exporterCountry"],
    consignee: ["consigneeName", "destinationCountry", "consigneeAddress"],
    shipment: ["port", "transportMode", "invoiceNumber", "invoiceDate", "currency", "invoiceValue"],
    goods: ["goodsDescription", "hsCode", "packages", "grossWeight", "netWeight"]
  };
  for (const [group, names] of Object.entries(groups)) {
    const complete = names.every((name) => String(form.elements.namedItem(name)?.value ?? "").trim());
    const icon = document.querySelector(`#check-${group}`);
    icon.textContent = complete ? "✓" : "○";
    icon.classList.toggle("complete", complete);
  }
}
function updateCurrencySymbol() {
  const selected = formOptions?.currencies.find((item) => item.code === form.elements.currency.value);
  document.querySelector("#currency-prefix").textContent = selected?.symbol ?? "—";
}
function resetForm() {
  form.reset();
  renderErrors({});
  updateProgress();
  updateCurrencySymbol();
  hideNotice();
  document.querySelector("#draft-status").textContent = "Draft · Not submitted";
}

form.addEventListener("input", (event) => {
  if (event.target.matches("input, textarea, select")) {
    clearFieldError(event.target);
    updateProgress();
  }
});
form.addEventListener("change", (event) => {
  if (event.target.name === "currency") updateCurrencySymbol();
  updateProgress();
});
document.querySelector("#retry-load").addEventListener("click", loadFormOptions);
document.querySelector("#reset-form").addEventListener("click", () => {
  if (requiredFields.some((field) => field.value.trim())) {
    if (!window.confirm("Clear all entered declaration details?")) return;
  }
  resetForm();
});
document.querySelector("#close-modal").addEventListener("click", () => {
  modal.hidden = true;
  document.querySelector("#draft-status").textContent = "Submitted · Demo";
});
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideNotice();
  const data = readFormData();
  const errors = validateShippingBill(data);
  renderErrors(errors);
  if (Object.keys(errors).length) {
    showNotice(`Please correct ${Object.keys(errors).length} field${Object.keys(errors).length === 1 ? "" : "s"} before submitting.`, "error");
    return;
  }
  submitButton.disabled = true;
  submitButton.textContent = "Submitting…";
  try {
    const result = await submitShippingBill(data);
    document.querySelector("#reference-number").textContent = result.reference;
    modal.hidden = false;
  } catch (error) {
    showNotice(error.message || "Submission failed. Please try again.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Review &amp; submit <span>→</span>';
  }
});

updateProgress();
loadFormOptions();
