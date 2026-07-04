/* ============================================================
   BestRate Mortgages — rates engine
   Reads window.RATES_DATA (data/rates-data.js), applies any
   local edits saved from rates-admin.html, computes an
   illustrative payment per $500k, and renders rates.html.
   ============================================================ */

const RATES_STORAGE_KEY = 'bestrate_rates_override';

/* Canadian mortgages compound semi-annually, not monthly —
   same formula used on the calculator page. */
function canadianMonthlyRate(annualRatePct){
  const i = annualRatePct / 100;
  const semiAnnual = Math.pow(1 + i / 2, 2);
  return Math.pow(semiAnnual, 1 / 12) - 1;
}

function monthlyPaymentFor(rate, principal = 500000, amortYears = 25){
  const monthlyRate = canadianMonthlyRate(rate);
  const n = amortYears * 12;
  if(monthlyRate === 0) return principal / n;
  return principal * (monthlyRate * Math.pow(1+monthlyRate, n)) / (Math.pow(1+monthlyRate, n) - 1);
}

/* Returns the working rate list: saved local edits if present,
   otherwise the defaults shipped in data/rates-data.js. */
function getRates(){
  try{
    const saved = localStorage.getItem(RATES_STORAGE_KEY);
    if(saved) return JSON.parse(saved);
  }catch(e){ /* fall through to defaults */ }
  return (window.RATES_DATA || []).map(r => ({...r}));
}

function saveRates(rates){
  localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(rates));
}

function clearRatesOverride(){
  localStorage.removeItem(RATES_STORAGE_KEY);
}

/* ---------------- rates.html rendering ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('ratesBody');
  if(!tbody) return; // not on rates.html

  const rates = getRates().sort((a,b) => a.rate - b.rate);
  const typeToolbar = document.getElementById('typeToolbar');
  const termToolbar = document.getElementById('termToolbar');

  let activeType = 'all';
  let activeTerm = 'all';

  renderTermChips(rates);
  renderRows();

  if(typeToolbar){
    typeToolbar.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        typeToolbar.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeType = chip.dataset.filter;
        renderRows();
      });
    });
  }

  function renderTermChips(list){
    if(!termToolbar) return;
    const terms = Array.from(new Set(list.map(r => r.term))).sort((a,b) => a-b);
    termToolbar.innerHTML = '<button class="chip active" data-term="all">All lengths</button>' +
      terms.map(t => `<button class="chip" data-term="${t}">${t}-Year</button>`).join('');

    termToolbar.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        termToolbar.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeTerm = chip.dataset.term;
        renderRows();
      });
    });
  }

  function renderRows(){
    const filtered = rates.filter(r => {
      const typeMatch = activeType === 'all'
        || (activeType === 'fixed' && r.type === 'Fixed')
        || (activeType === 'variable' && r.type === 'Variable')
        || (activeType === 'insured' && r.insured);
      const termMatch = activeTerm === 'all' || String(r.term) === String(activeTerm);
      return typeMatch && termMatch;
    });

    if(!filtered.length){
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--slate);">
        No rates match those filters right now — try a different term or type.
      </td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(r => {
      const payment = monthlyPaymentFor(r.rate);
      const insuredTag = r.insured ? `<span class="tag" style="background:var(--gold-100);color:var(--gold-600);">Insured</span>` : '';
      const customTag = r.tag ? `<span class="tag">${r.tag}</span>` : '';
      return `
        <tr>
          <td><div class="lender-cell"><span class="lender-dot" style="background:${r.color}"></span>${r.lender}</div></td>
          <td>${r.term}-Year</td>
          <td>${r.type}${customTag}${insuredTag}</td>
          <td class="rate-cell">${r.rate.toFixed(2)}%</td>
          <td class="mono">$${Math.round(payment).toLocaleString('en-CA')}</td>
          <td class="apply-cell"><a href="contact.html">Get quote</a></td>
        </tr>`;
    }).join('');
  }
});
