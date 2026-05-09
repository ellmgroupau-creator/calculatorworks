
const $ = (id) => document.getElementById(id);
const feetInput = $('feet');
const inchesInput = $('inches');
const decimalsSelect = $('decimals');
const resultOutput = $('result');
const calculateBtn = $('calculateBtn');
const resetBtn = $('resetBtn');
const pathParts = window.location.pathname.split('/');
const lastPart = pathParts[pathParts.length - 1];
const currentPage = lastPart && lastPart.includes('.html') ? lastPart : 'index.html';
function n(id){const el=$(id); if(!el) return NaN; return parseFloat(el.value);} function d(){return decimalsSelect?parseInt(decimalsSelect.value,10):2;} function money(v){return '$'+Number(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});} function pct(v){return Number(v).toFixed(d())+'%';} function out(s){if(resultOutput) resultOutput.textContent=s;} function monthsToText(m){if(!isFinite(m)||m<0) return 'Not payable with these inputs'; const y=Math.floor(m/12), mo=Math.ceil(m%12); return (y?y+' years ':'')+(mo?mo+' months':'');}
const calculatorConfigs={
'feet-to-metres.html':()=>{const dec=d(), f=n('feet'), i=parseFloat((inchesInput&&inchesInput.value)||'0'); if(isNaN(f)&&isNaN(i)) return out('Please enter feet and/or inches'); const sf=isNaN(f)?0:f, si=isNaN(i)?0:i; const total=sf+(si/12); out(sf+"'"+si+'" = '+(total*0.3048).toFixed(dec)+' m');},
'metres-to-feet.html':()=>{const dec=d(), m=n('feet'); if(isNaN(m)) return out('Please enter a valid number'); const total=m*3.28084; let f=Math.floor(total), inch=(total-f)*12; inch=dec===0?Math.round(inch):parseFloat(inch.toFixed(dec)); if(inch>=12){f+=1;inch=0;} out(m+' m = '+f+"'"+inch+'"');},
'cm-to-inches.html':()=>{const v=n('feet'); if(isNaN(v)) return out('Please enter a valid number'); out(v+' cm = '+(v/2.54).toFixed(d())+' inches');},
'inches-to-cm.html':()=>{const v=n('feet'); if(isNaN(v)) return out('Please enter a valid number'); out(v+' inches = '+(v*2.54).toFixed(d())+' cm');},
'credit-card-payoff.html':()=>{let bal=n('balance'), rate=n('rate')/100/12, pay=n('payment'); if([bal,rate,pay].some(isNaN)||pay<=bal*rate) return out('Enter a payment greater than monthly interest.'); let m=0, interest=0; while(bal>0&&m<1200){let int=bal*rate; interest+=int; bal=bal+int-pay; m++;} out('Estimated payoff: '+monthsToText(m)+' • Estimated interest: '+money(interest));},
'debt-payoff.html':()=>calculatorConfigs['credit-card-payoff.html'](),
'debt-to-income.html':()=>{const debt=n('debt'), income=n('income'); if(isNaN(debt)||isNaN(income)||income<=0)return out('Enter valid debt and income.'); out('Debt-to-income ratio: '+pct(debt/income*100));},
'net-worth.html':()=>{const a=n('assets'), l=n('liabilities'); if(isNaN(a)||isNaN(l))return out('Enter assets and liabilities.'); out('Estimated net worth: '+money(a-l));},
'refinance-savings.html':()=>{const c=n('current'), ne=n('new'), costs=n('costs')||0; if(isNaN(c)||isNaN(ne))return out('Enter current and new payments.'); const save=c-ne; out('Monthly savings: '+money(save)+' • Break-even: '+(save>0?monthsToText(costs/save):'No monthly saving'));},
'down-payment.html':()=>{const p=n('price'), per=n('percent'); if(isNaN(p)||isNaN(per))return out('Enter price and percentage.'); const dp=p*per/100; out('Down payment: '+money(dp)+' • Remaining loan: '+money(p-dp));},
'emergency-fund.html':()=>{const e=n('expenses'), m=n('months'); if(isNaN(e)||isNaN(m))return out('Enter expenses and months.'); out('Emergency fund target: '+money(e*m));},
'savings-goal.html':()=>{const t=n('target'), c=n('current')||0, m=n('months'); if(isNaN(t)||isNaN(m)||m<=0)return out('Enter target and months.'); out('Monthly saving needed: '+money((t-c)/m));},
'compound-interest.html':()=>{let p=n('principal')||0, c=n('contribution')||0, r=n('rate')/100/12, years=n('years'); if(isNaN(r)||isNaN(years))return out('Enter rate and years.'); let v=p; for(let i=0;i<years*12;i++){v=v*(1+r)+c;} out('Estimated future value: '+money(v));},
'simple-interest.html':()=>{const p=n('principal'), r=n('rate')/100, y=n('years'); if([p,r,y].some(isNaN))return out('Enter all values.'); out('Simple interest: '+money(p*r*y)+' • Total: '+money(p+(p*r*y)));},
'hourly-to-salary.html':()=>{const r=n('rate'), h=n('hours'); if(isNaN(r)||isNaN(h))return out('Enter rate and hours.'); const w=r*h; out('Weekly: '+money(w)+' • Annual: '+money(w*52));},
'pay-raise.html':()=>{const c=n('current'), r=n('raise'); if(isNaN(c)||isNaN(r))return out('Enter current pay and raise.'); out('New pay: '+money(c*(1+r/100))+' • Increase: '+money(c*r/100));},
'overtime.html':()=>{const r=n('rate'), reg=n('regular')||0, ot=n('overtime')||0, mult=n('multiplier')||1.5; if(isNaN(r))return out('Enter hourly rate.'); out('Estimated pay: '+money((r*reg)+(r*mult*ot)));},
'paycheck.html':()=>{const g=n('gross'), de=n('deductions')||0; if(isNaN(g))return out('Enter gross pay.'); out('Estimated take-home pay: '+money(g*(1-de/100)));},
'sales-tax.html':()=>{const p=n('price'), t=n('tax'); if(isNaN(p)||isNaN(t))return out('Enter price and tax rate.'); out('Tax: '+money(p*t/100)+' • Total: '+money(p*(1+t/100)));},
'credit-utilization.html':()=>{const b=n('balance'), l=n('limit'); if(isNaN(b)||isNaN(l)||l<=0)return out('Enter balance and limit.'); out('Credit utilization: '+pct(b/l*100));},
'current-ratio.html':()=>{const a=n('assets'), l=n('liabilities'); if(isNaN(a)||isNaN(l)||l<=0)return out('Enter assets and liabilities.'); out('Current ratio: '+(a/l).toFixed(d())+':1');},
'quick-ratio.html':()=>{const c=n('cash')||0, r=n('receivables')||0, l=n('liabilities'); if(isNaN(l)||l<=0)return out('Enter liabilities.'); out('Quick ratio: '+((c+r)/l).toFixed(d())+':1');},
'contribution-margin.html':()=>{const p=n('price'), v=n('variable'); if(isNaN(p)||isNaN(v)||p<=0)return out('Enter price and variable cost.'); const cm=p-v; out('Contribution margin: '+money(cm)+' • Margin: '+pct(cm/p*100));},
'depreciation.html':()=>{const c=n('cost'), s=n('salvage')||0, l=n('life'); if(isNaN(c)||isNaN(l)||l<=0)return out('Enter cost and useful life.'); out('Annual depreciation: '+money((c-s)/l));},
'percentage-increase.html':()=>{const o=n('old'), ne=n('new'); if(isNaN(o)||isNaN(ne)||o===0)return out('Enter valid values.'); out('Percentage increase: '+pct((ne-o)/o*100));},
'percentage-decrease.html':()=>{const o=n('old'), ne=n('new'); if(isNaN(o)||isNaN(ne)||o===0)return out('Enter valid values.'); out('Percentage decrease: '+pct((o-ne)/o*100));},
'discount.html':()=>{const p=n('price'), dis=n('discount'); if(isNaN(p)||isNaN(dis))return out('Enter price and discount.'); out('Sale price: '+money(p*(1-dis/100))+' • You save: '+money(p*dis/100));},
'bmi.html':()=>{const w=n('weight'), h=n('height')/100; if(isNaN(w)||isNaN(h)||h<=0)return out('Enter weight and height.'); out('BMI: '+(w/(h*h)).toFixed(d()));},
'age.html':()=>{const v=$('date1').value; if(!v)return out('Choose a date.'); const b=new Date(v), now=new Date(); let age=now.getFullYear()-b.getFullYear(); const m=now.getMonth()-b.getMonth(); if(m<0||(m===0&&now.getDate()<b.getDate())) age--; out('Age: '+age+' years');},
'date-difference.html':()=>{const a=new Date($('date1').value), b=new Date($('date2').value); if(isNaN(a)||isNaN(b))return out('Choose both dates.'); out('Difference: '+Math.abs(Math.round((b-a)/86400000))+' days');},
'paint.html':()=>{const a=n('area'), cov=n('coverage'), coats=n('coats')||1; if(isNaN(a)||isNaN(cov)||cov<=0)return out('Enter area and coverage.'); out('Paint needed: '+(a*coats/cov).toFixed(d())+' litres');},
'flooring.html':()=>{const a=n('area'), w=n('waste')||10; if(isNaN(a))return out('Enter floor area.'); out('Flooring needed: '+(a*(1+w/100)).toFixed(d())+' m²');},
'weighted-average.html':()=>{const vals=($('values').value||'').split(',').map(Number), ws=($('weights').value||'').split(',').map(Number); if(vals.length!==ws.length||vals.some(isNaN)||ws.some(isNaN))return out('Enter matching comma-separated values and weights.'); const sw=ws.reduce((a,b)=>a+b,0), s=vals.reduce((a,v,i)=>a+v*ws[i],0); out('Weighted average: '+(s/sw).toFixed(4));}
};
function resetCalculator(){document.querySelectorAll('input').forEach(i=>i.value=''); if(decimalsSelect) decimalsSelect.value='2'; out('Enter values to begin'); if(feetInput) feetInput.focus();}
if(calculateBtn&&resetBtn){const fn=calculatorConfigs[currentPage]; if(fn){calculateBtn.addEventListener('click',fn); resetBtn.addEventListener('click',resetCalculator); document.querySelectorAll('input').forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter')fn();}));}}
const mainCalcScreen=$('mainCalcScreen'); const mainCalcKeys=document.querySelectorAll('.calc-key'); if(mainCalcScreen&&mainCalcKeys.length){let expr=''; const display=()=>mainCalcScreen.textContent=(expr||'0').replace(/\*/g,'×').replace(/\//g,'÷').replace(/-/g,'−'); mainCalcKeys.forEach(btn=>btn.addEventListener('click',()=>{const v=btn.dataset.value,a=btn.dataset.action; if(a==='clear'){expr='';display();return;} if(a==='backspace'){expr=expr.slice(0,-1);display();return;} if(a==='equals'){try{const r=Function('"use strict";return ('+expr.replace(/%/g,'/100')+')')(); expr=isFinite(r)?Number(r.toFixed(10)).toString():''; mainCalcScreen.textContent=expr||'Error';}catch{expr='';mainCalcScreen.textContent='Error';} return;} if(v){expr+=v;display();}}));}
