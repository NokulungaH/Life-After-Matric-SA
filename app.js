const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR',maximumFractionDigits:2}).format(Math.max(0,n||0));

const year=$('year');
if(year) year.textContent=new Date().getFullYear();

const nav=$('mainNav'),menuBtn=$('menuBtn'),moreBtn=$('moreBtn'),moreMenu=$('moreMenu');

if(menuBtn&&nav){
  menuBtn.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded',open);
  });
}

if(moreBtn&&moreMenu){
  moreBtn.addEventListener('click',e=>{
    e.stopPropagation();
    const open=moreMenu.classList.toggle('open');
    moreBtn.setAttribute('aria-expanded',open);
  });
  document.addEventListener('click',e=>{
    if(!e.target.closest('.nav-dropdown')){
      moreMenu.classList.remove('open');
      moreBtn.setAttribute('aria-expanded','false');
    }
  });
}

document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>{
  nav?.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded','false');
}));

const page=document.body.dataset.page||'home';
const groupMap={home:'home',jobs:'work',cv:'work',applications:'work',interviews:'work',contracts:'work','job-scams':'work','first-job':'work',salary:'salary',tax:'tax',money:'money','moving-out':'living'};
const group=groupMap[page];
if(group) document.querySelector('[data-nav="'+group+'"]')?.classList.add('active');

if(['cars','education','business','adulting'].includes(page)){
  moreBtn?.classList.add('active');
  document.querySelector('[data-page-link="'+page+'"]')?.classList.add('active');
}

function annualTax(taxable){
  if(taxable<=245100)return taxable*.18;
  if(taxable<=383100)return 44118+(taxable-245100)*.26;
  if(taxable<=530200)return 79998+(taxable-383100)*.31;
  if(taxable<=695800)return 125599+(taxable-530200)*.36;
  if(taxable<=887000)return 185215+(taxable-695800)*.39;
  if(taxable<=1878600)return 259783+(taxable-887000)*.41;
  return 666339+(taxable-1878600)*.45;
}

function calculateSalary(){
  if(!$('salaryForm')) return;
  const gross=Math.max(0,+$('grossSalary').value||0);
  const retirementPct=Math.min(27.5,Math.max(0,+$('retirementPct').value||0));
  const other=Math.max(0,+$('otherDeductions').value||0);
  const retirement=gross*retirementPct/100;
  const annualTaxable=Math.max(0,(gross-retirement)*12);
  const paye=Math.max(0,(annualTax(annualTaxable)-17820)/12);
  const uif=Math.min(gross,17712)*.01;
  const net=Math.max(0,gross-retirement-paye-uif-other);
  $('grossOut').textContent=money(gross);
  $('payeOut').textContent=money(paye);
  $('uifOut').textContent=money(uif);
  $('retirementOut').textContent=money(retirement);
  $('otherOut').textContent=money(other);
  $('netPay').textContent=money(net);
  const pct=gross?Math.round(net/gross*100):0;
  $('salaryExplain').innerHTML=gross
    ?'About <b>'+pct+'%</b> of the gross salary remains after the deductions entered here. PAYE is estimated using the 2027 tax-year brackets and the primary rebate. UIF is capped at the current R17 712 monthly earnings ceiling.'
    :'Enter a monthly salary to see the estimate.';
}

if($('salaryForm')){
  $('salaryForm').addEventListener('submit',e=>{e.preventDefault();calculateSalary()});
  ['grossSalary','retirementPct','otherDeductions'].forEach(id=>$(id)?.addEventListener('input',calculateSalary));
  calculateSalary();
}
const workPageMap={jobs:'jobs.html',cv:'cv.html',applications:'applications.html',interviews:'interviews.html',contracts:'contracts.html','job-scams':'job-scams.html','first-job':'first-job.html'};
if(workPageMap[page]){
  document.querySelectorAll('.section-nav a').forEach(a=>{
    if(a.getAttribute('href')===workPageMap[page]) a.classList.add('active');
  });
}


// Generic sub-navigation highlighting
const currentFile=window.location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.section-nav a').forEach(a=>{
  if(a.getAttribute('href')===currentFile) a.classList.add('active');
});

const numberValue=id=>Math.max(0,Number(document.getElementById(id)?.value)||0);
const moneyPlain=n=>new Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR',maximumFractionDigits:2}).format(n);

if($('budgetCalc')){
  $('budgetCalc').addEventListener('click',()=>{
    const income=numberValue('budgetIncome');
    const spend=['budgetHousing','budgetTransport','budgetFood','budgetDebt','budgetOther'].reduce((s,id)=>s+numberValue(id),0);
    const left=income-spend;
    $('budgetResult').classList.toggle('negative',left<0);
    $('budgetResult').innerHTML=left>=0
      ?'<b>'+moneyPlain(left)+'</b> remains after the essentials entered above.'
      :'<b>'+moneyPlain(Math.abs(left))+' short</b>. The listed essentials are higher than the take-home pay entered.';
  });
}

if($('emergencyCalc')){
  $('emergencyCalc').addEventListener('click',()=>{
    const monthly=numberValue('emergencyMonthly'),months=Math.max(1,numberValue('emergencyMonths'));
    $('emergencyResult').innerHTML='A '+months+'-month target would be about <b>'+moneyPlain(monthly*months)+'</b>. You can still start with a smaller first milestone.';
  });
}

if($('moveCalc')){
  $('moveCalc').addEventListener('click',()=>{
    const income=numberValue('moveIncome');
    const spend=['moveRent','moveTransport','moveFood','moveUtilities','moveOther'].reduce((s,id)=>s+numberValue(id),0);
    const left=income-spend;
    $('moveResult').classList.toggle('negative',left<0);
    $('moveResult').innerHTML=left>=0
      ?'After the monthly costs entered, about <b>'+moneyPlain(left)+'</b> remains for saving, unexpected costs and flexible spending.'
      :'The costs entered are about <b>'+moneyPlain(Math.abs(left))+'</b> more than the take-home pay entered.';
  });
}

if($('carCalc')){
  $('carCalc').addEventListener('click',()=>{
    const price=numberValue('carPrice'),deposit=numberValue('carDeposit'),rate=numberValue('carRate')/100/12,months=Math.max(1,numberValue('carTerm')),balloonPct=Math.min(50,numberValue('carBalloon'))/100;
    const principal=Math.max(0,price-deposit),balloon=price*balloonPct;
    let instalment=0;
    if(rate===0){instalment=Math.max(0,(principal-balloon)/months)}
    else{
      const pvBalloon=balloon/Math.pow(1+rate,months);
      const financedForPayments=Math.max(0,principal-pvBalloon);
      instalment=financedForPayments*rate/(1-Math.pow(1+rate,-months));
    }
    const monthly=instalment+numberValue('carInsurance')+numberValue('carFuel')+numberValue('carOther');
    $('carResult').innerHTML='Estimated finance instalment: <b>'+moneyPlain(instalment)+'</b><br>Estimated total monthly ownership cost entered: <b>'+moneyPlain(monthly)+'</b>'+(balloon>0?'<br>Estimated balloon remaining at term end: <b>'+moneyPlain(balloon)+'</b>':'');
  });
}

if($('bizCalc')){
  $('bizCalc').addEventListener('click',()=>{
    const price=numberValue('bizPrice'),cost=numberValue('bizCost'),fees=numberValue('bizFees'),fixed=numberValue('bizFixed');
    const contribution=price-cost-fees;
    const margin=price>0?contribution/price*100:0;
    if(contribution<=0){
      $('bizResult').classList.add('negative');
      $('bizResult').innerHTML='This price does not leave a positive unit contribution after the costs entered.';
    } else {
      $('bizResult').classList.remove('negative');
      const units=Math.ceil(fixed/contribution);
      $('bizResult').innerHTML='Estimated unit contribution: <b>'+moneyPlain(contribution)+'</b> ('+margin.toFixed(1)+'% of selling price).<br>Approximate units to cover '+moneyPlain(fixed)+' fixed monthly costs: <b>'+units+'</b>.';
    }
  });
}


// Add Meet the Examples to the global navigation on every page.
if(nav && !nav.querySelector('[data-nav="examples"]')){
  const examplesLink=document.createElement('a');
  examplesLink.dataset.nav='examples';
  examplesLink.href=page==='home' ? '#examples' : 'index.html#examples';
  examplesLink.textContent='Meet the Examples';
  const explore=nav.querySelector('.nav-dropdown');
  nav.insertBefore(examplesLink, explore || null);
  examplesLink.addEventListener('click',()=> {
    nav.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded','false');
  });
}
