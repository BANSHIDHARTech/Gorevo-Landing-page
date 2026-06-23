
(function () {
  const el = document.getElementById('pct');
  if (!el) return;
  const target = 90;
  const duration = 1200;
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
})();

// Mobile menu
function toggleMenu() {
  const links = document.getElementById('nav-links');
  if (links) links.classList.toggle('mobile-open');
}

// WhatsApp redirect
function openWA() {
  window.open('https://wa.me/918679111428', '_blank');
}

// ── SHARED UTILITY ──
function formatINR(n) {
  return Math.round(n).toLocaleString('en-IN');
}


const EXCEL_DATA = {
  2: { rate: 63000, cost: 126000, gst: 11214, value: 137214, subsidy: 90000, balance: 47214, solarEmi: 1161, evEmi: 0, totalEmi: 1161, baas: 0, custOut: 1161, netSave: 589, savePct: 33.7, yr5: 34162, yr25: 525000, lifetime: 559162 },
  3: { rate: 60000, cost: 180000, gst: 16020, value: 196020, subsidy: 108000, balance: 88020, solarEmi: 2164, evEmi: 0, totalEmi: 2164, baas: 0, custOut: 2164, netSave: 836, savePct: 27.9, yr5: 48488, yr25: 900000, lifetime: 948488 },
  4: { rate: 59500, cost: 238000, gst: 21182, value: 259182, subsidy: 108000, balance: 151182, solarEmi: 3717, evEmi: 0, totalEmi: 3717, baas: 0, custOut: 3717, netSave: 783, savePct: 17.4, yr5: 45414, yr25: 1350000, lifetime: 1395414 },
  5: { rate: 59500, cost: 297500, gst: 26477.5, value: 323978, subsidy: 108000, balance: 215978, solarEmi: 5310, evEmi: 0, totalEmi: 5310, baas: 0, custOut: 5310, netSave: 690, savePct: 11.5, yr5: 40020, yr25: 1800000, lifetime: 1840020 },
  6: { rate: 57500, cost: 345000, gst: 30705, value: 375705, subsidy: 108000, balance: 267705, solarEmi: 6582, evEmi: 0, totalEmi: 6582, baas: 0, custOut: 6582, netSave: 718, savePct: 9.8, yr5: 41644, yr25: 2190000, lifetime: 2231644 },
  7: { rate: 56900, cost: 398300, gst: 35448.7, value: 433749, subsidy: 108000, balance: 325749, solarEmi: 8010, evEmi: 0, totalEmi: 8010, baas: 0, custOut: 8010, netSave: 490, savePct: 5.8, yr5: 28420, yr25: 2550000, lifetime: 2578420 },
  8: { rate: 56000, cost: 448000, gst: 39872, value: 487872, subsidy: 108000, balance: 379872, solarEmi: 9340, evEmi: 0, totalEmi: 9340, baas: 0, custOut: 9340, netSave: 160, savePct: 1.7, yr5: 9280, yr25: 2850000, lifetime: 2859280 },
  9: { rate: 55500, cost: 499500, gst: 44455.5, value: 543956, subsidy: 108000, balance: 435956, solarEmi: 10719, evEmi: 0, totalEmi: 10719, baas: 0, custOut: 10719, netSave: 31, savePct: 0.3, yr5: 1798, yr25: 3225000, lifetime: 3226798 },
  10: { rate: 55000, cost: 550000, gst: 48950, value: 598950, subsidy: 108000, balance: 490950, solarEmi: 12072, evEmi: 0, totalEmi: 12072, baas: 0, custOut: 12072, netSave: 328, savePct: 2.6, yr5: 19024, yr25: 3720000, lifetime: 3739024 }
};


function getCalcData(kw, bill, petrol = 0, bike = 0, gas = 0, includeEV = false) {

  const safeKw = Math.max(2, Math.min(10, kw));
  const data = EXCEL_DATA[safeKw];

  const rate = data.rate;
  const cost = data.cost;
  const gst = data.gst;
  const value = data.value;
  const subsidy = data.subsidy;
  const balance = data.balance;


  const solarEmi = data.solarEmi;


  const evEmi = includeEV ? 1598 : 0;
  const baas = includeEV ? 1000 : 0;
  const totalEmi = solarEmi + evEmi;
  const custOut = totalEmi + baas;

  const currentOut = bill + petrol + bike + gas;

  const netSave = currentOut - custOut;
  const savePct = currentOut > 0 ? Number(((netSave / currentOut) * 100).toFixed(1)) : 0;

  let yr5 = netSave * 60;
  let yr25 = currentOut * 300;
  let lifetime = yr25 + yr5;


  if (!includeEV && petrol === 0 && bike === 0 && gas === 0 && bill === currentOut) {
    yr5 = data.yr5;
    yr25 = data.yr25;
    lifetime = data.lifetime;
  }

  return { kw: safeKw, bill, rate, cost, gst, value, subsidy, balance, solarEmi, evEmi, totalEmi, baas, custOut, netSave, savePct, yr5, yr25, lifetime };
}


const TOP_CALCULATOR_MODE = "STRICT_EXCEL";


const slider = document.getElementById('bill-slider');
const dropdown = document.getElementById('bill-dropdown');

function updateTopCalc(bill) {
  bill = parseInt(bill);

  let kw, data, emi, topNetSavings, total_subsidy, bill_after, topFiveYr;

  if (TOP_CALCULATOR_MODE === "STRICT_EXCEL") {

    if (bill <= 2399) kw = 2;
    else if (bill <= 3900) kw = 3;
    else if (bill <= 5500) kw = 4;
    else if (bill <= 6500) kw = 5;
    else if (bill <= 8000) kw = 6;
    else if (bill <= 9000) kw = 7;
    else if (bill <= 10500) kw = 8;
    else if (bill <= 11500) kw = 9;
    else kw = 10;


    data = getCalcData(kw, bill, 0, 0, 0, false);
    emi = data.solarEmi;
    total_subsidy = data.subsidy;


    topNetSavings = data.netSave;


    bill_after = Math.max(0, bill - topNetSavings - emi); // Should be 0 usually

    topFiveYr = data.yr5;
  } else {

    // MODE B: MARKETING MODE

    const raw_kw = bill / 1800;
    kw = Math.min(Math.max(1, Math.round(raw_kw * 2) / 2), 15);

    const system_cost = kw * 65000;
    total_subsidy = 0;
    if (kw <= 7) {
      let central_subsidy;
      if (kw <= 2) central_subsidy = Math.round(kw * 30000);
      else central_subsidy = 60000 + Math.round(Math.min(kw - 2, 1) * 18000);
      central_subsidy = Math.min(central_subsidy, 78000);
      total_subsidy = Math.min(central_subsidy + 30000, 108000);
    }

    const net_cost = system_cost - total_subsidy;
    emi = Math.round(net_cost / 60 * 1.025);

    const monthly_savings = Math.round(bill * 0.9);
    bill_after = bill - monthly_savings;
    topNetSavings = monthly_savings - emi;
    topFiveYr = (topNetSavings * 60) + total_subsidy;
  }


  document.getElementById('net-savings').textContent = (topNetSavings < 0 ? '-₹ ' : '₹ ') + formatINR(Math.abs(topNetSavings));
  document.getElementById('net-savings').style.color = topNetSavings < 0 ? '#ff4d4d' : '#00d084';

  document.getElementById('emi-val').textContent = '₹ ' + formatINR(emi);

  const subEl = document.getElementById('subsidy-val');
  if (total_subsidy === 0) {
    subEl.parentElement.innerHTML = 'Subsidy <span id="subsidy-val" style="color:inherit">₹ 0</span> <span style="font-size:10px;color:#ff4d4d;display:block;line-height:1">(No subsidy for >7kW)</span>';
  } else {
    subEl.parentElement.innerHTML = 'Up to <span id="subsidy-val" style="color:inherit">₹ ' + formatINR(total_subsidy) + '</span>';
  }

  document.getElementById('bill-after').textContent = '₹ ' + formatINR(bill_after);
  document.getElementById('five-yr').textContent = (topFiveYr < 0 ? '-₹ ' : '₹ ') + formatINR(Math.abs(topFiveYr));
}

if (slider && dropdown) {
  const opts = Array.from(dropdown.options).map(o => parseInt(o.value));

  slider.addEventListener('input', () => {
    const val = parseInt(slider.value);

    const closest = opts.reduce((a, b) => Math.abs(b - val) < Math.abs(a - val) ? b : a);
    dropdown.value = closest;
    updateTopCalc(closest);
  });

  dropdown.addEventListener('change', () => {
    slider.value = dropdown.value;
    updateTopCalc(dropdown.value);
  });


  updateTopCalc(5000);
}




function toggleFaq(el) {
  const wasOpen = el.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) el.classList.add('open');
}


document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


window.addEventListener('scroll', () => {
  document.querySelector('.navbar').style.boxShadow =
    window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,0.3)' : 'none';
});


(function () {
  const selectors = [
    '.sec-title', '.why-headline', '.process-heading',
    '.rc2', '.wcard', '.pc-card', '.faq-item',
    '.wstat-item', '.trust-item', '.why-header-row',
    '.results-divider', '.process-footer-banner',
    '.why-trust-bottom', '.pfb-left'
  ];
  const els = document.querySelectorAll(selectors.join(','));
  els.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const siblings = Array.from(e.target.parentElement.children)
          .filter(c => c.classList.contains('reveal'));
        const idx = siblings.indexOf(e.target);
        e.target.style.transitionDelay = `${Math.min(idx, 3) * 70}ms`;
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();
