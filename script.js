
/* ===== CalculatorWorks Platform Consistency + Propagation ===== */

(function(){
'use strict';

function currentPage(){
  return (location.pathname.split('/').filter(Boolean).pop()||'index').replace(/\.html$/,'');
}

function buildConsistency(){
  if(document.querySelector('.cw-consistency-block')) return;

  const p=currentPage();
  let html='';

  if(/percentage|discount|margin|markup/.test(p)){
    html='<section class="cw-consistency-block"><h2>Related percentage calculators</h2><div class="cw-consistency-grid"><div class="cw-consistency-card"><strong>Discount calculations</strong><span>Estimate sale price and savings.</span></div><div class="cw-consistency-card"><strong>Percentage change</strong><span>Compare increases and decreases.</span></div><div class="cw-consistency-card"><strong>Business percentages</strong><span>Compare margin and markup calculations.</span></div></div></section>';
  }

  if(/feet|metres|meters|inch|cm|kg|lb|mile|km|convert/.test(p)){
    html='<section class="cw-consistency-block"><h2>Popular conversion tools</h2><div class="cw-consistency-grid"><div class="cw-consistency-card"><strong>Distance conversion</strong><span>Convert miles, kilometres and metres.</span></div><div class="cw-consistency-card"><strong>Weight conversion</strong><span>Convert kilograms and pounds.</span></div><div class="cw-consistency-card"><strong>Temperature conversion</strong><span>Convert Celsius and Fahrenheit.</span></div></div></section>';
  }

  if(/bmi|calorie|health|weight/.test(p)){
    html='<section class="cw-consistency-block"><h2>Health and fitness tools</h2><div class="cw-consistency-grid"><div class="cw-consistency-card"><strong>Body measurements</strong><span>Compare BMI, body fat and ideal weight estimates.</span></div><div class="cw-consistency-card"><strong>Nutrition planning</strong><span>Estimate calorie and protein targets.</span></div><div class="cw-consistency-card"><strong>Activity planning</strong><span>Compare TDEE and related estimates.</span></div></div></section>';
  }

  if(/business|vat|roi|profit/.test(p)){
    html='<section class="cw-consistency-block"><h2>Business planning tools</h2><div class="cw-consistency-grid"><div class="cw-consistency-card"><strong>Profit analysis</strong><span>Compare margin, markup and ROI calculations.</span></div><div class="cw-consistency-card"><strong>Tax tools</strong><span>Estimate VAT and sales tax scenarios.</span></div><div class="cw-consistency-card"><strong>Business forecasting</strong><span>Review contribution and break-even estimates.</span></div></div></section>';
  }

  if(!html) return;

  const wrap=document.createElement('div');
  wrap.innerHTML=html;

  const target=document.querySelector('.calculator-card') || document.querySelector('main');
  if(target){
    target.insertAdjacentElement('afterend',wrap.firstElementChild);
  }
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',buildConsistency);
}else{
  buildConsistency();
}

})();
