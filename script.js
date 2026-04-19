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
const pathParts = window.location.pathname.split('/').filter(Boolean);
const lastPart = pathParts[pathParts.length - 1] || 'index.html';
const currentPage = lastPart.endsWith('.html') ? lastPart : lastPart + '.html';

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
