const text = (value) => String(value ?? "").trim();

export function validateShippingBill(data) {
  const errors = {};
  const required = [
    ["exporterName", "Enter the exporter or company name."],
    ["iec", "Enter the Importer Exporter Code."],
    ["exporterCountry", "Choose the exporter country."],
    ["consigneeName", "Enter the consignee or buyer name."],
    ["destinationCountry", "Choose the destination country."],
    ["consigneeAddress", "Enter the consignee address."],
    ["port", "Choose the port of loading."],
    ["transportMode", "Choose a transport mode."],
    ["invoiceNumber", "Enter the commercial invoice number."],
    ["invoiceDate", "Choose the invoice date."],
    ["currency", "Choose the invoice currency."],
    ["invoiceValue", "Enter the invoice value."],
    ["goodsDescription", "Describe the goods."],
    ["hsCode", "Enter the HS / HSN code."],
    ["packages", "Enter the number of packages."],
    ["grossWeight", "Enter the gross weight."],
    ["netWeight", "Enter the net weight."]
  ];
  for (const [key, message] of required) if (!text(data[key])) errors[key] = message;

  if (text(data.iec) && !/^[A-Z0-9]{10}$/i.test(text(data.iec))) {
    errors.iec = "IEC should contain 10 letters or numbers.";
  }
  if (text(data.gstin) && !/^[0-9A-Z]{15}$/i.test(text(data.gstin))) {
    errors.gstin = "GSTIN should contain 15 letters or numbers.";
  }
  if (text(data.hsCode) && !/^\d{6,8}$/.test(text(data.hsCode))) {
    errors.hsCode = "Enter a 6–8 digit HS / HSN code.";
  }
  if (text(data.invoiceValue) && (!Number.isFinite(Number(data.invoiceValue)) || Number(data.invoiceValue) <= 0)) {
    errors.invoiceValue = "Invoice value must be greater than zero.";
  }
  if (text(data.packages) && (!Number.isInteger(Number(data.packages)) || Number(data.packages) < 1)) {
    errors.packages = "Enter a whole number of packages (at least 1).";
  }
  for (const key of ["grossWeight", "netWeight"]) {
    if (text(data[key]) && (!Number.isFinite(Number(data[key])) || Number(data[key]) <= 0)) {
      errors[key] = "Weight must be greater than zero.";
    }
  }
  if (text(data.grossWeight) && text(data.netWeight) &&
      Number(data.netWeight) > Number(data.grossWeight)) {
    errors.netWeight = "Net weight cannot exceed gross weight.";
  }
  if (text(data.invoiceDate)) {
    const date = new Date(`${data.invoiceDate}T00:00:00`);
    if (Number.isNaN(date.getTime())) errors.invoiceDate = "Enter a valid invoice date.";
    else if (date > new Date()) errors.invoiceDate = "Invoice date cannot be in the future.";
  }
  return errors;
}
