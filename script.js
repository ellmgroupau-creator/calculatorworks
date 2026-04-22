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
const currentLang = (document.documentElement.lang || 'en').toLowerCase();

function translateCalc(key, fallback) {
  const translations = {
    es: {
      initialPrompt: 'Introduce un valor para empezar',
      'Please enter valid numbers': 'Introduce números válidos',
      'Please enter valid loan, rate, and term values': 'Introduce valores válidos de préstamo, interés y plazo',
      'Please enter valid savings inputs': 'Introduce valores válidos de ahorro',
      'Please enter valid mortgage inputs': 'Introduce valores válidos de hipoteca',
      percentageResult: (percentageValue, baseValue, result) => percentageValue + '% de ' + baseValue + ' = ' + result,
      discountResult: (finalPrice, savings) => 'Precio final = ' + finalPrice + ' (Ahorras ' + savings + ')',
      loanRepaymentResult: (monthlyRepayment) => 'Cuota mensual estimada = ' + monthlyRepayment,
      savingsResult: (futureValue, interestEarned) => 'Saldo futuro = ' + futureValue + ', intereses ganados = ' + interestEarned,
      mortgageResult: (monthlyRepayment, totalRepayment, totalInterest) => 'Cuota mensual = ' + monthlyRepayment + ', total pagado = ' + totalRepayment + ', interés total = ' + totalInterest
    },
    pt: {
      initialPrompt: 'Introduza um valor para começar',
      'Please enter valid numbers': 'Introduza números válidos',
      'Please enter valid loan, rate, and term values': 'Introduza valores válidos de empréstimo, taxa e prazo',
      'Please enter valid savings inputs': 'Introduza valores válidos de poupança',
      'Please enter valid mortgage inputs': 'Introduza valores válidos de hipoteca',
      percentageResult: (percentageValue, baseValue, result) => percentageValue + '% de ' + baseValue + ' = ' + result,
      discountResult: (finalPrice, savings) => 'Preço final = ' + finalPrice + ' (Poupa ' + savings + ')',
      loanRepaymentResult: (monthlyRepayment) => 'Prestação mensal estimada = ' + monthlyRepayment,
      savingsResult: (futureValue, interestEarned) => 'Saldo futuro = ' + futureValue + ', juros ganhos = ' + interestEarned,
      mortgageResult: (monthlyRepayment, totalRepayment, totalInterest) => 'Prestação mensal = ' + monthlyRepayment + ', total pago = ' + totalRepayment + ', juros totais = ' + totalInterest
    }
  };

  const langMap = translations[currentLang] || {};
  if (key in langMap) {
    const value = langMap[key];
    return typeof value === 'function' ? value : value;
  }
  return fallback !== undefined ? fallback : key;
}

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
        resultOutput.textContent = translateCalc('Please enter valid numbers');
        return;
      }

      const result = (percentageValue / 100) * baseValue;

      resultOutput.textContent =
        translateCalc('percentageResult', (percentageValue, baseValue, resultText) => percentageValue + '% of ' + baseValue + ' = ' + resultText)(percentageValue, baseValue, result.toFixed(decimals));
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
        resultOutput.textContent = translateCalc('Please enter valid numbers');
        return;
      }

      const savings = originalPrice * (discountValue / 100);
      const finalPrice = originalPrice - savings;

      resultOutput.textContent =
        translateCalc('discountResult', (finalPriceText, savingsText) => 'Sale price = ' + finalPriceText + ' (You save ' + savingsText + ')')(finalPrice.toFixed(decimals), savings.toFixed(decimals));
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

      if (isNaN(billAmount) || isNaN(tipPercent) || billAmount < 0 || tipPercent < 0 || isNaN(people) || people < 1) {
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
        resultOutput.textContent = translateCalc('Please enter valid loan, rate, and term values');
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
        translateCalc('loanRepaymentResult', (monthlyRepaymentText) => 'Estimated monthly repayment = ' + monthlyRepaymentText)(monthlyRepayment.toFixed(2));
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
,

  'gpa-calculator.html': {
    calculate: function () {
      var decimals = decimalsSelect ? parseInt(decimalsSelect.value, 10) : 2;
      var rawGrades = feetInput.value;
      var rawCredits = inchesInput ? inchesInput.value.trim() : '';
      var gradeMap = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0
      };

      if (!rawGrades || !rawGrades.trim()) {
        resultOutput.textContent = 'Please enter grades separated by commas';
        return;
      }

      var gradeParts = rawGrades.split(',');
      var grades = [];
      for (var i = 0; i < gradeParts.length; i++) {
        var token = gradeParts[i].trim().toUpperCase();
        if (!token) continue;
        var value = Object.prototype.hasOwnProperty.call(gradeMap, token) ? gradeMap[token] : parseFloat(token);
        if (isNaN(value) || value < 0 || value > 4) {
          resultOutput.textContent = 'Use valid letter grades or grade points between 0.0 and 4.0';
          return;
        }
        grades.push(value);
      }

      if (grades.length === 0) {
        resultOutput.textContent = 'Please enter at least one valid grade';
        return;
      }

      var totalPoints = 0;
      for (var j = 0; j < grades.length; j++) totalPoints += grades[j];
      var gpa = totalPoints / grades.length;

      if (!rawCredits) {
        resultOutput.textContent = 'GPA = ' + gpa.toFixed(decimals) + ' across ' + grades.length + ' course' + (grades.length === 1 ? '' : 's');
        return;
      }

      var creditParts = rawCredits.split(',');
      if (creditParts.length !== grades.length) {
        resultOutput.textContent = 'Credits must match the number of grades';
        return;
      }

      var weightedPoints = 0;
      var totalCredits = 0;
      for (var k = 0; k < creditParts.length; k++) {
        var credit = parseFloat(creditParts[k].trim());
        if (isNaN(credit) || credit <= 0) {
          resultOutput.textContent = 'Credits must be positive numbers';
          return;
        }
        weightedPoints += grades[k] * credit;
        totalCredits += credit;
      }

      var weightedGpa = weightedPoints / totalCredits;
      resultOutput.textContent = 'Weighted GPA = ' + weightedGpa.toFixed(decimals) + ' across ' + totalCredits.toFixed(decimals) + ' credit hours';
    }
  },

  'margin-calculator.html': {
    calculate: function () {
      var decimals = decimalsSelect ? parseInt(decimalsSelect.value, 10) : 2;
      var sellingPrice = parseFloat(feetInput.value);
      var cost = inchesInput ? parseFloat(inchesInput.value) : NaN;

      if (isNaN(sellingPrice) || isNaN(cost) || sellingPrice <= 0 || cost < 0) {
        resultOutput.textContent = 'Please enter a valid selling price and cost';
        return;
      }

      var profit = sellingPrice - cost;
      var margin = (profit / sellingPrice) * 100;
      resultOutput.textContent = 'Gross profit = ' + profit.toFixed(decimals) + ', margin = ' + margin.toFixed(decimals) + '%';
    }
  },

  'markup-calculator.html': {
    calculate: function () {
      var decimals = decimalsSelect ? parseInt(decimalsSelect.value, 10) : 2;
      var cost = parseFloat(feetInput.value);
      var markupPercent = inchesInput ? parseFloat(inchesInput.value) : NaN;

      if (isNaN(cost) || isNaN(markupPercent) || cost < 0 || markupPercent < 0) {
        resultOutput.textContent = 'Please enter a valid cost and markup percentage';
        return;
      }

      var markupAmount = cost * (markupPercent / 100);
      var sellingPrice = cost + markupAmount;
      resultOutput.textContent = 'Markup amount = ' + markupAmount.toFixed(decimals) + ', selling price = ' + sellingPrice.toFixed(decimals);
    }
  },

  'savings-calculator.html': {
    calculate: function () {
      var principal = parseFloat(feetInput.value);
      var annualRate = inchesInput ? parseFloat(inchesInput.value) : NaN;
      var years = decimalsSelect ? parseInt(decimalsSelect.value, 10) : NaN;

      if (isNaN(principal) || isNaN(annualRate) || isNaN(years) || principal < 0 || annualRate < 0 || years <= 0) {
        resultOutput.textContent = translateCalc('Please enter valid savings inputs');
        return;
      }

      var futureValue = principal * Math.pow(1 + (annualRate / 100), years);
      var interestEarned = futureValue - principal;
      resultOutput.textContent = translateCalc('savingsResult', (futureValueText, interestEarnedText) => 'Future balance = ' + futureValueText + ', interest earned = ' + interestEarnedText)(futureValue.toFixed(2), interestEarned.toFixed(2));
    }
  },

  'mortgage-calculator.html': {
    calculate: function () {
      var principal = parseFloat(feetInput.value);
      var annualRate = inchesInput ? parseFloat(inchesInput.value) : NaN;
      var years = decimalsSelect ? parseInt(decimalsSelect.value, 10) : NaN;

      if (isNaN(principal) || isNaN(annualRate) || isNaN(years) || principal <= 0 || annualRate < 0 || years <= 0) {
        resultOutput.textContent = translateCalc('Please enter valid mortgage inputs');
        return;
      }

      var monthlyRate = annualRate / 100 / 12;
      var payments = years * 12;
      var monthlyRepayment;

      if (monthlyRate === 0) {
        monthlyRepayment = principal / payments;
      } else {
        monthlyRepayment = principal * monthlyRate * Math.pow(1 + monthlyRate, payments) / (Math.pow(1 + monthlyRate, payments) - 1);
      }

      var totalRepayment = monthlyRepayment * payments;
      var totalInterest = totalRepayment - principal;
      resultOutput.textContent = translateCalc('mortgageResult', (monthlyRepaymentText, totalRepaymentText, totalInterestText) => 'Monthly repayment = ' + monthlyRepaymentText + ', total repayment = ' + totalRepaymentText + ', total interest = ' + totalInterestText)(monthlyRepayment.toFixed(2), totalRepayment.toFixed(2), totalInterest.toFixed(2));
    }
  },

  'roi-calculator.html': {
    calculate: function () {
      var decimals = decimalsSelect ? parseInt(decimalsSelect.value, 10) : 2;
      var gain = parseFloat(feetInput.value);
      var cost = inchesInput ? parseFloat(inchesInput.value) : NaN;

      if (isNaN(gain) || isNaN(cost) || cost === 0) {
        resultOutput.textContent = 'Please enter valid gain and cost values';
        return;
      }

      var netProfit = gain - cost;
      var roi = ((gain - cost) / cost) * 100;

      resultOutput.textContent =
        'ROI = ' + roi.toFixed(decimals) + '%, net profit = ' + netProfit.toFixed(decimals);
    }
  },

  'break-even-calculator.html': {
    calculate: function () {
      var fixedCosts = parseFloat(feetInput.value);
      var sellingPrice = inchesInput ? parseFloat(inchesInput.value) : NaN;
      var variableCost = decimalsSelect ? parseFloat(decimalsSelect.value) : NaN;

      if (isNaN(fixedCosts) || isNaN(sellingPrice) || isNaN(variableCost) || fixedCosts < 0 || sellingPrice < 0 || variableCost < 0) {
        resultOutput.textContent = 'Please enter valid cost and price values';
        return;
      }

      var contribution = sellingPrice - variableCost;

      if (contribution <= 0) {
        resultOutput.textContent = 'Selling price must be greater than variable cost per unit';
        return;
      }

      var breakEvenUnits = Math.ceil(fixedCosts / contribution);
      var breakEvenRevenue = (breakEvenUnits * sellingPrice);

      resultOutput.textContent =
        'Break-even = ' + breakEvenUnits.toLocaleString() + ' units, revenue = ' + breakEvenRevenue.toFixed(2);
    }
  },

  'commission-calculator.html': {
    calculate: function () {
      var sales = parseFloat(feetInput.value);
      var rate = inchesInput ? parseFloat(inchesInput.value) : NaN;
      var basePay = decimalsSelect ? parseFloat(decimalsSelect.value) : 0;

      if (isNaN(sales) || isNaN(rate) || sales < 0 || rate < 0) {
        resultOutput.textContent = 'Please enter valid sales and rate values';
        return;
      }

      if (isNaN(basePay) || basePay < 0) basePay = 0;

      var commission = sales * (rate / 100);
      var totalPay = basePay + commission;

      resultOutput.textContent =
        'Commission = ' + commission.toFixed(2) + ', total pay = ' + totalPay.toFixed(2);
    }
  },

  'inflation-calculator.html': {
    calculate: function () {
      var currentPrice = parseFloat(feetInput.value);
      var rate = inchesInput ? parseFloat(inchesInput.value) : NaN;
      var years = decimalsSelect ? parseFloat(decimalsSelect.value) : NaN;

      if (isNaN(currentPrice) || isNaN(rate) || isNaN(years) || currentPrice < 0 || years < 0) {
        resultOutput.textContent = 'Please enter valid price, rate, and years';
        return;
      }

      var futurePrice = currentPrice * Math.pow(1 + (rate / 100), years);
      var increase = futurePrice - currentPrice;

      resultOutput.textContent =
        'Future price = ' + futurePrice.toFixed(2) + ', increase = ' + increase.toFixed(2);
    }
  },

  'vat-calculator.html': {
    calculate: function () {
      var amount = parseFloat(feetInput.value);
      var vatRate = inchesInput ? parseFloat(inchesInput.value) : NaN;
      var direction = decimalsSelect ? decimalsSelect.value : 'add';

      if (isNaN(amount) || isNaN(vatRate) || amount < 0 || vatRate < 0) {
        resultOutput.textContent = 'Please enter a valid amount and VAT rate';
        return;
      }

      if (direction === 'add') {
        var vatAmount = amount * (vatRate / 100);
        var gross = amount + vatAmount;
        resultOutput.textContent =
          'Net = ' + amount.toFixed(2) + ', VAT = ' + vatAmount.toFixed(2) + ', gross = ' + gross.toFixed(2);
      } else {
        var net = amount / (1 + (vatRate / 100));
        var vat = amount - net;
        resultOutput.textContent =
          'Net = ' + net.toFixed(2) + ', VAT = ' + vat.toFixed(2) + ', gross = ' + amount.toFixed(2);
      }
    }
  }

};

// =========================
// Shared Reset Function
// =========================
function resetCalculator() {
  if (feetInput) feetInput.value = '';
  if (inchesInput) inchesInput.value = '';
  if (decimalsSelect) {
    if (decimalsSelect.tagName === 'SELECT') {
      decimalsSelect.selectedIndex = 0;
    } else if ('defaultValue' in decimalsSelect) {
      decimalsSelect.value = decimalsSelect.defaultValue || '';
    } else {
      decimalsSelect.value = '';
    }
  }
  if (resultOutput) resultOutput.textContent = translateCalc('initialPrompt');
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

    if (decimalsSelect) {
      decimalsSelect.addEventListener('keydown', function (event) {
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