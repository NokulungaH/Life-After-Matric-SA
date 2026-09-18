const money=n=>new Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR',maximumFractionDigits:2}).format(Math.max(0,n||0));
document.getElementById('year').textContent=new Date().getFullYear();

const menuBtn=document.getElementById('menuBtn'),nav=document.getElementById('mainNav');
menuBtn.addEventListener('click',()=>{nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',nav.classList.contains('open'))});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.go).scrollIntoView({behavior:'smooth'})));

const checklistItems=['Read and save your employment contract','Confirm your start date, working hours and location','Ask when payroll cut-off and payday are','Check what documents HR needs from you','Know whether benefits or retirement deductions apply','Check your first payslip line by line'];
const checklistKey='lam-checklist';
let checklistState=JSON.parse(localStorage.getItem(checklistKey)||'{}');
const checklist=document.getElementById('jobChecklist');
function renderChecklist(){checklist.innerHTML='';checklistItems.forEach((item,i)=>{const label=document.createElement('label');label.className='check-item';label.innerHTML=`<input type="checkbox" data-i="${i}" ${checklistState[i]?'checked':''}><span>${item}</span>`;checklist.appendChild(label)});const done=checklistItems.filter((_,i)=>checklistState[i]).length;document.getElementById('checkProgress').textContent=Math.round(done/checklistItems.length*100)}
checklist.addEventListener('change',e=>{if(e.target.matches('input')){checklistState[e.target.dataset.i]=e.target.checked;localStorage.setItem(checklistKey,JSON.stringify(checklistState));renderChecklist()}});
renderChecklist();

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
  const gross=Math.max(0,+document.getElementById('grossSalary').value||0);
  const retirementPct=Math.min(27.5,Math.max(0,+document.getElementById('retirementPct').value||0));
  const other=Math.max(0,+document.getElementById('otherDeductions').value||0);
  const retirement=gross*retirementPct/100;
  const annualTaxable=Math.max(0,(gross-retirement)*12);
  const paye=Math.max(0,(annualTax(annualTaxable)-17820)/12);
  const uif=Math.min(gross,17712)*.01;
  const net=Math.max(0,gross-retirement-paye-uif-other);
  grossOut.textContent=money(gross);payeOut.textContent=money(paye);uifOut.textContent=money(uif);retirementOut.textContent=money(retirement);otherOut.textContent=money(other);netPay.textContent=money(net);
  const pct=gross?Math.round(net/gross*100):0;
  salaryExplain.innerHTML=gross?`About <b>${pct}%</b> of the gross salary remains after the deductions entered here. PAYE is estimated using the 2027 tax-year brackets and the primary rebate. UIF is capped at the current R17 712 monthly earnings ceiling.`:'Enter a monthly salary to see the estimate.';
}
document.getElementById('salaryForm').addEventListener('submit',e=>{e.preventDefault();calculateSalary()});
['grossSalary','retirementPct','otherDeductions'].forEach(id=>document.getElementById(id).addEventListener('input',calculateSalary));calculateSalary();

const appKey='lam-applications';
let applications=JSON.parse(localStorage.getItem(appKey)||'[]');
const form=document.getElementById('trackerForm'),list=document.getElementById('applicationList');
dateApplied.value=new Date().toISOString().slice(0,10);
function saveApps(){localStorage.setItem(appKey,JSON.stringify(applications));renderApps()}
function renderApps(){applicationCount.textContent=`${applications.length} application${applications.length===1?'':'s'}`;if(!applications.length){list.innerHTML='<div class="empty">No applications yet. Add your first one above.</div>';return}list.innerHTML=applications.map(a=>`<div class="application"><b>${escapeHtml(a.company)}</b><span>${escapeHtml(a.role)}</span><span class="status">${escapeHtml(a.status)}</span><small>${escapeHtml(a.date)}</small><button class="delete" data-id="${a.id}" aria-label="Delete application">×</button></div>`).join('')}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
form.addEventListener('submit',e=>{e.preventDefault();applications.unshift({id:Date.now(),company:company.value.trim(),role:role.value.trim(),status:status.value,date:dateApplied.value});saveApps();form.reset();dateApplied.value=new Date().toISOString().slice(0,10)});
list.addEventListener('click',e=>{if(e.target.matches('.delete')){applications=applications.filter(a=>String(a.id)!==e.target.dataset.id);saveApps()}});
clearApplications.addEventListener('click',()=>{if(applications.length&&confirm('Clear all saved applications on this device?')){applications=[];saveApps()}});renderApps();

const modules=[
['🔎','Jobs & applications','CVs, applications, interviews, contracts and scams.'],
['💼','Salary & payslips','Gross vs net, PAYE, UIF and deductions.'],
['🧾','SARS & tax','Tax numbers, IRP5s, returns and assessments.'],
['💰','Money','Budgeting, emergency funds, credit, debt and saving.'],
['🏠','Moving out','Rent, deposits, leases and household costs.'],
['🚗','Cars','Finance, balloon payments, insurance and running costs.'],
['🎓','Education & career','University, TVET, learnerships, bursaries and upskilling.'],
['💡','Business & side hustles','CIPC, pricing, records, tax and profit basics.'],
['🗂️','Adulting admin','IDs, bank accounts, insurance, contracts and consumer basics.']
];
const roadmapKey='lam-roadmap';let roadmap=JSON.parse(localStorage.getItem(roadmapKey)||'{}'),grid=document.getElementById('roadmapGrid');
function renderRoadmap(){grid.innerHTML=modules.map((m,i)=>`<article class="roadmap-card ${roadmap[i]?'done':''}"><label><input type="checkbox" data-r="${i}" ${roadmap[i]?'checked':''}><span><b>${m[0]} ${m[1]}</b><small>${m[2]}</small></span></label></article>`).join('')}
grid.addEventListener('change',e=>{if(e.target.matches('[data-r]')){roadmap[e.target.dataset.r]=e.target.checked;localStorage.setItem(roadmapKey,JSON.stringify(roadmap));renderRoadmap()}});renderRoadmap();