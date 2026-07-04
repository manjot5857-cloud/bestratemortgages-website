/* ============================================================
   BestRate Mortgages — rates admin
   Uses getRates()/saveRates()/clearRatesOverride() from
   js/rates-engine.js.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const body = document.getElementById('adminBody');
  if(!body) return;

  let rates = getRates();

  function renderAdminRows(){
    body.innerHTML = rates.map((r, idx) => `
      <tr data-idx="${idx}">
        <td><input type="color" value="${r.color}" data-field="color"></td>
        <td><input type="text" value="${r.lender}" data-field="lender" placeholder="Lender name"></td>
        <td><input type="number" value="${r.term}" data-field="term" min="1" max="30" style="width:70px"></td>
        <td>
          <select data-field="type">
            <option value="Fixed" ${r.type === 'Fixed' ? 'selected' : ''}>Fixed</option>
            <option value="Variable" ${r.type === 'Variable' ? 'selected' : ''}>Variable</option>
          </select>
        </td>
        <td style="text-align:center;"><input type="checkbox" data-field="insured" ${r.insured ? 'checked' : ''}></td>
        <td><input type="number" value="${r.rate}" data-field="rate" step="0.01" style="width:90px"></td>
        <td><input type="text" value="${r.tag || ''}" data-field="tag" placeholder="e.g. Best rate"></td>
        <td><button class="row-del" data-del="${idx}">Remove</button></td>
      </tr>
    `).join('');

    body.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', onFieldChange);
      el.addEventListener('change', onFieldChange);
    });
    body.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        rates.splice(parseInt(btn.dataset.del, 10), 1);
        renderAdminRows();
      });
    });
  }

  function onFieldChange(e){
    const tr = e.target.closest('tr');
    const idx = parseInt(tr.dataset.idx, 10);
    const field = e.target.dataset.field;
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    if(field === 'term' || field === 'rate') value = parseFloat(value) || 0;
    rates[idx][field] = value;
  }

  renderAdminRows();

  document.getElementById('addRow').addEventListener('click', () => {
    rates.push({
      id: 'custom-' + Date.now(),
      lender: 'New lender',
      color: '#0F2A43',
      term: 5,
      type: 'Fixed',
      insured: false,
      rate: 4.99,
      tag: ''
    });
    renderAdminRows();
  });

  document.getElementById('saveRates').addEventListener('click', () => {
    saveRates(rates);
    flashStatus('Saved — refresh rates.html to see it live in this browser.');
  });

  document.getElementById('resetRates').addEventListener('click', () => {
    if(!confirm('Reset all rates back to the defaults shipped in data/rates-data.js? This clears anything saved in this browser.')) return;
    clearRatesOverride();
    rates = getRates();
    renderAdminRows();
    flashStatus('Reset to shipped defaults.');
  });

  document.getElementById('exportRates').addEventListener('click', () => {
    const box = document.getElementById('exportBox');
    box.style.display = 'block';
    box.value = buildFileContents(rates);
    box.select();
    downloadFile('rates-data.js', box.value);
    flashStatus('Downloaded — upload this file to data/rates-data.js on your host.');
  });

  function flashStatus(msg){
    const status = document.getElementById('adminStatus');
    status.textContent = msg;
    status.classList.add('show');
    setTimeout(() => status.classList.remove('show'), 4000);
  }

  function buildFileContents(list){
    const lines = list.map(r => {
      return `  { id: ${JSON.stringify(r.id)}, lender: ${JSON.stringify(r.lender)}, color: ${JSON.stringify(r.color)}, term: ${r.term}, type: ${JSON.stringify(r.type)}, insured: ${!!r.insured}, rate: ${r.rate}, tag: ${JSON.stringify(r.tag || '')} }`;
    });
    return `/* ============================================================\n   BestRate Mortgages — RATE DATA\n   Exported from rates-admin.html on ${new Date().toISOString().slice(0,10)}\n   Replace data/rates-data.js on your host with this file to\n   publish these rates to every visitor.\n   ============================================================ */\n\nwindow.RATES_DATA = [\n${lines.join(',\n')}\n];\n`;
  }

  function downloadFile(filename, contents){
    const blob = new Blob([contents], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
});
