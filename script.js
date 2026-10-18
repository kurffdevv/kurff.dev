document.addEventListener('DOMContentLoaded', function() {
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

function convertReg2No(id1, id2, id3){
  const stupidNum = Number(document.getElementById(id1).value);

  const selectStupidVal = document.getElementById(id2);
  const stupidVal = selectStupidVal.selectedOptions[0] ? selectStupidVal.selectedOptions[0].value : "";

  const stupidOut = document.getElementById(id3);

  if (stupidNum > 0) {
    if (stupidVal !== ""){
      if (stupidVal == "moon"){
        const newOut = stupidNum * (1/9.82);

        stupidOut.textContent = `output: ${newOut.toFixed(2)}`
      }

      // planets

      if (stupidVal == "mercury"){
        const newOut = stupidNum * (3.70/9.82);

        stupidOut.textContent = `output: ${newOut.toFixed(2)}`
      }
      if (stupidVal == "venus"){
        const newOut = stupidNum * (8.87/9.82);

        stupidOut.textContent = `output: ${newOut.toFixed(2)}`
      }
      if (stupidVal == "mars"){
        const newOut = stupidNum * (3.73/9.82);

        stupidOut.textContent = `output: ${newOut.toFixed(2)}`
      }
      if (stupidVal == "jupiter"){
        const newOut = stupidNum * (25.92/9.82);

        stupidOut.textContent = `output: ${newOut.toFixed(2)}`
      }
      if (stupidVal == "saturn"){
        const newOut = stupidNum * (11.19/9.82);

        stupidOut.textContent = `output: ${newOut.toFixed(2)}`
      }
      if (stupidVal == "uranus"){
        const newOut = stupidNum * (9.01/9.82);

        stupidOut.textContent = `output: ${newOut.toFixed(2)}`
      }
      if (stupidVal == "neptune"){
        const newOut = stupidNum * (11.27/9.82);

        stupidOut.textContent = `output: ${newOut.toFixed(2)}`
      }

      // fucked planets

      if (stupidVal == "pluto"){
        const newOut = stupidNum * (0.62/9.82);

        stupidOut.textContent = `output: ${newOut.toFixed(2)}`
      }
    }
  }
}

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