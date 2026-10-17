document.addEventListener('click', function(e) {
    const link = e.target.closest('[scroll-to]');
    if (!link) return;
    
    e.preventDefault();
    const id = link.getAttribute('scroll-to').match(/id:\s*([^;]+)/)?.[1]?.trim();
    
    const target = document.getElementById(id);
    if (target) {
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        
        const padding = 100; 
        const offsetPosition = elementPosition - padding;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
});



document.addEventListener("DOMContentLoaded", () => {
  const dih = document.querySelector('.marquee-text');
  if (!dih) return;
  
  const text = dih.textContent.trim();
  
  let repeated = '';
  for (let i = 0; i < 15; i++) {
    repeated += `<span>${text}</span>`;
  }
  
  dih.innerHTML = repeated + repeated;
});

const colorPicker = document.getElementById('colour');
const hexValueText = document.getElementById('hexValue');

colorPicker.addEventListener('input', (event) => {
    hexValueText.textContent = event.target.value;
});

function copyHex() {
  const hexText = document.getElementById('hexValue').innerText;

  navigator.clipboard.writeText(hexText)
    .then(() => {
      moveUpAndDown();
    })
    .catch(err => {
      console.error("Failed to copy text: ", err);
    });
};

const element = document.querySelector('.panel');

function moveUpAndDown() {
  element.style.transition = 'transform 0.5s ease-in-out';
  element.style.transform = 'translateY(-100px)';

  setTimeout(() => {
    element.style.transform = 'translateY(0)';
  }, 2000);
}