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