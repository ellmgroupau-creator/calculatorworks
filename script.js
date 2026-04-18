const feetInput = document.getElementById('feet');
const decimalsSelect = document.getElementById('decimals');
const resultOutput = document.getElementById('result');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');

function calculateFeetToMetres() {
  const feet = parseFloat(feetInput.value);
  const decimals = parseInt(decimalsSelect.value, 10);

  if (isNaN(feet)) {
    resultOutput.textContent = 'Please enter a valid number';
    return;
  }

  const metres = feet * 0.3048;
  resultOutput.textContent = feet + ' ft = ' + metres.toFixed(decimals) + ' m';
}

function resetCalculator() {
  feetInput.value = '';
  decimalsSelect.value = '3';
  resultOutput.textContent = 'Enter a value to begin';
  feetInput.focus();
}

calculateBtn.addEventListener('click', calculateFeetToMetres);
resetBtn.addEventListener('click', resetCalculator);

feetInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    calculateFeetToMetres();
  }
});