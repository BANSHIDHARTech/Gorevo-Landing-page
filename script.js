// Mobile menu
function toggleMenu() {
  const links = document.getElementById('nav-links');
  links.classList.toggle('mobile-open');
}

// WhatsApp redirect
function openWA() {
  window.open('https://wa.me/918679111428', '_blank');
}

// Calculator
const slider = document.getElementById('bill-slider');
const billAmount = document.getElementById('bill-amount');

function formatINR(n) {
  return n.toLocaleString('en-IN');
}

function updateCalc() {
  const bill = parseInt(slider.value);
  billAmount.textContent = formatINR(bill);

  // System size: size to offset ~50% of bill (matches reference marketing numbers)
  const raw_kw = bill / 1800;
  const system_kw = Math.max(1, Math.round(raw_kw * 2) / 2);
  const clamped_kw = Math.min(system_kw, 10);

  const monthly_savings = Math.round(bill * 0.82);
  const annual_savings = monthly_savings * 12;

  // PM Surya Ghar subsidy: ₹30k/kW for first 2kW, ₹18k for 3rd kW, capped at ₹78k
  let subsidy;
  if (clamped_kw <= 2) subsidy = Math.round(clamped_kw * 30000);
  else subsidy = 60000 + Math.round(Math.min(clamped_kw - 2, 1) * 18000);
  subsidy = Math.min(subsidy, 78000);

  const net_cost = (clamped_kw * 85000) - subsidy;
  const payback = net_cost / annual_savings;
  const pb_min = Math.floor(payback);
  const pb_max = pb_min + 1;

  document.getElementById('monthly-savings').textContent = '₹ ' + formatINR(monthly_savings);
  document.getElementById('annual-savings').textContent = '₹ ' + formatINR(annual_savings);
  document.getElementById('system-size').textContent = clamped_kw + ' KW';
  document.getElementById('subsidy-val').textContent = '₹ ' + formatINR(subsidy);
  document.getElementById('payback-val').textContent = pb_min + ' – ' + pb_max + ' Years';
}

slider.addEventListener('input', updateCalc);
updateCalc();

// FAQ accordion
function toggleFaq(el) {
  const wasOpen = el.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) el.classList.add('open');
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Navbar shadow on scroll
window.addEventListener('scroll', () => {
  document.querySelector('.navbar').style.boxShadow =
    window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,0.3)' : 'none';
});
