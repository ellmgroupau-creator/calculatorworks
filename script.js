const feetInput = document.getElementById('feet');
const decimalsSelect = document.getElementById('decimals');
const resultOutput = document.getElementById('result');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');

if (feetInput && decimalsSelect && resultOutput && calculateBtn && resetBtn) {
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
}

const mainCalcScreen = document.getElementById('mainCalcScreen');
const mainCalcKeys = document.querySelectorAll('.calc-key');

if (mainCalcScreen && mainCalcKeys.length) {
  let currentExpression = '';

  function updateMainCalcScreen(value) {
    mainCalcScreen.textContent = value || '0';
  }

  function formatExpressionForDisplay(expression) {
    return expression
      .replace(/\*/g, '×')
      .replace(/\//g, '÷')
      .replace(/-/g, '−');
  }

  function evaluateExpression(expression) {
    try {
      const safeExpression = expression.replace(/%/g, '/100');
      const result = Function('"use strict"; return (' + safeExpression + ')')();
      if (result === undefined || Number.isNaN(result) || !Number.isFinite(result)) {
        return 'Error';
      }
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
        updateMainCalcScreen('0');
        return;
      }

      if (action === 'backspace') {
        currentExpression = currentExpression.slice(0, -1);
        updateMainCalcScreen(formatExpressionForDisplay(currentExpression) || '0');
        return;
      }

      if (action === 'equals') {
        const result = evaluateExpression(currentExpression);
        currentExpression = result === 'Error' ? '' : result;
        updateMainCalcScreen(result);
        return;
      }

      if (value) {
        currentExpression += value;
        updateMainCalcScreen(formatExpressionForDisplay(currentExpression));
      }
    });
  });
}