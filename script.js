document.addEventListener("DOMContentLoaded", () => {
  const p = document.querySelector('.marquee-text');
  if (!p) return;
  
  const text = p.textContent.trim();
  
  let repeated = '';
  for (let i = 0; i < 15; i++) {
    repeated += `<span>${text}</span>`;
  }
  
  p.innerHTML = repeated + repeated;
});