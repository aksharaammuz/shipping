# Shipping Bill Refactor — Harbor

A small, responsive Shipping Bill form prototype focused on maintainable structure, clear field relationships, reusable validation, and API-ready asynchronous services. Built with HTML, CSS, and vanilla JavaScript; it has **no added package dependencies**.

## Run locally

Because the JavaScript uses ES modules, serve the folder with any local static server. For example, if Python is installed:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

No build step is required. The Google Fonts import is optional; the page falls back to system sans-serif fonts if unavailable.

## Structure

```text
src/
├── data/mockData.js                 # Mock reference options
├── services/shippingBillService.js  # Promise-based service boundary
├── utils/validation.js              # Pure validation rules
└── main.js                          # DOM events, form state and rendering
index.html                           # Semantic form markup
styles.css                           # Responsive presentation
```

## Engineering decisions

- UI code does not import hardcoded option arrays. It requests options through `getShippingBillOptions()`.
- `getShippingBillOptions()` and `submitShippingBill()` are asynchronous service functions and can be replaced with HTTP calls without changing the form markup.
- Loading and error states are shown while fetching options; a retry action is available.
- Validation is centralized and returns field-keyed errors. The UI renders those errors consistently and focuses the first invalid field.
- The form provides progress feedback, section completion indicators, submission loading, and a confirmation dialog.
- Domain rules are deliberately pragmatic assumptions for a demo: IEC is validated as 10 alphanumeric characters, GSTIN as 15 alphanumeric characters when supplied, HS/HSN as 6–8 digits, package count as a positive integer, and net weight cannot exceed gross weight. Confirm current official requirements before using these rules in a production customs workflow.
- This prototype only simulates submission. It does not submit a customs declaration or connect to an external authority.

## AI Usage & Approach

- **Tools used:** ChatGPT for planning, architecture review and drafting validation scenarios.
- **How used:** To outline service boundaries, identify practical field checks and review user-facing states.


