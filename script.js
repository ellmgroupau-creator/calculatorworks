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

function formatLocalDate(dateValue) {
  var year = dateValue.getFullYear();
  var month = String(dateValue.getMonth() + 1).padStart(2, '0');
  var day = String(dateValue.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function translateCalc(key, fallback) {
  const translations = {
    en: {
      initialPrompt: 'Enter a value to begin'
    },
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


function localizeDynamicText(text) {
  if (!text || currentLang === 'en') return text;
  const maps = {
    es: [
      ['Please enter valid numbers','Introduce números válidos'],['Please enter a valid number','Introduce un número válido'],['Please enter both dates','Introduce ambas fechas'],['Please enter valid dates','Introduce fechas válidas'],['Please enter both birth dates','Introduce ambas fechas de nacimiento'],['Please enter valid date-time values','Introduce valores válidos de fecha y hora'],['Please enter both date-time values','Introduce ambos valores de fecha y hora'],['Please enter a future date','Introduce una fecha futura'],['Please enter a date of birth','Introduce una fecha de nacimiento'],['Please enter feet and/or inches','Introduce pies y/o pulgadas'],['Please enter numbers separated by commas','Introduce números separados por comas'],['Please enter valid numbers','Introduce números válidos'],['Please enter valid body weight and height values','Introduce valores válidos de peso y altura'],['Please enter valid height and frame adjustment','Introduce valores válidos de altura y complexión'],['Please enter valid cost and price values','Introduce valores válidos de coste y precio'],['Please enter valid cost and markup percentage','Introduce valores válidos de coste y recargo'],['Please enter valid price and tax rate','Introduce valores válidos de precio e impuesto'],['Please enter valid cost, salvage value, and useful life values','Introduce valores válidos de coste, valor residual y vida útil'],['Please enter valid room dimensions','Introduce dimensiones válidas de la habitación'],['Please enter valid room dimensions and waste allowance','Introduce dimensiones válidas de la habitación y margen de desperdicio'],['Please enter valid area and coverage rate','Introduce valores válidos de área y rendimiento'],['Please enter valid area and gravel depth','Introduce valores válidos de área y profundidad de grava'],['Please enter valid area and mulch depth','Introduce valores válidos de área y profundidad de mantillo'],['Please enter valid area and tile dimensions','Introduce valores válidos de área y dimensiones de baldosa'],['Please enter valid slab dimensions','Introduce dimensiones válidas de la losa'],['Please enter valid balance and credit limit values','Introduce valores válidos de saldo y límite de crédito'],['Please enter valid balance, APR, and monthly payment','Introduce valores válidos de saldo, APR y pago mensual'],['Please enter valid balance, interest rate, and payment values','Introduce valores válidos de saldo, tipo de interés y pago'],['Please enter valid monthly debt and income values','Introduce valores válidos de deuda mensual e ingresos'],['Please enter valid asset and liability values','Introduce valores válidos de activos y pasivos'],['Please enter valid current assets and liabilities','Introduce valores válidos de activos y pasivos corrientes'],['Please enter valid quick assets and liabilities','Introduce valores válidos de activos rápidos y pasivos'],['Please enter valid selling price and variable cost values','Introduce valores válidos de precio de venta y coste variable'],['Please enter valid selling price and cost','Introduce valores válidos de precio de venta y coste'],['Please enter valid unit and profit values','Introduce valores válidos de unidad y beneficio'],['Please enter valid sales and rate values','Introduce valores válidos de ventas y tasa'],['Please enter valid gain and cost values','Introduce valores válidos de ganancia y coste'],['Please enter valid salary and work hours','Introduce valores válidos de salario y horas de trabajo'],['Please enter valid hourly rate and hours','Introduce valores válidos de tarifa por hora y horas'],['Please enter valid hourly rate, hours, and multiplier values','Introduce valores válidos de tarifa por hora, horas y multiplicador'],['Please enter valid salary and raise values','Introduce valores válidos de salario y aumento'],['Please enter valid salary, pay periods, and tax rate values','Introduce valores válidos de salario, periodos de pago y tasa fiscal'],['Please enter valid payment and term values','Introduce valores válidos de pago y plazo'],['Please enter valid principal, rate, and time values','Introduce valores válidos de principal, tasa y tiempo'],['Please enter valid price, rate, and years','Introduce valores válidos de precio, tasa y años'],['Please enter valid property price and percentage','Introduce valores válidos de precio de la propiedad y porcentaje'],['Please enter valid expenses and coverage months','Introduce valores válidos de gastos y meses de cobertura'],['Please enter valid goal, current savings amount, and monthly contribution','Introduce valores válidos de objetivo, ahorro actual y aportación mensual'],['Please enter valid bill, tip, and split values','Introduce valores válidos de cuenta, propina y reparto'],['Please enter valid weight and activity values','Introduce valores válidos de peso y actividad'],['Please enter valid body weight and protein target','Introduce valores válidos de peso corporal y objetivo de proteína'],['Please enter valid body weight and body-fat percentage','Introduce valores válidos de peso corporal y porcentaje de grasa'],['Please enter valid waist and hip measurements','Introduce valores válidos de cintura y cadera'],['Please enter valid cycle start date and cycle length','Introduce valores válidos de inicio de ciclo y duración'],['Please enter the first day of the last menstrual period','Introduce el primer día del último periodo menstrual'],['Please enter valid distance and time','Introduce valores válidos de distancia y tiempo'],['Please enter valid speed','Introduce una velocidad válida'],['Please enter valid amount and VAT rate','Introduce un importe y una tasa de IVA válidos'],['Please enter valid volume','Introduce un volumen válido'],['Please enter valid area','Introduce un área válida'],['Please enter valid area and rate','Introduce valores válidos de área y tasa'],['Please enter both start and end times','Introduce la hora de inicio y fin'],['Please enter both points as x,y','Introduce ambos puntos como x,y'],['Please enter two positive whole numbers','Introduce dos números enteros positivos'],['Please enter values and matching weights','Introduce valores y pesos correspondientes'],['Values and weights must contain the same number of valid entries','Los valores y pesos deben contener el mismo número de entradas válidas'],['Weights must be positive numbers','Los pesos deben ser números positivos'],['Credits must be positive numbers','Los créditos deben ser números positivos'],['Credits must match the number of grades','Los créditos deben coincidir con el número de calificaciones'],['Please enter at least one valid grade','Introduce al menos una calificación válida'],['Please enter grades separated by commas','Introduce calificaciones separadas por comas'],['Use valid letter grades or grade points between 0.0 and 4.0','Usa letras válidas o notas entre 0,0 y 4,0'],['Normal weight','Peso normal'],['Monthly payment must be higher than monthly interest','La cuota mensual debe ser mayor que el interés mensual'],['Original value must be greater than 0','El valor original debe ser mayor que 0'],['Selling price must be greater than variable cost per unit','El precio de venta debe ser mayor que el coste variable por unidad'],['Slope is undefined for a vertical line','La pendiente no está definida para una línea vertical'],['No mode: all values appear once','Sin moda: todos los valores aparecen una vez'],['Age difference = ','Diferencia de edad = '],['Average of ','Promedio de '],['Average pace = ','Ritmo medio = '],['BMI = ','IMC = '],['Baseline ideal weight = ','Peso ideal base = '],['Body surface area = ','Superficie corporal = '],['Break-even = ','Punto de equilibrio = '],['Business days = ','Días laborables = '],['Commission = ','Comisión = '],['Concrete volume = ','Volumen de hormigón = '],['Contribution per unit = ','Contribución por unidad = '],['Credit utilization = ','Utilización de crédito = '],['Current ratio = ','Ratio corriente = '],['Daily protein target = ','Objetivo diario de proteína = '],['Days remaining = ','Días restantes = '],['Debt-to-income ratio = ','Ratio deuda/ingresos = '],['Down payment = ','Pago inicial = '],['Emergency fund target = ','Objetivo de fondo de emergencia = '],['Estimated daily water intake = ','Consumo diario de agua estimado = '],['Estimated due date = ','Fecha de parto estimada = '],['Estimated monthly repayment = ','Cuota mensual estimada = '],['Estimated one-rep max = ','Una repetición máxima estimada = '],['Estimated ovulation date = ','Fecha estimada de ovulación = '],['Estimated paint needed = ','Pintura estimada necesaria = '],['Estimated payoff time = ','Tiempo estimado para liquidar = '],['Estimated tile quantity = ','Cantidad estimada de baldosas = '],['Estimated time to goal = ','Tiempo estimado hasta el objetivo = '],['Future balance = ','Saldo futuro = '],['Future price = ','Precio futuro = '],['GPA = ','GPA = '],['Gravel volume = ','Volumen de grava = '],['Gross per pay period = ','Bruto por periodo de pago = '],['Gross profit = ','Beneficio bruto = '],['Hours between dates = ','Horas entre fechas = '],['Interest = ','Interés = '],['Lean body mass = ','Masa corporal magra = '],['Markup amount = ','Importe del recargo = '],['Median = ','Mediana = '],['Midpoint = (','Punto medio = ('],['Mode = ','Moda = '],['Monthly = ','Mensual = '],['Monthly savings = ','Ahorro mensual = '],['Mulch volume = ','Volumen de mantillo = '],['Net = ','Neto = '],['Net worth = ','Patrimonio neto = '],['Percent change = ','Cambio porcentual = '],['Perimeter = ','Perímetro = '],['Population standard deviation = ','Desviación estándar poblacional = '],['Projected profit = ','Beneficio proyectado = '],['Quick ratio = ','Ratio rápido = '],['ROI = ','ROI = '],['Raise amount = ','Importe del aumento = '],['Regular hours = ','Horas normales = '],['Resulting date = ','Fecha resultante = '],['Room area = ','Área de la habitación = '],['Sale price = ','Precio final = '],['Sales tax = ','Impuesto sobre ventas = '],['Simplified ratio = ','Razón simplificada = '],['Slope = ','Pendiente = '],['Tip = ','Propina = '],['Total litres = ','Litros totales = '],['Waist-to-hip ratio = ','Relación cintura-cadera = '],['Weekly pay = ','Pago semanal = '],['Weeks between dates = ','Semanas entre fechas = '],['Weighted average = ','Promedio ponderado = '],['Date of birth must be in the past','La fecha de nacimiento debe estar en el pasado'],[' years, ',' años, '],[' months, ',' meses, '],[' days',' días'],[' hours ',' horas '],[' minutes',' minutos'],[' day',' día'],[' hour',' hora'],[' minute',' minuto'],['decreased by ','disminuido en '],['increased by ','aumentado en '],[' sq ft',' pies cuadrados'],[' sq m',' m²'],[' litres',' litros'],[' miles',' millas'],[' inches',' pulgadas'],[' pounds',' libras']
    ],
      pt: [
      ['Please enter valid numbers','Introduza números válidos'],['Please enter a valid number','Introduza um número válido'],['Please enter both dates','Introduza ambas as datas'],['Please enter valid dates','Introduza datas válidas'],['Please enter both birth dates','Introduza ambas as datas de nascimento'],['Please enter valid date-time values','Introduza valores válidos de data e hora'],['Please enter both date-time values','Introduza ambos os valores de data e hora'],['Please enter a future date','Introduza uma data futura'],['Please enter a date of birth','Introduza uma data de nascimento'],['Please enter feet and/or inches','Introduza pés e/ou polegadas'],['Please enter numbers separated by commas','Introduza números separados por vírgulas'],['Please enter valid body weight and height values','Introduza valores válidos de peso e altura'],['Please enter valid height and frame adjustment','Introduza valores válidos de altura e estrutura'],['Please enter valid cost and price values','Introduza valores válidos de custo e preço'],['Please enter valid cost and markup percentage','Introduza valores válidos de custo e margem'],['Please enter valid price and tax rate','Introduza valores válidos de preço e imposto'],['Please enter valid cost, salvage value, and useful life values','Introduza valores válidos de custo, valor residual e vida útil'],['Please enter valid room dimensions','Introduza dimensões válidas da divisão'],['Please enter valid room dimensions and waste allowance','Introduza dimensões válidas da divisão e margem de desperdício'],['Please enter valid area and coverage rate','Introduza valores válidos de área e rendimento'],['Please enter valid area and gravel depth','Introduza valores válidos de área e profundidade de gravilha'],['Please enter valid area and mulch depth','Introduza valores válidos de área e profundidade de cobertura'],['Please enter valid area and tile dimensions','Introduza valores válidos de área e dimensões do azulejo'],['Please enter valid slab dimensions','Introduza dimensões válidas da laje'],['Please enter valid balance and credit limit values','Introduza valores válidos de saldo e limite de crédito'],['Please enter valid balance, APR, and monthly payment','Introduza valores válidos de saldo, APR e pagamento mensal'],['Please enter valid balance, interest rate, and payment values','Introduza valores válidos de saldo, taxa de juro e pagamento'],['Please enter valid monthly debt and income values','Introduza valores válidos de dívida mensal e rendimento'],['Please enter valid asset and liability values','Introduza valores válidos de ativos e passivos'],['Please enter valid current assets and liabilities','Introduza valores válidos de ativos correntes e passivos'],['Please enter valid quick assets and liabilities','Introduza valores válidos de ativos rápidos e passivos'],['Please enter valid selling price and variable cost values','Introduza valores válidos de preço de venda e custo variável'],['Please enter valid selling price and cost','Introduza valores válidos de preço de venda e custo'],['Please enter valid unit and profit values','Introduza valores válidos de unidade e lucro'],['Please enter valid sales and rate values','Introduza valores válidos de vendas e taxa'],['Please enter valid gain and cost values','Introduza valores válidos de ganho e custo'],['Please enter valid salary and work hours','Introduza valores válidos de salário e horas de trabalho'],['Please enter valid hourly rate and hours','Introduza valores válidos de tarifa horária e horas'],['Please enter valid hourly rate, hours, and multiplier values','Introduza valores válidos de tarifa horária, horas e multiplicador'],['Please enter valid salary and raise values','Introduza valores válidos de salário e aumento'],['Please enter valid salary, pay periods, and tax rate values','Introduza valores válidos de salário, períodos de pagamento e taxa fiscal'],['Please enter valid payment and term values','Introduza valores válidos de pagamento e prazo'],['Please enter valid principal, rate, and time values','Introduza valores válidos de capital, taxa e tempo'],['Please enter valid price, rate, and years','Introduza valores válidos de preço, taxa e anos'],['Please enter valid property price and percentage','Introduza valores válidos de preço da propriedade e percentagem'],['Please enter valid expenses and coverage months','Introduza valores válidos de despesas e meses de cobertura'],['Please enter valid goal, current savings amount, and monthly contribution','Introduza valores válidos de objetivo, poupança atual e contribuição mensal'],['Please enter valid bill, tip, and split values','Introduza valores válidos de conta, gorjeta e divisão'],['Please enter valid weight and activity values','Introduza valores válidos de peso e atividade'],['Please enter valid body weight and protein target','Introduza valores válidos de peso corporal e objetivo de proteína'],['Please enter valid body weight and body-fat percentage','Introduza valores válidos de peso corporal e percentagem de gordura'],['Please enter valid waist and hip measurements','Introduza valores válidos de cintura e anca'],['Please enter valid cycle start date and cycle length','Introduza valores válidos de início de ciclo e duração'],['Please enter the first day of the last menstrual period','Introduza o primeiro dia do último período menstrual'],['Please enter valid distance and time','Introduza valores válidos de distância e tempo'],['Please enter valid speed','Introduza uma velocidade válida'],['Please enter valid amount and VAT rate','Introduza um valor e uma taxa de IVA válidos'],['Please enter valid volume','Introduza um volume válido'],['Please enter valid area','Introduza uma área válida'],['Please enter valid area and rate','Introduza valores válidos de área e taxa'],['Please enter both start and end times','Introduza a hora de início e de fim'],['Please enter both points as x,y','Introduza ambos os pontos como x,y'],['Please enter two positive whole numbers','Introduza dois números inteiros positivos'],['Please enter values and matching weights','Introduza valores e pesos correspondentes'],['Values and weights must contain the same number of valid entries','Os valores e os pesos devem conter o mesmo número de entradas válidas'],['Weights must be positive numbers','Os pesos devem ser números positivos'],['Credits must be positive numbers','Os créditos devem ser números positivos'],['Credits must match the number of grades','Os créditos devem corresponder ao número de classificações'],['Please enter at least one valid grade','Introduza pelo menos uma classificação válida'],['Please enter grades separated by commas','Introduza classificações separadas por vírgulas'],['Use valid letter grades or grade points between 0.0 and 4.0','Use letras válidas ou notas entre 0,0 e 4,0'],['Normal weight','Peso normal'],['Monthly payment must be higher than monthly interest','O pagamento mensal deve ser superior ao juro mensal'],['Original value must be greater than 0','O valor original deve ser superior a 0'],['Selling price must be greater than variable cost per unit','O preço de venda deve ser superior ao custo variável por unidade'],['Slope is undefined for a vertical line','O declive é indefinido para uma linha vertical'],['No mode: all values appear once','Sem moda: todos os valores aparecem uma vez'],['Age difference = ','Diferença de idades = '],['Average of ','Média de '],['Average pace = ','Ritmo médio = '],['BMI = ','IMC = '],['Baseline ideal weight = ','Peso ideal base = '],['Body surface area = ','Superfície corporal = '],['Break-even = ','Ponto de equilíbrio = '],['Business days = ','Dias úteis = '],['Commission = ','Comissão = '],['Concrete volume = ','Volume de betão = '],['Contribution per unit = ','Contribuição por unidade = '],['Credit utilization = ','Utilização de crédito = '],['Current ratio = ','Rácio corrente = '],['Daily protein target = ','Objetivo diário de proteína = '],['Days remaining = ','Dias restantes = '],['Debt-to-income ratio = ','Rácio dívida/rendimento = '],['Down payment = ','Entrada = '],['Emergency fund target = ','Objetivo do fundo de emergência = '],['Estimated daily water intake = ','Ingestão diária de água estimada = '],['Estimated due date = ','Data prevista estimada = '],['Estimated monthly repayment = ','Prestação mensal estimada = '],['Estimated one-rep max = ','Uma repetição máxima estimada = '],['Estimated ovulation date = ','Data estimada de ovulação = '],['Estimated paint needed = ','Tinta estimada necessária = '],['Estimated payoff time = ','Tempo estimado para liquidar = '],['Estimated tile quantity = ','Quantidade estimada de azulejos = '],['Estimated time to goal = ','Tempo estimado até ao objetivo = '],['Future balance = ','Saldo futuro = '],['Future price = ','Preço futuro = '],['GPA = ','GPA = '],['Gravel volume = ','Volume de gravilha = '],['Gross per pay period = ','Bruto por período de pagamento = '],['Gross profit = ','Lucro bruto = '],['Hours between dates = ','Horas entre datas = '],['Interest = ','Juro = '],['Lean body mass = ','Massa corporal magra = '],['Markup amount = ','Valor da margem = '],['Median = ','Mediana = '],['Midpoint = (','Ponto médio = ('],['Mode = ','Moda = '],['Monthly = ','Mensal = '],['Monthly savings = ','Poupança mensal = '],['Mulch volume = ','Volume de cobertura = '],['Net = ','Líquido = '],['Net worth = ','Património líquido = '],['Percent change = ','Variação percentual = '],['Perimeter = ','Perímetro = '],['Population standard deviation = ','Desvio padrão populacional = '],['Projected profit = ','Lucro projetado = '],['Quick ratio = ','Rácio rápido = '],['ROI = ','ROI = '],['Raise amount = ','Valor do aumento = '],['Regular hours = ','Horas normais = '],['Resulting date = ','Data resultante = '],['Room area = ','Área da divisão = '],['Sale price = ','Preço final = '],['Sales tax = ','Imposto sobre vendas = '],['Simplified ratio = ','Rácio simplificado = '],['Slope = ','Declive = '],['Tip = ','Gorjeta = '],['Total litres = ','Litros totais = '],['Waist-to-hip ratio = ','Relação cintura/anca = '],['Weekly pay = ','Pagamento semanal = '],['Weeks between dates = ','Semanas entre datas = '],['Weighted average = ','Média ponderada = '],['Date of birth must be in the past','A data de nascimento deve estar no passado'],[' years, ',' anos, '],[' months, ',' meses, '],[' days',' dias'],[' hours ',' horas '],[' minutes',' minutos'],[' day',' dia'],[' hour',' hora'],[' minute',' minuto'],['decreased by ','diminuído em '],['increased by ','aumentado em '],[' sq ft',' pés quadrados'],[' sq m',' m²'],[' litres',' litros'],[' miles',' milhas'],[' inches',' polegadas'],[' pounds',' libras']
    ]
  };
  let result = String(text);
  const replacements = maps[currentLang] || [];
  replacements.forEach(function (pair) { result = result.split(pair[0]).join(pair[1]); });
  return result;
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
  },
  'age-difference-calculator.html': {
    calculate: function () { var a=feetInput.value, b=inchesInput?inchesInput.value:''; if(!a||!b){resultOutput.textContent='Please enter both birth dates';return;} var d1=new Date(a+'T00:00:00'), d2=new Date(b+'T00:00:00'); if(isNaN(d1.getTime())||isNaN(d2.getTime())){resultOutput.textContent='Please enter valid dates';return;} var o=d1<=d2?d1:d2, y=d1<=d2?d2:d1, yrs=y.getFullYear()-o.getFullYear(), mos=y.getMonth()-o.getMonth(); if(y.getDate()<o.getDate())mos--; if(mos<0){yrs--; mos+=12;} resultOutput.textContent='Age difference = '+yrs+' years, '+mos+' months'; }
  },
  'body-surface-area-calculator.html': {
    calculate: function () { var w=parseFloat(feetInput.value), h=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(w)||isNaN(h)||w<=0||h<=0){resultOutput.textContent='Please enter valid body weight and height values';return;} resultOutput.textContent='Body surface area = '+Math.sqrt((h*w)/3600).toFixed(2)+' m²'; }
  },
  'business-days-calculator.html': {
    calculate: function () { var sv=feetInput.value, ev=inchesInput?inchesInput.value:''; if(!sv||!ev){resultOutput.textContent='Please enter both dates';return;} var s=new Date(sv+'T00:00:00'), e=new Date(ev+'T00:00:00'); if(isNaN(s.getTime())||isNaN(e.getTime())){resultOutput.textContent='Please enter valid dates';return;} var step=e>=s?1:-1, cur=new Date(s.getTime()), n=0; while(cur.getTime()!==e.getTime()){ cur.setDate(cur.getDate()+step); var day=cur.getDay(); if(day!==0&&day!==6)n+=step; } resultOutput.textContent='Business days = '+n; }
  },
  'business-profit-planner-calculator.html': {
    calculate: function () { var u=parseFloat(feetInput.value), p=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(u)||isNaN(p)||u<0||p<0){resultOutput.textContent='Please enter valid unit and profit values';return;} resultOutput.textContent='Projected profit = '+(u*p).toFixed(2); }
  },
  'concrete-calculator.html': {
    calculate: function () { var l=parseFloat(feetInput.value), w=inchesInput?parseFloat(inchesInput.value):NaN, d=decimalsSelect?parseFloat(decimalsSelect.value):NaN; if(isNaN(l)||isNaN(w)||isNaN(d)||l<=0||w<=0||d<=0){resultOutput.textContent='Please enter valid slab dimensions';return;} resultOutput.textContent='Concrete volume = '+(l*w*d).toFixed(2)+' cubic metres'; }
  },
  'contribution-margin-calculator.html': {
    calculate: function () { var p=parseFloat(feetInput.value), v=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(p)||isNaN(v)||p<=0||v<0||v>p){resultOutput.textContent='Please enter valid selling price and variable cost values';return;} var c=p-v; resultOutput.textContent='Contribution per unit = '+c.toFixed(2)+', contribution margin ratio = '+((c/p)*100).toFixed(2)+'%'; }
  },
  'countdown-calculator.html': {
    calculate: function () { var v=feetInput.value; if(!v){resultOutput.textContent='Please enter a future date';return;} var t=new Date(v+'T00:00:00'); var now=new Date(), start=new Date(now.getFullYear(),now.getMonth(),now.getDate()); if(isNaN(t.getTime())){resultOutput.textContent='Please enter a valid date';return;} resultOutput.textContent='Days remaining = '+Math.round((t-start)/(1000*60*60*24)); }
  },
  'credit-card-payoff-calculator.html': {
    calculate: function () { var b=parseFloat(feetInput.value), r=inchesInput?parseFloat(inchesInput.value):NaN, p=decimalsSelect?parseFloat(decimalsSelect.value):NaN; if(isNaN(b)||isNaN(r)||isNaN(p)||b<=0||r<0||p<=0){resultOutput.textContent='Please enter a valid balance, APR, and monthly payment';return;} var mr=r/100/12,m=0,ti=0,c=b; while(c>0&&m<1200){var i=c*mr;if(p<=i&&mr>0){resultOutput.textContent='Monthly payment must be higher than monthly interest';return;} c=c+i-p; ti+=i; m++; if(c<0)c=0;} resultOutput.textContent='Estimated payoff time = '+m+' months, total interest = '+ti.toFixed(2); }
  },
  'credit-utilization-calculator.html': {
    calculate: function () { var b=parseFloat(feetInput.value), l=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(b)||isNaN(l)||b<0||l<=0){resultOutput.textContent='Please enter valid balance and credit limit values';return;} resultOutput.textContent='Credit utilization = '+((b/l)*100).toFixed(2)+'%'; }
  },
  'cups-to-ml-calculator.html': {
    calculate: function () { var v=parseFloat(feetInput.value); if(isNaN(v)||v<0){resultOutput.textContent='Please enter a valid volume';return;} resultOutput.textContent=v+' cups = '+(v*236.588).toFixed(2)+' mL'; }
  },
  'current-ratio-calculator.html': {
    calculate: function () { var a=parseFloat(feetInput.value), l=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(a)||isNaN(l)||a<0||l<=0){resultOutput.textContent='Please enter valid current assets and liabilities';return;} resultOutput.textContent='Current ratio = '+(a/l).toFixed(2); }
  },
  'date-add-calculator.html': {
    calculate: function () { var sv=feetInput.value, d=inchesInput?parseFloat(inchesInput.value):NaN; if(!sv||isNaN(d)){resultOutput.textContent='Please enter a valid start date and number of days';return;} var dt=new Date(sv+'T00:00:00'); if(isNaN(dt.getTime())){resultOutput.textContent='Please enter a valid date';return;} dt.setDate(dt.getDate()+Math.round(d)); resultOutput.textContent='Resulting date = '+formatLocalDate(dt); }
  },
  'debt-payoff-calculator.html': {
    calculate: function () { var b=parseFloat(feetInput.value), r=inchesInput?parseFloat(inchesInput.value):NaN, p=decimalsSelect?parseFloat(decimalsSelect.value):NaN; if(isNaN(b)||isNaN(r)||isNaN(p)||b<=0||r<0||p<=0){resultOutput.textContent='Please enter valid balance, interest rate, and payment values';return;} var mr=r/100/12,m=0,ti=0,c=b; while(c>0&&m<1200){var i=c*mr;if(p<=i&&mr>0){resultOutput.textContent='Monthly payment must be higher than monthly interest';return;} c=c+i-p; ti+=i; m++; if(c<0)c=0;} resultOutput.textContent='Estimated payoff time = '+m+' months, total interest = '+ti.toFixed(2); }
  },
  'debt-to-income-calculator.html': {
    calculate: function () { var d=parseFloat(feetInput.value), i=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(d)||isNaN(i)||d<0||i<=0){resultOutput.textContent='Please enter valid monthly debt and income values';return;} resultOutput.textContent='Debt-to-income ratio = '+((d/i)*100).toFixed(2)+'%'; }
  },
  'depreciation-calculator.html': {
    calculate: function () { var c=parseFloat(feetInput.value), s=inchesInput?parseFloat(inchesInput.value):NaN, y=decimalsSelect?parseFloat(decimalsSelect.value):NaN; if(isNaN(c)||isNaN(s)||isNaN(y)||c<0||s<0||y<=0||s>c){resultOutput.textContent='Please enter valid cost, salvage value, and useful life values';return;} resultOutput.textContent='Annual depreciation = '+((c-s)/y).toFixed(2); }
  },
  'down-payment-calculator.html': {
    calculate: function () { var p=parseFloat(feetInput.value), d=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(p)||isNaN(d)||p<=0||d<0||d>100){resultOutput.textContent='Please enter a valid property price and percentage';return;} var dp=p*(d/100); resultOutput.textContent='Down payment = '+dp.toFixed(2)+', loan amount = '+(p-dp).toFixed(2); }
  },
  'due-date-calculator.html': {
    calculate: function () { var v=feetInput.value; if(!v){resultOutput.textContent='Please enter the first day of the last menstrual period';return;} var d=new Date(v+'T00:00:00'); if(isNaN(d.getTime())){resultOutput.textContent='Please enter a valid date';return;} d.setDate(d.getDate()+280); resultOutput.textContent='Estimated due date = '+formatLocalDate(d); }
  },
  'emergency-fund-calculator.html': {
    calculate: function () { var e=parseFloat(feetInput.value), m=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(e)||isNaN(m)||e<0||m<=0){resultOutput.textContent='Please enter valid expenses and coverage months';return;} resultOutput.textContent='Emergency fund target = '+(e*m).toFixed(2); }
  },
  'flooring-calculator.html': {
    calculate: function () { var l=parseFloat(feetInput.value), w=inchesInput?parseFloat(inchesInput.value):NaN, x=decimalsSelect?parseFloat(decimalsSelect.value):NaN; if(isNaN(l)||isNaN(w)||isNaN(x)||l<=0||w<=0||x<0){resultOutput.textContent='Please enter valid room dimensions and waste allowance';return;} var a=l*w; resultOutput.textContent='Room area = '+a.toFixed(2)+', flooring to buy = '+(a*(1+(x/100))).toFixed(2); }
  },
  'gallons-to-litres-calculator.html': {
    calculate: function () { var v=parseFloat(feetInput.value); if(isNaN(v)||v<0){resultOutput.textContent='Please enter a valid volume';return;} resultOutput.textContent=v+' US gallons = '+(v*3.78541).toFixed(2)+' litres'; }
  },
  'gravel-calculator.html': {
    calculate: function () { var a=parseFloat(feetInput.value), d=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(a)||isNaN(d)||a<=0||d<=0){resultOutput.textContent='Please enter a valid area and gravel depth';return;} resultOutput.textContent='Gravel volume = '+(a*(d/100)).toFixed(2)+' cubic metres'; }
  },
  'hourly-to-salary-calculator.html': {
    calculate: function () { var r=parseFloat(feetInput.value), h=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(r)||isNaN(h)||r<0||h<=0){resultOutput.textContent='Please enter a valid hourly rate and hours';return;} var w=r*h,a=w*52; resultOutput.textContent='Weekly pay = '+w.toFixed(2)+', monthly pay = '+(a/12).toFixed(2)+', annual pay = '+a.toFixed(2); }
  },
  'hours-between-dates-calculator.html': {
    calculate: function () { var sv=feetInput.value, ev=inchesInput?inchesInput.value:''; if(!sv||!ev){resultOutput.textContent='Please enter both date-time values';return;} var s=new Date(sv), e=new Date(ev); if(isNaN(s.getTime())||isNaN(e.getTime())){resultOutput.textContent='Please enter valid date-time values';return;} resultOutput.textContent='Hours between dates = '+(Math.abs(e-s)/(1000*60*60)).toFixed(2); }
  },
  'ideal-weight-calculator.html': {
    calculate: function () { var h=parseFloat(feetInput.value), f=inchesInput?parseFloat(inchesInput.value):0; if(isNaN(h)||isNaN(f)||h<=0){resultOutput.textContent='Please enter a valid height and frame adjustment';return;} var over=Math.max((h/2.54)-60,0), base=50+(2.3*over), adj=base*(1+(f/100)); resultOutput.textContent='Baseline ideal weight = '+base.toFixed(2)+' kg, adjusted estimate = '+adj.toFixed(2)+' kg'; }
  },
  'kph-to-mph-calculator.html': {
    calculate: function () { var v=parseFloat(feetInput.value); if(isNaN(v)||v<0){resultOutput.textContent='Please enter a valid speed';return;} resultOutput.textContent=v+' kph = '+(v*0.621371).toFixed(2)+' mph'; }
  },
  'lean-body-mass-calculator.html': {
    calculate: function () { var w=parseFloat(feetInput.value), b=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(w)||isNaN(b)||w<=0||b<0||b>=100){resultOutput.textContent='Please enter a valid body weight and body-fat percentage';return;} resultOutput.textContent='Lean body mass = '+(w*(1-(b/100))).toFixed(2)+' kg'; }
  },
  'litres-per-square-metre-calculator.html': {
    calculate: function () { var a=parseFloat(feetInput.value), r=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(a)||isNaN(r)||a<0||r<0){resultOutput.textContent='Please enter a valid area and rate';return;} resultOutput.textContent='Total litres = '+(a*r).toFixed(2); }
  },
  'litres-to-gallons-calculator.html': {
    calculate: function () { var v=parseFloat(feetInput.value); if(isNaN(v)||v<0){resultOutput.textContent='Please enter a valid volume';return;} resultOutput.textContent=v+' litres = '+(v*0.264172).toFixed(2)+' US gallons'; }
  },
  'median-calculator.html': {
    calculate: function () { var raw=feetInput.value; if(!raw||!raw.trim()){resultOutput.textContent='Please enter numbers separated by commas';return;} var n=raw.split(',').map(function(x){return parseFloat(x.trim());}).filter(function(x){return !isNaN(x);}).sort(function(a,b){return a-b;}); if(!n.length){resultOutput.textContent='Please enter valid numbers';return;} var m=Math.floor(n.length/2), med=n.length%2?n[m]:(n[m-1]+n[m])/2; resultOutput.textContent='Median = '+med.toFixed(2); }
  },
  'midpoint-calculator.html': {
    calculate: function () { var p1=feetInput.value.split(',').map(function(x){return parseFloat(x.trim());}), p2=inchesInput?inchesInput.value.split(',').map(function(x){return parseFloat(x.trim());}):[]; if(p1.length!==2||p2.length!==2||p1.some(isNaN)||p2.some(isNaN)){resultOutput.textContent='Please enter both points as x,y';return;} resultOutput.textContent='Midpoint = ('+((p1[0]+p2[0])/2).toFixed(2)+', '+((p1[1]+p2[1])/2).toFixed(2)+')'; }
  },
  'ml-to-cups-calculator.html': {
    calculate: function () { var v=parseFloat(feetInput.value); if(isNaN(v)||v<0){resultOutput.textContent='Please enter a valid volume';return;} resultOutput.textContent=v+' mL = '+(v/236.588).toFixed(2)+' cups'; }
  },
  'mode-calculator.html': {
    calculate: function () { var raw=feetInput.value; if(!raw||!raw.trim()){resultOutput.textContent='Please enter numbers separated by commas';return;} var n=raw.split(',').map(function(x){return parseFloat(x.trim());}).filter(function(x){return !isNaN(x);}); if(!n.length){resultOutput.textContent='Please enter valid numbers';return;} var c={}, mx=0; n.forEach(function(v){var k=v.toString(); c[k]=(c[k]||0)+1; if(c[k]>mx)mx=c[k];}); if(mx===1){resultOutput.textContent='No mode: all values appear once';return;} var m=Object.keys(c).filter(function(k){return c[k]===mx;}); resultOutput.textContent='Mode = '+m.join(', '); }
  },
  'mph-to-kph-calculator.html': {
    calculate: function () { var v=parseFloat(feetInput.value); if(isNaN(v)||v<0){resultOutput.textContent='Please enter a valid speed';return;} resultOutput.textContent=v+' mph = '+(v*1.60934).toFixed(2)+' kph'; }
  },
  'mulch-calculator.html': {
    calculate: function () { var a=parseFloat(feetInput.value), d=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(a)||isNaN(d)||a<=0||d<=0){resultOutput.textContent='Please enter a valid area and mulch depth';return;} resultOutput.textContent='Mulch volume = '+(a*(d/100)).toFixed(2)+' cubic metres'; }
  },
  'net-worth-calculator.html': {
    calculate: function () { var a=parseFloat(feetInput.value), l=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(a)||isNaN(l)||a<0||l<0){resultOutput.textContent='Please enter valid asset and liability values';return;} resultOutput.textContent='Net worth = '+(a-l).toFixed(2); }
  },
  'one-rep-max-calculator.html': {
    calculate: function () { var w=parseFloat(feetInput.value), r=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(w)||isNaN(r)||w<=0||r<1||r>=37){resultOutput.textContent='Please enter a valid lifted weight and rep count below 37';return;} resultOutput.textContent='Estimated one-rep max = '+(w*36/(37-r)).toFixed(2); }
  },
  'overtime-calculator.html': {
    calculate: function () { var r=parseFloat(feetInput.value), h=inchesInput?parseFloat(inchesInput.value):NaN, m=decimalsSelect?parseFloat(decimalsSelect.value):NaN; if(isNaN(r)||isNaN(h)||isNaN(m)||r<0||h<0||m<1){resultOutput.textContent='Please enter valid hourly rate, hours, and multiplier values';return;} var reg=Math.min(h,40), ot=Math.max(h-40,0), g=(reg*r)+(ot*r*m); resultOutput.textContent='Regular hours = '+reg.toFixed(2)+', overtime hours = '+ot.toFixed(2)+', gross pay = '+g.toFixed(2); }
  },
  'ovulation-calculator.html': {
    calculate: function () { var s=feetInput.value, c=inchesInput?parseFloat(inchesInput.value):NaN; if(!s||isNaN(c)||c<20){resultOutput.textContent='Please enter a valid cycle start date and cycle length';return;} var d=new Date(s+'T00:00:00'); d.setDate(d.getDate()+Math.round(c)-14); resultOutput.textContent='Estimated ovulation date = '+formatLocalDate(d); }
  },
  'pace-calculator.html': {
    calculate: function () { var d=parseFloat(feetInput.value), t=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(d)||isNaN(t)||d<=0||t<=0){resultOutput.textContent='Please enter a valid distance and time';return;} var p=t/d,m=Math.floor(p),s=Math.round((p-m)*60); if(s===60){m+=1;s=0;} resultOutput.textContent='Average pace = '+m+':' + (s<10?'0'+s:s) + ' per km'; }
  },
  'paint-calculator.html': {
    calculate: function () { var a=parseFloat(feetInput.value), c=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(a)||isNaN(c)||a<=0||c<=0){resultOutput.textContent='Please enter a valid area and coverage rate';return;} resultOutput.textContent='Estimated paint needed = '+(a/c).toFixed(2)+' litres'; }
  },
  'pay-raise-calculator.html': {
    calculate: function () { var s=parseFloat(feetInput.value), r=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(s)||isNaN(r)||s<0||r<0){resultOutput.textContent='Please enter valid salary and raise values';return;} var a=s*(r/100); resultOutput.textContent='Raise amount = '+a.toFixed(2)+', new salary = '+(s+a).toFixed(2); }
  },
  'paycheck-calculator.html': {
    calculate: function () { var s=parseFloat(feetInput.value), p=inchesInput?parseFloat(inchesInput.value):NaN, t=decimalsSelect?parseFloat(decimalsSelect.value):NaN; if(isNaN(s)||isNaN(p)||isNaN(t)||s<0||p<=0||t<0||t>100){resultOutput.textContent='Please enter valid salary, pay periods, and tax rate values';return;} var g=s/p; resultOutput.textContent='Gross per pay period = '+g.toFixed(2)+', post-tax estimate = '+(g*(1-(t/100))).toFixed(2); }
  },
  'protein-intake-calculator.html': {
    calculate: function () { var w=parseFloat(feetInput.value), g=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(w)||isNaN(g)||w<=0||g<=0){resultOutput.textContent='Please enter a valid body weight and protein target';return;} resultOutput.textContent='Daily protein target = '+(w*g).toFixed(2)+' grams'; }
  },
  'quick-ratio-calculator.html': {
    calculate: function () { var a=parseFloat(feetInput.value), l=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(a)||isNaN(l)||a<0||l<=0){resultOutput.textContent='Please enter valid quick assets and liabilities';return;} resultOutput.textContent='Quick ratio = '+(a/l).toFixed(2); }
  },
  'ratio-calculator.html': {
    calculate: function () { var a=parseInt(feetInput.value,10), b=inchesInput?parseInt(inchesInput.value,10):NaN; function gcd(x,y){return y===0?x:gcd(y,x%y);} if(isNaN(a)||isNaN(b)||a<=0||b<=0){resultOutput.textContent='Please enter two positive whole numbers';return;} var g=gcd(a,b); resultOutput.textContent='Simplified ratio = '+(a/g)+':'+(b/g); }
  },
  'refinance-savings-calculator.html': {
    calculate: function () { var c=parseFloat(feetInput.value), n=inchesInput?parseFloat(inchesInput.value):NaN, m=decimalsSelect?parseFloat(decimalsSelect.value):NaN; if(isNaN(c)||isNaN(n)||isNaN(m)||c<0||n<0||m<=0){resultOutput.textContent='Please enter valid payment and term values';return;} resultOutput.textContent='Monthly savings = '+(c-n).toFixed(2)+', total savings = '+((c-n)*m).toFixed(2); }
  },
  'room-perimeter-calculator.html': {
    calculate: function () { var l=parseFloat(feetInput.value), w=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(l)||isNaN(w)||l<=0||w<=0){resultOutput.textContent='Please enter valid room dimensions';return;} resultOutput.textContent='Perimeter = '+(2*(l+w)).toFixed(2); }
  },
  'sales-tax-calculator.html': {
    calculate: function () { var p=parseFloat(feetInput.value), r=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(p)||isNaN(r)||p<0||r<0){resultOutput.textContent='Please enter a valid price and tax rate';return;} var t=p*(r/100); resultOutput.textContent='Sales tax = '+t.toFixed(2)+', final price = '+(p+t).toFixed(2); }
  },
  'savings-goal-calculator.html': {
    calculate: function () { var g=parseFloat(feetInput.value), c=inchesInput?parseFloat(inchesInput.value):NaN, m=decimalsSelect?parseFloat(decimalsSelect.value):NaN; if(isNaN(g)||isNaN(c)||isNaN(m)||g<=0||c<0||m<=0||c>g){resultOutput.textContent='Please enter a valid goal, current savings amount, and monthly contribution';return;} resultOutput.textContent='Estimated time to goal = '+Math.ceil((g-c)/m)+' months'; }
  },
  'slope-calculator.html': {
    calculate: function () { var p1=feetInput.value.split(',').map(function(x){return parseFloat(x.trim());}), p2=inchesInput?inchesInput.value.split(',').map(function(x){return parseFloat(x.trim());}):[]; if(p1.length!==2||p2.length!==2||p1.some(isNaN)||p2.some(isNaN)){resultOutput.textContent='Please enter both points as x,y';return;} var dx=p2[0]-p1[0]; if(dx===0){resultOutput.textContent='Slope is undefined for a vertical line';return;} resultOutput.textContent='Slope = '+((p2[1]-p1[1])/dx).toFixed(2); }
  },
  'square-feet-to-square-metres-calculator.html': {
    calculate: function () { var v=parseFloat(feetInput.value); if(isNaN(v)||v<0){resultOutput.textContent='Please enter a valid area';return;} resultOutput.textContent=v+' sq ft = '+(v*0.092903).toFixed(2)+' sq m'; }
  },
  'square-footage-calculator.html': {
    calculate: function () { var l=parseFloat(feetInput.value), w=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(l)||isNaN(w)||l<=0||w<=0){resultOutput.textContent='Please enter valid length and width values';return;} resultOutput.textContent='Area = '+(l*w).toFixed(2)+' square units'; }
  },
  'square-metres-to-square-feet-calculator.html': {
    calculate: function () { var v=parseFloat(feetInput.value); if(isNaN(v)||v<0){resultOutput.textContent='Please enter a valid area';return;} resultOutput.textContent=v+' sq m = '+(v*10.7639).toFixed(2)+' sq ft'; }
  },
  'standard-deviation-calculator.html': {
    calculate: function () { var raw=feetInput.value; if(!raw||!raw.trim()){resultOutput.textContent='Please enter numbers separated by commas';return;} var n=raw.split(',').map(function(x){return parseFloat(x.trim());}).filter(function(x){return !isNaN(x);}); if(!n.length){resultOutput.textContent='Please enter valid numbers';return;} var s=0; n.forEach(function(v){s+=v;}); var mean=s/n.length, sq=0; n.forEach(function(v){sq+=Math.pow(v-mean,2);}); resultOutput.textContent='Population standard deviation = '+Math.sqrt(sq/n.length).toFixed(2); }
  },
  'tile-calculator.html': {
    calculate: function () { var a=parseFloat(feetInput.value), l=inchesInput?parseFloat(inchesInput.value):NaN, w=decimalsSelect?parseFloat(decimalsSelect.value):NaN; if(isNaN(a)||isNaN(l)||isNaN(w)||a<=0||l<=0||w<=0){resultOutput.textContent='Please enter valid area and tile dimensions';return;} var ta=(l/100)*(w/100); resultOutput.textContent='Estimated tile quantity = '+Math.ceil(a/ta)+' tiles'; }
  },
  'waist-to-hip-ratio-calculator.html': {
    calculate: function () { var w=parseFloat(feetInput.value), h=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(w)||isNaN(h)||w<=0||h<=0){resultOutput.textContent='Please enter valid waist and hip measurements';return;} resultOutput.textContent='Waist-to-hip ratio = '+(w/h).toFixed(2); }
  },
  'water-intake-calculator.html': {
    calculate: function () { var w=parseFloat(feetInput.value), a=inchesInput?parseFloat(inchesInput.value):NaN; if(isNaN(w)||isNaN(a)||w<=0||a<0){resultOutput.textContent='Please enter valid weight and activity values';return;} resultOutput.textContent='Estimated daily water intake = '+(((w*35)+(a*12))/1000).toFixed(2)+' litres'; }
  },
  'weeks-between-dates-calculator.html': {
    calculate: function () { var sv=feetInput.value, ev=inchesInput?inchesInput.value:''; if(!sv||!ev){resultOutput.textContent='Please enter both dates';return;} var s=new Date(sv+'T00:00:00'), e=new Date(ev+'T00:00:00'); if(isNaN(s.getTime())||isNaN(e.getTime())){resultOutput.textContent='Please enter valid dates';return;} resultOutput.textContent='Weeks between dates = '+(Math.abs(e-s)/(1000*60*60*24*7)).toFixed(2); }
  },
  'weighted-average-calculator.html': {
    calculate: function () { var rv=feetInput.value, rw=inchesInput?inchesInput.value:''; if(!rv||!rw){resultOutput.textContent='Please enter values and matching weights';return;} var v=rv.split(',').map(function(x){return parseFloat(x.trim());}).filter(function(x){return !isNaN(x);}); var w=rw.split(',').map(function(x){return parseFloat(x.trim());}).filter(function(x){return !isNaN(x);}); if(!v.length||v.length!==w.length){resultOutput.textContent='Values and weights must contain the same number of valid entries';return;} var t=0, tw=0; for(var i=0;i<v.length;i++){ if(w[i]<=0){resultOutput.textContent='Weights must be positive numbers';return;} t+=v[i]*w[i]; tw+=w[i]; } resultOutput.textContent='Weighted average = '+(t/tw).toFixed(2); }
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
    const runActiveCalculator = function () { activeCalculator.calculate(); if (resultOutput) resultOutput.textContent = localizeDynamicText(resultOutput.textContent); };
    calculateBtn.addEventListener('click', runActiveCalculator);
    resetBtn.addEventListener('click', resetCalculator);

    feetInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') runActiveCalculator();
    });

    if (inchesInput) {
      inchesInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') runActiveCalculator();
      });
    }

    if (decimalsSelect) {
      decimalsSelect.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') runActiveCalculator();
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

// =========================
// Consent Banner
// =========================
const consentBanner = document.getElementById('consentBanner');
const consentAccept = document.getElementById('consentAccept');
const consentReject = document.getElementById('consentReject');

function setConsentChoice(choice) {
  try { localStorage.setItem('cw-consent-choice', choice); } catch (e) {}
  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      ad_storage: choice === 'accepted' ? 'granted' : 'denied',
      ad_user_data: choice === 'accepted' ? 'granted' : 'denied',
      ad_personalization: choice === 'accepted' ? 'granted' : 'denied',
      analytics_storage: 'denied'
    });
  }
  window.adsbygoogle = window.adsbygoogle || [];
  if (choice === 'accepted') {
    window.adsbygoogle.pauseAdRequests = 0;
    window.adsbygoogle.requestNonPersonalizedAds = 0;
  } else {
    window.adsbygoogle.pauseAdRequests = 1;
    window.adsbygoogle.requestNonPersonalizedAds = 1;
  }
}

if (consentBanner && consentAccept && consentReject) {
  let storedConsent = null;
  try { storedConsent = localStorage.getItem('cw-consent-choice'); } catch (e) {}

  if (!storedConsent) {
    consentBanner.hidden = false;
  }

  consentAccept.addEventListener('click', function () {
    setConsentChoice('accepted');
    consentBanner.hidden = true;
    window.location.reload();
  });

  consentReject.addEventListener('click', function () {
    setConsentChoice('rejected');
    consentBanner.hidden = true;
  });
}
