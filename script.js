document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Third tab placeholder – change href once you pick the page.
  const third = document.getElementById('tab-third');
  if (third) {
    third.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Coming soon! (Use this tab for Repairs, Contact, or FAQ)');
    });
  }
});
