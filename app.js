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
