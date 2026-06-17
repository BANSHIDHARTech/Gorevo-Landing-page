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
const dropdown = document.getElementById('bill-dropdown');

function formatINR(n) {
  return n.toLocaleString('en-IN');
}

function updateCalc(bill) {
  bill = parseInt(bill);

  const raw_kw = bill / 1800;
  const kw = Math.min(Math.max(1, Math.round(raw_kw * 2) / 2), 10);

  const system_cost = kw * 65000;

  // PM Surya Ghar central subsidy
  let central_subsidy;
  if (kw <= 2) central_subsidy = Math.round(kw * 30000);
  else central_subsidy = 60000 + Math.round(Math.min(kw - 2, 1) * 18000);
  central_subsidy = Math.min(central_subsidy, 78000);

  // Total with UP state subsidy
  const total_subsidy = Math.min(central_subsidy + 30000, 108000);

  const net_cost = system_cost - central_subsidy;
  const emi = Math.round(net_cost / 60 * 1.025);

  const monthly_savings = Math.round(bill * 0.9);
  const bill_after = bill - monthly_savings;
  const net_savings = monthly_savings - emi;
  const five_yr = net_savings * 60 + total_subsidy;

  document.getElementById('net-savings').textContent = '₹ ' + formatINR(net_savings);
  document.getElementById('emi-val').textContent = '₹ ' + formatINR(emi);
  document.getElementById('subsidy-val').textContent = '₹ ' + formatINR(total_subsidy);
  document.getElementById('bill-after').textContent = '₹ ' + formatINR(bill_after);
  document.getElementById('five-yr').textContent = '₹ ' + formatINR(five_yr);
}

// Sync slider → dropdown
slider.addEventListener('input', () => {
  const val = slider.value;
  // Find closest dropdown option
  const opts = Array.from(dropdown.options).map(o => parseInt(o.value));
  const closest = opts.reduce((a, b) => Math.abs(b - val) < Math.abs(a - val) ? b : a);
  dropdown.value = closest;
  updateCalc(val);
});

// Sync dropdown → slider
dropdown.addEventListener('change', () => {
  slider.value = dropdown.value;
  updateCalc(dropdown.value);
});

// Init
updateCalc(5000);

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
