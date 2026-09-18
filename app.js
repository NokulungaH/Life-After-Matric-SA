const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR',maximumFractionDigits:2}).format(Math.max(0,n||0));

$('year').textContent=new Date().getFullYear();

const menuBtn=$('menuBtn'),nav=$('mainNav');
menuBtn.addEventListener('click',()=>{
  nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded',nav.classList.contains('open'));
});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.go).scrollIntoView({behavior:'smooth'})));

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
    ?`About <b>${pct}%</b> of the gross salary remains after the deductions entered here. PAYE is estimated using the 2027 tax-year brackets and the primary rebate. UIF is capped at the current R17 712 monthly earnings ceiling.`
    :'Enter a monthly salary to see the estimate.';
}

$('salaryForm').addEventListener('submit',e=>{
  e.preventDefault();
  calculateSalary();
});
['grossSalary','retirementPct','otherDeductions'].forEach(id=>$(id).addEventListener('input',calculateSalary));
calculateSalary();