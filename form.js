/**
 * Sanjeevini Convent School – Professional Form JS
 */

// ── TOAST SYSTEM ─────────────────────────────────────
function showToast(msg, type = 'info', duration = 2500) {
  const stack = document.getElementById('toast-stack');
  if (!stack) return;

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-text">${msg}</span>`;
  stack.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── RADIO CARDS ──────────────────────────────────────
function pickRadio(name, value, activeId, ...otherIds) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
    r.checked = (r.value === value);
  });
  // Update card styles
  const allCards = document.querySelectorAll(`input[name="${name}"]`);
  allCards.forEach(r => {
    const card = r.closest('.radio-card');
    if (card) card.classList.remove('checked');
  });
  const active = document.getElementById(activeId);
  if (active) active.classList.add('checked');
  updateProgress();
}

function syncRadioCards() {
  // Sync all radio inputs with their card states on load
  document.querySelectorAll('input[type="radio"]').forEach(r => {
    if (r.checked) {
      const card = r.closest('.radio-card');
      if (card) card.classList.add('checked');
    }
  });
}

// ── CHECKBOX CARDS ───────────────────────────────────
function toggleCheck(inputId, cardId) {
  const input = document.getElementById(inputId);
  const card  = document.getElementById(cardId);
  if (!input || !card) return;
  input.checked = !input.checked;
  card.classList.toggle('checked', input.checked);
  updateProgress();
}

function syncCheckboxCards() {
  ['father_living','father_not_living','mother_living','mother_not_living'].forEach(id => {
    const inp = document.getElementById(id);
    const card = document.getElementById('cc-' + id.replace(/_/g,'-'));
    if (inp && card) card.classList.toggle('checked', inp.checked);
  });
}

// ── SECTION TOGGLE ────────────────────────────────────
function toggleSection(id) {
  const body = document.getElementById(id);
  const togId = 'tog-' + id.replace('sec-','');
  const tog = document.getElementById(togId);
  if (!body || !tog) return;
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : '';
  tog.classList.toggle('open', !isOpen);
}

// ── PROGRESS TRACKER ──────────────────────────────────
const TRACKED_FIELDS = [
  'pupil_name','sex_boy','sex_girl','dob_day','dob_month','dob_year',
  'village','father_name','mother_name','nationality','religion',
  'parent_address1','admission_class','child_aadhar','medium'
];

function updateProgress() {
  let filled = 0;
  TRACKED_FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === 'radio' || el.type === 'checkbox') {
      if (el.checked) filled++;
    } else if (el.value.trim()) {
      filled++;
    }
  });
  const pct = Math.round((filled / TRACKED_FIELDS.length) * 100);
  const fill = document.getElementById('prog-fill');
  const lbl  = document.getElementById('prog-label');
  if (fill) fill.style.width = pct + '%';
  if (lbl)  lbl.textContent = pct + '% filled';
}

// ── HELPERS ──────────────────────────────────────────
function getVal(id)      { return (document.getElementById(id)?.value || '').trim(); }
function setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val || ''; }
function getRadio(name) {
  const sel = document.querySelector(`input[name="${name}"]:checked`);
  return sel ? sel.value : '';
}
function setRadio(name, val) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(r => { r.checked = (r.value === val); });
}
function getCheckbox(id) { return !!document.getElementById(id)?.checked; }
function setCheckbox(id, val) { const el = document.getElementById(id); if (el) el.checked = !!val; }

// ── COLLECT FORM DATA ─────────────────────────────────
function collectFormData() {
  return {
    student_id: getVal('current_student_id'),
    serial_no: getVal('serial_no'),
    form_date: getVal('form_date'),
    o_standard: getVal('o_standard'), o_sec: getVal('o_sec'),
    o_admn: getVal('o_admn'), o_hm: getVal('o_hm'), o_principal: getVal('o_principal'),
    pupil_name: getVal('pupil_name'),
    sex: getRadio('sex'),
    dob_day: getVal('dob_day'), dob_month: getVal('dob_month'), dob_year: getVal('dob_year'),
    dob_words: getVal('dob_words'),
    village: getVal('village'), town: getVal('town'), taluk: getVal('taluk'),
    district: getVal('district'), state: getVal('state'),
    father_name: getVal('father_name'), father_qual: getVal('father_qual'),
    father_occ: getVal('father_occ'), father_income: getVal('father_income'),
    father_living: getCheckbox('father_living'), father_not_living: getCheckbox('father_not_living'),
    mother_name: getVal('mother_name'), mother_qual: getVal('mother_qual'),
    mother_occ: getVal('mother_occ'), mother_income: getVal('mother_income'),
    mother_living: getCheckbox('mother_living'), mother_not_living: getCheckbox('mother_not_living'),
    grandfather_name: getVal('grandfather_name'),
    child_aadhar: getVal('child_aadhar'), father_aadhar: getVal('father_aadhar'),
    mother_aadhar: getVal('mother_aadhar'), ration_card: getVal('ration_card'),
    bank_ac: getVal('bank_ac'), ifsc: getVal('ifsc'), dise_no: getVal('dise_no'),
    nationality: getVal('nationality'), religion: getVal('religion'),
    caste: getVal('caste'), sub_caste: getVal('sub_caste'),
    sc_no: getVal('sc_no'), sc_date: getVal('sc_date'),
    mother_tongue: getVal('mother_tongue'), other_languages: getVal('other_languages'),
    parent_address1: getVal('parent_address1'), parent_address2: getVal('parent_address2'),
    parent_address3: getVal('parent_address3'), parent_address4: getVal('parent_address4'),
    guardian_address1: getVal('guardian_address1'), guardian_address2: getVal('guardian_address2'),
    guardian_address3: getVal('guardian_address3'), guardian_address4: getVal('guardian_address4'),
    prev_school_1: getVal('prev_school_1'), prev_class_1: getVal('prev_class_1'), prev_year_1: getVal('prev_year_1'),
    prev_school_2: getVal('prev_school_2'), prev_class_2: getVal('prev_class_2'), prev_year_2: getVal('prev_year_2'),
    prev_school_3: getVal('prev_school_3'), prev_class_3: getVal('prev_class_3'), prev_year_3: getVal('prev_year_3'),
    slc: getRadio('slc'), slc_no_num: getVal('slc_no_num'),
    vacc: getRadio('vacc'), vacc_cert: getRadio('vacc_cert'),
    medium: getVal('medium'),
    admission_class: getVal('admission_class'),
    sign_date: getVal('sign_date'), parent_sign: getVal('parent_sign'),
    o2_standard: getVal('o2_standard'), o2_sec: getVal('o2_sec'), o2_receipt: getVal('o2_receipt'),
    decl_applicant: getVal('decl_applicant'), decl_parent: getVal('decl_parent'),
  };
}

// ── POPULATE FORM ─────────────────────────────────────
function populateForm(d) {
  setVal('current_student_id', d.student_id || '');
  setVal('serial_no', d.serial_no); setVal('form_date', d.form_date);
  setVal('o_standard', d.o_standard); setVal('o_sec', d.o_sec);
  setVal('o_admn', d.o_admn); setVal('o_hm', d.o_hm); setVal('o_principal', d.o_principal);
  setVal('pupil_name', d.pupil_name);
  setRadio('sex', d.sex);
  setVal('dob_day', d.dob_day); setVal('dob_month', d.dob_month); setVal('dob_year', d.dob_year);
  setVal('dob_words', d.dob_words);
  setVal('village', d.village); setVal('town', d.town); setVal('taluk', d.taluk);
  setVal('district', d.district); setVal('state', d.state);
  setVal('father_name', d.father_name); setVal('father_qual', d.father_qual);
  setVal('father_occ', d.father_occ); setVal('father_income', d.father_income);
  setCheckbox('father_living', d.father_living); setCheckbox('father_not_living', d.father_not_living);
  setVal('mother_name', d.mother_name); setVal('mother_qual', d.mother_qual);
  setVal('mother_occ', d.mother_occ); setVal('mother_income', d.mother_income);
  setCheckbox('mother_living', d.mother_living); setCheckbox('mother_not_living', d.mother_not_living);
  setVal('grandfather_name', d.grandfather_name);
  setVal('child_aadhar', d.child_aadhar); setVal('father_aadhar', d.father_aadhar);
  setVal('mother_aadhar', d.mother_aadhar); setVal('ration_card', d.ration_card);
  setVal('bank_ac', d.bank_ac); setVal('ifsc', d.ifsc); setVal('dise_no', d.dise_no);
  setVal('nationality', d.nationality); setVal('religion', d.religion);
  setVal('caste', d.caste); setVal('sub_caste', d.sub_caste);
  setVal('sc_no', d.sc_no); setVal('sc_date', d.sc_date);
  setVal('mother_tongue', d.mother_tongue); setVal('other_languages', d.other_languages);
  setVal('parent_address1', d.parent_address1); setVal('parent_address2', d.parent_address2);
  setVal('parent_address3', d.parent_address3); setVal('parent_address4', d.parent_address4);
  setVal('guardian_address1', d.guardian_address1); setVal('guardian_address2', d.guardian_address2);
  setVal('guardian_address3', d.guardian_address3); setVal('guardian_address4', d.guardian_address4);
  setVal('prev_school_1', d.prev_school_1); setVal('prev_class_1', d.prev_class_1); setVal('prev_year_1', d.prev_year_1);
  setVal('prev_school_2', d.prev_school_2); setVal('prev_class_2', d.prev_class_2); setVal('prev_year_2', d.prev_year_2);
  setVal('prev_school_3', d.prev_school_3); setVal('prev_class_3', d.prev_class_3); setVal('prev_year_3', d.prev_year_3);
  setRadio('slc', d.slc); setVal('slc_no_num', d.slc_no_num);
  setRadio('vacc', d.vacc); setRadio('vacc_cert', d.vacc_cert);
  setVal('medium', d.medium);
  setVal('admission_class', d.admission_class);
  setVal('sign_date', d.sign_date); setVal('parent_sign', d.parent_sign);
  setVal('o2_standard', d.o2_standard); setVal('o2_sec', d.o2_sec); setVal('o2_receipt', d.o2_receipt);
  setVal('decl_applicant', d.decl_applicant); setVal('decl_parent', d.decl_parent);

  syncRadioCards();
  syncCheckboxCards();
  updateProgress();
}

// ── SAVE FORM ─────────────────────────────────────────
async function saveForm() {
  const data = collectFormData();
  if (!data.pupil_name) {
    showToast('Enter the pupil name first', 'warning');
    document.getElementById('pupil_name')?.focus();
    return;
  }
  try {
    const resp = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await resp.json();
    if (result.success) {
      setVal('current_student_id', result.student_id);
      const badge = document.getElementById('student-id-badge');
      if (badge) {
        badge.textContent = result.student_id;
        badge.classList.add('visible');
      }
      const action = result.action === 'updated' ? 'Record updated' : 'Record saved';
      showToast(`${action} · ${result.student_id}`, 'success');
    } else {
      showToast('Save failed: ' + result.error, 'error');
    }
  } catch (err) {
    showToast('Network error', 'error');
  }
}

// ── PRINT ─────────────────────────────────────────────
async function printForm() {
  let sid = getVal('current_student_id');
  if (!sid) {
    await saveForm();
    sid = getVal('current_student_id');
    if (!sid) { showToast('Save failed', 'error'); return; }
  }
  window.open(`/print/${sid}`, '_blank');
}

// ── PDF ───────────────────────────────────────────────
async function downloadPDF() {
  let sid = getVal('current_student_id');
  if (!sid) {
    await saveForm();
    sid = getVal('current_student_id');
    if (!sid) { showToast('Save failed', 'error'); return; }
  }
  const win = window.open(`/print/${sid}`, '_blank');
  if (win) {
    win.addEventListener('load', () => setTimeout(() => win.print(), 500));
    showToast('Use "Save as PDF" in the print dialog', 'info');
  }
}

// ── RESET ─────────────────────────────────────────────
function resetForm() {
  if (!confirm('Start a new form? Unsaved changes will be lost.')) return;
  document.querySelectorAll('input[type="text"], input[type="date"]').forEach(el => el.value = '');
  document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(el => el.checked = false);
  document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('checked'));
  document.querySelectorAll('.checkbox-card').forEach(c => c.classList.remove('checked'));
  setVal('current_student_id', '');
  const badge = document.getElementById('student-id-badge');
  if (badge) badge.classList.remove('visible');
  setVal('form_date', new Date().toISOString().split('T')[0]);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateProgress();
  showToast('New form started', 'info');
}

// ── LOGOUT ────────────────────────────────────────────
async function doLogout() {
  try {
    await fetch('/api/logout', { method: 'POST' });
  } catch {}
  window.location.href = '/login';
}

// ── LOAD FROM URL ─────────────────────────────────────
async function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  const sid = params.get('load');
  if (!sid) return;
  try {
    const resp = await fetch(`/api/record/${encodeURIComponent(sid)}`);
    if (!resp.ok) { showToast('Record not found', 'error'); return; }
    const data = await resp.json();
    populateForm(data);
    const badge = document.getElementById('student-id-badge');
    if (badge) { badge.textContent = sid; badge.classList.add('visible'); }
    showToast(`Loaded · ${sid}`, 'success');
    window.history.replaceState({}, '', '/');
  } catch {
    showToast('Failed to load record', 'error');
  }
}

// ── LOAD USER INFO ────────────────────────────────────
async function loadUserInfo() {
  try {
    const resp = await fetch('/api/me');
    if (!resp.ok) { window.location.href = '/login'; return; }
    const data = await resp.json();
    const nameEl = document.getElementById('user-name');
    const avatarEl = document.getElementById('user-avatar');
    if (nameEl) nameEl.textContent = data.name;
    if (avatarEl) avatarEl.textContent = data.name ? data.name[0].toUpperCase() : '👤';
  } catch {}
}

// ── AADHAAR FORMATTER ─────────────────────────────────
function formatAadhaar(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 12);
  input.value = v.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3').trim();
}

// ── INIT ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadUserInfo();
  loadFromURL();

  if (!getVal('form_date')) {
    setVal('form_date', new Date().toISOString().split('T')[0]);
  }

  // Progress tracking on all inputs
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', updateProgress);
    el.addEventListener('change', updateProgress);
  });

  // Aadhaar formatting
  ['child_aadhar','father_aadhar','mother_aadhar'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', function() { formatAadhaar(this); });
  });

  // Keyboard shortcut: Ctrl+S
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveForm();
    }
  });

  updateProgress();
});
