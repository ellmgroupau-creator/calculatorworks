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
const calculatorSection = document.getElementById('calculator');
const explicitCalculator = calculatorSection ? calculatorSection.getAttribute('data-calculator') : null;
const pathParts = window.location.pathname.split('/');
const lastPart = pathParts[pathParts.length - 1];
const cleanLastPart = lastPart.split('?')[0].split('#')[0];
const currentPage = explicitCalculator || (cleanLastPart && cleanLastPart.includes('.html') ? cleanLastPart : 'index.html');

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
  },

  'bmi-calculator.html': {
    calculate: function () {
      const decimals = decimalsSelect ? parseInt(decimalsSelect.value, 10) : 2;
      const weight = parseFloat(feetInput.value);
      const heightCm = inchesInput ? parseFloat(inchesInput.value) : NaN;

      if (isNaN(weight) || isNaN(heightCm) || weight <= 0 || heightCm <= 0) {
        resultOutput.textContent = 'Please enter valid weight and height';
        return;
      }

      const heightM = heightCm / 100;
      const bmi = weight / (heightM * heightM);

      var category = '';
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi < 25) category = 'Normal weight';
      else if (bmi < 30) category = 'Overweight';
      else category = 'Obese';

      resultOutput.textContent =
        'BMI = ' + bmi.toFixed(decimals) + ' (' + category + ')';
    }
  },

  'age-calculator.html': {
    calculate: function () {
      var dobValue = feetInput.value;
      var endValue = inchesInput ? inchesInput.value : '';

      if (!dobValue) {
        resultOutput.textContent = 'Please enter a date of birth';
        return;
      }

      var dob = new Date(dobValue + 'T00:00:00');
      var end = endValue ? new Date(endValue + 'T00:00:00') : new Date();

      if (isNaN(dob.getTime())) {
        resultOutput.textContent = 'Please enter a valid date';
        return;
      }

      if (dob > end) {
        resultOutput.textContent = 'Date of birth must be in the past';
        return;
      }

      var years = end.getFullYear() - dob.getFullYear();
      var months = end.getMonth() - dob.getMonth();
      var days = end.getDate() - dob.getDate();

      if (days < 0) {
        months--;
        var prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }

      resultOutput.textContent =
        years + ' years, ' + months + ' months, ' + days + ' days';
    }
  },

  'time-duration-calculator.html': {
    calculate: function () {
      var startValue = feetInput.value;
      var endValue = inchesInput ? inchesInput.value : '';

      if (!startValue || !endValue) {
        resultOutput.textContent = 'Please enter both start and end times';
        return;
      }

      var startParts = startValue.split(':');
      var endParts = endValue.split(':');

      var startMinutes = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);
      var endMinutes = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10);

      if (endMinutes < startMinutes) {
        endMinutes += 24 * 60;
      }

      var diff = endMinutes - startMinutes;
      var hours = Math.floor(diff / 60);
      var minutes = diff % 60;

      resultOutput.textContent =
        hours + ' hours ' + minutes + ' minutes';
    }
  },

  'days-between-dates-calculator.html': {
    calculate: function () {
      var startValue = feetInput.value;
      var endValue = inchesInput ? inchesInput.value : '';

      if (!startValue || !endValue) {
        resultOutput.textContent = 'Please enter both dates';
        return;
      }

      var start = new Date(startValue + 'T00:00:00');
      var end = new Date(endValue + 'T00:00:00');

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        resultOutput.textContent = 'Please enter valid dates';
        return;
      }

      var diffMs = Math.abs(end - start);
      var diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      resultOutput.textContent =
        diffDays + ' day' + (diffDays !== 1 ? 's' : '');
    }
  },

  'average-calculator.html': {
    calculate: function () {
      var decimals = decimalsSelect ? parseInt(decimalsSelect.value, 10) : 3;
      var raw = feetInput.value;

      if (!raw || !raw.trim()) {
        resultOutput.textContent = 'Please enter numbers separated by commas';
        return;
      }

      var parts = raw.split(',');
      var numbers = [];
      for (var i = 0; i < parts.length; i++) {
        var n = parseFloat(parts[i].trim());
        if (!isNaN(n)) numbers.push(n);
      }

      if (numbers.length === 0) {
        resultOutput.textContent = 'Please enter valid numbers';
        return;
      }

      var sum = 0;
      for (var j = 0; j < numbers.length; j++) {
        sum += numbers[j];
      }

      var average = sum / numbers.length;

      resultOutput.textContent =
        'Average of ' + numbers.length + ' numbers = ' + average.toFixed(decimals);
    }
  },

  'tip-calculator.html': {
    calculate: function () {
      var billAmount = parseFloat(feetInput.value);
      var tipPercent = inchesInput ? parseFloat(inchesInput.value) : NaN;
      var people = decimalsSelect ? parseInt(decimalsSelect.value, 10) : 1;

      if (isNaN(billAmount) || isNaN(tipPercent) || billAmount < 0 || tipPercent < 0 || !people || people < 1) {
        resultOutput.textContent = 'Please enter valid bill, tip, and split values';
        return;
      }

      var tipAmount = billAmount * (tipPercent / 100);
      var totalAmount = billAmount + tipAmount;
      var perPerson = totalAmount / people;

      resultOutput.textContent =
        'Tip = ' + tipAmount.toFixed(2) + ', total = ' + totalAmount.toFixed(2) + ', per person = ' + perPerson.toFixed(2);
    }
  },

  'simple-interest-calculator.html': {
    calculate: function () {
      var principal = parseFloat(feetInput.value);
      var annualRate = inchesInput ? parseFloat(inchesInput.value) : NaN;
      var years = decimalsSelect ? parseFloat(decimalsSelect.value) : NaN;

      if (isNaN(principal) || isNaN(annualRate) || isNaN(years) || principal < 0 || annualRate < 0 || years < 0) {
        resultOutput.textContent = 'Please enter valid principal, rate, and time values';
        return;
      }

      var interest = principal * (annualRate / 100) * years;
      var total = principal + interest;

      resultOutput.textContent =
        'Interest = ' + interest.toFixed(2) + ', final balance = ' + total.toFixed(2);
    }
  },

  'compound-interest-calculator.html': {
    calculate: function () {
      var principal = parseFloat(feetInput.value);
      var annualRate = inchesInput ? parseFloat(inchesInput.value) : NaN;
      var years = decimalsSelect ? parseFloat(decimalsSelect.value) : NaN;

      if (isNaN(principal) || isNaN(annualRate) || isNaN(years) || principal < 0 || annualRate < 0 || years < 0) {
        resultOutput.textContent = 'Please enter valid principal, rate, and time values';
        return;
      }

      var total = principal * Math.pow(1 + (annualRate / 100), years);
      var interest = total - principal;

      resultOutput.textContent =
        'Interest = ' + interest.toFixed(2) + ', final balance = ' + total.toFixed(2);
    }
  },

  'loan-repayment-calculator.html': {
    calculate: function () {
      var loanAmount = parseFloat(feetInput.value);
      var annualRate = inchesInput ? parseFloat(inchesInput.value) : NaN;
      var years = decimalsSelect ? parseInt(decimalsSelect.value, 10) : NaN;

      if (isNaN(loanAmount) || isNaN(annualRate) || isNaN(years) || loanAmount <= 0 || annualRate < 0 || years <= 0) {
        resultOutput.textContent = 'Please enter valid loan, rate, and term values';
        return;
      }

      var monthlyRate = annualRate / 100 / 12;
      var payments = years * 12;
      var monthlyRepayment;

      if (monthlyRate === 0) {
        monthlyRepayment = loanAmount / payments;
      } else {
        monthlyRepayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, payments) / (Math.pow(1 + monthlyRate, payments) - 1);
      }

      resultOutput.textContent =
        'Estimated monthly repayment = ' + monthlyRepayment.toFixed(2);
    }
  },

  'salary-calculator.html': {
    calculate: function () {
      var annualSalary = parseFloat(feetInput.value);
      var hoursPerWeek = inchesInput ? parseFloat(inchesInput.value) : NaN;
      var decimals = decimalsSelect ? parseInt(decimalsSelect.value, 10) : 2;

      if (isNaN(annualSalary) || isNaN(hoursPerWeek) || annualSalary < 0 || hoursPerWeek <= 0) {
        resultOutput.textContent = 'Please enter valid salary and work hours';
        return;
      }

      var monthly = annualSalary / 12;
      var fortnightly = annualSalary / 26;
      var weekly = annualSalary / 52;
      var hourly = annualSalary / (52 * hoursPerWeek);

      resultOutput.textContent =
        'Monthly = ' + monthly.toFixed(decimals) + ', fortnightly = ' + fortnightly.toFixed(decimals) + ', weekly = ' + weekly.toFixed(decimals) + ', hourly = ' + hourly.toFixed(decimals);
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
if (feetInput && resultOutput && calculateBtn && resetBtn) {
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