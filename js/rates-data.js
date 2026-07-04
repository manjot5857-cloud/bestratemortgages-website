/* ============================================================
   BestRate Mortgages — RATE DATA
   ============================================================
   This is the single source of truth for every rate shown on
   rates.html. Edit the numbers below and every visitor sees the
   update — no other file needs to change.

   FIELDS
   id        unique code, don't reuse (e.g. "rbc-5yr-fixed")
   lender    display name
   color     hex color for the little lender dot/badge
   term      length of term in years (used for the term filter)
   type      "Fixed" or "Variable"
   insured   true = high-ratio / insured (<20% down), false = conventional
   rate      the interest rate as a number, e.g. 4.34
   tag       optional short label, e.g. "Best rate" — leave "" for none

   HOW TO PUBLISH A CHANGE
   1. Edit a number/field below and save this file, OR
   2. Open rates-admin.html in a browser, edit rates there, click
      "Save changes", then click "Download rates-data.js" and
      replace this file with the one you downloaded.
   Either way, upload the updated file to your host to go live.
   ============================================================ */

window.RATES_DATA = [
  { id: "mcap-5yr-fixed-ins",     lender: "MCAP",            color: "#7A2D8C", term: 5,  type: "Fixed",    insured: true,  rate: 4.34, tag: "Best rate" },
  { id: "equitable-5yr-var-ins",  lender: "Equitable Bank",  color: "#00857C", term: 5,  type: "Variable", insured: true,  rate: 4.09, tag: "" },
  { id: "hometrust-1yr-fixed",    lender: "Home Trust",      color: "#C89B3C", term: 1,  type: "Fixed",    insured: true,  rate: 4.79, tag: "" },
  { id: "firstnational-2yr-fixed",lender: "First National",  color: "#1B3A63", term: 2,  type: "Fixed",    insured: false, rate: 4.59, tag: "" },
  { id: "firstnational-3yr-fixed",lender: "First National",  color: "#1B3A63", term: 3,  type: "Fixed",    insured: false, rate: 4.49, tag: "" },
  { id: "td-4yr-fixed",           lender: "TD",              color: "#00A650", term: 4,  type: "Fixed",    insured: false, rate: 4.71, tag: "" },
  { id: "td-5yr-variable",        lender: "TD",              color: "#00A650", term: 5,  type: "Variable", insured: false, rate: 4.65, tag: "" },
  { id: "rbc-5yr-fixed",          lender: "RBC",             color: "#005DAA", term: 5,  type: "Fixed",    insured: false, rate: 4.79, tag: "" },
  { id: "scotiabank-5yr-fixed",   lender: "Scotiabank",      color: "#EC1C2E", term: 5,  type: "Fixed",    insured: false, rate: 4.84, tag: "" },
  { id: "bmo-5yr-fixed",          lender: "BMO",             color: "#0033A0", term: 5,  type: "Fixed",    insured: false, rate: 4.89, tag: "" },
  { id: "cibc-5yr-fixed",         lender: "CIBC",            color: "#B4131B", term: 5,  type: "Fixed",    insured: false, rate: 4.87, tag: "" },
  { id: "natbank-5yr-fixed",      lender: "National Bank",   color: "#004C97", term: 5,  type: "Fixed",    insured: false, rate: 4.82, tag: "" },
  { id: "tangerine-5yr-fixed",    lender: "Tangerine",       color: "#F37021", term: 5,  type: "Fixed",    insured: false, rate: 4.94, tag: "" },
  { id: "hsbc-5yr-fixed",         lender: "HSBC",             color: "#DB0011", term: 5,  type: "Fixed",    insured: false, rate: 4.91, tag: "" },
  { id: "rbc-7yr-fixed",          lender: "RBC",             color: "#005DAA", term: 7,  type: "Fixed",    insured: false, rate: 5.09, tag: "" },
  { id: "bmo-10yr-fixed",         lender: "BMO",             color: "#0033A0", term: 10, type: "Fixed",    insured: false, rate: 5.49, tag: "" }
];
