const target = document.GetElementById("target");
const label = document.GetElementById("targetLabel")

let count = 0;

target.addEventListener('input', (event) => {
    label.innerHTML = count++;
})