/* ============================================================
   BestRate — mortgage payment calculator
   Standard Canadian semi-annual compounding conversion,
   then amortized to the selected payment frequency.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const priceInput   = document.getElementById('homePrice');
  const downInput    = document.getElementById('downPayment');
  const downPct      = document.getElementById('downPaymentPct');
  const rateInput    = document.getElementById('rateInput');
  const rateVal      = document.getElementById('rateVal');
  const amortInput   = document.getElementById('amortInput');
  const amortVal     = document.getElementById('amortVal');
  const freqButtons  = document.querySelectorAll('#freqToggle button');

  if(!priceInput) return; // not on this page

  let frequency = 'monthly';

  const paymentsPerYear = { monthly: 12, biweekly: 26, weekly: 52, accelerated: 26 };

  function canadianMonthlyRate(annualRatePct){
    // Canadian mortgages compound semi-annually, not monthly.
    const i = annualRatePct / 100;
    const semiAnnual = Math.pow(1 + i / 2, 2);
    return Math.pow(semiAnnual, 1 / 12) - 1;
  }

  function calc(){
    const price = parseFloat(priceInput.value) || 0;
    let down = parseFloat(downInput.value) || 0;
    if(down > price) down = price;
    const principal = Math.max(price - down, 0);
    const annualRate = parseFloat(rateInput.value);
    const amortYears = parseInt(amortInput.value, 10);

    rateVal.textContent = annualRate.toFixed(2) + '%';
    amortVal.textContent = amortYears + ' yrs';
    downPct.textContent = price > 0 ? Math.round((down/price)*100) + '%' : '0%';

    const monthlyRate = canadianMonthlyRate(annualRate);
    const n = amortYears * 12;

    let monthlyPayment = 0;
    if(monthlyRate === 0){
      monthlyPayment = principal / n;
    } else {
      monthlyPayment = principal * (monthlyRate * Math.pow(1+monthlyRate, n)) / (Math.pow(1+monthlyRate, n) - 1);
    }

    let displayPayment = monthlyPayment;
    let freqLabel = 'per month';

    if(frequency === 'biweekly'){
      displayPayment = (monthlyPayment * 12) / 26;
      freqLabel = 'per 2 weeks';
    } else if(frequency === 'weekly'){
      displayPayment = (monthlyPayment * 12) / 52;
      freqLabel = 'per week';
    } else if(frequency === 'accelerated'){
      displayPayment = monthlyPayment / 2;
      freqLabel = 'accelerated / 2 weeks';
    }

    const totalPayments = frequency === 'monthly' ? n
      : frequency === 'accelerated' ? amortYears * 26
      : frequency === 'biweekly' ? amortYears * 26
      : amortYears * 52;

    const totalPaid = displayPayment * totalPayments;
    const totalInterest = totalPaid - principal;

    document.getElementById('resPayment').innerHTML =
      '$' + formatMoney(displayPayment) + ' <small>' + freqLabel + '</small>';
    document.getElementById('resLoan').textContent = '$' + formatMoney(principal, 0);
    document.getElementById('resInterest').textContent = '$' + formatMoney(totalInterest, 0);
    document.getElementById('resTotal').textContent = '$' + formatMoney(totalPaid, 0);
    document.getElementById('resDown').textContent = '$' + formatMoney(down, 0);

    drawBars(principal, totalInterest);
  }

  function formatMoney(n, decimals = 2){
    return n.toLocaleString('en-CA', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }

  function drawBars(principal, interest){
    const barPrincipal = document.getElementById('barPrincipal');
    const barInterest = document.getElementById('barInterest');
    if(!barPrincipal || !barInterest) return;
    const total = principal + interest || 1;
    barPrincipal.style.width = Math.max((principal/total)*100, 4) + '%';
    barInterest.style.width = Math.max((interest/total)*100, 4) + '%';
  }

  [priceInput, downInput, rateInput, amortInput].forEach(el => {
    el.addEventListener('input', calc);
  });

  freqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      freqButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      frequency = btn.dataset.freq;
      calc();
    });
  });

  calc();
});
