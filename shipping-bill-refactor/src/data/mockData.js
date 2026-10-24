// Mock reference data is deliberately kept separate from the UI and service layer.
export const mockFormOptions = {
  countries: ["Australia", "Canada", "Germany", "India", "Japan", "Singapore", "United Arab Emirates", "United Kingdom", "United States"],
  ports: ["Chennai (INMAA)", "Cochin (INCOK)", "Kolkata (INCCU)", "Mumbai (INBOM)", "Nhava Sheva (INNSA)", "Tuticorin (INTUT)"],
  transportModes: ["Sea", "Air", "Road", "Rail"],
  currencies: [
    { code: "USD", label: "US Dollar (USD)", symbol: "$" },
    { code: "EUR", label: "Euro (EUR)", symbol: "€" },
    { code: "GBP", label: "Pound Sterling (GBP)", symbol: "£" },
    { code: "INR", label: "Indian Rupee (INR)", symbol: "₹" },
    { code: "AED", label: "UAE Dirham (AED)", symbol: "د.إ" }
  ]
};
