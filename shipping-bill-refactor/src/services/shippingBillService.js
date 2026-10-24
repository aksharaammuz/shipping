import { mockFormOptions } from "../data/mockData.js";

const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

/**
 * API boundary: replace the simulated implementation with fetch() calls later.
 * The UI only depends on these exported functions, not on the mock data.
 */
export async function getShippingBillOptions() {
  await delay(500);
  // Set this to true temporarily to inspect the loading-error state.
  const simulateError = false;
  if (simulateError) throw new Error("Unable to load form options.");
  return structuredClone(mockFormOptions);
}

export async function submitShippingBill(formData) {
  await delay(800);
  if (!formData || typeof formData !== "object") {
    throw new Error("The declaration data is missing.");
  }
  // Simulates an API response; no customs authority is contacted.
  return {
    ok: true,
    reference: `SB-DEMO-${Date.now().toString().slice(-6)}`,
    submittedAt: new Date().toISOString()
  };
}
