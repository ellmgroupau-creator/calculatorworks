/* CalculatorWorks production script
   Stable calculator logic, global calculator search, and button/form safety only.
   Deliberately excludes prior experimental dynamic content expansion layers. */

const $ = (id) => document.getElementById(id);
const feetInput = $('feet');
const inchesInput = $('inches');
const decimalsSelect = $('decimals');
const resultOutput = $('result');
const calculateBtn = $('calculateBtn');
const resetBtn = $('resetBtn');
const calculatorCard = document.querySelector('.calculator-card');
const calculatorKey = calculatorCard ? (calculatorCard.dataset.calculator || '') : '';
const pathParts = window.location.pathname.split('/').filter(Boolean);
const lastPart = pathParts[pathParts.length - 1] || '';
const currentPage = lastPart ? (lastPart.includes('.html') ? lastPart : lastPart + '.html') : 'index.html';
function n(id){const el=$(id); if(!el) return NaN; return parseFloat(el.value);} function d(){return decimalsSelect?parseInt(decimalsSelect.value,10):2;} function money(v){return '$'+Number(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});} function pct(v){return Number(v).toFixed(d())+'%';} function out(s){if(resultOutput) resultOutput.textContent=s;} function monthsToText(m){if(!isFinite(m)||m<0) return 'Not payable with these inputs'; if(m===0) return '0 months'; const y=Math.floor(m/12), mo=Math.ceil(m%12); return ((y?y+' years ':'')+(mo?mo+' months':'')) || '0 months';}
const calculatorConfigs={
'feet-to-metres.html':()=>{const dec=d(), f=n('feet'), i=parseFloat((inchesInput&&inchesInput.value)||'0'); if(isNaN(f)&&isNaN(i)) return out('Please enter feet and/or inches'); const sf=isNaN(f)?0:f, si=isNaN(i)?0:i; const total=sf+(si/12); out(sf+"'"+si+'" = '+(total*0.3048).toFixed(dec)+' m');},
'metres-to-feet.html':()=>{const dec=d(), m=n('feet'); if(isNaN(m)) return out('Please enter a valid number'); const total=m*3.28084; let f=Math.floor(total), inch=(total-f)*12; inch=dec===0?Math.round(inch):parseFloat(inch.toFixed(dec)); if(inch>=12){f+=1;inch=0;} out(m+' m = '+f+"'"+inch+'"');},
'cm-to-inches.html':()=>{const v=n('feet'); if(isNaN(v)) return out('Please enter a valid number'); out(v+' cm = '+(v/2.54).toFixed(d())+' inches');},
'inches-to-cm.html':()=>{const v=n('feet'); if(isNaN(v)) return out('Please enter a valid number'); out(v+' inches = '+(v*2.54).toFixed(d())+' cm');},

'mortgage-calculator.html':()=>{const loan=n('loan'), rate=n('rate')/100/12, years=n('years'); if(isNaN(loan)||isNaN(rate)||isNaN(years)||loan<=0||years<=0)return out('Enter loan amount, rate, and term.'); const months=years*12; const payment=rate===0?loan/months:loan*rate*Math.pow(1+rate,months)/(Math.pow(1+rate,months)-1); out('Estimated monthly payment: '+money(payment)+' • Total interest: '+money(payment*months-loan));},
'loan-payment.html':()=>{const loan=n('loan'), rate=n('rate')/100/12, years=n('years'); if(isNaN(loan)||isNaN(rate)||isNaN(years)||loan<=0||years<=0)return out('Enter loan amount, rate, and term.'); const months=years*12; const payment=rate===0?loan/months:loan*rate*Math.pow(1+rate,months)/(Math.pow(1+rate,months)-1); out('Monthly payment: '+money(payment)+' • Total repayment: '+money(payment*months)+' • Interest: '+money(payment*months-loan));},
'auto-loan.html':()=>{const price=n('price'), deposit=n('deposit')||0, rate=n('rate')/100/12, years=n('years'); const loan=price-deposit; if(isNaN(price)||isNaN(rate)||isNaN(years)||loan<=0||years<=0)return out('Enter vehicle price, deposit, rate, and term.'); const months=years*12; const payment=rate===0?loan/months:loan*rate*Math.pow(1+rate,months)/(Math.pow(1+rate,months)-1); out('Amount financed: '+money(loan)+' • Monthly payment: '+money(payment)+' • Interest: '+money(payment*months-loan));},
'rent-vs-buy.html':()=>{const rent=n('rent'), home=n('homepayment'), owner=n('ownerextra')||0, renter=n('renterextra')||0; if(isNaN(rent)||isNaN(home))return out('Enter rent and mortgage payment.'); const rentTotal=rent+renter, buyTotal=home+owner, diff=buyTotal-rentTotal; out('Rent estimate: '+money(rentTotal)+'/mo • Buy estimate: '+money(buyTotal)+'/mo • '+(diff>0?'Buying costs '+money(diff)+' more per month':'Buying costs '+money(Math.abs(diff))+' less per month'));},
'credit-card-payoff.html':()=>{let bal=n('balance'), rate=n('rate')/100/12, pay=n('payment'); if([bal,rate,pay].some(isNaN)||pay<=bal*rate) return out('Enter a payment greater than monthly interest.'); let m=0, interest=0; while(bal>0&&m<1200){let int=bal*rate; interest+=int; bal=bal+int-pay; m++;} out('Estimated payoff: '+monthsToText(m)+' • Estimated interest: '+money(interest));},
'debt-payoff.html':()=>calculatorConfigs['credit-card-payoff.html'](),
'debt-to-income.html':()=>{const debt=n('debt'), income=n('income'); if(isNaN(debt)||isNaN(income)||income<=0)return out('Enter valid debt and income.'); out('Debt-to-income ratio: '+pct(debt/income*100));},
'net-worth.html':()=>{const a=n('assets'), l=n('liabilities'); if(isNaN(a)||isNaN(l))return out('Enter assets and liabilities.'); out('Estimated net worth: '+money(a-l));},
'refinance-savings.html':()=>{const c=n('current'), ne=n('new'), costs=n('costs')||0; if(isNaN(c)||isNaN(ne))return out('Enter current and new payments.'); const save=c-ne; out('Monthly savings: '+money(save)+' • Break-even: '+(save>0?monthsToText(costs/save):'No monthly saving'));},
'down-payment.html':()=>{const p=n('price'), entry=n('percent'); if(isNaN(p)||isNaN(entry)||p<=0||entry<0)return out('Enter a valid purchase price and down payment.'); const isAmount=entry>100; const dp=isAmount?entry:p*entry/100; if(dp>p)return out('Down payment cannot be greater than the purchase price.'); const per=dp/p*100; out('Down payment: '+money(dp)+' ('+per.toFixed(d())+'%) • Remaining loan: '+money(p-dp));},
'emergency-fund.html':()=>{const e=n('expenses'), m=n('months'); if(isNaN(e)||isNaN(m))return out('Enter expenses and months.'); out('Emergency fund target: '+money(e*m));},
'savings-goal.html':()=>{const t=n('target'), c=n('current')||0, m=n('months'); if(isNaN(t)||isNaN(m)||m<=0)return out('Enter target and months.'); const remaining=t-c; if(remaining<=0)return out('Goal already reached.'); out('Monthly saving needed: '+money(remaining/m));},
'compound-interest.html':()=>{let p=n('principal')||0, c=n('contribution')||0, r=n('rate')/100/12, years=n('years'); if(isNaN(r)||isNaN(years))return out('Enter rate and years.'); let v=p; for(let i=0;i<years*12;i++){v=v*(1+r)+c;} out('Estimated future value: '+money(v));},
'simple-interest.html':()=>{const p=n('principal'), r=n('rate')/100, y=n('years'); if([p,r,y].some(isNaN))return out('Enter all values.'); out('Simple interest: '+money(p*r*y)+' • Total: '+money(p+(p*r*y)));},
'hourly-to-salary.html':()=>{const r=n('rate'), h=n('hours'); if(isNaN(r)||isNaN(h))return out('Enter rate and hours.'); const w=r*h; out('Weekly: '+money(w)+' • Annual: '+money(w*52));},
'pay-raise.html':()=>{const c=n('current'), r=n('raise'); if(isNaN(c)||isNaN(r))return out('Enter current pay and raise.'); out('New pay: '+money(c*(1+r/100))+' • Increase: '+money(c*r/100));},
'overtime.html':()=>{const r=n('rate'), reg=n('regular')||0, ot=n('overtime')||0, mult=n('multiplier')||1.5; if(isNaN(r))return out('Enter hourly rate.'); out('Estimated pay: '+money((r*reg)+(r*mult*ot)));},
'paycheck.html':()=>{const g=n('gross'), de=n('deductions')||0; if(isNaN(g))return out('Enter gross pay.'); out('Estimated take-home pay: '+money(g*(1-de/100)));},
'sales-tax.html':()=>{const p=n('price'), t=n('tax'); if(isNaN(p)||isNaN(t))return out('Enter price and tax rate.'); out('Tax: '+money(p*t/100)+' • Total: '+money(p*(1+t/100)));},
'credit-utilization.html':()=>{const b=n('balance'), l=n('limit'); if(isNaN(b)||isNaN(l)||l<=0)return out('Enter balance and limit.'); out('Credit utilization: '+pct(b/l*100));},
'credit-utilization-calculator.html':()=>calculatorConfigs['credit-utilization.html'](),
'current-ratio.html':()=>{const a=n('assets'), l=n('liabilities'); if(isNaN(a)||isNaN(l)||l<=0)return out('Enter assets and liabilities.'); out('Current ratio: '+(a/l).toFixed(d())+':1');},
'quick-ratio.html':()=>{const c=n('cash')||0, r=n('receivables')||0, l=n('liabilities'); if(isNaN(l)||l<=0)return out('Enter liabilities.'); out('Quick ratio: '+((c+r)/l).toFixed(d())+':1');},
'contribution-margin.html':()=>{const p=n('price'), v=n('variable'); if(isNaN(p)||isNaN(v)||p<=0)return out('Enter price and variable cost.'); const cm=p-v; out('Contribution margin: '+money(cm)+' • Margin: '+pct(cm/p*100));},
'depreciation.html':()=>{const c=n('cost'), s=n('salvage')||0, l=n('life'); if(isNaN(c)||isNaN(l)||l<=0)return out('Enter cost and useful life.'); out('Annual depreciation: '+money((c-s)/l));},
'percentage-increase.html':()=>{const o=n('old'), ne=n('new'); if(isNaN(o)||isNaN(ne)||o===0)return out('Enter valid values.'); out('Percentage increase: '+pct((ne-o)/o*100));},
'percentage-decrease.html':()=>{const o=n('old'), ne=n('new'); if(isNaN(o)||isNaN(ne)||o===0)return out('Enter valid values.'); out('Percentage decrease: '+pct((o-ne)/o*100));},
'discount.html':()=>{const p=n('price'), dis=n('discount'); if(isNaN(p)||isNaN(dis))return out('Enter price and discount.'); out('Sale price: '+money(p*(1-dis/100))+' • You save: '+money(p*dis/100));},
'bmi.html':()=>{const w=n('weight'), h=n('height')/100; if(isNaN(w)||isNaN(h)||h<=0)return out('Enter weight and height.'); out('BMI: '+(w/(h*h)).toFixed(d()));},
'bmi-calculator.html':()=>calculatorConfigs['bmi.html'](),
'age.html':()=>{const v=$('date1').value; if(!v)return out('Choose a date.'); const b=new Date(v), now=new Date(); if(b>now)return out('Date of birth cannot be in the future.'); let age=now.getFullYear()-b.getFullYear(); const m=now.getMonth()-b.getMonth(); if(m<0||(m===0&&now.getDate()<b.getDate())) age--; out('Age: '+age+' years');},
'date-difference.html':()=>{const v1=$('date1').value, v2=$('date2').value; if(!v1||!v2)return out('Choose both dates.'); const a=new Date(v1), b=new Date(v2); if(isNaN(a)||isNaN(b))return out('Choose both dates.'); out('Difference: '+Math.abs(Math.round((b-a)/86400000))+' days');},
'paint.html':()=>{const a=n('area'), cov=n('coverage'), coats=n('coats')||1; if(isNaN(a)||isNaN(cov)||cov<=0)return out('Enter area and coverage.'); out('Paint needed: '+(a*coats/cov).toFixed(d())+' litres');},
'flooring.html':()=>{const a=n('area'), w=n('waste')||10; if(isNaN(a))return out('Enter floor area.'); out('Flooring needed: '+(a*(1+w/100)).toFixed(d())+' m²');},

'mortgage-amortization.html':()=>{const loan=n('loan'), rate=n('rate')/100/12, years=n('years'); if(isNaN(loan)||isNaN(rate)||isNaN(years)||loan<=0||years<=0)return out('Enter loan amount, rate, and term.'); const months=years*12; const payment=rate===0?loan/months:loan*rate*Math.pow(1+rate,months)/(Math.pow(1+rate,months)-1); out('Monthly payment: '+money(payment)+' • Total repayment: '+money(payment*months)+' • Total interest: '+money(payment*months-loan));}
,'extra-payment-mortgage.html':()=>{const loan=n('loan'), rate=n('rate')/100/12, years=n('years'), extra=n('extra')||0; if(isNaN(loan)||isNaN(rate)||isNaN(years)||loan<=0||years<=0)return out('Enter loan amount, rate, term, and optional extra payment.'); const months=years*12; const base=rate===0?loan/months:loan*rate*Math.pow(1+rate,months)/(Math.pow(1+rate,months)-1); let bal=loan,m=0,int=0,pay=base+extra; while(bal>0&&m<months){let i=bal*rate; int+=i; bal=bal+i-pay; m++;} const baseInt=base*months-loan; out('New payoff: '+monthsToText(m)+' • Interest saved: '+money(Math.max(0,baseInt-int)));}
,'offset-account-savings.html':()=>{const loan=n('loan'), offset=n('offset')||0, rate=n('rate')/100, years=n('years'); if(isNaN(loan)||isNaN(rate)||isNaN(years)||loan<=0||years<=0)return out('Enter loan amount, offset balance, rate, and years.'); const effective=Math.max(0,Math.min(offset,loan)); out('Estimated simple interest saved: '+money(effective*rate*years));}
,'debt-snowball.html':()=>{let bal=n('balance'), rate=n('rate')/100/12, pay=n('payment'); if([bal,rate,pay].some(isNaN)||bal<=0||pay<=bal*rate)return out('Enter a payment greater than monthly interest.'); let m=0,int=0; while(bal>0&&m<1200){let i=bal*rate; int+=i; bal=bal+i-pay; m++;} out('Estimated payoff: '+monthsToText(m)+' • Interest: '+money(int));}
,'debt-avalanche.html':()=>calculatorConfigs['debt-snowball.html']()
,'investment-return.html':()=>{let p=n('principal')||0,c=n('contribution')||0,r=n('rate')/100/12,years=n('years'); if(isNaN(r)||isNaN(years)||years<=0)return out('Enter rate and years.'); let v=p; for(let i=0;i<years*12;i++){v=v*(1+r)+c;} out('Estimated future value: '+money(v)+' • Contributions: '+money(p+c*years*12));}
,'retirement-savings.html':()=>calculatorConfigs['investment-return.html']()
,'fire.html':()=>{const e=n('expenses'), swr=n('rate'), cur=n('current')||0; if(isNaN(e)||isNaN(swr)||e<=0||swr<=0)return out('Enter annual expenses and withdrawal rate.'); const target=e/(swr/100); out('Estimated FIRE target: '+money(target)+' • Remaining: '+money(Math.max(0,target-cur)));}
,
'weighted-average.html':()=>{const vals=($('values').value||'').split(',').map(Number), ws=($('weights').value||'').split(',').map(Number); if(vals.length!==ws.length||vals.some(isNaN)||ws.some(isNaN))return out('Enter matching comma-separated values and weights.'); const sw=ws.reduce((a,b)=>a+b,0); if(sw===0)return out('Weights must add up to more than zero.'); const s=vals.reduce((a,v,i)=>a+v*ws[i],0); out('Weighted average: '+(s/sw).toFixed(4));}
};

/* Stabilisation configs for newer calculator pages that use the shared feet/inches/decimals IDs. */
function textVal(id){const el=$(id); return el ? String(el.value || '').trim() : '';}
function numberList(id){const raw=textVal(id); return raw.split(/[,\s]+/).map(Number).filter(v=>!isNaN(v));}
function dt(id){const v=textVal(id); return v ? new Date(v) : null;}
function daysBetween(a,b){return Math.round((b-a)/86400000);}
function formatNumber(v){return Number(v).toFixed(d());}
function simplePayoff(balance, annualRate, payment){const r=annualRate/100/12; if([balance,annualRate,payment].some(isNaN)||balance<=0||payment<=balance*r)return null; let bal=balance,m=0,int=0; while(bal>0&&m<1200){let i=bal*r; int+=i; bal=bal+i-payment; m++;} return {months:m,interest:int};}
function loanPayment(loan, annualRate, years){const r=annualRate/100/12, months=years*12; return r===0?loan/months:loan*r*Math.pow(1+r,months)/(Math.pow(1+r,months)-1);}
Object.assign(calculatorConfigs,{
'age-calculator.html':()=>{const birth=dt('feet'), asof=dt('inches')||new Date(); if(!birth||isNaN(birth))return out('Choose a date of birth.'); if(birth>asof)return out('Date of birth cannot be after the calculation date.'); let age=asof.getFullYear()-birth.getFullYear(); const m=asof.getMonth()-birth.getMonth(); if(m<0||(m===0&&asof.getDate()<birth.getDate()))age--; out('Age: '+age+' years');},
'age-difference-calculator.html':()=>{const a=dt('feet'), b=dt('inches'); if(!a||!b||isNaN(a)||isNaN(b))return out('Choose both dates.'); out('Age difference: '+Math.abs(daysBetween(a,b))+' days');},
'average-calculator.html':()=>{const v=numberList('feet'); if(!v.length)return out('Enter numbers separated by commas.'); out('Average: '+formatNumber(v.reduce((a,b)=>a+b,0)/v.length));},
'body-surface-area-calculator.html':()=>{const w=n('feet'), h=n('inches'); if(isNaN(w)||isNaN(h)||w<=0||h<=0)return out('Enter weight and height.'); out('Estimated body surface area: '+Math.sqrt((h*w)/3600).toFixed(2)+' m²');},
'break-even-calculator.html':()=>{const fixed=n('feet'), price=n('inches'), variable=d(); if(isNaN(fixed)||isNaN(price)||isNaN(variable)||price<=variable)return out('Enter fixed cost, price, and a variable cost below price.'); out('Break-even units: '+Math.ceil(fixed/(price-variable)).toLocaleString());},
'business-days-calculator.html':()=>{const a=dt('feet'), b=dt('inches'); if(!a||!b||isNaN(a)||isNaN(b))return out('Choose both dates.'); let start=new Date(Math.min(a,b)), end=new Date(Math.max(a,b)), count=0; for(let x=new Date(start);x<=end;x.setDate(x.getDate()+1)){const day=x.getDay(); if(day!==0&&day!==6)count++;} out('Business days: '+count);},
'business-profit-planner-calculator.html':()=>{const units=n('feet'), profit=n('inches'); if(isNaN(units)||isNaN(profit))return out('Enter units and profit per unit.'); out('Estimated profit: '+money(units*profit));},
'celsius-to-fahrenheit.html':()=>{const v=n('feet'); if(isNaN(v))return out('Please enter a valid number'); out(v+' °C = '+((v*9/5)+32).toFixed(d())+' °F');},
'fahrenheit-to-celsius.html':()=>{const v=n('feet'); if(isNaN(v))return out('Please enter a valid number'); out(v+' °F = '+((v-32)*5/9).toFixed(d())+' °C');},
'commission-calculator.html':()=>{const sales=n('feet'), rate=n('inches'), base=d(); if(isNaN(sales)||isNaN(rate))return out('Enter sales and commission rate.'); out('Commission: '+money(sales*rate/100)+' • Total pay: '+money((sales*rate/100)+(isNaN(base)?0:base)));},
'compound-interest-calculator.html':()=>{const p=n('feet'), r=n('inches')/100/12, years=d(); if(isNaN(p)||isNaN(r)||isNaN(years))return out('Enter principal, rate, and years.'); const months=years*12; out('Estimated future value: '+money(p*Math.pow(1+r,months)));},
'concrete-calculator.html':()=>{const l=n('feet'), w=n('inches'), depth=d(); if(isNaN(l)||isNaN(w)||isNaN(depth))return out('Enter length, width, and depth.'); out('Concrete volume: '+(l*w*depth).toFixed(2)+' m³');},
'contribution-margin-calculator.html':()=>{const p=n('feet'), v=n('inches'); if(isNaN(p)||isNaN(v)||p<=0)return out('Enter selling price and variable cost.'); const cm=p-v; out('Contribution margin: '+money(cm)+' • Margin: '+(cm/p*100).toFixed(2)+'%');},
'countdown-calculator.html':()=>{const target=dt('feet'); if(!target||isNaN(target))return out('Choose a future date.'); const days=Math.ceil((target-new Date())/86400000); out(days>=0?'Countdown: '+days+' days':'That date has passed.');},
'credit-card-payoff-calculator.html':()=>{const r=simplePayoff(n('feet'),n('inches'),d()); if(!r)return out('Enter a payment greater than monthly interest.'); out('Estimated payoff: '+monthsToText(r.months)+' • Estimated interest: '+money(r.interest));},
'cups-to-ml-calculator.html':()=>{const v=n('feet'); if(isNaN(v))return out('Enter cups.'); out(v+' cups = '+(v*236.588).toFixed(2)+' mL');},
'current-ratio-calculator.html':()=>{const a=n('feet'), l=n('inches'); if(isNaN(a)||isNaN(l)||l<=0)return out('Enter assets and liabilities.'); out('Current ratio: '+(a/l).toFixed(2)+':1');},
'date-add-calculator.html':()=>{const a=dt('feet'), days=n('inches'); if(!a||isNaN(a)||isNaN(days))return out('Choose a start date and days to add.'); a.setDate(a.getDate()+days); out('Result date: '+a.toLocaleDateString());},
'days-between-dates-calculator.html':()=>{const a=dt('feet'), b=dt('inches'); if(!a||!b||isNaN(a)||isNaN(b))return out('Choose both dates.'); out('Difference: '+Math.abs(daysBetween(a,b))+' days');},
'debt-avalanche-calculator.html':()=>calculatorConfigs['credit-card-payoff-calculator.html'](),
'debt-payoff-calculator.html':()=>calculatorConfigs['credit-card-payoff-calculator.html'](),
'debt-snowball-calculator.html':()=>calculatorConfigs['credit-card-payoff-calculator.html'](),
'debt-to-income-calculator.html':()=>{const debt=n('feet'), income=n('inches'); if(isNaN(debt)||isNaN(income)||income<=0)return out('Enter debt and income.'); out('Debt-to-income ratio: '+(debt/income*100).toFixed(2)+'%');},
'depreciation-calculator.html':()=>{const cost=n('feet'), salvage=n('inches'), life=d(); if(isNaN(cost)||isNaN(life)||life<=0)return out('Enter cost and useful life.'); out('Annual depreciation: '+money((cost-(isNaN(salvage)?0:salvage))/life));},
'discount-calculator.html':()=>{const price=n('feet'), disc=n('inches'); if(isNaN(price)||isNaN(disc))return out('Enter price and discount.'); out('Sale price: '+money(price*(1-disc/100))+' • You save: '+money(price*disc/100));},
'down-payment-calculator.html':()=>{const price=n('feet'), pct=n('inches'); if(isNaN(price)||isNaN(pct))return out('Enter price and down payment percentage.'); const dp=price*pct/100; out('Down payment: '+money(dp)+' • Remaining loan: '+money(price-dp));},
'due-date-calculator.html':()=>{const lmp=dt('feet'); if(!lmp||isNaN(lmp))return out('Choose the first day of the last period.'); lmp.setDate(lmp.getDate()+280); out('Estimated due date: '+lmp.toLocaleDateString());},
'emergency-fund-calculator.html':()=>{const e=n('feet'), m=n('inches'); if(isNaN(e)||isNaN(m))return out('Enter expenses and months.'); out('Emergency fund target: '+money(e*m));},
'extra-payment-mortgage-calculator.html':()=>{const loan=n('feet'), rate=n('inches'), extra=d(); if(isNaN(loan)||isNaN(rate))return out('Enter loan amount and rate.'); const years=30, base=loanPayment(loan,rate,years); let bal=loan,m=0,int=0,pay=base+(isNaN(extra)?0:extra); while(bal>0&&m<years*12){let i=bal*rate/100/12; int+=i; bal=bal+i-pay; m++;} out('New payoff: '+monthsToText(m)+' • Monthly payment used: '+money(pay));},
'fire-calculator.html':()=>{const expenses=n('feet'), swr=n('inches'), current=d(); if(isNaN(expenses)||isNaN(swr)||swr<=0)return out('Enter expenses and withdrawal rate.'); const target=expenses/(swr/100); out('Estimated FIRE target: '+money(target)+' • Remaining: '+money(Math.max(0,target-(isNaN(current)?0:current))));},
'flooring-calculator.html':()=>{const l=n('feet'), w=n('inches'), waste=d(); if(isNaN(l)||isNaN(w))return out('Enter room length and width.'); out('Flooring needed: '+(l*w*(1+(isNaN(waste)?10:waste)/100)).toFixed(2)+' m²');},
'gallons-to-litres-calculator.html':()=>{const v=n('feet'); if(isNaN(v))return out('Enter gallons.'); out(v+' US gal = '+(v*3.78541).toFixed(2)+' L');},
'gpa-calculator.html':()=>{const grades=numberList('feet'), credits=numberList('inches'); if(!grades.length)return out('Enter grades.'); if(credits.length===grades.length){const sw=credits.reduce((a,b)=>a+b,0); return out('GPA: '+(grades.reduce((a,g,i)=>a+g*credits[i],0)/sw).toFixed(d()));} out('GPA: '+(grades.reduce((a,b)=>a+b,0)/grades.length).toFixed(d()));},
'gravel-calculator.html':()=>{const area=n('feet'), depth=n('inches'); if(isNaN(area)||isNaN(depth))return out('Enter area and depth.'); out('Gravel volume: '+(area*(depth/100)).toFixed(2)+' m³');},
'hourly-to-salary-calculator.html':()=>{const rate=n('feet'), hours=n('inches'); if(isNaN(rate)||isNaN(hours))return out('Enter rate and hours.'); const weekly=rate*hours; out('Weekly: '+money(weekly)+' • Annual: '+money(weekly*52));},
'hours-between-dates-calculator.html':()=>{const a=dt('feet'), b=dt('inches'); if(!a||!b||isNaN(a)||isNaN(b))return out('Choose both dates and times.'); out('Difference: '+(Math.abs(b-a)/3600000).toFixed(2)+' hours');},
'ideal-weight-calculator.html':()=>{const h=n('feet'), adj=n('inches')||0; if(isNaN(h)||h<=0)return out('Enter height.'); const base=22*Math.pow(h/100,2); out('Estimated ideal weight: '+(base*(1+adj/100)).toFixed(1)+' kg');},
'inflation-calculator.html':()=>{const price=n('feet'), rate=n('inches'), years=d(); if(isNaN(price)||isNaN(rate)||isNaN(years))return out('Enter price, inflation rate, and years.'); out('Future price: '+money(price*Math.pow(1+rate/100,years)));},
'investment-return-calculator.html':()=>{const p=n('feet'), rate=n('inches'), years=d(); if(isNaN(p)||isNaN(rate)||isNaN(years))return out('Enter starting amount, return, and years.'); out('Estimated future value: '+money(p*Math.pow(1+rate/100,years)));},
'kg-to-lb.html':()=>{const v=n('feet'); if(isNaN(v))return out('Enter kilograms.'); out(v+' kg = '+(v*2.20462).toFixed(d())+' lb');},
'lb-to-kg.html':()=>{const v=n('feet'); if(isNaN(v))return out('Enter pounds.'); out(v+' lb = '+(v/2.20462).toFixed(d())+' kg');},
'km-to-miles.html':()=>{const v=n('feet'); if(isNaN(v))return out('Enter kilometres.'); out(v+' km = '+(v*0.621371).toFixed(d())+' miles');},
'miles-to-km.html':()=>{const v=n('feet'); if(isNaN(v))return out('Enter miles.'); out(v+' miles = '+(v*1.60934).toFixed(d())+' km');},
'kph-to-mph-calculator.html':()=>{const v=n('feet'); if(isNaN(v))return out('Enter speed.'); out(v+' km/h = '+(v*0.621371).toFixed(2)+' mph');},
'mph-to-kph-calculator.html':()=>{const v=n('feet'); if(isNaN(v))return out('Enter speed.'); out(v+' mph = '+(v*1.60934).toFixed(2)+' km/h');},
'mulch-calculator.html':()=>{const area=n('feet'), depth=n('inches'); if(isNaN(area)||isNaN(depth))return out('Enter area and mulch depth.'); out('Mulch volume: '+(area*(depth/100)).toFixed(2)+' m³');},
'lean-body-mass-calculator.html':()=>{const w=n('feet'), h=n('inches'); if(isNaN(w)||isNaN(h))return out('Enter weight and height.'); out('Estimated lean body mass: '+((0.407*w)+(0.267*h)-19.2).toFixed(1)+' kg');},
'litres-per-square-metre-calculator.html':()=>{const litres=n('feet'), area=n('inches'); if(isNaN(litres)||isNaN(area)||area<=0)return out('Enter litres and area.'); out('Litres per square metre: '+(litres/area).toFixed(2)+' L/m²');},
'litres-to-gallons-calculator.html':()=>{const v=n('feet'); if(isNaN(v))return out('Enter litres.'); out(v+' L = '+(v/3.78541).toFixed(2)+' US gal');},
'loan-repayment-calculator.html':()=>{const loan=n('feet'), rate=n('inches'), years=d(); if(isNaN(loan)||isNaN(rate)||isNaN(years)||years<=0)return out('Enter loan amount, rate, and years.'); const payment=loanPayment(loan,rate,years); out('Monthly payment: '+money(payment)+' • Total interest: '+money(payment*years*12-loan));},
'margin-calculator.html':()=>{const revenue=n('feet'), cost=n('inches'); if(isNaN(revenue)||isNaN(cost)||revenue<=0)return out('Enter revenue and cost.'); out('Profit: '+money(revenue-cost)+' • Margin: '+((revenue-cost)/revenue*100).toFixed(2)+'%');},
'markup-calculator.html':()=>{const cost=n('feet'), markup=n('inches'); if(isNaN(cost)||isNaN(markup))return out('Enter cost and markup.'); out('Selling price: '+money(cost*(1+markup/100)));},
'median-calculator.html':()=>{const v=numberList('feet').sort((a,b)=>a-b); if(!v.length)return out('Enter numbers separated by commas.'); const mid=Math.floor(v.length/2), med=v.length%2?v[mid]:(v[mid-1]+v[mid])/2; out('Median: '+med);},
'ml-to-cups-calculator.html':()=>{const v=n('feet'); if(isNaN(v))return out('Enter mL.'); out(v+' mL = '+(v/236.588).toFixed(2)+' cups');},
'mode-calculator.html':()=>{const v=numberList('feet'); if(!v.length)return out('Enter numbers separated by commas.'); const c={}; v.forEach(x=>c[x]=(c[x]||0)+1); const max=Math.max(...Object.values(c)); out('Mode: '+Object.keys(c).filter(k=>c[k]===max).join(', '));},
'mortgage-amortization-calculator.html':()=>calculatorConfigs['loan-repayment-calculator.html'](),
'net-worth-calculator.html':()=>{const a=n('feet'), l=n('inches'); if(isNaN(a)||isNaN(l))return out('Enter assets and liabilities.'); out('Estimated net worth: '+money(a-l));},
'offset-account-calculator.html':()=>{const offset=n('feet'), rate=n('inches'), years=d(); if(isNaN(offset)||isNaN(rate)||isNaN(years))return out('Enter offset balance, rate, and years.'); out('Estimated simple interest saved: '+money(offset*rate/100*years));},
'one-rep-max-calculator.html':()=>{const weight=n('feet'), reps=n('inches'); if(isNaN(weight)||isNaN(reps))return out('Enter weight and reps.'); out('Estimated one-rep max: '+(weight*(1+reps/30)).toFixed(1));},
'overtime-calculator.html':()=>{const rate=n('feet'), hours=n('inches'), mult=d(); if(isNaN(rate)||isNaN(hours))return out('Enter rate and hours.'); const regular=Math.min(hours,40), overtime=Math.max(0,hours-40); out('Estimated pay: '+money(regular*rate+overtime*rate*(isNaN(mult)?1.5:mult)));},
'ovulation-calculator.html':()=>{const start=dt('feet'), cycle=n('inches')||28; if(!start||isNaN(start))return out('Choose the first day of the last period.'); const ov=new Date(start); ov.setDate(ov.getDate()+cycle-14); out('Estimated ovulation date: '+ov.toLocaleDateString());},
'pace-calculator.html':()=>{const dist=n('feet'), mins=n('inches'); if(isNaN(dist)||isNaN(mins)||dist<=0)return out('Enter distance and time.'); out('Pace: '+(mins/dist).toFixed(2)+' min/km');},
'paint-calculator.html':()=>{const area=n('feet'), cov=n('inches'); if(isNaN(area)||isNaN(cov)||cov<=0)return out('Enter area and coverage.'); out('Paint needed: '+(area/cov).toFixed(2)+' litres');},
'pay-raise-calculator.html':()=>{const salary=n('feet'), raise=n('inches'); if(isNaN(salary)||isNaN(raise))return out('Enter salary and raise.'); out('New salary: '+money(salary*(1+raise/100))+' • Increase: '+money(salary*raise/100));},
'paycheck-calculator.html':()=>{const salary=n('feet'), periods=n('inches'), tax=d(); if(isNaN(salary)||isNaN(periods)||periods<=0)return out('Enter salary and pay periods.'); const gross=salary/periods; out('Estimated pay per period: '+money(gross*(1-(isNaN(tax)?0:tax)/100)));},
'percent-change-calculator.html':()=>{const old=n('feet'), ne=n('inches'); if(isNaN(old)||isNaN(ne)||old===0)return out('Enter original and new values.'); out('Percent change: '+((ne-old)/old*100).toFixed(d())+'%');},
'percentage-calculator.html':()=>{const pctv=n('feet'), num=n('inches'); if(isNaN(pctv)||isNaN(num))return out('Enter percentage and number.'); out(pctv+'% of '+num+' = '+(pctv/100*num).toFixed(d()));},
'percentage-decrease-calculator.html':()=>{const original=n('feet'), dec=n('inches'); if(isNaN(original)||isNaN(dec))return out('Enter value and decrease.'); out('Result: '+(original*(1-dec/100)).toFixed(d()));},
'percentage-increase-calculator.html':()=>{const original=n('feet'), inc=n('inches'); if(isNaN(original)||isNaN(inc))return out('Enter value and increase.'); out('Result: '+(original*(1+inc/100)).toFixed(d()));},
'protein-intake-calculator.html':()=>{const w=n('feet'), target=n('inches'); if(isNaN(w)||isNaN(target))return out('Enter weight and protein target.'); out('Daily protein target: '+(w*target).toFixed(0)+' g');},
'quick-ratio-calculator.html':()=>{const assets=n('feet'), liabilities=n('inches'); if(isNaN(assets)||isNaN(liabilities)||liabilities<=0)return out('Enter quick assets and liabilities.'); out('Quick ratio: '+(assets/liabilities).toFixed(2)+':1');},
'ratio-calculator.html':()=>{let a=n('feet'), b=n('inches'); if(isNaN(a)||isNaN(b)||b===0)return out('Enter two numbers.'); function gcd(x,y){x=Math.abs(x);y=Math.abs(y);while(y){let t=y;y=x%y;x=t;}return x||1;} const g=gcd(a,b); out('Ratio: '+(a/g)+':'+(b/g));},
'refinance-savings-calculator.html':()=>{const current=n('feet'), ne=n('inches'), months=d(); if(isNaN(current)||isNaN(ne))return out('Enter current and new payments.'); out('Monthly savings: '+money(current-ne)+' • Savings over term: '+money((current-ne)*(isNaN(months)?0:months)));},
'retirement-savings-calculator.html':()=>{const p=n('feet'), rate=n('inches'), years=d(); if(isNaN(p)||isNaN(rate)||isNaN(years))return out('Enter savings, return, and years.'); out('Estimated retirement savings: '+money(p*Math.pow(1+rate/100,years)));},
'roi-calculator.html':()=>{const gain=n('feet'), cost=n('inches'); if(isNaN(gain)||isNaN(cost)||cost===0)return out('Enter gain and cost.'); out('ROI: '+((gain-cost)/cost*100).toFixed(d())+'%');},
'room-perimeter-calculator.html':()=>{const l=n('feet'), w=n('inches'); if(isNaN(l)||isNaN(w))return out('Enter length and width.'); out('Perimeter: '+(2*(l+w)).toFixed(2));},
'salary-calculator.html':()=>{const salary=n('feet'), hours=n('inches'), precision=d(); if(isNaN(salary)||isNaN(hours)||hours<=0)return out('Enter salary and hours.'); out('Hourly equivalent: '+money(salary/(hours*52)));},
'sales-tax-calculator.html':()=>{const price=n('feet'), tax=n('inches'); if(isNaN(price)||isNaN(tax))return out('Enter price and tax.'); out('Tax: '+money(price*tax/100)+' • Total: '+money(price*(1+tax/100)));},
'savings-calculator.html':()=>{const p=n('feet'), rate=n('inches'), years=d(); if(isNaN(p)||isNaN(rate)||isNaN(years))return out('Enter amount, rate, and term.'); out('Estimated savings: '+money(p*Math.pow(1+rate/100,years)));},
'savings-goal-calculator.html':()=>{const goal=n('feet'), current=n('inches'), monthly=d(); if(isNaN(goal)||isNaN(current)||isNaN(monthly)||monthly<=0)return out('Enter goal, current savings, and monthly contribution.'); out('Time to goal: '+monthsToText(Math.ceil((goal-current)/monthly)));},
'simple-interest-calculator.html':()=>{const p=n('feet'), rate=n('inches'), years=d(); if(isNaN(p)||isNaN(rate)||isNaN(years))return out('Enter principal, rate, and years.'); out('Simple interest: '+money(p*rate/100*years)+' • Total: '+money(p+(p*rate/100*years)));},
'slope-calculator.html':()=>{const p1=textVal('feet').split(',').map(Number), p2=textVal('inches').split(',').map(Number); if(p1.length<2||p2.length<2||p1.some(isNaN)||p2.some(isNaN)||p2[0]===p1[0])return out('Enter two points as x,y.'); out('Slope: '+((p2[1]-p1[1])/(p2[0]-p1[0])).toFixed(4));},
'midpoint-calculator.html':()=>{const p1=textVal('feet').split(',').map(Number), p2=textVal('inches').split(',').map(Number); if(p1.length<2||p2.length<2||p1.some(isNaN)||p2.some(isNaN))return out('Enter two points as x,y.'); out('Midpoint: ('+((p1[0]+p2[0])/2)+', '+((p1[1]+p2[1])/2)+')');},
'square-feet-to-square-metres-calculator.html':()=>{const v=n('feet'); if(isNaN(v))return out('Enter square feet.'); out(v+' sq ft = '+(v*0.092903).toFixed(2)+' m²');},
'square-metres-to-square-feet-calculator.html':()=>{const v=n('feet'); if(isNaN(v))return out('Enter square metres.'); out(v+' m² = '+(v*10.7639).toFixed(2)+' sq ft');},
'square-footage-calculator.html':()=>{const l=n('feet'), w=n('inches'); if(isNaN(l)||isNaN(w))return out('Enter length and width.'); out('Area: '+(l*w).toFixed(2)+' square feet');},
'standard-deviation-calculator.html':()=>{const v=numberList('feet'); if(v.length<2)return out('Enter at least two numbers.'); const mean=v.reduce((a,b)=>a+b,0)/v.length; const variance=v.reduce((a,b)=>a+Math.pow(b-mean,2),0)/v.length; out('Standard deviation: '+Math.sqrt(variance).toFixed(4));},
'tile-calculator.html':()=>{const area=n('feet'), length=n('inches'), width=d(); if(isNaN(area)||isNaN(length)||isNaN(width)||length<=0||width<=0)return out('Enter area and tile dimensions.'); const tileArea=(length/100)*(width/100); out('Tiles needed: '+Math.ceil(area/tileArea));},
'time-duration-calculator.html':()=>{const a=textVal('feet'), b=textVal('inches'); if(!a||!b)return out('Enter start and end times.'); const da=new Date('1970-01-01T'+a), db=new Date('1970-01-01T'+b); let diff=(db-da)/60000; if(diff<0)diff+=1440; out('Duration: '+Math.floor(diff/60)+' hours '+Math.round(diff%60)+' minutes');},
'tip-calculator.html':()=>{const bill=n('feet'), tip=n('inches'), people=d(); if(isNaN(bill)||isNaN(tip))return out('Enter bill and tip.'); const total=bill*(1+tip/100), split=people>0?people:1; out('Tip: '+money(bill*tip/100)+' • Total: '+money(total)+' • Per person: '+money(total/split));},
'vat-calculator.html':()=>{const amount=n('feet'), rate=n('inches'), direction=d(); if(isNaN(amount)||isNaN(rate))return out('Enter amount and VAT rate.'); if(direction===2)return out('VAT included: '+money(amount-amount/(1+rate/100))+' • Net: '+money(amount/(1+rate/100))); out('VAT: '+money(amount*rate/100)+' • Gross: '+money(amount*(1+rate/100)));},
'waist-to-hip-ratio-calculator.html':()=>{const waist=n('feet'), hip=n('inches'); if(isNaN(waist)||isNaN(hip)||hip<=0)return out('Enter waist and hip measurements.'); out('Waist-to-hip ratio: '+(waist/hip).toFixed(2));},
'water-intake-calculator.html':()=>{const weight=n('feet'), active=n('inches')||0; if(isNaN(weight))return out('Enter body weight.'); out('Estimated daily water: '+((weight*35)+(active*12)).toFixed(0)+' mL');},
'weeks-between-dates-calculator.html':()=>{const a=dt('feet'), b=dt('inches'); if(!a||!b||isNaN(a)||isNaN(b))return out('Choose both dates.'); out('Difference: '+(Math.abs(daysBetween(a,b))/7).toFixed(2)+' weeks');},
'weighted-average-calculator.html':()=>{const vals=numberList('feet'), weights=numberList('inches'); if(!vals.length||vals.length!==weights.length)return out('Enter matching values and weights.'); const sw=weights.reduce((a,b)=>a+b,0); out('Weighted average: '+(vals.reduce((a,v,i)=>a+v*weights[i],0)/sw).toFixed(4));}
,
'mortgage-affordability-calculator.html':()=>{const payment=n('feet'), rate=n('rate')/100/12, years=n('years'), deposit=n('deposit')||0; if(isNaN(payment)||isNaN(rate)||isNaN(years)||payment<=0||years<=0)return out('Enter monthly budget, rate, and term.'); const months=years*12; const loan=rate===0?payment*months:payment*(Math.pow(1+rate,months)-1)/(rate*Math.pow(1+rate,months)); out('Estimated affordable loan: '+money(loan)+' • Estimated home price with down payment: '+money(loan+deposit));},
'contractor-rate-calculator.html':()=>{const target=n('feet'), hours=n('inches'), overhead=(n('rate')||0)/100; if(isNaN(target)||isNaN(hours)||target<=0||hours<=0)return out('Enter target income and billable hours.'); const annualHours=hours*48; const hourly=target*(1+overhead)/annualHours; out('Estimated contractor rate: '+money(hourly)+'/hour • Annual billable hours: '+annualHours.toLocaleString());},
'leave-payout-calculator.html':()=>{const rate=n('feet'), hours=n('inches'), days=n('days'); if(isNaN(rate)||isNaN(hours)||isNaN(days)||rate<0||hours<0||days<0)return out('Enter pay rate, hours per day, and leave days.'); out('Estimated gross leave payout: '+money(rate*hours*days));},
'calorie-calculator.html':()=>{const kg=n('feet'), cm=n('inches'), age=n('age'), sex=n('sex'), activity=n('activity'); if([kg,cm,age,sex,activity].some(isNaN)||kg<=0||cm<=0||age<=0||activity<=0)return out('Enter weight, height, age, sex, and activity level.'); const bmr=10*kg+6.25*cm-5*age+sex; out('Estimated maintenance calories: '+(bmr*activity).toFixed(0)+' kcal/day • BMR: '+bmr.toFixed(0)+' kcal/day');},
'bmr-calculator.html':()=>{const kg=n('feet'), cm=n('inches'), age=n('age'), sex=n('sex'); if([kg,cm,age,sex].some(isNaN)||kg<=0||cm<=0||age<=0)return out('Enter weight, height, age, and sex.'); const bmr=10*kg+6.25*cm-5*age+sex; out('Estimated BMR: '+bmr.toFixed(0)+' kcal/day');},
'roofing-calculator.html':()=>{const length=n('feet'), width=n('inches'), pitch=n('rate')||1, waste=(n('waste')||0)/100; if(isNaN(length)||isNaN(width)||length<=0||width<=0||pitch<=0)return out('Enter length, width, and pitch factor.'); const area=length*width*pitch*(1+waste); out('Estimated roof area with allowance: '+area.toFixed(d())+' square units');},
'fence-calculator.html':()=>{const length=n('feet'), panel=n('inches'), spacing=n('spacing')||panel; if(isNaN(length)||isNaN(panel)||isNaN(spacing)||length<=0||panel<=0||spacing<=0)return out('Enter fence length, panel width, and post spacing.'); out('Estimated panels: '+Math.ceil(length/panel)+' • Estimated posts: '+(Math.ceil(length/spacing)+1));},
'work-hours-calculator.html':()=>{const start=n('feet'), end=n('inches'), breaks=n('breaks')||0, days=n('days')||1; if(isNaN(start)||isNaN(end)||start<0||end<=start||breaks<0||days<=0)return out('Enter valid start time, end time, break, and days.'); const daily=end-start-breaks; if(daily<0)return out('Break time cannot exceed the shift length.'); out('Total work hours: '+(daily*days).toFixed(d())+' hours • Daily paid hours: '+daily.toFixed(d()));}

});

function resetCalculator(){document.querySelectorAll('input').forEach(i=>i.value=''); document.querySelectorAll('select').forEach(s=>{const selected=s.querySelector('option[selected]'); if(selected){s.value=selected.value;} else if(s.id==='decimals'){s.value='2';} else {s.selectedIndex=0;}}); out('Enter values to begin'); if(feetInput) feetInput.focus();}

Object.assign(calculatorConfigs,{
'body-fat-calculator.html':()=>{const waist=n('inches'), neck=n('rate'), height=n('years'); const sexEl=$('sex'); const sex=sexEl?sexEl.value:'male'; if([waist,neck,height].some(isNaN)||waist<=0||neck<=0||height<=0)return out('Enter waist, neck and height measurements.'); let bf; if(sex==='female'){const hip=n('feet'); bf=495/(1.29579-0.35004*Math.log10(Math.max(1,waist+hip-neck))+0.22100*Math.log10(height))-450;} else {bf=495/(1.0324-0.19077*Math.log10(Math.max(1,waist-neck))+0.15456*Math.log10(height))-450;} if(!isFinite(bf))return out('Check the measurements and try again.'); out('Estimated body fat: '+bf.toFixed(1)+'%');},
'tdee-calculator.html':()=>{const kg=n('feet'), cm=n('inches'), age=n('age'), sex=n('sex'), activity=n('activity'); if([kg,cm,age,sex,activity].some(isNaN)||kg<=0||cm<=0||age<=0)return out('Enter weight, height, age, sex and activity level.'); const bmr=10*kg+6.25*cm-5*age+sex; out('Estimated TDEE: '+(bmr*activity).toFixed(0)+' kcal/day • BMR: '+bmr.toFixed(0)+' kcal/day');},
'macro-calculator.html':()=>{const calories=n('feet'), protein=n('inches'), fat=n('rate'); if([calories,protein,fat].some(isNaN)||calories<=0||protein<0||fat<0)return out('Enter calories, protein and fat.'); const remaining=calories-(protein*4)-(fat*9); if(remaining<0)return out('Protein and fat exceed the calorie target.'); out('Protein: '+protein.toFixed(0)+' g • Fat: '+fat.toFixed(0)+' g • Carbs: '+(remaining/4).toFixed(0)+' g');},
'drywall-calculator.html':()=>{const area=n('feet'), sheet=n('inches'), waste=n('rate')||0; if([area,sheet].some(isNaN)||area<=0||sheet<=0)return out('Enter wall area and sheet area.'); out('Estimated sheets needed: '+Math.ceil(area*(1+waste/100)/sheet).toLocaleString());},
'wallpaper-calculator.html':()=>{const area=n('feet'), roll=n('inches'), waste=n('rate')||0; if([area,roll].some(isNaN)||area<=0||roll<=0)return out('Enter wall area and roll coverage.'); out('Estimated rolls needed: '+Math.ceil(area*(1+waste/100)/roll).toLocaleString());},
'decking-calculator.html':()=>{const area=n('feet'), board=n('inches'), waste=n('rate')||0; if([area,board].some(isNaN)||area<=0||board<=0)return out('Enter deck area and board coverage.'); out('Estimated boards needed: '+Math.ceil(area*(1+waste/100)/board).toLocaleString());},
'time-card-calculator.html':()=>{const start=n('feet'), end=n('inches'), breakMin=n('rate')||0, days=n('years')||1; if([start,end,days].some(isNaN)||end<start||days<=0)return out('Enter start time, end time and days.'); const hours=(end-start)-(breakMin/60); out('Paid hours: '+(hours*days).toFixed(2)+' hours');},
'week-number-calculator.html':()=>{const date=dt('feet'); if(!date||isNaN(date))return out('Choose a date.'); const dte=new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())); const day=dte.getUTCDay()||7; dte.setUTCDate(dte.getUTCDate()+4-day); const yearStart=new Date(Date.UTC(dte.getUTCFullYear(),0,1)); const week=Math.ceil((((dte-yearStart)/86400000)+1)/7); out('ISO week: '+week+' • ISO week-year: '+dte.getUTCFullYear());}
});


Object.assign(calculatorConfigs,{
'refinance-calculator.html':()=>{const loan=n('loan'), rate=n('rate'), years=n('years'), newRate=n('newRate'), newYears=n('newYears'), fees=n('fees')||0; if([loan,rate,years,newRate,newYears].some(isNaN)||loan<=0||years<=0||newYears<=0)return out('Enter loan balance, rates and terms.'); const pay=(p,apr,y)=>{const r=apr/100/12, m=y*12; return r===0?p/m:p*r*Math.pow(1+r,m)/(Math.pow(1+r,m)-1)}; const oldP=pay(loan,rate,years), newP=pay(loan,newRate,newYears), save=oldP-newP; const be=save>0?fees/save:NaN; out('Current payment: '+money(oldP)+' • New payment: '+money(newP)+' • Monthly saving: '+money(save)+' • Break-even: '+(isFinite(be)?Math.ceil(be)+' months':'not reached'));},
'amortization-calculator.html':()=>{const loan=n('loan'), rate=n('rate'), years=n('years'); if([loan,rate,years].some(isNaN)||loan<=0||years<=0)return out('Enter loan amount, rate and term.'); const r=rate/100/12, m=years*12; const p=r===0?loan/m:loan*r*Math.pow(1+r,m)/(Math.pow(1+r,m)-1); out('Monthly payment: '+money(p)+' • Total paid: '+money(p*m)+' • Total interest: '+money(p*m-loan));},
'extra-payment-calculator.html':()=>{const loan=n('loan'), rate=n('rate'), years=n('years'), extra=n('extra')||0; if([loan,rate,years].some(isNaN)||loan<=0||years<=0)return out('Enter loan balance, rate, term and extra payment.'); const r=rate/100/12, m=years*12; const base=r===0?loan/m:loan*r*Math.pow(1+r,m)/(Math.pow(1+r,m)-1); const p=base+extra; if(p<=loan*r)return out('Payment is too low to reduce the balance.'); const newMonths=r===0?loan/p:Math.ceil(-Math.log(1-r*loan/p)/Math.log(1+r)); out('Standard payment: '+money(base)+' • With extra: '+money(p)+' • Estimated payoff: '+monthsToText(newMonths)+' • Time saved: '+monthsToText(m-newMonths));},
'rent-vs-buy-calculator.html':()=>{const rent=n('rent'), price=n('price'), down=n('down')||0, rate=n('rate'), years=n('years'), costs=n('costs')||0; if([rent,price,rate,years].some(isNaN)||rent<0||price<=0||years<=0)return out('Enter rent, price, rate and term.'); const loan=Math.max(0,price-down), r=rate/100/12, m=years*12; const mortgage=r===0?loan/m:loan*r*Math.pow(1+r,m)/(Math.pow(1+r,m)-1); const own=mortgage+costs; out('Estimated ownership cost: '+money(own)+' / month • Rent: '+money(rent)+' / month • Difference: '+money(own-rent)+' / month');},
'salary-to-hourly-calculator.html':()=>{const salary=n('salary'), hours=n('hours'), weeks=n('weeks'); if([salary,hours,weeks].some(isNaN)||salary<=0||hours<=0||weeks<=0)return out('Enter salary, hours per week and weeks per year.'); const hourly=salary/(hours*weeks); out('Hourly equivalent: '+money(hourly)+' • Weekly: '+money(salary/weeks)+' • Monthly: '+money(salary/12));}
});


Object.assign(calculatorConfigs,{
'biweekly-mortgage-calculator.html':()=>{const loan=n('loan'),rate=n('rate'),years=n('years');if([loan,rate,years].some(isNaN)||loan<=0||years<=0)return out('Enter loan amount, rate and term.');const r=rate/100/12,m=years*12,p=r===0?loan/m:loan*r*Math.pow(1+r,m)/(Math.pow(1+r,m)-1);out('Monthly payment: '+money(p)+' • Biweekly equivalent: '+money(p*12/26)+' • Annual paid: '+money(p*12));},
'mortgage-payoff-calculator.html':()=>{const loan=n('loan'),rate=n('rate')/100/12,payment=n('payment');if([loan,rate,payment].some(isNaN)||loan<=0||payment<=0)return out('Enter balance, rate and payment.');if(payment<=loan*rate)return out('Payment must be greater than monthly interest.');const months=rate===0?Math.ceil(loan/payment):Math.ceil(-Math.log(1-rate*loan/payment)/Math.log(1+rate));out('Estimated payoff time: '+monthsToText(months)+' • Estimated total paid: '+money(payment*months)+' • Estimated interest: '+money(payment*months-loan));},
'mortgage-interest-calculator.html':()=>{const loan=n('loan'),rate=n('rate'),years=n('years');if([loan,rate,years].some(isNaN)||loan<=0||years<=0)return out('Enter loan amount, rate and term.');const r=rate/100/12,m=years*12,p=r===0?loan/m:loan*r*Math.pow(1+r,m)/(Math.pow(1+r,m)-1);out('Monthly payment: '+money(p)+' • Total interest: '+money(p*m-loan)+' • Total paid: '+money(p*m));},
'refinance-savings-calculator.html':()=>{const cur=n('current'),nw=n('newPayment'),costs=n('costs')||0;if([cur,nw].some(isNaN)||cur<0||nw<0)return out('Enter current and new payment.');const save=cur-nw;out('Monthly savings: '+money(save)+' • Break-even: '+(save>0?monthsToText(Math.ceil(costs/save)):'No monthly saving'));},
'arm-vs-fixed-mortgage-calculator.html':()=>{const loan=n('loan'),fixed=n('fixedRate'),arm=n('armRate'),years=n('years');if([loan,fixed,arm,years].some(isNaN)||loan<=0||years<=0)return out('Enter loan amount, rates and term.');const pay=(apr)=>{const r=apr/100/12,m=years*12;return r===0?loan/m:loan*r*Math.pow(1+r,m)/(Math.pow(1+r,m)-1)};const fp=pay(fixed),ap=pay(arm);out('Fixed starting payment: '+money(fp)+' • ARM starting payment: '+money(ap)+' • Starting difference: '+money(ap-fp));},
'bonus-tax-calculator.html':()=>{const bonus=n('bonus'),rate=n('rate');if([bonus,rate].some(isNaN)||bonus<0)return out('Enter bonus and withholding rate.');const tax=bonus*rate/100;out('Estimated withholding: '+money(tax)+' • Estimated net bonus: '+money(bonus-tax));},
'tax-withholding-calculator.html':()=>{const gross=n('gross'),rate=n('rate');if([gross,rate].some(isNaN)||gross<0)return out('Enter gross pay and withholding rate.');const tax=gross*rate/100;out('Estimated tax withheld: '+money(tax)+' • Estimated net pay: '+money(gross-tax));},
'self-employed-tax-calculator.html':()=>{const income=n('income'),expenses=n('expenses')||0,rate=n('rate');if([income,rate].some(isNaN)||income<0)return out('Enter income, expenses and estimated tax rate.');const profit=Math.max(0,income-expenses),tax=profit*rate/100;out('Estimated profit: '+money(profit)+' • Suggested tax reserve: '+money(tax));},
'freelance-rate-calculator.html':()=>{const target=n('target'),expenses=n('expenses')||0,hours=n('hours');if([target,hours].some(isNaN)||hours<=0)return out('Enter target income and billable hours.');out('Suggested hourly rate: '+money((target+expenses)/hours)+' • Required revenue: '+money(target+expenses));},
'shift-differential-calculator.html':()=>{const rate=n('rate'),hours=n('hours'),diff=n('diff');if([rate,hours,diff].some(isNaN)||hours<0)return out('Enter rate, hours and differential.');const effective=rate*(1+diff/100);out('Effective rate: '+money(effective)+'/hour • Estimated pay: '+money(effective*hours));},
'paycheck-estimator-calculator.html':()=>{const gross=n('gross'),tax=n('tax')||0,ded=n('deductions')||0;if(isNaN(gross)||gross<0)return out('Enter gross pay.');const withheld=gross*tax/100;out('Estimated take-home pay: '+money(gross-withheld-ded)+' • Tax: '+money(withheld)+' • Deductions: '+money(ded));},
'calorie-deficit-calculator.html':()=>{const maintenance=n('maintenance'),deficit=n('deficit');if([maintenance,deficit].some(isNaN)||maintenance<=0)return out('Enter maintenance calories and deficit.');out('Target calories: '+Math.max(0,maintenance-deficit).toFixed(0)+' kcal/day • Weekly deficit: '+(deficit*7).toFixed(0)+' kcal');},
'lean-body-mass-calculator.html':()=>{const weight=n('weight'),bf=n('bodyfat');if([weight,bf].some(isNaN)||weight<=0||bf<0||bf>=100)return out('Enter weight and body fat percentage.');out('Lean body mass: '+(weight*(1-bf/100)).toFixed(d())+' • Fat mass: '+(weight*bf/100).toFixed(d()));},
'one-rep-max-calculator.html':()=>{const weight=n('weight'),reps=n('reps');if([weight,reps].some(isNaN)||weight<=0||reps<=0)return out('Enter weight lifted and reps.');out('Estimated one-rep max: '+(weight*(1+reps/30)).toFixed(d()));},
'water-intake-calculator.html':()=>{const weight=n('weight'),minutes=n('minutes')||0;if(isNaN(weight)||weight<=0)return out('Enter body weight.');const ml=weight*35+minutes*12;out('Estimated daily water target: '+(ml/1000).toFixed(2)+' L/day');},
'body-surface-area-calculator.html':()=>{const h=n('height'),w=n('weight');if([h,w].some(isNaN)||h<=0||w<=0)return out('Enter height and weight.');out('Estimated body surface area: '+(0.007184*Math.pow(h,0.725)*Math.pow(w,0.425)).toFixed(2)+' m²');},
'gravel-calculator.html':()=>{const area=n('area'),depth=n('depth');if([area,depth].some(isNaN)||area<=0||depth<=0)return out('Enter area and depth.');out('Estimated gravel volume: '+(area*depth).toFixed(d())+' cubic units');},
'paver-calculator.html':()=>{const area=n('area'),paver=n('paver'),waste=n('waste')||0;if([area,paver].some(isNaN)||area<=0||paver<=0)return out('Enter project area and paver area.');out('Estimated pavers: '+Math.ceil(area*(1+waste/100)/paver).toLocaleString());},
'brick-calculator.html':()=>{const area=n('area'),bricks=n('bricks'),waste=n('waste')||0;if([area,bricks].some(isNaN)||area<=0||bricks<=0)return out('Enter wall area and bricks per area.');out('Estimated bricks: '+Math.ceil(area*bricks*(1+waste/100)).toLocaleString());},
'topsoil-calculator.html':()=>{const area=n('area'),depth=n('depth');if([area,depth].some(isNaN)||area<=0||depth<=0)return out('Enter area and depth.');out('Estimated topsoil volume: '+(area*depth).toFixed(d())+' cubic units');},
'cubic-yard-calculator.html':()=>{const length=n('length'),width=n('width'),depth=n('depth');if([length,width,depth].some(isNaN)||length<=0||width<=0||depth<=0)return out('Enter length, width and depth in feet.');out('Estimated volume: '+(length*width*depth/27).toFixed(d())+' cubic yards');},
'asphalt-calculator.html':()=>{const area=n('area'),depth=n('depth');if([area,depth].some(isNaN)||area<=0||depth<=0)return out('Enter area and depth.');out('Estimated asphalt volume: '+(area*depth).toFixed(d())+' cubic units');}
});

if(calculateBtn&&resetBtn){const keyBase=calculatorKey.replace(/\.html$/,''); const pageBase=currentPage.replace(/\.html$/,''); const candidates=[currentPage, calculatorKey, calculatorKey+'.html', keyBase, keyBase+'.html', pageBase, pageBase+'.html', currentPage.replace('-calculator.html','.html'), pageBase.replace('-calculator','')+'.html']; const fn=candidates.map(k=>calculatorConfigs[k]).find(Boolean); if(fn){calculateBtn.addEventListener('click',fn); resetBtn.addEventListener('click',resetCalculator); document.querySelectorAll('input').forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter')fn();}));}}
const mainCalcScreen=$('mainCalcScreen'); const mainCalcKeys=document.querySelectorAll('.calc-key'); if(mainCalcScreen&&mainCalcKeys.length){let expr=''; const display=()=>mainCalcScreen.textContent=(expr||'0').replace(/\*/g,'×').replace(/\//g,'÷').replace(/-/g,'−'); mainCalcKeys.forEach(btn=>btn.addEventListener('click',()=>{const v=btn.dataset.value,a=btn.dataset.action; if(a==='clear'){expr='';display();return;} if(a==='backspace'){expr=expr.slice(0,-1);display();return;} if(a==='equals'){try{const r=Function('"use strict";return ('+expr.replace(/%/g,'/100')+')')(); expr=isFinite(r)?Number(r.toFixed(10)).toString():''; mainCalcScreen.textContent=expr||'Error';}catch{expr='';mainCalcScreen.textContent='Error';} return;} if(v){expr+=v;display();}}));}

/* ===== CalculatorWorks Reliable Global Search Fix ===== */

(function() {
'use strict';

const CW_SEARCH_INDEX = [{"title":"Calculator tools for money, health, dates, home projects, and conversions","url":"/","category":"Calculator index","description":"Use CalculatorWorks for free online calculators covering mortgage, salary and pay, health, construction, finance, percentages, dates, units and everyday planning.","searchText":"calculator tools for money, health, dates, home projects, and conversions   use calculatorworks for free online calculators covering mortgage, salary and pay, health, construction, finance, percentages, dates, units and everyday planning. calculator index"},{"title":"All free online calculators","url":"/calculators","category":"Calculator index","description":"Browse every free online calculator available on CalculatorWorks, including finance calculators, percentage tools, unit converters, health calculators, date tools, business calculators, math tools and more.","searchText":"all free online calculators  calculators browse every free online calculator available on calculatorworks, including finance calculators, percentage tools, unit converters, health calculators, date tools, business calculators, math tools and more. calculator index"},{"title":"Finance Calculators","url":"/finance","category":"Finance","description":"Finance calculators for mortgages, loans, compound interest, retirement savings, credit card payoff and financial planning estimates.","searchText":"finance calculators  finance finance calculators for mortgages, loans, compound interest, retirement savings, credit card payoff and financial planning estimates. finance"},{"title":"Business Calculators","url":"/business","category":"Business","description":"Business calculators for margins, markup, break-even, profit, sales and practical business planning estimates.","searchText":"business calculators  business business calculators for margins, markup, break-even, profit, sales and practical business planning estimates. business"},{"title":"Percentage Calculators","url":"/percentage","category":"Percentage","description":"Percentage calculators for discounts, percentage change, increases, decreases, margins, markups, tax and tipping.","searchText":"percentage calculators  percentage percentage calculators for discounts, percentage change, increases, decreases, margins, markups, tax and tipping. percentage"},{"title":"Unit Conversion Calculators","url":"/unit-conversion","category":"Conversion","description":"Unit conversion calculators for length, weight, temperature, area, volume and everyday measurement conversions.","searchText":"unit conversion calculators  unit conversion unit conversion calculators for length, weight, temperature, area, volume and everyday measurement conversions. conversion"},{"title":"Health Calculators","url":"/health","category":"Health","description":"Health calculators including BMI and general wellness estimation tools with educational caveats.","searchText":"health calculators  health health calculators including bmi and general wellness estimation tools with educational caveats. health"},{"title":"Math Calculators","url":"/math","category":"Math","description":"Math calculators for percentage, formulas, everyday arithmetic and practical calculation tasks.","searchText":"math calculators  math math calculators for percentage, formulas, everyday arithmetic and practical calculation tasks. math"},{"title":"Household Calculators","url":"/household","category":"Household","description":"Household calculators for home, renovation, measurement, budget and everyday planning estimates.","searchText":"household calculators  household household calculators for home, renovation, measurement, budget and everyday planning estimates. household"},{"title":"Date and Time Calculators","url":"/date-time","category":"Date & Time","description":"Date and time calculators for age, duration, date difference, days between dates and time planning.","searchText":"date and time calculators  date time date and time calculators for age, duration, date difference, days between dates and time planning. date & time"},{"title":"Everyday Calculators","url":"/everyday","category":"Everyday","description":"Everyday calculators for practical planning, dates, percentages, conversions, finance and household tasks.","searchText":"everyday calculators  everyday everyday calculators for practical planning, dates, percentages, conversions, finance and household tasks. everyday"},{"title":"Break-Even Calculator","url":"/break-even-calculator","category":"Business","description":"Use the free break-even calculator to estimate required sales volume, break-even revenue, contribution margin, pricing scenarios, and startup planning examples.","searchText":"break-even calculator  break even calculator use the free break-even calculator to estimate required sales volume, break-even revenue, contribution margin, pricing scenarios, and startup planning examples. business"},{"title":"Business Days Calculator","url":"/business-days-calculator","category":"Business","description":"Count weekdays between two dates while excluding weekends.","searchText":"business days calculator  business days calculator count weekdays between two dates while excluding weekends. business"},{"title":"Business Profit Planner Calculator","url":"/business-profit-planner-calculator","category":"Business","description":"Estimate projected profit from units sold and profit per unit.","searchText":"business profit planner calculator  business profit planner calculator estimate projected profit from units sold and profit per unit. business"},{"title":"Contribution Margin Calculator","url":"/contribution-margin-calculator","category":"Business","description":"Calculate contribution per unit and contribution-margin ratio from price and variable cost.","searchText":"contribution margin calculator  contribution margin calculator calculate contribution per unit and contribution-margin ratio from price and variable cost. business"},{"title":"Current Ratio Calculator","url":"/current-ratio-calculator","category":"Business","description":"Estimate current ratio from current assets and current liabilities.","searchText":"current ratio calculator  current ratio calculator estimate current ratio from current assets and current liabilities. business"},{"title":"Depreciation Calculator","url":"/depreciation-calculator","category":"Business","description":"Estimate straight-line annual depreciation from cost, salvage value, and useful life.","searchText":"depreciation calculator  depreciation calculator estimate straight-line annual depreciation from cost, salvage value, and useful life. business"},{"title":"Margin Calculator","url":"/margin-calculator","category":"Business","description":"Use the free margin calculator to estimate gross profit margin from selling price and cost, with formulas, examples, pricing context, and related business calculators.","searchText":"margin calculator  margin calculator use the free margin calculator to estimate gross profit margin from selling price and cost, with formulas, examples, pricing context, and related business calculators. business"},{"title":"Markup Calculator","url":"/markup-calculator","category":"Business","description":"Use the free markup calculator to turn product cost and markup percentage into selling price, gross profit, pricing examples, and business margin context.","searchText":"markup calculator  markup calculator use the free markup calculator to turn product cost and markup percentage into selling price, gross profit, pricing examples, and business margin context. business"},{"title":"Quick Ratio Calculator","url":"/quick-ratio-calculator","category":"Business","description":"Estimate the quick ratio from liquid assets and current liabilities.","searchText":"quick ratio calculator  quick ratio calculator estimate the quick ratio from liquid assets and current liabilities. business"},{"title":"Ratio Calculator","url":"/ratio-calculator","category":"Business","description":"Simplify a ratio instantly and compare two values for recipes, scaling, maths homework, and planning tasks.","searchText":"ratio calculator  ratio calculator simplify a ratio instantly and compare two values for recipes, scaling, maths homework, and planning tasks. business"},{"title":"ROI Calculator","url":"/roi-calculator","category":"Business","description":"Use the free ROI calculator to find return on investment percentage and net profit from your investment cost and gain. Includes formula, worked examples, and FAQ.","searchText":"roi calculator  roi calculator use the free roi calculator to find return on investment percentage and net profit from your investment cost and gain. includes formula, worked examples, and faq. business"},{"title":"Sales Tax Calculator","url":"/sales-tax","category":"Business","description":"Add or reverse sales tax from a purchase price.","searchText":"sales tax calculator  sales tax add or reverse sales tax from a purchase price. business"},{"title":"Time Duration Calculator","url":"/time-duration-calculator","category":"Business","description":"Calculate the duration between two times in hours and minutes with CalculatorWorks. Includes formula, worked examples, and a simple time duration calculator.","searchText":"time duration calculator  time duration calculator calculate the duration between two times in hours and minutes with calculatorworks. includes formula, worked examples, and a simple time duration calculator. business"},{"title":"VAT Calculator","url":"/vat-calculator","category":"Business","description":"Use the free VAT calculator to add VAT to a net price or remove VAT from a gross price. Shows VAT amount, net price, and gross price clearly with formula and examples.","searchText":"vat calculator  vat calculator use the free vat calculator to add vat to a net price or remove vat from a gross price. shows vat amount, net price, and gross price clearly with formula and examples. business"},{"title":"Waist-to-Hip Ratio Calculator","url":"/waist-to-hip-ratio-calculator","category":"Business","description":"Calculate waist-to-hip ratio from waist and hip measurements.","searchText":"waist-to-hip ratio calculator  waist to hip ratio calculator calculate waist-to-hip ratio from waist and hip measurements. business"},{"title":"Amortization Calculator","url":"/amortization-calculator","category":"Calculator","description":"Estimate monthly payment, total interest and total cost for an amortising loan.","searchText":"amortization calculator  amortization calculator estimate monthly payment, total interest and total cost for an amortising loan. calculator"},{"title":"Bonus Tax Calculator","url":"/bonus-tax-calculator","category":"Calculator","description":"Estimate bonus tax withholding and net bonus amount.","searchText":"bonus tax calculator  bonus tax calculator estimate bonus tax withholding and net bonus amount. calculator"},{"title":"Contractor Rate Calculator","url":"/contractor-rate-calculator","category":"Calculator","description":"Convert a target annual income into an estimated contractor or freelance hourly rate after overhead and billable hours.","searchText":"contractor rate calculator  contractor rate calculator convert a target annual income into an estimated contractor or freelance hourly rate after overhead and billable hours. calculator"},{"title":"Decking Calculator","url":"/decking-calculator","category":"Calculator","description":"Estimate decking board requirements from deck area, board coverage and waste allowance.","searchText":"decking calculator  decking calculator estimate decking board requirements from deck area, board coverage and waste allowance. calculator"},{"title":"Drywall Calculator","url":"/drywall-calculator","category":"Calculator","description":"Estimate drywall sheet requirements from wall area, sheet size and waste allowance.","searchText":"drywall calculator  drywall calculator estimate drywall sheet requirements from wall area, sheet size and waste allowance. calculator"},{"title":"Emergency Fund Calculator","url":"/emergency-fund-calculator","category":"Calculator","description":"Estimate an emergency-fund target from monthly essential expenses and desired months of coverage.","searchText":"emergency fund calculator  emergency fund calculator estimate an emergency-fund target from monthly essential expenses and desired months of coverage. calculator"},{"title":"Extra Payment Calculator","url":"/extra-payment-calculator","category":"Calculator","description":"Estimate how extra monthly repayments can reduce loan time and interest.","searchText":"extra payment calculator  extra payment calculator estimate how extra monthly repayments can reduce loan time and interest. calculator"},{"title":"Ferramentas de cálculo para dinheiro, saúde, datas, projetos domésticos e conversões","url":"/pt","category":"Calculator","description":"Calculadoras online grátis para finanças, percentagens, datas, saúde, projetos domésticos e conversões de medidas.","searchText":"ferramentas de cálculo para dinheiro, saúde, datas, projetos domésticos e conversões  pt calculadoras online grátis para finanças, percentagens, datas, saúde, projetos domésticos e conversões de medidas. calculator"},{"title":"Freelance Rate Calculator","url":"/freelance-rate-calculator","category":"Calculator","description":"Estimate a freelance hourly rate from target income, expenses and billable hours.","searchText":"freelance rate calculator  freelance rate calculator estimate a freelance hourly rate from target income, expenses and billable hours. calculator"},{"title":"Herramientas de cálculo para dinero, salud, fechas, proyectos del hogar y conversiones","url":"/es","category":"Calculator","description":"Calculadoras online gratis para finanzas, porcentajes, fechas, salud, proyectos del hogar y conversiones de medidas.","searchText":"herramientas de cálculo para dinero, salud, fechas, proyectos del hogar y conversiones  es calculadoras online gratis para finanzas, porcentajes, fechas, salud, proyectos del hogar y conversiones de medidas. calculator"},{"title":"Leave Payout Calculator","url":"/leave-payout-calculator","category":"Calculator","description":"Estimate the gross value of unused leave from pay rate, hours per day and leave days.","searchText":"leave payout calculator  leave payout calculator estimate the gross value of unused leave from pay rate, hours per day and leave days. calculator"},{"title":"Macro Calculator","url":"/macro-calculator","category":"Calculator","description":"Split daily calories into estimated protein, fat and carbohydrate targets.","searchText":"macro calculator  macro calculator split daily calories into estimated protein, fat and carbohydrate targets. calculator"},{"title":"Measurement Calculators","url":"/measurement","category":"Calculator","description":"Area, volume, and speed converters for practical measurement tasks.","searchText":"measurement calculators  measurement area, volume, and speed converters for practical measurement tasks. calculator"},{"title":"One Rep Max Calculator","url":"/one-rep-max-calculator","category":"Calculator","description":"Estimate one-rep max strength from weight and reps.","searchText":"one rep max calculator  one rep max calculator estimate one-rep max strength from weight and reps. calculator"},{"title":"Pay Raise Calculator","url":"/pay-raise-calculator","category":"Calculator","description":"Estimate raise amount and new salary after a percentage increase.","searchText":"pay raise calculator  pay raise calculator estimate raise amount and new salary after a percentage increase. calculator"},{"title":"Rent vs Buy Calculator","url":"/rent-vs-buy","category":"Calculator","description":"Compare estimated monthly renting costs with estimated monthly home ownership costs.","searchText":"rent vs buy calculator  rent vs buy compare estimated monthly renting costs with estimated monthly home ownership costs. calculator"},{"title":"Self-Employed Tax Calculator","url":"/self-employed-tax-calculator","category":"Calculator","description":"Estimate self-employed tax reserve from income and expenses.","searchText":"self-employed tax calculator  self employed tax calculator estimate self-employed tax reserve from income and expenses. calculator"},{"title":"Shift Differential Calculator","url":"/shift-differential-calculator","category":"Calculator","description":"Estimate extra earnings from a shift differential rate.","searchText":"shift differential calculator  shift differential calculator estimate extra earnings from a shift differential rate. calculator"},{"title":"Square Metres to Square Feet Calculator","url":"/square-metres-to-square-feet-calculator","category":"Calculator","description":"Convert square metres to square feet instantly for property, flooring, renovation, and area planning tasks.","searchText":"square metres to square feet calculator  square metres to square feet calculator convert square metres to square feet instantly for property, flooring, renovation, and area planning tasks. calculator"},{"title":"Tax Withholding Calculator","url":"/tax-withholding-calculator","category":"Calculator","description":"Estimate tax withheld from gross pay using a withholding percentage.","searchText":"tax withholding calculator  tax withholding calculator estimate tax withheld from gross pay using a withholding percentage. calculator"},{"title":"Wallpaper Calculator","url":"/wallpaper-calculator","category":"Calculator","description":"Estimate wallpaper rolls from wall area, roll coverage and waste allowance.","searchText":"wallpaper calculator  wallpaper calculator estimate wallpaper rolls from wall area, roll coverage and waste allowance. calculator"},{"title":"Work Hours Calculator","url":"/work-hours-calculator","category":"Calculator","description":"Calculate total work hours from start time, end time, break length and number of days.","searchText":"work hours calculator  work hours calculator calculate total work hours from start time, end time, break length and number of days. calculator"},{"title":"Celsius to Fahrenheit Calculator","url":"/celsius-to-fahrenheit","category":"Conversion","description":"Convert Celsius to Fahrenheit with a fast °C to °F converter, weather and cooking examples, quick reference values, and clear formula guidance.","searchText":"celsius to fahrenheit calculator  celsius to fahrenheit convert celsius to fahrenheit with a fast °c to °f converter, weather and cooking examples, quick reference values, and clear formula guidance. conversion"},{"title":"CM to Inches Calculator","url":"/cm-to-inches","category":"Conversion","description":"Convert centimetres to inches quickly and accurately.","searchText":"cm to inches calculator  cm to inches convert centimetres to inches quickly and accurately. conversion"},{"title":"Cups to mL Calculator","url":"/cups-to-ml-calculator","category":"Conversion","description":"Convert US cups to millilitres instantly for cooking, baking, meal prep, and everyday kitchen measurements.","searchText":"cups to ml calculator  cups to ml calculator convert us cups to millilitres instantly for cooking, baking, meal prep, and everyday kitchen measurements. conversion"},{"title":"Fahrenheit to Celsius Calculator","url":"/fahrenheit-to-celsius","category":"Conversion","description":"Convert Fahrenheit to Celsius with a fast °F to °C converter, weather and cooking examples, quick reference values, and clear formula guidance.","searchText":"fahrenheit to celsius calculator  fahrenheit to celsius convert fahrenheit to celsius with a fast °f to °c converter, weather and cooking examples, quick reference values, and clear formula guidance. conversion"},{"title":"Feet to Metres Calculator","url":"/feet-to-metres","category":"Conversion","description":"Convert feet and inches to metres with a clear formula and examples.","searchText":"feet to metres calculator  feet to metres convert feet and inches to metres with a clear formula and examples. conversion"},{"title":"Gallons to Litres Calculator","url":"/gallons-to-litres-calculator","category":"Conversion","description":"Convert US gallons to litres instantly for fuel, water, storage, and everyday volume measurements.","searchText":"gallons to litres calculator  gallons to litres calculator convert us gallons to litres instantly for fuel, water, storage, and everyday volume measurements. conversion"},{"title":"Inches to CM Calculator","url":"/inches-to-cm","category":"Conversion","description":"Convert inches to centimetres quickly and accurately.","searchText":"inches to cm calculator  inches to cm convert inches to centimetres quickly and accurately. conversion"},{"title":"KG to LB Calculator","url":"/kg-to-lb","category":"Conversion","description":"Convert kilograms to pounds with a fast kg to lb converter, quick reference values, common weight examples, and practical fitness and shipping use cases.","searchText":"kg to lb calculator  kg to lb convert kilograms to pounds with a fast kg to lb converter, quick reference values, common weight examples, and practical fitness and shipping use cases. conversion"},{"title":"KM to Miles Calculator","url":"/km-to-miles","category":"Conversion","description":"Convert kilometres to miles with a fast km to mi converter, route examples, quick reference values, and practical travel and running use cases.","searchText":"km to miles calculator  km to miles convert kilometres to miles with a fast km to mi converter, route examples, quick reference values, and practical travel and running use cases. conversion"},{"title":"KPH to MPH Calculator","url":"/kph-to-mph-calculator","category":"Conversion","description":"Convert kilometres per hour to miles per hour instantly for travel, running, cycling, and speed checks.","searchText":"kph to mph calculator  kph to mph calculator convert kilometres per hour to miles per hour instantly for travel, running, cycling, and speed checks. conversion"},{"title":"LB to KG Calculator","url":"/lb-to-kg","category":"Conversion","description":"Convert pounds to kilograms with a fast lb to kg converter, quick reference values, common weight examples, and practical travel and fitness use cases.","searchText":"lb to kg calculator  lb to kg convert pounds to kilograms with a fast lb to kg converter, quick reference values, common weight examples, and practical travel and fitness use cases. conversion"},{"title":"Litres per Square Metre Calculator","url":"/litres-per-square-metre-calculator","category":"Conversion","description":"Estimate litres needed from area and application rate.","searchText":"litres per square metre calculator  litres per square metre calculator estimate litres needed from area and application rate. conversion"},{"title":"Litres to Gallons Calculator","url":"/litres-to-gallons-calculator","category":"Conversion","description":"Convert litres to US gallons instantly for fuel, water, storage, and everyday volume measurements.","searchText":"litres to gallons calculator  litres to gallons calculator convert litres to us gallons instantly for fuel, water, storage, and everyday volume measurements. conversion"},{"title":"Metres to Feet Calculator","url":"/metres-to-feet","category":"Conversion","description":"Convert metres to feet and inches with practical rounding.","searchText":"metres to feet calculator  metres to feet convert metres to feet and inches with practical rounding. conversion"},{"title":"Miles to KM Calculator","url":"/miles-to-km","category":"Conversion","description":"Convert miles to kilometres with a fast mi to km converter, route examples, quick reference values, and practical travel and running use cases.","searchText":"miles to km calculator  miles to km convert miles to kilometres with a fast mi to km converter, route examples, quick reference values, and practical travel and running use cases. conversion"},{"title":"mL to Cups Calculator","url":"/ml-to-cups-calculator","category":"Conversion","description":"Convert millilitres to US cups instantly for cooking, baking, meal prep, and kitchen measurements.","searchText":"ml to cups calculator  ml to cups calculator convert millilitres to us cups instantly for cooking, baking, meal prep, and kitchen measurements. conversion"},{"title":"MPH to KPH Calculator","url":"/mph-to-kph-calculator","category":"Conversion","description":"Convert miles per hour to kilometres per hour instantly for travel, running, cycling, and speed checks.","searchText":"mph to kph calculator  mph to kph calculator convert miles per hour to kilometres per hour instantly for travel, running, cycling, and speed checks. conversion"},{"title":"Square Feet to Square Metres Calculator","url":"/square-feet-to-square-metres-calculator","category":"Conversion","description":"Convert square feet to square metres instantly for property, flooring, renovation, and area planning tasks.","searchText":"square feet to square metres calculator  square feet to square metres calculator convert square feet to square metres instantly for property, flooring, renovation, and area planning tasks. conversion"},{"title":"Age Calculator","url":"/age-calculator","category":"Date & Time","description":"Calculate your exact age in years, months, and days with CalculatorWorks. Includes formula, worked examples, and a simple age calculator.","searchText":"age calculator  age calculator calculate your exact age in years, months, and days with calculatorworks. includes formula, worked examples, and a simple age calculator. date & time"},{"title":"Age Difference Calculator","url":"/age-difference-calculator","category":"Date & Time","description":"Estimate the age difference between two birth dates in years and months.","searchText":"age difference calculator  age difference calculator estimate the age difference between two birth dates in years and months. date & time"},{"title":"Countdown Calculator","url":"/countdown-calculator","category":"Date & Time","description":"Count the days remaining until a future date with a simple countdown calculator for events, deadlines, and milestones.","searchText":"countdown calculator  countdown calculator count the days remaining until a future date with a simple countdown calculator for events, deadlines, and milestones. date & time"},{"title":"Date Add Calculator","url":"/date-add-calculator","category":"Date & Time","description":"Add days to a date to estimate a future deadline or milestone.","searchText":"date add calculator  date add calculator add days to a date to estimate a future deadline or milestone. date & time"},{"title":"Date Difference Calculator","url":"/date-difference","category":"Date & Time","description":"Calculate the number of days between two dates.","searchText":"date difference calculator  date difference calculate the number of days between two dates. date & time"},{"title":"Days Between Dates Calculator","url":"/days-between-dates-calculator","category":"Date & Time","description":"Calculate the number of days between two dates instantly with CalculatorWorks. Includes formula, worked examples, and a simple date difference calculator.","searchText":"days between dates calculator  days between dates calculator calculate the number of days between two dates instantly with calculatorworks. includes formula, worked examples, and a simple date difference calculator. date & time"},{"title":"Hours Between Dates Calculator","url":"/hours-between-dates-calculator","category":"Date & Time","description":"Count the number of hours between two date-and-time values.","searchText":"hours between dates calculator  hours between dates calculator count the number of hours between two date-and-time values. date & time"},{"title":"Square Footage Calculator","url":"/square-footage-calculator","category":"Date & Time","description":"Calculate square footage from room length and width for flooring, paint, furniture, and renovation planning.","searchText":"square footage calculator  square footage calculator calculate square footage from room length and width for flooring, paint, furniture, and renovation planning. date & time"},{"title":"Time Card Calculator","url":"/time-card-calculator","category":"Date & Time","description":"Estimate paid hours from start time, end time, break length and number of work days.","searchText":"time card calculator  time card calculator estimate paid hours from start time, end time, break length and number of work days. date & time"},{"title":"Week Number Calculator","url":"/week-number-calculator","category":"Date & Time","description":"Find the ISO week number for a selected date.","searchText":"week number calculator  week number calculator find the iso week number for a selected date. date & time"},{"title":"Weeks Between Dates Calculator","url":"/weeks-between-dates-calculator","category":"Date & Time","description":"Convert the time span between two dates into weeks for schedules, planning, pregnancy, and project timing.","searchText":"weeks between dates calculator  weeks between dates calculator convert the time span between two dates into weeks for schedules, planning, pregnancy, and project timing. date & time"},{"title":"ARM vs Fixed Mortgage Calculator","url":"/arm-vs-fixed-mortgage-calculator","category":"Finance","description":"Compare an adjustable-rate mortgage estimate with a fixed-rate mortgage estimate.","searchText":"arm vs fixed mortgage calculator  arm vs fixed mortgage calculator compare an adjustable-rate mortgage estimate with a fixed-rate mortgage estimate. finance"},{"title":"Auto Loan Calculator","url":"/auto-loan","category":"Finance","description":"Estimate a car loan payment using vehicle price, deposit, interest rate, and loan term.","searchText":"auto loan calculator  auto loan estimate a car loan payment using vehicle price, deposit, interest rate, and loan term. finance"},{"title":"Biweekly Mortgage Calculator","url":"/biweekly-mortgage-calculator","category":"Finance","description":"Estimate biweekly mortgage payments and compare them with standard monthly payments.","searchText":"biweekly mortgage calculator  biweekly mortgage calculator estimate biweekly mortgage payments and compare them with standard monthly payments. finance"},{"title":"Commission Calculator","url":"/commission-calculator","category":"Finance","description":"Use the free commission calculator to work out sales commission, commission amount, and total pay including optional base salary. Includes formula, examples, and FAQ.","searchText":"commission calculator  commission calculator use the free commission calculator to work out sales commission, commission amount, and total pay including optional base salary. includes formula, examples, and faq. finance"},{"title":"Compound Interest Calculator","url":"/compound-interest-calculator","category":"Finance","description":"Calculate compound interest growth, interest earned, and final balance with the free Compound Interest Calculator from CalculatorWorks.","searchText":"compound interest calculator  compound interest calculator calculate compound interest growth, interest earned, and final balance with the free compound interest calculator from calculatorworks. finance"},{"title":"Credit Card Payoff Calculator","url":"/credit-card-payoff","category":"Finance","description":"Estimate how long it may take to pay off a card balance and how much interest could be paid.","searchText":"credit card payoff calculator  credit card payoff estimate how long it may take to pay off a card balance and how much interest could be paid. finance"},{"title":"Credit Utilization Calculator","url":"/credit-utilization-calculator","category":"Finance","description":"Estimate credit utilization from combined revolving balances and total credit limits.","searchText":"credit utilization calculator  credit utilization calculator estimate credit utilization from combined revolving balances and total credit limits. finance"},{"title":"Debt Avalanche Calculator","url":"/debt-avalanche-calculator","category":"Finance","description":"Estimate debt payoff time when prioritising higher-interest debt with a fixed monthly payment.","searchText":"debt avalanche calculator  debt avalanche calculator estimate debt payoff time when prioritising higher-interest debt with a fixed monthly payment. finance"},{"title":"Debt Payoff Calculator","url":"/debt-payoff-calculator","category":"Finance","description":"Estimate payoff time and total interest for a balance with a fixed monthly payment.","searchText":"debt payoff calculator  debt payoff calculator estimate payoff time and total interest for a balance with a fixed monthly payment. finance"},{"title":"Debt Snowball Calculator","url":"/debt-snowball","category":"Finance","description":"Estimate payoff time for a fixed debt payment.","searchText":"debt snowball calculator  debt snowball estimate payoff time for a fixed debt payment. finance"},{"title":"Debt-to-Income Calculator","url":"/debt-to-income","category":"Finance","description":"Compare monthly debt payments with gross monthly income.","searchText":"debt-to-income calculator  debt to income compare monthly debt payments with gross monthly income. finance"},{"title":"Down Payment Calculator","url":"/down-payment","category":"Finance","description":"Work out a down payment amount, down payment percentage, and remaining loan size from a home purchase price.","searchText":"down payment calculator  down payment work out a down payment amount, down payment percentage, and remaining loan size from a home purchase price. finance"},{"title":"Extra Payment Mortgage Calculator","url":"/extra-payment-mortgage","category":"Finance","description":"Estimate interest savings from extra mortgage payments.","searchText":"extra payment mortgage calculator  extra payment mortgage estimate interest savings from extra mortgage payments. finance"},{"title":"FIRE Calculator","url":"/fire-calculator","category":"Finance","description":"Estimate a simple financial independence target from annual expenses and a withdrawal-rate assumption.","searchText":"fire calculator  fire calculator estimate a simple financial independence target from annual expenses and a withdrawal-rate assumption. finance"},{"title":"Hourly to Salary Calculator","url":"/hourly-to-salary-calculator","category":"Finance","description":"Convert an hourly rate into weekly, monthly, and annual pay using hours per week.","searchText":"hourly to salary calculator  hourly to salary calculator convert an hourly rate into weekly, monthly, and annual pay using hours per week. finance"},{"title":"How Compound Interest Works","url":"/how-compound-interest-works","category":"Finance","description":"Learn how compound interest works, including formulas, examples, and long-term investing concepts.","searchText":"how compound interest works  how compound interest works learn how compound interest works, including formulas, examples, and long-term investing concepts. finance"},{"title":"How Investment Growth Works","url":"/how-investment-growth-works","category":"Finance","description":"Learn how investment growth works including compounding, diversification, long-term investing, and risk management.","searchText":"how investment growth works  how investment growth works learn how investment growth works including compounding, diversification, long-term investing, and risk management. finance"},{"title":"How Loan Interest Works","url":"/how-loan-interest-works","category":"Finance","description":"Learn how loan interest works, including APR, repayment structures, amortization, and borrowing costs.","searchText":"how loan interest works  how loan interest works learn how loan interest works, including apr, repayment structures, amortization, and borrowing costs. finance"},{"title":"How Mortgage Amortization Works","url":"/how-mortgage-amortization-works","category":"Finance","description":"Learn how mortgage amortization works including interest allocation and principal reduction.","searchText":"how mortgage amortization works  how mortgage amortization works learn how mortgage amortization works including interest allocation and principal reduction. finance"},{"title":"Inflation Calculator","url":"/inflation-calculator","category":"Finance","description":"Estimate the future cost of goods and services after inflation. Includes inflation formula, purchasing power explanation, examples, planning tips, and finance calculator links.","searchText":"inflation calculator  inflation calculator estimate the future cost of goods and services after inflation. includes inflation formula, purchasing power explanation, examples, planning tips, and finance calculator links. finance"},{"title":"Investment Return Calculator","url":"/investment-return-calculator","category":"Finance","description":"Estimate future investment value, total contributions, and growth from a starting amount, annual return, and time period.","searchText":"investment return calculator  investment return calculator estimate future investment value, total contributions, and growth from a starting amount, annual return, and time period. finance"},{"title":"Loan Payment Calculator","url":"/loan-payment","category":"Finance","description":"Estimate monthly loan repayments, total repayment, and interest from amount, rate, and term.","searchText":"loan payment calculator  loan payment estimate monthly loan repayments, total repayment, and interest from amount, rate, and term. finance"},{"title":"Loan Repayment Calculator","url":"/loan-repayment-calculator","category":"Finance","description":"Use the free loan repayment calculator to estimate monthly loan payments with amortisation formula examples, planning tips, and related mortgage and savings tools.","searchText":"loan repayment calculator  loan repayment calculator use the free loan repayment calculator to estimate monthly loan payments with amortisation formula examples, planning tips, and related mortgage and savings tools. finance"},{"title":"Mortgage Affordability Calculator","url":"/mortgage-affordability-calculator","category":"Finance","description":"Estimate an affordable home price from a monthly mortgage budget, interest rate, loan term and down payment.","searchText":"mortgage affordability calculator  mortgage affordability calculator estimate an affordable home price from a monthly mortgage budget, interest rate, loan term and down payment. finance"},{"title":"Mortgage Amortization Calculator","url":"/mortgage-amortization","category":"Finance","description":"Estimate principal, interest, and total mortgage cost.","searchText":"mortgage amortization calculator  mortgage amortization estimate principal, interest, and total mortgage cost. finance"},{"title":"Mortgage Calculator","url":"/mortgage-calculator","category":"Finance","description":"Estimate monthly mortgage repayments from loan amount, interest rate, and loan term.","searchText":"mortgage calculator  mortgage calculator estimate monthly mortgage repayments from loan amount, interest rate, and loan term. finance"},{"title":"Mortgage Interest Calculator","url":"/mortgage-interest-calculator","category":"Finance","description":"Estimate total mortgage interest over the life of a loan.","searchText":"mortgage interest calculator  mortgage interest calculator estimate total mortgage interest over the life of a loan. finance"},{"title":"Mortgage Payoff Calculator","url":"/mortgage-payoff-calculator","category":"Finance","description":"Estimate how long it may take to pay off a mortgage with a chosen monthly payment.","searchText":"mortgage payoff calculator  mortgage payoff calculator estimate how long it may take to pay off a mortgage with a chosen monthly payment. finance"},{"title":"Mortgage Tools and Calculators","url":"/mortgage-tools","category":"Finance","description":"Compare mortgage payments, affordability, refinance savings, amortization, extra repayments, down payments, DTI and rent-vs-buy scenarios.","searchText":"mortgage tools and calculators  mortgage tools compare mortgage payments, affordability, refinance savings, amortization, extra repayments, down payments, dti and rent-vs-buy scenarios. finance"},{"title":"Net Worth Calculator","url":"/net-worth-calculator","category":"Finance","description":"Estimate net worth by subtracting liabilities from assets.","searchText":"net worth calculator  net worth calculator estimate net worth by subtracting liabilities from assets. finance"},{"title":"Offset Account Savings Calculator","url":"/offset-account-savings","category":"Finance","description":"Estimate simple mortgage offset interest savings.","searchText":"offset account savings calculator  offset account savings estimate simple mortgage offset interest savings. finance"},{"title":"Overtime Calculator","url":"/overtime-calculator","category":"Finance","description":"Estimate gross weekly pay when hours above 40 use an overtime multiplier.","searchText":"overtime calculator  overtime calculator estimate gross weekly pay when hours above 40 use an overtime multiplier. finance"},{"title":"Paycheck Calculator","url":"/paycheck-calculator","category":"Finance","description":"Estimate gross and post-tax pay per pay period from annual salary, pay periods, and a flat tax rate.","searchText":"paycheck calculator  paycheck calculator estimate gross and post-tax pay per pay period from annual salary, pay periods, and a flat tax rate. finance"},{"title":"Paycheck Estimator","url":"/paycheck-estimator-calculator","category":"Finance","description":"Estimate take-home pay after taxes and deductions.","searchText":"paycheck estimator  paycheck estimator calculator estimate take-home pay after taxes and deductions. finance"},{"title":"Refinance Calculator","url":"/refinance-calculator","category":"Finance","description":"Estimate refinance savings, new monthly payment, and break-even time from loan balance, rates, terms, and closing costs. Includes examples, decision factors, and mortgage planning links.","searchText":"refinance calculator  refinance calculator estimate refinance savings, new monthly payment, and break-even time from loan balance, rates, terms, and closing costs. includes examples, decision factors, and mortgage planning links. finance"},{"title":"Refinance Savings Calculator","url":"/refinance-savings","category":"Finance","description":"Compare current and new loan payments to estimate monthly refinance savings.","searchText":"refinance savings calculator  refinance savings compare current and new loan payments to estimate monthly refinance savings. finance"},{"title":"Retirement Savings Calculator","url":"/retirement-savings-calculator","category":"Finance","description":"Estimate future retirement savings from a starting balance, annual return, and time horizon. Includes examples, retirement planning context, inflation notes, and related finance calculators.","searchText":"retirement savings calculator  retirement savings calculator estimate future retirement savings from a starting balance, annual return, and time horizon. includes examples, retirement planning context, inflation notes, and related finance calculators. finance"},{"title":"Salary and Pay Calculators","url":"/salary-pay-calculators","category":"Finance","description":"Convert salary, hourly pay, overtime, commission, pay raises, contractor rates and leave payout estimates with one connected pay calculator hub.","searchText":"salary and pay calculators  salary pay calculators convert salary, hourly pay, overtime, commission, pay raises, contractor rates and leave payout estimates with one connected pay calculator hub. finance"},{"title":"Salary Calculator","url":"/salary-calculator","category":"Finance","description":"Convert annual salary into monthly, fortnightly, weekly, and hourly pay estimates with the free Salary Calculator from CalculatorWorks.","searchText":"salary calculator  salary calculator convert annual salary into monthly, fortnightly, weekly, and hourly pay estimates with the free salary calculator from calculatorworks. finance"},{"title":"Salary to Hourly Calculator","url":"/salary-to-hourly-calculator","category":"Finance","description":"Convert an annual salary into an estimated hourly rate.","searchText":"salary to hourly calculator  salary to hourly calculator convert an annual salary into an estimated hourly rate. finance"},{"title":"Savings Calculator","url":"/savings-calculator","category":"Finance","description":"Use the free savings calculator to estimate future balance and interest earned from a starting amount, annual rate, and savings term with examples and FAQs.","searchText":"savings calculator  savings calculator use the free savings calculator to estimate future balance and interest earned from a starting amount, annual rate, and savings term with examples and faqs. finance"},{"title":"Savings Goal Calculator","url":"/savings-goal","category":"Finance","description":"Calculate the monthly saving needed to reach a target by a deadline.","searchText":"savings goal calculator  savings goal calculate the monthly saving needed to reach a target by a deadline. finance"},{"title":"Simple Interest Calculator","url":"/simple-interest-calculator","category":"Finance","description":"Calculate simple interest, total interest, and final balance from principal, annual rate, and time. Includes formula, examples, use cases, limitations, and related finance calculators.","searchText":"simple interest calculator  simple interest calculator calculate simple interest, total interest, and final balance from principal, annual rate, and time. includes formula, examples, use cases, limitations, and related finance calculators. finance"},{"title":"Understanding Credit Card Interest","url":"/understanding-credit-card-interest","category":"Finance","description":"Learn how credit card interest works including APR and repayment strategies.","searchText":"understanding credit card interest  understanding credit card interest learn how credit card interest works including apr and repayment strategies. finance"},{"title":"Understanding Interest Rates","url":"/understanding-interest-rates","category":"Finance","description":"General educational information about interest rates, borrowing costs, savings returns, and financial calculations.","searchText":"understanding interest rates  understanding interest rates general educational information about interest rates, borrowing costs, savings returns, and financial calculations. finance"},{"title":"Understanding Investment Risk","url":"/understanding-investment-risk","category":"Finance","description":"General educational information about investment risk, market volatility, diversification, and long-term investing concepts.","searchText":"understanding investment risk  understanding investment risk general educational information about investment risk, market volatility, diversification, and long-term investing concepts. finance"},{"title":"Understanding Loan Repayments","url":"/understanding-loan-repayments","category":"Finance","description":"General educational information about loan repayments, amortization, principal, interest, and repayment schedules.","searchText":"understanding loan repayments  understanding loan repayments general educational information about loan repayments, amortization, principal, interest, and repayment schedules. finance"},{"title":"Understanding Mortgage Repayments","url":"/understanding-mortgage-repayments","category":"Finance","description":"Learn how mortgage repayments work, including interest, loan terms, refinancing, and repayment calculations.","searchText":"understanding mortgage repayments  understanding mortgage repayments learn how mortgage repayments work, including interest, loan terms, refinancing, and repayment calculations. finance"},{"title":"BMI Calculator","url":"/bmi-calculator","category":"Health","description":"Calculate your Body Mass Index (BMI) instantly with CalculatorWorks. Includes formula, weight category ranges, worked examples, and a simple BMI calculator.","searchText":"bmi calculator  bmi calculator calculate your body mass index (bmi) instantly with calculatorworks. includes formula, weight category ranges, worked examples, and a simple bmi calculator. health"},{"title":"BMR Calculator","url":"/bmr-calculator","category":"Health","description":"Estimate basal metabolic rate using weight, height, age and sex adjustment.","searchText":"bmr calculator  bmr calculator estimate basal metabolic rate using weight, height, age and sex adjustment. health"},{"title":"Body Fat Calculator","url":"/body-fat-calculator","category":"Health","description":"Estimate body fat percentage from common circumference measurements for general fitness planning.","searchText":"body fat calculator  body fat calculator estimate body fat percentage from common circumference measurements for general fitness planning. health"},{"title":"Body Surface Area Calculator","url":"/body-surface-area-calculator","category":"Health","description":"Estimate body surface area from height and weight.","searchText":"body surface area calculator  body surface area calculator estimate body surface area from height and weight. health"},{"title":"Calorie Calculator","url":"/calorie-calculator","category":"Health","description":"Estimate daily maintenance calories using weight, height, age, sex and activity level.","searchText":"calorie calculator  calorie calculator estimate daily maintenance calories using weight, height, age, sex and activity level. health"},{"title":"Calorie Deficit Calculator","url":"/calorie-deficit-calculator","category":"Health","description":"Estimate a calorie target from maintenance calories and desired deficit.","searchText":"calorie deficit calculator  calorie deficit calculator estimate a calorie target from maintenance calories and desired deficit. health"},{"title":"Due Date Calculator","url":"/due-date-calculator","category":"Health","description":"Estimate a due date from the first day of the last menstrual period.","searchText":"due date calculator  due date calculator estimate a due date from the first day of the last menstrual period. health"},{"title":"How BMI Is Calculated","url":"/how-bmi-is-calculated","category":"Health","description":"Learn how BMI is calculated, what Body Mass Index means, BMI categories, and the limitations of BMI measurements.","searchText":"how bmi is calculated  how bmi is calculated learn how bmi is calculated, what body mass index means, bmi categories, and the limitations of bmi measurements. health"},{"title":"Ideal Weight Calculator","url":"/ideal-weight-calculator","category":"Health","description":"Estimate a guideline weight from height using the Devine method with an optional frame adjustment.","searchText":"ideal weight calculator  ideal weight calculator estimate a guideline weight from height using the devine method with an optional frame adjustment. health"},{"title":"Lean Body Mass Calculator","url":"/lean-body-mass-calculator","category":"Health","description":"Estimate lean body mass from body weight and body fat percentage.","searchText":"lean body mass calculator  lean body mass calculator estimate lean body mass from body weight and body fat percentage. health"},{"title":"Ovulation Calculator","url":"/ovulation-calculator","category":"Health","description":"Estimate the next ovulation date from the first day of the last period and average cycle length.","searchText":"ovulation calculator  ovulation calculator estimate the next ovulation date from the first day of the last period and average cycle length. health"},{"title":"Pace Calculator","url":"/pace-calculator","category":"Health","description":"Calculate average pace per kilometre from distance and total time in minutes.","searchText":"pace calculator  pace calculator calculate average pace per kilometre from distance and total time in minutes. health"},{"title":"Protein Intake Calculator","url":"/protein-intake-calculator","category":"Health","description":"Estimate a daily protein target from body weight and a grams-per-kilogram target.","searchText":"protein intake calculator  protein intake calculator estimate a daily protein target from body weight and a grams-per-kilogram target. health"},{"title":"TDEE Calculator","url":"/tdee-calculator","category":"Health","description":"Estimate total daily energy expenditure from weight, height, age, sex and activity level.","searchText":"tdee calculator  tdee calculator estimate total daily energy expenditure from weight, height, age, sex and activity level. health"},{"title":"Water Intake Calculator","url":"/water-intake-calculator","category":"Health","description":"Estimate daily water intake from body weight and activity.","searchText":"water intake calculator  water intake calculator estimate daily water intake from body weight and activity. health"},{"title":"Weighted Average Calculator","url":"/weighted-average-calculator","category":"Health","description":"Calculate a weighted average from comma-separated values and weights.","searchText":"weighted average calculator  weighted average calculator calculate a weighted average from comma-separated values and weights. health"},{"title":"Asphalt Calculator","url":"/asphalt-calculator","category":"Household","description":"Estimate asphalt volume from area and depth.","searchText":"asphalt calculator  asphalt calculator estimate asphalt volume from area and depth. household"},{"title":"Brick Calculator","url":"/brick-calculator","category":"Household","description":"Estimate bricks required from wall area and brick coverage.","searchText":"brick calculator  brick calculator estimate bricks required from wall area and brick coverage. household"},{"title":"Concrete Calculator","url":"/concrete-calculator","category":"Household","description":"Estimate cubic metres of concrete for a rectangular slab.","searchText":"concrete calculator  concrete calculator estimate cubic metres of concrete for a rectangular slab. household"},{"title":"Cubic Yard Calculator","url":"/cubic-yard-calculator","category":"Household","description":"Estimate cubic yards from length, width and depth in feet.","searchText":"cubic yard calculator  cubic yard calculator estimate cubic yards from length, width and depth in feet. household"},{"title":"Fence Calculator","url":"/fence-calculator","category":"Household","description":"Estimate fence panels and posts from total fence length, panel width and post spacing.","searchText":"fence calculator  fence calculator estimate fence panels and posts from total fence length, panel width and post spacing. household"},{"title":"Flooring Calculator","url":"/flooring-calculator","category":"Household","description":"Estimate room area and waste-adjusted flooring requirement.","searchText":"flooring calculator  flooring calculator estimate room area and waste-adjusted flooring requirement. household"},{"title":"Gravel Calculator","url":"/gravel-calculator","category":"Household","description":"Estimate gravel volume from area and depth.","searchText":"gravel calculator  gravel calculator estimate gravel volume from area and depth. household"},{"title":"Mulch Calculator","url":"/mulch-calculator","category":"Household","description":"Estimate mulch volume from garden-bed area and depth.","searchText":"mulch calculator  mulch calculator estimate mulch volume from garden-bed area and depth. household"},{"title":"Paint Calculator","url":"/paint-calculator","category":"Household","description":"Estimate paint needed from wall area and coverage per litre.","searchText":"paint calculator  paint calculator estimate paint needed from wall area and coverage per litre. household"},{"title":"Paver Calculator","url":"/paver-calculator","category":"Household","description":"Estimate number of pavers needed from area and paver size.","searchText":"paver calculator  paver calculator estimate number of pavers needed from area and paver size. household"},{"title":"Roofing Calculator","url":"/roofing-calculator","category":"Household","description":"Estimate roof area and material allowance from building length, width, roof pitch factor and waste percentage.","searchText":"roofing calculator  roofing calculator estimate roof area and material allowance from building length, width, roof pitch factor and waste percentage. household"},{"title":"Room Perimeter Calculator","url":"/room-perimeter-calculator","category":"Household","description":"Calculate room perimeter from length and width for painting, skirting, trim, flooring, and renovation planning.","searchText":"room perimeter calculator  room perimeter calculator calculate room perimeter from length and width for painting, skirting, trim, flooring, and renovation planning. household"},{"title":"Tile Calculator","url":"/tile-calculator","category":"Household","description":"Estimate tile quantity from total area and tile dimensions.","searchText":"tile calculator  tile calculator estimate tile quantity from total area and tile dimensions. household"},{"title":"Topsoil Calculator","url":"/topsoil-calculator","category":"Household","description":"Estimate topsoil volume from area and depth.","searchText":"topsoil calculator  topsoil calculator estimate topsoil volume from area and depth. household"},{"title":"Average Calculator","url":"/average-calculator","category":"Math","description":"Calculate the average (mean) of a set of numbers instantly with CalculatorWorks. Includes formula, worked examples, and a simple average calculator.","searchText":"average calculator  average calculator calculate the average (mean) of a set of numbers instantly with calculatorworks. includes formula, worked examples, and a simple average calculator. math"},{"title":"GPA Calculator","url":"/gpa-calculator","category":"Math","description":"Calculate GPA from letter grades or grade points with optional course credits using the free GPA Calculator from CalculatorWorks.","searchText":"gpa calculator  gpa calculator calculate gpa from letter grades or grade points with optional course credits using the free gpa calculator from calculatorworks. math"},{"title":"Median Calculator","url":"/median-calculator","category":"Math","description":"Find the median of a comma-separated list of numbers.","searchText":"median calculator  median calculator find the median of a comma-separated list of numbers. math"},{"title":"Midpoint Calculator","url":"/midpoint-calculator","category":"Math","description":"Calculate the midpoint between two coordinate points entered as x,y pairs.","searchText":"midpoint calculator  midpoint calculator calculate the midpoint between two coordinate points entered as x,y pairs. math"},{"title":"Mode Calculator","url":"/mode-calculator","category":"Math","description":"Find the most frequent value in a comma-separated list of numbers.","searchText":"mode calculator  mode calculator find the most frequent value in a comma-separated list of numbers. math"},{"title":"Slope Calculator","url":"/slope-calculator","category":"Math","description":"Calculate slope between two coordinate points entered as x,y pairs.","searchText":"slope calculator  slope calculator calculate slope between two coordinate points entered as x,y pairs. math"},{"title":"Standard Deviation Calculator","url":"/standard-deviation-calculator","category":"Math","description":"Estimate population standard deviation from a list of numbers.","searchText":"standard deviation calculator  standard deviation calculator estimate population standard deviation from a list of numbers. math"},{"title":"Discount Calculator","url":"/discount-calculator","category":"Percentage","description":"Use the free discount calculator to find sale price, amount saved, and percentage-off results with simple formulas, examples, and related percentage tools.","searchText":"discount calculator  discount calculator use the free discount calculator to find sale price, amount saved, and percentage-off results with simple formulas, examples, and related percentage tools. percentage"},{"title":"Percent Change Calculator","url":"/percent-change-calculator","category":"Percentage","description":"Calculate percent change between two values instantly with CalculatorWorks. Includes formula, examples, and a simple percent change calculator.","searchText":"percent change calculator  percent change calculator calculate percent change between two values instantly with calculatorworks. includes formula, examples, and a simple percent change calculator. percentage"},{"title":"Percentage Calculator","url":"/percentage-calculator","category":"Percentage","description":"Percentage calculator with formulas, worked examples, and percentage explanations.","searchText":"percentage calculator  percentage calculator percentage calculator with formulas, worked examples, and percentage explanations. percentage"},{"title":"Percentage Decrease Calculator","url":"/percentage-decrease","category":"Percentage","description":"Calculate the percentage decrease from one value to another.","searchText":"percentage decrease calculator  percentage decrease calculate the percentage decrease from one value to another. percentage"},{"title":"Percentage Increase Calculator","url":"/percentage-increase","category":"Percentage","description":"Calculate the percentage increase from one value to another.","searchText":"percentage increase calculator  percentage increase calculate the percentage increase from one value to another. percentage"},{"title":"Tip Calculator","url":"/tip-calculator","category":"Percentage","description":"Calculate tips, total bill amounts, and per-person splits instantly with the free Tip Calculator from CalculatorWorks.","searchText":"tip calculator  tip calculator calculate tips, total bill amounts, and per-person splits instantly with the free tip calculator from calculatorworks. percentage"},{"title":"Understanding Percentage Change","url":"/understanding-percentage-change","category":"Percentage","description":"Learn how percentage increase and percentage decrease calculations work with formulas and examples.","searchText":"understanding percentage change  understanding percentage change learn how percentage increase and percentage decrease calculations work with formulas and examples. percentage"},{"title":"About CalculatorWorks","url":"/about","category":"Site page","description":"Learn about CalculatorWorks, its purpose, editorial approach, calculator methodology, and educational mission.","searchText":"about calculatorworks  about learn about calculatorworks, its purpose, editorial approach, calculator methodology, and educational mission. site page"},{"title":"Calculator Guides & Educational Resources","url":"/guides","category":"Site page","description":"Educational calculator guides covering finance, mortgages, loans, interest, percentages, BMI, budgeting, and general planning concepts.","searchText":"calculator guides & educational resources  guides educational calculator guides covering finance, mortgages, loans, interest, percentages, bmi, budgeting, and general planning concepts. site page"},{"title":"Calculator Methodology","url":"/calculator-methodology","category":"Site page","description":"General information about CalculatorWorks calculation methodologies and educational calculator principles.","searchText":"calculator methodology  calculator methodology general information about calculatorworks calculation methodologies and educational calculator principles. site page"},{"title":"Contact CalculatorWorks","url":"/contact","category":"Site page","description":"Use this page for CalculatorWorks feedback, correction requests, calculator suggestions, and general website enquiries.","searchText":"contact calculatorworks  contact use this page for calculatorworks feedback, correction requests, calculator suggestions, and general website enquiries. site page"},{"title":"Disclaimer","url":"/disclaimer","category":"Site page","description":"General disclaimer and educational-use policy for CalculatorWorks calculators, guides, and resources.","searchText":"disclaimer  disclaimer general disclaimer and educational-use policy for calculatorworks calculators, guides, and resources. site page"},{"title":"Editorial Policy","url":"/editorial-policy","category":"Site page","description":"CalculatorWorks editorial standards, methodology principles, and educational content policy.","searchText":"editorial policy  editorial policy calculatorworks editorial standards, methodology principles, and educational content policy. site page"},{"title":"Editorial Standards","url":"/editorial-standards","category":"Site page","description":"CalculatorWorks explains how calculators are written, reviewed, maintained, and presented for general guidance.","searchText":"editorial standards  editorial standards calculatorworks explains how calculators are written, reviewed, maintained, and presented for general guidance. site page"},{"title":"Financial Education Centre","url":"/financial-education-centre","category":"Site page","description":"General financial education resources covering calculators, interest, budgeting, borrowing, investment risk, and planning concepts.","searchText":"financial education centre  financial education centre general financial education resources covering calculators, interest, budgeting, borrowing, investment risk, and planning concepts. site page"},{"title":"Privacy Policy","url":"/privacy","category":"Site page","description":"CalculatorWorks privacy policy covering cookies, analytics, advertising, data handling, and user choices.","searchText":"privacy policy  privacy calculatorworks privacy policy covering cookies, analytics, advertising, data handling, and user choices. site page"},{"title":"Terms of Use","url":"/terms","category":"Site page","description":"Terms and conditions for using CalculatorWorks calculators, guides, and educational resources.","searchText":"terms of use  terms terms and conditions for using calculatorworks calculators, guides, and educational resources. site page"},{"title":"Understanding Budgeting","url":"/understanding-budgeting","category":"Site page","description":"General educational information about budgeting, savings goals, expenses, emergency funds, and financial planning concepts.","searchText":"understanding budgeting  understanding budgeting general educational information about budgeting, savings goals, expenses, emergency funds, and financial planning concepts. site page"},{"title":"Understanding Compound Growth","url":"/understanding-compound-growth","category":"Site page","description":"General educational information about compound growth, compounding frequency, savings, investing, and long-term estimates.","searchText":"understanding compound growth  understanding compound growth general educational information about compound growth, compounding frequency, savings, investing, and long-term estimates. site page"},{"title":"Understanding Financial Planning","url":"/understanding-financial-planning","category":"Site page","description":"General educational information about financial planning, borrowing, saving, goals, retirement, and risk concepts.","searchText":"understanding financial planning  understanding financial planning general educational information about financial planning, borrowing, saving, goals, retirement, and risk concepts. site page"}];

function normaliseQuery(value) {
  return String(value || '').toLowerCase().trim();
}

function scoreItem(item, q) {
  if (!q) return 1;
  const title = item.title.toLowerCase();
  const category = item.category.toLowerCase();
  const haystack = item.searchText || '';
  let score = 0;

  if (title === q) score += 100;
  if (title.startsWith(q)) score += 70;
  if (title.includes(q)) score += 45;
  if (category.includes(q)) score += 25;

  const terms = q.split(/\s+/).filter(Boolean);
  terms.forEach(term => {
    if (title.includes(term)) score += 18;
    if (haystack.includes(term)) score += 6;
  });

  return score;
}

function cleanTitle(title) {
  return String(title || 'Calculator').replace(/\s*\|\s*CalculatorWorks\s*$/i, '').trim();
}

function ensureSearchButton() {
  const nav = document.querySelector('.main-nav') || document.querySelector('nav');
  if (!nav) return null;

  let trigger = document.querySelector('[data-cw-search-trigger]');
  if (!trigger) {
    trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'search-trigger';
    trigger.setAttribute('data-cw-search-trigger', 'true');
    trigger.setAttribute('aria-label', 'Search calculators');
    trigger.textContent = 'Search Calculators';
    nav.appendChild(trigger);
  }
  return trigger;
}

function ensureOverlay() {
  let overlay = document.getElementById('cwGlobalSearchOverlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'cwGlobalSearchOverlay';
    overlay.className = 'global-search-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    overlay.innerHTML = `
      <div class="global-search-panel" role="dialog" aria-modal="true" aria-label="Search calculators">
        <div class="global-search-top">
          <input type="search" id="globalCalculatorSearch" autocomplete="off" placeholder="Search mortgage, percentage, BMI, salary, loan..." aria-label="Search calculators">
        </div>
        <div class="search-results" id="cwSearchResults"></div>
      </div>
    `;

    document.body.appendChild(overlay);
  }

  return overlay;
}

function renderResults(query) {
  const results = document.getElementById('cwSearchResults');
  if (!results) return;

  const q = normaliseQuery(query);

  let matches = CW_SEARCH_INDEX
    .map(item => ({ item, score: scoreItem(item, q) }))
    .filter(row => !q || row.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, 80)
    .map(row => row.item);

  if (!matches.length) {
    results.innerHTML = `
      <div class="search-result-item" role="status">
        <span class="search-result-title">No calculators found</span>
        <span class="search-result-description">Try a broader search such as mortgage, loan, salary, percentage, BMI, savings, or conversion.</span>
      </div>
    `;
    return;
  }

  results.innerHTML = matches.map(item => `
    <a class="search-result-item" href="${item.url}">
      <span class="search-result-title">${cleanTitle(item.title)}</span>
      <span class="search-result-description">${item.category}${item.description ? ' — ' + item.description : ''}</span>
    </a>
  `).join('');
}

function openSearch() {
  const overlay = ensureOverlay();
  const input = overlay.querySelector('#globalCalculatorSearch');

  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');

  renderResults(input ? input.value : '');

  if (input) {
    setTimeout(() => input.focus(), 0);
  }
}

function closeSearch() {
  const overlay = document.getElementById('cwGlobalSearchOverlay');
  if (!overlay) return;

  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
}

function initReliableSearch() {
  const trigger = ensureSearchButton();
  const overlay = ensureOverlay();
  const input = overlay.querySelector('#globalCalculatorSearch');

  if (trigger && !trigger.dataset.cwSearchReady) {
    trigger.dataset.cwSearchReady = 'true';
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      openSearch();
    });
  }

  if (input && !input.dataset.cwSearchReady) {
    input.dataset.cwSearchReady = 'true';
    input.addEventListener('input', function() {
      renderResults(input.value);
    });

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeSearch();
      }
    });
  }

  if (!overlay.dataset.cwSearchReady) {
    overlay.dataset.cwSearchReady = 'true';
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeSearch();
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeSearch();

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
  });

  renderResults('');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReliableSearch);
} else {
  initReliableSearch();
}

})();

/* ===== CalculatorWorks Formula & Button Assurance Layer ===== */

(function(){
'use strict';

function $(id){ return document.getElementById(id); }

function currentPageKey(){
  const part = window.location.pathname.split('/').filter(Boolean).pop() || 'index';
  return part.replace(/\.html$/,'') + '.html';
}

function pageBase(){
  return currentPageKey().replace(/\.html$/,'');
}

function text(id){
  const el = $(id);
  return el ? String(el.value || '').trim() : '';
}

function num(id){
  const v = parseFloat(text(id));
  return Number.isFinite(v) ? v : NaN;
}

function decimalOr(defaultValue){
  const el = $('decimals');
  if(!el) return defaultValue;
  const v = parseFloat(el.value);
  return Number.isFinite(v) ? v : defaultValue;
}

function out(message){
  const result = $('result');
  if(result) result.textContent = message;
}

function money(value){
  if(!Number.isFinite(value)) return '$0.00';
  return '$' + Number(value).toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2});
}

function format(value, places){
  const n = Number(value);
  if(!Number.isFinite(n)) return '0';
  return n.toFixed(Number.isFinite(places) ? places : 2);
}

function monthsToText(months){
  if(!Number.isFinite(months) || months < 0) return 'Not payable with these inputs';
  const rounded = Math.ceil(months);
  const years = Math.floor(rounded / 12);
  const rem = rounded % 12;
  if(years && rem) return years + ' years ' + rem + ' months';
  if(years) return years + ' years';
  return rem + ' months';
}

function loanPayment(principal, apr, years){
  const months = years * 12;
  const r = apr / 100 / 12;
  if(!Number.isFinite(principal) || !Number.isFinite(apr) || !Number.isFinite(years) || principal <= 0 || years <= 0) return NaN;
  if(r === 0) return principal / months;
  return principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
}

function payoff(balance, apr, monthlyPayment){
  const r = apr / 100 / 12;
  if(!Number.isFinite(balance) || !Number.isFinite(apr) || !Number.isFinite(monthlyPayment) || balance <= 0 || monthlyPayment <= 0) return null;
  if(monthlyPayment <= balance * r) return null;

  let months = 0;
  let interest = 0;
  let bal = balance;

  while(bal > 0 && months < 1200){
    const monthInterest = bal * r;
    const principal = Math.min(bal, monthlyPayment - monthInterest);
    if(principal <= 0) return null;
    bal -= principal;
    interest += monthInterest;
    months += 1;
  }

  return { months, interest };
}

function valuesForLoan(){
  const loan = Number.isFinite(num('loan')) ? num('loan') : num('feet');
  const rate = Number.isFinite(num('rate')) ? num('rate') : num('inches');
  const years = Number.isFinite(num('years')) ? num('years') : decimalOr(NaN);
  return { loan, rate, years };
}

function correctedMortgage(){
  const v = valuesForLoan();
  const p = loanPayment(v.loan, v.rate, v.years);
  if(!Number.isFinite(p)) return out('Enter loan amount, rate, and term.');
  const months = v.years * 12;
  out('Estimated monthly payment: ' + money(p) + ' • Total interest: ' + money(p * months - v.loan) + ' • Total paid: ' + money(p * months));
}

function correctedLoanRepayment(){
  const v = valuesForLoan();
  const p = loanPayment(v.loan, v.rate, v.years);
  if(!Number.isFinite(p)) return out('Enter loan amount, annual interest rate, and loan term.');
  const months = v.years * 12;
  out('Monthly payment: ' + money(p) + ' • Total interest: ' + money(p * months - v.loan) + ' • Total paid: ' + money(p * months));
}

function correctedCompound(){
  const principal = Number.isFinite(num('principal')) ? num('principal') : num('feet');
  const apr = Number.isFinite(num('rate')) ? num('rate') : num('inches');
  const years = Number.isFinite(num('years')) ? num('years') : decimalOr(NaN);
  const contribution = Number.isFinite(num('contribution')) ? num('contribution') : 0;

  if(!Number.isFinite(principal) || !Number.isFinite(apr) || !Number.isFinite(years) || years < 0) {
    return out('Enter principal, annual interest rate, and years.');
  }

  const months = Math.round(years * 12);
  const r = apr / 100 / 12;
  let balance = principal;
  let contributed = principal;

  for(let i = 0; i < months; i++){
    balance = balance * (1 + r) + contribution;
    contributed += contribution;
  }

  out('Estimated future value: ' + money(balance) + ' • Contributions: ' + money(contributed) + ' • Estimated growth: ' + money(balance - contributed));
}

function correctedSavings(){
  const principal = num('feet');
  const apr = num('inches');
  const years = decimalOr(NaN);

  if(!Number.isFinite(principal) || !Number.isFinite(apr) || !Number.isFinite(years) || years < 0) {
    return out('Enter starting amount, annual interest rate, and term.');
  }

  const balance = principal * Math.pow(1 + apr / 100, years);
  out('Estimated savings: ' + money(balance) + ' • Estimated interest: ' + money(balance - principal));
}

function correctedSavingsGoal(){
  const goal = num('feet');
  const current = num('inches');
  const monthly = decimalOr(NaN);
  if(!Number.isFinite(goal) || !Number.isFinite(current) || !Number.isFinite(monthly) || monthly <= 0) {
    return out('Enter goal, current savings, and monthly contribution.');
  }
  const remaining = goal - current;
  if(remaining <= 0) return out('Goal already reached.');
  out('Time to goal: ' + monthsToText(Math.ceil(remaining / monthly)) + ' • Remaining amount: ' + money(remaining));
}

function correctedCreditDebt(){
  const balance = Number.isFinite(num('balance')) ? num('balance') : num('feet');
  const apr = Number.isFinite(num('rate')) ? num('rate') : num('inches');
  const payment = Number.isFinite(num('payment')) ? num('payment') : decimalOr(NaN);
  const result = payoff(balance, apr, payment);
  if(!result) return out('Enter a payment greater than the monthly interest.');
  out('Estimated payoff: ' + monthsToText(result.months) + ' • Estimated interest: ' + money(result.interest) + ' • Estimated total paid: ' + money(balance + result.interest));
}

function correctedBMI(){
  const weight = Number.isFinite(num('weight')) ? num('weight') : num('feet');
  const heightCm = Number.isFinite(num('height')) ? num('height') : num('inches');
  const places = decimalOr(1);
  if(!Number.isFinite(weight) || !Number.isFinite(heightCm) || weight <= 0 || heightCm <= 0) {
    return out('Enter weight and height.');
  }
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  let category = 'Healthy weight range';
  if(bmi < 18.5) category = 'Underweight range';
  else if(bmi >= 30) category = 'Obesity range';
  else if(bmi >= 25) category = 'Overweight range';
  out('BMI: ' + bmi.toFixed(places) + ' • ' + category);
}

function correctedSalary(){
  const salary = Number.isFinite(num('salary')) ? num('salary') : num('feet');
  const hours = Number.isFinite(num('hours')) ? num('hours') : num('inches');
  const weeks = Number.isFinite(num('weeks')) ? num('weeks') : 52;
  if(!Number.isFinite(salary) || !Number.isFinite(hours) || !Number.isFinite(weeks) || salary <= 0 || hours <= 0 || weeks <= 0) {
    return out('Enter annual salary and weekly hours.');
  }
  const hourly = salary / (hours * weeks);
  out('Hourly equivalent: ' + money(hourly) + ' • Weekly: ' + money(salary / weeks) + ' • Monthly: ' + money(salary / 12));
}

function correctedPercentage(){
  const percentage = num('feet');
  const number = num('inches');
  const places = decimalOr(2);
  if(!Number.isFinite(percentage) || !Number.isFinite(number)) return out('Enter percentage and number.');
  out(percentage + '% of ' + number + ' = ' + format((percentage / 100) * number, places));
}

function correctedPercentChange(){
  const oldValue = num('feet');
  const newValue = num('inches');
  const places = decimalOr(2);
  if(!Number.isFinite(oldValue) || !Number.isFinite(newValue) || oldValue === 0) return out('Enter original and new values.');
  out('Percent change: ' + format(((newValue - oldValue) / oldValue) * 100, places) + '%');
}

function correctedPercentageIncrease(){
  const original = num('feet');
  const increase = num('inches');
  const places = decimalOr(2);
  if(!Number.isFinite(original) || !Number.isFinite(increase)) return out('Enter value and increase percentage.');
  out('Result: ' + format(original * (1 + increase / 100), places) + ' • Increase: ' + format(original * increase / 100, places));
}

function correctedPercentageDecrease(){
  const original = num('feet');
  const decrease = num('inches');
  const places = decimalOr(2);
  if(!Number.isFinite(original) || !Number.isFinite(decrease)) return out('Enter value and decrease percentage.');
  out('Result: ' + format(original * (1 - decrease / 100), places) + ' • Decrease: ' + format(original * decrease / 100, places));
}

function correctedDiscount(){
  const price = num('feet');
  const discount = num('inches');
  if(!Number.isFinite(price) || !Number.isFinite(discount)) return out('Enter price and discount.');
  out('Sale price: ' + money(price * (1 - discount / 100)) + ' • You save: ' + money(price * discount / 100));
}

function correctedMargin(){
  const revenue = num('feet');
  const cost = num('inches');
  if(!Number.isFinite(revenue) || !Number.isFinite(cost) || revenue <= 0) return out('Enter revenue and cost.');
  const profit = revenue - cost;
  out('Profit: ' + money(profit) + ' • Margin: ' + ((profit / revenue) * 100).toFixed(2) + '%');
}

function correctedMarkup(){
  const cost = num('feet');
  const markup = num('inches');
  if(!Number.isFinite(cost) || !Number.isFinite(markup)) return out('Enter cost and markup.');
  out('Selling price: ' + money(cost * (1 + markup / 100)) + ' • Markup amount: ' + money(cost * markup / 100));
}

function correctedSimpleInterest(){
  const principal = num('feet');
  const apr = num('inches');
  const years = decimalOr(NaN);
  if(!Number.isFinite(principal) || !Number.isFinite(apr) || !Number.isFinite(years)) return out('Enter principal, rate, and years.');
  const interest = principal * apr / 100 * years;
  out('Simple interest: ' + money(interest) + ' • Total: ' + money(principal + interest));
}

function correctedDownPayment(){
  const price = num('feet');
  const pct = num('inches');
  if(!Number.isFinite(price) || !Number.isFinite(pct) || price <= 0 || pct < 0) return out('Enter price and down payment percentage.');
  const down = pct > 100 ? pct : price * pct / 100;
  if(down > price) return out('Down payment cannot be greater than the purchase price.');
  out('Down payment: ' + money(down) + ' • Remaining loan: ' + money(price - down) + ' • Down payment percentage: ' + ((down / price) * 100).toFixed(2) + '%');
}

function correctedConversions(){
  const key = pageBase();
  const value = num('feet');
  const places = decimalOr(2);
  if(!Number.isFinite(value)) return out('Please enter a valid number.');

  const map = {
    'feet-to-metres': [0.3048, ' ft', ' m'],
    'metres-to-feet': [3.280839895, ' m', ' ft'],
    'cm-to-inches': [1/2.54, ' cm', ' inches'],
    'inches-to-cm': [2.54, ' inches', ' cm'],
    'kg-to-lb': [2.2046226218, ' kg', ' lb'],
    'lb-to-kg': [1/2.2046226218, ' lb', ' kg'],
    'km-to-miles': [0.6213711922, ' km', ' miles'],
    'miles-to-km': [1.609344, ' miles', ' km'],
    'celsius-to-fahrenheit': null,
    'fahrenheit-to-celsius': null
  };

  if(key === 'celsius-to-fahrenheit') return out(value + ' °C = ' + format((value * 9 / 5) + 32, places) + ' °F');
  if(key === 'fahrenheit-to-celsius') return out(value + ' °F = ' + format((value - 32) * 5 / 9, places) + ' °C');

  if(map[key]){
    out(value + map[key][1] + ' = ' + format(value * map[key][0], places) + map[key][2]);
  }
}

const fixedCalculators = {
  'mortgage-calculator': correctedMortgage,
  'loan-payment': correctedMortgage,
  'loan-repayment-calculator': correctedLoanRepayment,
  'mortgage-amortization-calculator': correctedLoanRepayment,
  'mortgage-interest-calculator': correctedLoanRepayment,
  'compound-interest-calculator': correctedCompound,
  'compound-interest': correctedCompound,
  'savings-calculator': correctedSavings,
  'savings-goal-calculator': correctedSavingsGoal,
  'credit-card-payoff-calculator': correctedCreditDebt,
  'debt-payoff-calculator': correctedCreditDebt,
  'debt-avalanche-calculator': correctedCreditDebt,
  'debt-snowball-calculator': correctedCreditDebt,
  'bmi-calculator': correctedBMI,
  'bmi': correctedBMI,
  'salary-calculator': correctedSalary,
  'salary-to-hourly-calculator': correctedSalary,
  'percentage-calculator': correctedPercentage,
  'percent-change-calculator': correctedPercentChange,
  'percentage-increase-calculator': correctedPercentageIncrease,
  'percentage-decrease-calculator': correctedPercentageDecrease,
  'discount-calculator': correctedDiscount,
  'margin-calculator': correctedMargin,
  'markup-calculator': correctedMarkup,
  'simple-interest-calculator': correctedSimpleInterest,
  'down-payment-calculator': correctedDownPayment,
  'feet-to-metres': correctedConversions,
  'metres-to-feet': correctedConversions,
  'cm-to-inches': correctedConversions,
  'inches-to-cm': correctedConversions,
  'kg-to-lb': correctedConversions,
  'lb-to-kg': correctedConversions,
  'km-to-miles': correctedConversions,
  'miles-to-km': correctedConversions,
  'celsius-to-fahrenheit': correctedConversions,
  'fahrenheit-to-celsius': correctedConversions
};

function correctedCalculate(){
  const key = pageBase();
  const fn = fixedCalculators[key];
  if(fn) fn();
}

function repairScenarioPayload(payload){
  if(!$('principal') && $('feet') && payload.principal !== undefined) payload.feet = payload.principal;
  if(!$('rate') && $('inches') && payload.rate !== undefined) payload.inches = payload.rate;
  if(!$('years') && $('decimals') && payload.years !== undefined) payload.decimals = payload.years;
  if(!$('loan') && $('feet') && payload.loan !== undefined) payload.feet = payload.loan;
  if(!$('payment') && $('decimals') && payload.payment !== undefined) payload.decimals = payload.payment;
  return payload;
}

function applyScenarioFixes(){
  document.querySelectorAll('[data-cw-scenario]').forEach(function(btn){
    if(btn.dataset.cwFormulaScenarioFixed) return;
    btn.dataset.cwFormulaScenarioFixed = 'true';

    btn.addEventListener('click', function(){
      let payload = {};
      try { payload = JSON.parse(btn.getAttribute('data-cw-scenario') || '{}'); } catch(e) { payload = {}; }
      payload = repairScenarioPayload(payload);

      Object.keys(payload).forEach(function(key){
        const input = $(key);
        if(input) input.value = payload[key];
      });

      setTimeout(correctedCalculate, 0);
    });
  });
}

function repairReset(){
  const reset = $('resetBtn');
  if(!reset || reset.dataset.cwFormulaResetFixed) return;
  reset.dataset.cwFormulaResetFixed = 'true';

  reset.addEventListener('click', function(){
    setTimeout(function(){
      const decimals = $('decimals');
      if(decimals && decimals.tagName && decimals.tagName.toLowerCase() === 'select'){
        const optionValues = Array.from(decimals.options || []).map(function(o){ return o.value; });
        if(optionValues.includes('2')) decimals.value = '2';
        else if(optionValues.includes('10')) decimals.value = '10';
        else if(decimals.options && decimals.options.length) decimals.value = decimals.options[0].value;
      }
      out('Enter values to begin');
    }, 0);
  });
}

function repairButtons(){
  const calculate = $('calculateBtn');
  if(calculate && !calculate.dataset.cwFormulaFixed){
    calculate.dataset.cwFormulaFixed = 'true';
    calculate.setAttribute('type', 'button');
    calculate.addEventListener('click', function(){
      setTimeout(correctedCalculate, 0);
    });
  }

  const reset = $('resetBtn');
  if(reset) reset.setAttribute('type', 'button');

  document.querySelectorAll('input, select').forEach(function(input){
    if(input.dataset.cwFormulaEnterFixed) return;
    input.dataset.cwFormulaEnterFixed = 'true';
    input.addEventListener('keydown', function(e){
      if(e.key === 'Enter') setTimeout(correctedCalculate, 0);
    });
  });

  repairReset();
  applyScenarioFixes();
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', repairButtons);
}else{
  repairButtons();
}

})();
