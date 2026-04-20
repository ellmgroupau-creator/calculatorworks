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
// Calculator Page Config
// Uses current file names only
// No HTML structure changes needed
// =========================
const pathParts = window.location.pathname.split('/');
const lastPart = pathParts[pathParts.length - 1];
const currentPage = lastPart && lastPart.includes('.html') ? lastPart : 'index.html';

const calculatorConfigs = {
  'feet-to-metres.html': {
    calculate: function () {
      const decimals = parseInt(decimalsSelect.value, 10);

      const feetValue = parseFloat(feetInput.value);
      const inchesValue = inchesInput ? parseFloat(inchesInput.value || '0') : 0;

      if (isNaN(feetValue) && isNaN(inchesValue)) {
        resultOutput.textContent = 'Please enter feet and/or inches';
        return;
      }

      const safeFeet = isNaN(feetValue) ? 0 : feetValue;
      const safeInches = isNaN(inchesValue) ? 0 : inchesValue;

      const extraFeet = Math.floor(safeInches / 12);
      const remainingInches = parseFloat((safeInches % 12).toFixed(decimals));
      const finalFeet = safeFeet + extraFeet;

      const totalFeet = finalFeet + (remainingInches / 12);
      const metres = totalFeet * 0.3048;

      resultOutput.textContent =
        finalFeet + "'" + remainingInches + '" = ' + metres.toFixed(decimals) + ' m';
    }
  },

  'metres-to-feet.html': {
    calculate: function () {
      const decimals = parseInt(decimalsSelect.value, 10);
      const metresValue = parseFloat(feetInput.value);

      if (isNaN(metresValue)) {
        resultOutput.textContent = 'Please enter a valid number';
        return;
      }

      const totalFeet = metresValue * 3.28084;

      let feet = Math.floor(totalFeet);
      let inches = (totalFeet - feet) * 12;

      inches = parseFloat(inches.toFixed(decimals));

      if (inches >= 12) {
        feet += 1;
        inches = 0;
      }

      resultOutput.textContent =
        metresValue + ' m = ' + feet + "'" + inches + '"';
    }
  },

  'cm-to-inches.html': {
    calculate: function () {
      const decimals = parseInt(decimalsSelect.value, 10);
      const cmValue = parseFloat(feetInput.value);

      if (isNaN(cmValue)) {
        resultOutput.textContent = 'Please enter a valid number';
        return;
      }

      const inches = cmValue / 2.54;

      resultOutput.textContent =
        cmValue + ' cm = ' + inches.toFixed(decimals) + ' inches';
    }
  },

  'inches-to-cm.html': {
    calculate: function () {
      const decimals = parseInt(decimalsSelect.value, 10);
      const inchesValue = parseFloat(feetInput.value);

      if (isNaN(inchesValue)) {
        resultOutput.textContent = 'Please enter a valid number';
        return;
      }

      const cm = inchesValue * 2.54;

      resultOutput.textContent =
        inchesValue + ' inches = ' + cm.toFixed(decimals) + ' cm';
    }
  },

  'kg-to-lb.html': {
    calculate: function () {
      const decimals = parseInt(decimalsSelect.value, 10);
      const kgValue = parseFloat(feetInput.value);

      if (isNaN(kgValue)) {
        resultOutput.textContent = 'Please enter a valid number';
        return;
      }

      const lb = kgValue * 2.2046226218;

      resultOutput.textContent =
        kgValue + ' kg = ' + lb.toFixed(decimals) + ' lb';
    }
  },

  'lb-to-kg.html': {
    calculate: function () {
      const decimals = parseInt(decimalsSelect.value, 10);
      const lbValue = parseFloat(feetInput.value);

      if (isNaN(lbValue)) {
        resultOutput.textContent = 'Please enter a valid number';
        return;
      }

      const kg = lbValue / 2.2046226218;

      resultOutput.textContent =
        lbValue + ' lb = ' + kg.toFixed(decimals) + ' kg';
    }
  },

  'km-to-miles.html': {
    calculate: function () {
      const decimals = parseInt(decimalsSelect.value, 10);
      const kmValue = parseFloat(feetInput.value);

      if (isNaN(kmValue)) {
        resultOutput.textContent = 'Please enter a valid number';
        return;
      }

      const miles = kmValue * 0.621371;

      resultOutput.textContent =
        kmValue + ' km = ' + miles.toFixed(decimals) + ' miles';
    }
  },

  'miles-to-km.html': {
    calculate: function () {
      const decimals = parseInt(decimalsSelect.value, 10);
      const milesValue = parseFloat(feetInput.value);

      if (isNaN(milesValue)) {
        resultOutput.textContent = 'Please enter a valid number';
        return;
      }

      const km = milesValue * 1.60934;

      resultOutput.textContent =
        milesValue + ' miles = ' + km.toFixed(decimals) + ' km';
    }
  },

  'celsius-to-fahrenheit.html': {
    calculate: function () {
      const decimals = parseInt(decimalsSelect.value, 10);
      const celsiusValue = parseFloat(feetInput.value);

      if (isNaN(celsiusValue)) {
        resultOutput.textContent = 'Please enter a valid number';
        return;
      }

      const fahrenheit = (celsiusValue * 9 / 5) + 32;

      resultOutput.textContent =
        celsiusValue + '°C = ' + fahrenheit.toFixed(decimals) + '°F';
    }
  },

  'fahrenheit-to-celsius.html': {
    calculate: function () {
      const decimals = parseInt(decimalsSelect.value, 10);
      const fahrenheitValue = parseFloat(feetInput.value);

      if (isNaN(fahrenheitValue)) {
        resultOutput.textContent = 'Please enter a valid number';
        return;
      }

      const celsius = (fahrenheitValue - 32) * 5 / 9;

      resultOutput.textContent =
        fahrenheitValue + '°F = ' + celsius.toFixed(decimals) + '°C';
    }
  },

  'percentage-calculator.html': {
    calculate: function () {
      const decimals = parseInt(decimalsSelect.value, 10);
      const percentageValue = parseFloat(feetInput.value);
      const baseValue = inchesInput ? parseFloat(inchesInput.value) : NaN;

      if (isNaN(percentageValue) || isNaN(baseValue)) {
        resultOutput.textContent = 'Please enter valid numbers';
        return;
      }

      const result = (percentageValue / 100) * baseValue;

      resultOutput.textContent =
        percentageValue + '% of ' + baseValue + ' = ' + result.toFixed(decimals);
    }
  },

  'percentage-increase-calculator.html': {
    calculate: function () {
      const decimals = parseInt(decimalsSelect.value, 10);
      const originalValue = parseFloat(feetInput.value);
      const increaseValue = inchesInput ? parseFloat(inchesInput.value) : NaN;

      if (isNaN(originalValue) || isNaN(increaseValue)) {
        resultOutput.textContent = 'Please enter valid numbers';
        return;
      }

      const result = originalValue * (1 + (increaseValue / 100));

      resultOutput.textContent =
        originalValue + ' increased by ' + increaseValue + '% = ' + result.toFixed(decimals);
    }
  },

  'percentage-decrease-calculator.html': {
    calculate: function () {
      const decimals = parseInt(decimalsSelect.value, 10);
      const originalValue = parseFloat(feetInput.value);
      const decreaseValue = inchesInput ? parseFloat(inchesInput.value) : NaN;

      if (isNaN(originalValue) || isNaN(decreaseValue)) {
        resultOutput.textContent = 'Please enter valid numbers';
        return;
      }

      const result = originalValue * (1 - (decreaseValue / 100));

      resultOutput.textContent =
        originalValue + ' decreased by ' + decreaseValue + '% = ' + result.toFixed(decimals);
    }
  },

  'percent-change-calculator.html': {
    calculate: function () {
      const decimals = parseInt(decimalsSelect.value, 10);
      const originalValue = parseFloat(feetInput.value);
      const newValue = inchesInput ? parseFloat(inchesInput.value) : NaN;

      if (isNaN(originalValue) || isNaN(newValue)) {
        resultOutput.textContent = 'Please enter valid numbers';
        return;
      }

      if (originalValue === 0) {
        resultOutput.textContent = 'Original value must be greater than 0';
        return;
      }

      const result = ((newValue - originalValue) / originalValue) * 100;

      resultOutput.textContent =
        'Percent change = ' + result.toFixed(decimals) + '%';
    }
  },

  'discount-calculator.html': {
    calculate: function () {
      const decimals = parseInt(decimalsSelect.value, 10);
      const originalPrice = parseFloat(feetInput.value);
      const discountValue = inchesInput ? parseFloat(inchesInput.value) : NaN;

      if (isNaN(originalPrice) || isNaN(discountValue)) {
        resultOutput.textContent = 'Please enter valid numbers';
        return;
      }

      const savings = originalPrice * (discountValue / 100);
      const finalPrice = originalPrice - savings;

      resultOutput.textContent =
        'Sale price = ' + finalPrice.toFixed(decimals) + ' (You save ' + savings.toFixed(decimals) + ')';
    }
  }
};

// =========================
// Shared Reset Function
// =========================
function resetCalculator() {
  if (feetInput) feetInput.value = '';
  if (inchesInput) inchesInput.value = '';
  if (decimalsSelect) decimalsSelect.value = '3';
  if (resultOutput) resultOutput.textContent = 'Enter a value to begin';
  if (feetInput) feetInput.focus();
}

// =========================
// Shared Calculator Setup
// =========================
if (feetInput && decimalsSelect && resultOutput && calculateBtn && resetBtn) {
  const activeCalculator = calculatorConfigs[currentPage];

  if (activeCalculator) {
    calculateBtn.addEventListener('click', activeCalculator.calculate);
    resetBtn.addEventListener('click', resetCalculator);

    feetInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') activeCalculator.calculate();
    });

    if (inchesInput) {
      inchesInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') activeCalculator.calculate();
      });
    }
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