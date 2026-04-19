// =========================
// Shared Inputs
// =========================
const feetInput = document.getElementById('feet');
const inchesInput = document.getElementById('inches');
const decimalsSelect = document.getElementById('decimals');
const resultOutput = document.getElementById('result');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');

// =========================
// Feet ↔ Metres Calculators
// =========================
if (feetInput && decimalsSelect && resultOutput && calculateBtn && resetBtn) {

  function calculateConversion() {
    const decimals = parseInt(decimalsSelect.value, 10);

    // =========================
    // METRES → FEET + INCHES
    // =========================
    if (document.title.includes("Metres to Feet")) {

      const metresValue = parseFloat(feetInput.value);

      if (isNaN(metresValue)) {
        resultOutput.textContent = 'Please enter a valid number';
        return;
      }

      const totalFeet = metresValue * 3.28084;

      let feet = Math.floor(totalFeet);
      let inches = (totalFeet - feet) * 12;

      inches = parseFloat(inches.toFixed(decimals));

      // Handle rounding overflow (e.g. 11.99 → 12)
      if (inches >= 12) {
        feet += 1;
        inches = 0;
      }

      resultOutput.textContent =
        metresValue + ' m = ' + feet + "'" + inches + '"';
    }

    // =========================
    // FEET + INCHES → METRES
    // =========================
    else {

      const feetValue = parseFloat(feetInput.value);
      const inchesValue = inchesInput ? parseFloat(inchesInput.value || '0') : 0;

      if (isNaN(feetValue) && isNaN(inchesValue)) {
        resultOutput.textContent = 'Please enter feet and/or inches';
        return;
      }

      const safeFeet = isNaN(feetValue) ? 0 : feetValue;
      const safeInches = isNaN(inchesValue) ? 0 : inchesValue;

      // Handle inches overflow (e.g. 12 inches → +1 foot)
      const extraFeet = Math.floor(safeInches / 12);
      const remainingInches = safeInches % 12;
      const finalFeet = safeFeet + extraFeet;

      const totalFeet = finalFeet + (remainingInches / 12);
      const metres = totalFeet * 0.3048;

      resultOutput.textContent =
        finalFeet + "'" + remainingInches + '" = ' + metres.toFixed(decimals) + ' m';
    }
  }

  function resetCalculator() {
    feetInput.value = '';
    if (inchesInput) inchesInput.value = '';
    decimalsSelect.value = '3';
    resultOutput.textContent = 'Enter a value to begin';
    feetInput.focus();
  }

  calculateBtn.addEventListener('click', calculateConversion);
  resetBtn.addEventListener('click', resetCalculator);

  feetInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') calculateConversion();
  });

  if (inchesInput) {
    inchesInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') calculateConversion();
    });
  }
}

// =========================
// Homepage Standard Calculator
// =========================
const mainCalcScreen = document.getElementById('mainCalcScreen');
const mainCalcKeys = document.querySelectorAll('.calc-key');

if (mainCalcScreen && mainCalcKeys.length) {

  let currentExpression = '';

  function updateScreen(value) {
    mainCalcScreen.textContent = value || '0';
  }

  function formatDisplay(expression) {
    return expression
      .replace(/\*/g, '×')
      .replace(/\//g, '÷')
      .replace(/-/g, '−');
  }

  function evaluateExpression(expression) {
    try {
      const safeExpression = expression.replace(/%/g, '/100');
      const result = Function('"use strict"; return (' + safeExpression + ')')();

      if (!isFinite(result)) return 'Error';

      return Number(result.toFixed(10)).toString();
    } catch {
      return 'Error';
    }
  }

  mainCalcKeys.forEach((button) => {
    button.addEventListener('click', () => {

      const value = button.dataset.value;
      const action = button.dataset.action;

      if (action === 'clear') {
        currentExpression = '';
        updateScreen('0');
        return;
      }

      if (action === 'backspace') {
        currentExpression = currentExpression.slice(0, -1);
        updateScreen(formatDisplay(currentExpression) || '0');
        return;
      }

      if (action === 'equals') {
        const result = evaluateExpression(currentExpression);
        currentExpression = result === 'Error' ? '' : result;
        updateScreen(result);
        return;
      }

      if (value) {
        currentExpression += value;
        updateScreen(formatDisplay(currentExpression));
      }
    });
  });
}
