let currentProduct = null;

function showNotification(message) {
  if (typeof window !== 'undefined' && window.alert) {
    window.alert(message);
  }
}

function openPaymentModal(product) {
  currentProduct = product || null;
  const modal = document.getElementById('paymentModal');
  if (modal) {
    modal.style.display = 'block';
  }
}

function closePaymentModal() {
  const modal = document.getElementById('paymentModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function goToPaymentStep(step) {
  const steps = document.querySelectorAll('.payment-step');
  steps.forEach((panel, index) => {
    panel.classList.toggle('hidden', index !== step);
  });
}

function submitPaymentForm() {
  goToPaymentStep(3);
}

function submitPayment(event) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }
  showNotification('Payment details captured. Please continue in WhatsApp for final confirmation.');
}
