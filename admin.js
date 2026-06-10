/* ============================================================
   WorkPulse HRMS — Admin Panel JS
   ============================================================ */

// ── AUTH GUARD ───────────────────────────────────────────────
var CURRENT_ADMIN = requireAdmin();
if (!CURRENT_ADMIN) { throw new Error('redirecting'); }

// ── POPULATE ADMIN PROFILE ────────────────────────────────────
document.getElementById('adminSidebarAvatar').textContent = CURRENT_ADMIN.initials;
document.getElementById('adminSidebarName').textContent   = CURRENT_ADMIN.name;

// ── LOGOUT ───────────────────────────────────────────────────
document.getElementById('adminLogoutBtn').addEventListener('click', function(e) {
  e.preventDefault();
  logout();
});

// ── NAVIGATION ───────────────────────────────────────────────
document.querySelectorAll('.nav-item[data-screen]').forEach(function(item) {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    showScreen(this.getAttribute('data-screen'));
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
    this.classList.add('active');
    document.getElementById('sidebar').classList.remove('open');
  });
});

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
  var el = document.getElementById('screen-' + name);
  if (el) el.classList.add('active');
}

document.getElementById('menuToggle').addEventListener('click', function() {
  document.getElementById('sidebar').classList.toggle('open');
});

// ── LIVE CLOCK ────────────────────────────────────────────────
function updateClock() {
  var now = new Date();
  var el = document.getElementById('liveClock');
  if (el) el.textContent = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
}
updateClock(); setInterval(updateClock, 1000);

// ── EMPLOYEE DATA (localStorage-backed) ──────────────────────
var SAMPLE_EMPLOYEES = [
  { id:'WP-1001', name:'Arjun Kumar',  dept:'Engineering', role:'Software Engineer',   join:'Apr 1, 2022',  status:'active',   initials:'AK', isSample:true },
  { id:'WP-1002', name:'Priya Sharma', dept:'HR',          role:'HR Executive',         join:'Jan 15, 2021', status:'active',   initials:'PS', isSample:true },
  { id:'WP-1003', name:'Ravi Shankar', dept:'Engineering', role:'Engineering Head',     join:'Mar 10, 2019', status:'active',   initials:'RS', isSample:true },
  { id:'WP-1004', name:'Sneha Patel',  dept:'Finance',     role:'Finance Analyst',      join:'Jul 20, 2022', status:'active',   initials:'SP', isSample:true },
  { id:'WP-1005', name:'Karan Singh',  dept:'Sales',       role:'Sales Executive',      join:'Sep 5, 2023',  status:'active',   initials:'KS', isSample:true },
  { id:'WP-1006', name:'Ananya Roy',   dept:'Marketing',   role:'Marketing Specialist', join:'Feb 28, 2023', status:'on-leave', initials:'AR', isSample:true },
  { id:'WP-1007', name:'Vijay Menon',  dept:'Engineering', role:'Backend Developer',    join:'Nov 1, 2022',  status:'active',   initials:'VM', isSample:true },
  { id:'WP-1008', name:'Deepa Nair',   dept:'HR',          role:'HR Manager',           join:'Jun 15, 2018', status:'active',   initials:'DN', isSample:true },
];

function getEmployees() {
  try {
    var raw = localStorage.getItem('wp_employees');
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(SAMPLE_EMPLOYEES));
  } catch(e) { return JSON.parse(JSON.stringify(SAMPLE_EMPLOYEES)); }
}
function saveEmployees(list) { localStorage.setItem('wp_employees', JSON.stringify(list)); }

var employees = getEmployees();


// ── OVERVIEW: LIVE EMPLOYEE STATUS ───────────────────────────
(function() {
  var container = document.getElementById('liveEmployeeStatus');
  if (!container) return;
  var list = document.createElement('div'); list.className = 'emp-status-list';
  var sample = [
    { name:'Arjun Kumar',  dept:'Engineering', status:'present', initials:'AK' },
    { name:'Priya Sharma', dept:'HR',          status:'present', initials:'PS' },
    { name:'Ravi Shankar', dept:'Engineering', status:'present', initials:'RS' },
    { name:'Sneha Patel',  dept:'Finance',     status:'present', initials:'SP' },
    { name:'Ananya Roy',   dept:'Marketing',   status:'leave',   initials:'AR' },
  ];
  var bm = { present:'badge-green', leave:'badge-yellow', absent:'badge-red' };
  var lm = { present:'Present', leave:'On Leave', absent:'Absent' };
  sample.forEach(function(emp) {
    var item = document.createElement('div'); item.className = 'emp-status-item';
    var left = document.createElement('div'); left.className = 'emp-status-left';
    var av = document.createElement('div'); av.className = 'avatar'; av.style.cssText='width:32px;height:32px;font-size:11px;flex-shrink:0;'; av.textContent = emp.initials;
    var info = document.createElement('div'); info.className = 'emp-status-info';
    var nm = document.createElement('div'); nm.className = 'emp-status-name'; nm.textContent = emp.name;
    var dp = document.createElement('div'); dp.className = 'emp-status-dept'; dp.textContent = emp.dept;
    info.appendChild(nm); info.appendChild(dp); left.appendChild(av); left.appendChild(info);
    var badge = document.createElement('span'); badge.className = 'badge ' + bm[emp.status]; badge.textContent = lm[emp.status];
    item.appendChild(left); item.appendChild(badge); list.appendChild(item);
  });
  container.appendChild(list);
})();

// ── OVERVIEW: DEPT CHART ──────────────────────────────────────
(function() {
  var container = document.getElementById('deptChart');
  if (!container) return;
  var depts = [
    { label:'Engineering', count:45 },
    { label:'Sales',       count:32 },
    { label:'Finance',     count:18 },
    { label:'HR',          count:12 },
    { label:'Marketing',   count:21 },
  ];
  var max = 45;
  depts.forEach(function(d) {
    var row = document.createElement('div'); row.className = 'bar-row';
    var lbl = document.createElement('div'); lbl.className = 'bar-label'; lbl.textContent = d.label;
    var track = document.createElement('div'); track.className = 'bar-track';
    var fill = document.createElement('div'); fill.className = 'bar-fill'; fill.style.width = Math.round((d.count/max)*100)+'%';
    track.appendChild(fill);
    var count = document.createElement('div'); count.className = 'bar-count'; count.textContent = d.count;
    row.appendChild(lbl); row.appendChild(track); row.appendChild(count); container.appendChild(row);
  });
})();

// ── OVERVIEW: WEEK CHART ──────────────────────────────────────
(function() {
  var container = document.getElementById('weekChart');
  if (!container) return;
  // June 2-8: Mon-Sun. June 8 is today (Sunday) — no data yet
  var days = [
    { day:'Mon', val:118 }, { day:'Tue', val:122 }, { day:'Wed', val:120 },
    { day:'Thu', val:114 }, { day:'Fri', val:116 }, { day:'Sat', val:0, future:true },
    { day:'Sun', val:0, future:true },
  ];
  var max = 128;
  days.forEach(function(d) {
    var wrap = document.createElement('div'); wrap.className = 'week-bar-wrap';
    var valEl = document.createElement('div'); valEl.className = 'week-bar-val'; valEl.textContent = d.val || '—';
    var bar = document.createElement('div'); bar.className = 'week-bar';
    bar.style.height = d.val ? Math.round((d.val/max)*90)+'px' : '4px';
    bar.style.background = d.future ? '#e5e3f5' : '#6366f1';
    var dayEl = document.createElement('div'); dayEl.className = 'week-bar-day'; dayEl.textContent = d.day;
    wrap.appendChild(valEl); wrap.appendChild(bar); wrap.appendChild(dayEl); container.appendChild(wrap);
  });
})();

// ── EMPLOYEE TABLE ────────────────────────────────────────────
function buildEmployeeTable(data) {
  var tbody = document.getElementById('employeeTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  // Show banner if any sample data still present
  var hasSample = data.some(function(e) { return e.isSample; });
  var banner = document.getElementById('sampleDataBanner');
  if (banner) banner.style.display = hasSample ? 'flex' : 'none';

  var sm = { active:'badge-green', 'on-leave':'badge-yellow', inactive:'badge-red' };
  var sl = { active:'Active', 'on-leave':'On Leave', inactive:'Inactive' };
  data.forEach(function(emp) {
    var tr = document.createElement('tr');
    if (emp.isSample) tr.style.opacity = '0.7';
    var empTd = document.createElement('td');
    var wrap = document.createElement('div'); wrap.style.cssText='display:flex;align-items:center;gap:10px;';
    var av = document.createElement('div'); av.className='avatar'; av.style.cssText='width:32px;height:32px;font-size:11px;flex-shrink:0;'; av.textContent=emp.initials;
    var nameWrap = document.createElement('div');
    var nm = document.createElement('div'); nm.style.cssText='font-weight:600;font-size:13px;'; nm.textContent=emp.name;
    var idEl = document.createElement('div'); idEl.style.cssText='font-size:11px;color:var(--text-muted);'; idEl.textContent=emp.id + (emp.isSample ? ' · Sample' : '');
    nameWrap.appendChild(nm); nameWrap.appendChild(idEl); wrap.appendChild(av); wrap.appendChild(nameWrap); empTd.appendChild(wrap);
    tr.appendChild(empTd);
    function td(t) { var c=document.createElement('td'); c.textContent=t; return c; }
    tr.appendChild(td(emp.dept)); tr.appendChild(td(emp.role)); tr.appendChild(td(emp.join));
    var stTd=document.createElement('td'); var b=document.createElement('span');
    b.className='badge '+(sm[emp.status]||'badge-blue'); b.textContent=sl[emp.status]||emp.status;
    stTd.appendChild(b); tr.appendChild(stTd);
    var acTd=document.createElement('td'); acTd.className='table-actions-cell';
    var editBtn=document.createElement('button'); editBtn.className='btn btn-sm btn-outline'; editBtn.textContent='✏️ Edit';
    (function(e){ editBtn.addEventListener('click', function() { openEditEmp(e); }); })(emp);
    var delBtn=document.createElement('button'); delBtn.className='btn btn-sm btn-danger'; delBtn.textContent='🗑 Delete';
    delBtn.addEventListener('click', function() {
      if (!confirm('Delete ' + emp.name + '? This cannot be undone.')) return;
      employees = employees.filter(function(e) { return e.id !== emp.id; });
      saveEmployees(employees);
      buildEmployeeTable(employees);
    });
    acTd.appendChild(editBtn); acTd.appendChild(delBtn); tr.appendChild(acTd);
    tbody.appendChild(tr);
  });
}
buildEmployeeTable(employees);

// ── APPROVALS (reads live from localStorage + defaults) ───────
function buildApprovals() {
  var container = document.getElementById('approvalCards');
  if (!container) return;
  container.innerHTML = '';

  // Merge default pending + any submitted by employees via localStorage
  var defaultPending = [
    { id:'d1', name:'Karan Singh',  dept:'Sales',       type:'Earned Leave', from:'2026-06-15', to:'2026-06-20', days:6, reason:'Annual family vacation planned in advance.', initials:'KS', empId:'WP-1005' },
    { id:'d2', name:'Vijay Menon',  dept:'Engineering', type:'Casual Leave', from:'2026-06-13', to:'2026-06-13', days:1, reason:'Personal work.', initials:'VM', empId:'WP-1007' },
  ];

  var submitted = [];
  try { submitted = JSON.parse(localStorage.getItem('wp_approvals') || '[]'); } catch(e) {}

  // Combine — employee submitted ones first
  var all = submitted.concat(defaultPending);

  // Filter only pending
  var pending = all.filter(function(a) { return a.status === 'pending' || !a.status; });

  // Update both KPI card and sidebar nav badge
  var kpiEl = document.getElementById('kpiPendingCount');
  if (kpiEl) kpiEl.textContent = pending.length;
  var navBadge = document.querySelector('.nav-item[data-screen="admin-approvals"] .nav-badge');
  if (navBadge) navBadge.textContent = pending.length;

  if (pending.length === 0) {
    var msg = document.createElement('div');
    msg.style.cssText = 'text-align:center;padding:48px;color:var(--text-muted);font-size:14px;';
    msg.textContent = '✅ No pending approvals right now.';
    container.appendChild(msg); return;
  }

  pending.forEach(function(item) {
    var card = document.createElement('div'); card.className = 'approval-card';
    var header = document.createElement('div'); header.className = 'approval-card-header';
    var av = document.createElement('div'); av.className = 'approval-avatar'; av.textContent = item.initials || '??';
    var nameWrap = document.createElement('div');
    var nm = document.createElement('div'); nm.className = 'approval-name'; nm.textContent = item.name || item.submittedBy || 'Employee';
    var meta = document.createElement('div'); meta.className = 'approval-meta'; meta.textContent = (item.dept||'') + ' — ' + item.type;
    nameWrap.appendChild(nm); nameWrap.appendChild(meta);
    var badge = document.createElement('span'); badge.className = 'badge badge-yellow'; badge.style.marginLeft='auto'; badge.textContent = 'Pending';
    header.appendChild(av); header.appendChild(nameWrap); header.appendChild(badge);

    var details = document.createElement('div'); details.className = 'approval-details';
    var fromFmt = formatHolidayDate ? formatHolidayDate(item.from) : item.from;
    var toFmt   = formatHolidayDate ? formatHolidayDate(item.to)   : item.to;
    [{ label:'From', val:fromFmt },{ label:'To', val:toFmt },{ label:'Days', val:item.days+(item.days>1?' days':' day') }].forEach(function(d) {
      var di=document.createElement('div'); di.className='approval-detail-item';
      var lbl=document.createElement('div'); lbl.className='approval-detail-label'; lbl.textContent=d.label;
      var val=document.createElement('div'); val.className='approval-detail-val'; val.textContent=d.val;
      di.appendChild(lbl); di.appendChild(val); details.appendChild(di);
    });

    var reason = document.createElement('div'); reason.className = 'approval-reason'; reason.textContent = '📝 ' + item.reason;
    var actions = document.createElement('div'); actions.className = 'approval-actions';

    var rejectBtn  = document.createElement('button'); rejectBtn.className='btn btn-sm btn-danger';  rejectBtn.textContent='✕ Reject';
    var approveBtn = document.createElement('button'); approveBtn.className='btn btn-sm btn-success'; approveBtn.textContent='✓ Approve';

    function updateLeaveStatus(newStatus) {
      // Update in employee's localStorage store
      if (item.empId) {
        var key = 'wp_leaves_' + item.empId;
        try {
          var leaves = JSON.parse(localStorage.getItem(key) || '[]');
          leaves = leaves.map(function(l) { return l.id === item.id ? Object.assign({}, l, {status: newStatus}) : l; });
          localStorage.setItem(key, JSON.stringify(leaves));
        } catch(e) {}
      }
      // Update in approvals store
      try {
        var approvals = JSON.parse(localStorage.getItem('wp_approvals') || '[]');
        approvals = approvals.map(function(a) { return a.id === item.id ? Object.assign({}, a, {status: newStatus}) : a; });
        localStorage.setItem('wp_approvals', JSON.stringify(approvals));
      } catch(e) {}
    }

    rejectBtn.addEventListener('click', function() {
      updateLeaveStatus('rejected');
      card.style.opacity='.45'; badge.className='badge badge-red'; badge.textContent='Rejected';
      rejectBtn.disabled=true; approveBtn.disabled=true;
    });
    approveBtn.addEventListener('click', function() {
      updateLeaveStatus('approved');
      card.style.opacity='.45'; badge.className='badge badge-green'; badge.textContent='Approved';
      rejectBtn.disabled=true; approveBtn.disabled=true;
    });

    actions.appendChild(rejectBtn); actions.appendChild(approveBtn);
    card.appendChild(header); card.appendChild(details); card.appendChild(reason); card.appendChild(actions);
    container.appendChild(card);
  });
}
buildApprovals();

// ── AUTO-REFRESH approvals every 10s when on that screen ─────
setInterval(function() {
  var screen = document.getElementById('screen-admin-approvals');
  if (screen && screen.classList.contains('active')) {
    buildApprovals();
  }
}, 10000);

// ── HOLIDAY TABLE (fully editable) ───────────────────────────
function buildHolidayTable() {
  var tbody = document.getElementById('holidayTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  var holidays = getHolidays();
  if (holidays.length === 0) {
    var tr = document.createElement('tr');
    var td = document.createElement('td'); td.colSpan = 5;
    td.style.cssText = 'text-align:center;color:var(--text-muted);padding:24px;';
    td.textContent = 'No holidays added yet. Click "+ Add Holiday" to get started.';
    tr.appendChild(td); tbody.appendChild(tr); return;
  }
  holidays.forEach(function(h) {
    var tr = document.createElement('tr');
    function td(t){var c=document.createElement('td');c.textContent=t;return c;}
    tr.appendChild(td(h.name));
    tr.appendChild(td(formatHolidayDate(h.date)));
    tr.appendChild(td(getDayName(h.date)));
    var typeTd=document.createElement('td');
    var b=document.createElement('span');
    b.className = h.type==='National' ? 'badge badge-purple' : h.type==='Regional' ? 'badge badge-blue' : 'badge badge-green';
    b.textContent=h.type; typeTd.appendChild(b); tr.appendChild(typeTd);

    var acTd=document.createElement('td'); acTd.className='table-actions-cell';
    var editBtn=document.createElement('button'); editBtn.className='btn btn-sm btn-outline'; editBtn.textContent='✏️ Edit';
    var delBtn=document.createElement('button'); delBtn.className='btn btn-sm btn-danger'; delBtn.textContent='🗑 Delete';

    editBtn.addEventListener('click', function() { openHolidayModal(h); });
    delBtn.addEventListener('click', function() { openDeleteConfirm(h); });

    acTd.appendChild(editBtn); acTd.appendChild(delBtn); tr.appendChild(acTd);
    tbody.appendChild(tr);
  });
}
buildHolidayTable();

// ── HOLIDAY MODAL (Add / Edit) ────────────────────────────────
var holidayModal      = document.getElementById('holidayModal');
var holidayModalTitle = document.getElementById('holidayModalTitle');
var holidayEditId     = document.getElementById('holidayEditId');
var holidayNameInput  = document.getElementById('holidayNameInput');
var holidayDateInput  = document.getElementById('holidayDateInput');
var holidayTypeInput  = document.getElementById('holidayTypeInput');
var holidayFormError  = document.getElementById('holidayFormError');

function openHolidayModal(h) {
  holidayFormError.style.display = 'none';
  if (h) {
    // Edit mode
    holidayModalTitle.textContent = 'Edit Holiday';
    holidayEditId.value           = h.id;
    holidayNameInput.value        = h.name;
    holidayDateInput.value        = h.date;
    holidayTypeInput.value        = h.type;
  } else {
    // Add mode
    holidayModalTitle.textContent = 'Add Holiday';
    holidayEditId.value           = '';
    holidayNameInput.value        = '';
    holidayDateInput.value        = '';
    holidayTypeInput.value        = 'National';
  }
  holidayModal.classList.add('open');
  holidayNameInput.focus();
}

function closeHolidayModalFn() { holidayModal.classList.remove('open'); }

document.getElementById('addHolidayBtn').addEventListener('click', function() { openHolidayModal(null); });
document.getElementById('closeHolidayModal').addEventListener('click', closeHolidayModalFn);
document.getElementById('cancelHolidayModal').addEventListener('click', closeHolidayModalFn);
holidayModal.addEventListener('click', function(e) { if (e.target === holidayModal) closeHolidayModalFn(); });

document.getElementById('saveHolidayBtn').addEventListener('click', function() {
  var name = holidayNameInput.value.trim();
  var date = holidayDateInput.value;
  var type = holidayTypeInput.value;

  holidayFormError.style.display = 'none';

  if (!name) { holidayFormError.textContent = 'Please enter a holiday name.'; holidayFormError.style.display='block'; return; }
  if (!date) { holidayFormError.textContent = 'Please select a date.'; holidayFormError.style.display='block'; return; }

  var holidays = getHolidays();
  var editId   = parseInt(holidayEditId.value, 10);

  if (editId) {
    // Update existing
    holidays = holidays.map(function(h) {
      if (h.id === editId) { return { id:h.id, name:name, date:date, day:getDayName(date), type:type }; }
      return h;
    });
  } else {
    // Add new — generate unique id
    var newId = holidays.reduce(function(max, h) { return h.id > max ? h.id : max; }, 0) + 1;
    // Insert sorted by date
    holidays.push({ id:newId, name:name, date:date, day:getDayName(date), type:type });
    holidays.sort(function(a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
  }

  saveHolidays(holidays);
  buildHolidayTable();
  closeHolidayModalFn();
});

// ── DELETE CONFIRM MODAL ──────────────────────────────────────
var deleteConfirmModal = document.getElementById('deleteConfirmModal');
var deleteHolidayName  = document.getElementById('deleteHolidayName');
var pendingDeleteId    = null;

function openDeleteConfirm(h) {
  pendingDeleteId = h.id;
  deleteHolidayName.textContent = h.name;
  deleteConfirmModal.classList.add('open');
}

document.getElementById('closeDeleteModal').addEventListener('click', function() { deleteConfirmModal.classList.remove('open'); });
document.getElementById('cancelDeleteModal').addEventListener('click', function() { deleteConfirmModal.classList.remove('open'); });
deleteConfirmModal.addEventListener('click', function(e) { if (e.target===deleteConfirmModal) deleteConfirmModal.classList.remove('open'); });

document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
  if (!pendingDeleteId) return;
  var holidays = getHolidays().filter(function(h) { return h.id !== pendingDeleteId; });
  saveHolidays(holidays);
  pendingDeleteId = null;
  deleteConfirmModal.classList.remove('open');
  buildHolidayTable();
});

// ── ADD EMPLOYEE MODAL ────────────────────────────────────────
var addEmpModal  = document.getElementById('addEmpModal');
var addEmpBtn    = document.getElementById('addEmpBtn');
var closeEmpModal = document.getElementById('closeEmpModal');
var cancelEmp    = document.getElementById('cancelEmp');
if (addEmpBtn)    addEmpBtn.addEventListener('click',    function() { addEmpModal.classList.add('open'); });
if (closeEmpModal) closeEmpModal.addEventListener('click', function() { addEmpModal.classList.remove('open'); });
if (cancelEmp)    cancelEmp.addEventListener('click',    function() { addEmpModal.classList.remove('open'); });
if (addEmpModal)  addEmpModal.addEventListener('click',  function(e) { if (e.target===addEmpModal) addEmpModal.classList.remove('open'); });

// Save new employee
var saveEmpBtn = addEmpModal ? addEmpModal.querySelector('.btn-primary') : null;
if (saveEmpBtn) {
  saveEmpBtn.addEventListener('click', function() {
    var inputs = addEmpModal.querySelectorAll('input, select');
    var firstName = inputs[0].value.trim();
    var lastName  = inputs[1].value.trim();
    var email     = inputs[2].value.trim();
    var dept      = inputs[4].value;
    var role      = inputs[5].value.trim();
    var joinRaw   = inputs[6].value;
    var empId     = inputs[7].value.trim();
    if (!firstName || !lastName || !role || !joinRaw || !empId) {
      alert('Please fill in all required fields (Name, Role, Join Date, Employee ID).');
      return;
    }
    var initials = (firstName[0] + lastName[0]).toUpperCase();
    var joinDate = new Date(joinRaw + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
    var newEmp = { id:empId, name:firstName+' '+lastName, dept:dept, role:role, join:joinDate, status:'active', initials:initials, isSample:false };
    employees.push(newEmp);
    saveEmployees(employees);
    buildEmployeeTable(employees);
    addEmpModal.classList.remove('open');
    // clear inputs
    inputs.forEach(function(i) { if (i.tagName !== 'SELECT') i.value = ''; });
  });
}

// Clear sample data
var clearSampleBtn = document.getElementById('clearSampleBtn');
if (clearSampleBtn) {
  clearSampleBtn.addEventListener('click', function() {
    if (!confirm('This will delete all ' + employees.filter(function(e){return e.isSample;}).length + ' sample employees. Continue?')) return;
    employees = employees.filter(function(e) { return !e.isSample; });
    saveEmployees(employees);
    buildEmployeeTable(employees);
  });
}

// ── EDIT EMPLOYEE MODAL ───────────────────────────────────────
var editEmpModal = document.getElementById('editEmpModal');

function openEditEmp(emp) {
  var nameParts = emp.name.split(' ');
  document.getElementById('editEmpId').value       = emp.id;
  document.getElementById('editFirstName').value   = nameParts[0] || '';
  document.getElementById('editLastName').value    = nameParts.slice(1).join(' ') || '';
  document.getElementById('editEmpIdField').value  = emp.id;
  document.getElementById('editRole').value        = emp.role;
  document.getElementById('editDept').value        = emp.dept;
  document.getElementById('editStatus').value      = emp.status;
  // Convert join date string back to YYYY-MM-DD for date input
  try {
    var d = new Date(emp.join);
    if (!isNaN(d)) document.getElementById('editJoinDate').value = d.toISOString().split('T')[0];
  } catch(e) {}
  document.getElementById('editEmpError').style.display = 'none';
  editEmpModal.classList.add('open');
}

document.getElementById('closeEditEmpModal').addEventListener('click', function() { editEmpModal.classList.remove('open'); });
document.getElementById('cancelEditEmp').addEventListener('click', function() { editEmpModal.classList.remove('open'); });
editEmpModal.addEventListener('click', function(e) { if (e.target === editEmpModal) editEmpModal.classList.remove('open'); });

document.getElementById('saveEditEmpBtn').addEventListener('click', function() {
  var id        = document.getElementById('editEmpId').value;
  var firstName = document.getElementById('editFirstName').value.trim();
  var lastName  = document.getElementById('editLastName').value.trim();
  var role      = document.getElementById('editRole').value.trim();
  var dept      = document.getElementById('editDept').value;
  var status    = document.getElementById('editStatus').value;
  var joinRaw   = document.getElementById('editJoinDate').value;
  var errEl     = document.getElementById('editEmpError');

  if (!firstName || !lastName || !role) {
    errEl.textContent = 'Name and Designation are required.';
    errEl.style.display = 'block'; return;
  }
  var joinDate = joinRaw ? new Date(joinRaw + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '';
  var initials = (firstName[0] + (lastName[0]||'')).toUpperCase();

  employees = employees.map(function(e) {
    if (e.id !== id) return e;
    return Object.assign({}, e, { name:firstName+' '+lastName, role:role, dept:dept, status:status, join:joinDate, initials:initials, isSample:false });
  });
  saveEmployees(employees);
  buildEmployeeTable(employees);
  editEmpModal.classList.remove('open');
});

// ── ATTENDANCE STORE ──────────────────────────────────────────
function getAttendanceRecords() {
  try { return JSON.parse(localStorage.getItem('wp_attendance') || '[]'); } catch(e) { return []; }
}
function saveAttendanceRecords(list) { localStorage.setItem('wp_attendance', JSON.stringify(list)); }

function calcHours(inTime, outTime) {
  if (!inTime || !outTime || inTime === '—' || outTime === '—') return '—';
  var parts1 = inTime.split(':'), parts2 = outTime.split(':');
  var mins = (parseInt(parts2[0])*60 + parseInt(parts2[1])) - (parseInt(parts1[0])*60 + parseInt(parts1[1]));
  if (mins <= 0) return '—';
  return Math.floor(mins/60) + 'h ' + (mins%60) + 'm';
}

function buildAttendanceTable() {
  var tbody = document.getElementById('adminAttendanceBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  var records = getAttendanceRecords();
  var countEl = document.getElementById('attRecordCount');

  // Sort by date desc then employee name
  records.sort(function(a,b) { return b.date.localeCompare(a.date) || a.empName.localeCompare(b.empName); });

  if (countEl) countEl.textContent = records.length + ' records';

  if (!records.length) {
    var tr = document.createElement('tr');
    var td = document.createElement('td'); td.colSpan = 7;
    td.style.cssText = 'text-align:center;padding:32px;color:var(--text-muted);font-size:13px;';
    td.textContent = 'No attendance records yet. Click "+ Mark Attendance" to add.';
    tr.appendChild(td); tbody.appendChild(tr); return;
  }

  var bm = { present:'badge-green', late:'badge-yellow', leave:'badge-blue', absent:'badge-red', weekend:'badge-blue' };
  var lm = { present:'Present', late:'Late', leave:'On Leave', absent:'Absent', weekend:'Weekend' };

  records.forEach(function(r) {
    var tr = document.createElement('tr');
    function td(t,style) { var c=document.createElement('td'); c.textContent=t; if(style) c.style.cssText=style; return c; }
    // Format date nicely
    var dateLabel = '';
    try { dateLabel = new Date(r.date+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric',weekday:'short'}); } catch(e){ dateLabel=r.date; }
    tr.appendChild(td(dateLabel));
    tr.appendChild(td(r.empName));
    tr.appendChild(td(r.dept || '—'));
    tr.appendChild(td(r.checkIn || '—'));
    tr.appendChild(td(r.checkOut || '—'));
    tr.appendChild(td(calcHours(r.checkIn, r.checkOut)));
    var stTd = document.createElement('td');
    var badge = document.createElement('span'); badge.className='badge '+(bm[r.status]||'badge-blue'); badge.textContent=lm[r.status]||r.status;
    stTd.appendChild(badge); tr.appendChild(stTd);
    tbody.appendChild(tr);
  });
}
buildAttendanceTable();

// ── ATTENDANCE MODAL ──────────────────────────────────────────
var attModal = document.getElementById('attendanceModal');
var markAttBtn = document.getElementById('markAttBtn');

function populateAttEmpSelect() {
  var sel = document.getElementById('attEmpSelect');
  if (!sel) return;
  sel.innerHTML = '';
  employees.forEach(function(e) {
    var opt = document.createElement('option');
    opt.value = e.id; opt.textContent = e.name + ' (' + e.dept + ')';
    sel.appendChild(opt);
  });
}

// Set default date to today, min = June 1 of current year
function initAttModal() {
  populateAttEmpSelect();
  var today = new Date();
  var todayStr = today.toISOString().split('T')[0];
  var minDate = today.getFullYear() + '-06-01';
  var attDateInput = document.getElementById('attDate');
  attDateInput.value = todayStr;
  attDateInput.max   = todayStr;
  attDateInput.min   = minDate;
  document.getElementById('attCheckInTime').value  = '09:00';
  document.getElementById('attCheckOutTime').value = '18:00';
  document.getElementById('attStatusSelect').value = 'present';
  document.getElementById('attFormError').style.display = 'none';
}

if (markAttBtn) markAttBtn.addEventListener('click', function() { initAttModal(); attModal.classList.add('open'); });
document.getElementById('closeAttModal').addEventListener('click', function() { attModal.classList.remove('open'); });
document.getElementById('cancelAttModal').addEventListener('click', function() { attModal.classList.remove('open'); });
attModal.addEventListener('click', function(e) { if (e.target === attModal) attModal.classList.remove('open'); });

// Auto-clear times when status is absent/weekend
document.getElementById('attStatusSelect').addEventListener('change', function() {
  var s = this.value;
  if (s === 'absent' || s === 'weekend') {
    document.getElementById('attCheckInTime').value  = '';
    document.getElementById('attCheckOutTime').value = '';
  }
});

document.getElementById('saveAttBtn').addEventListener('click', function() {
  var empId   = document.getElementById('attEmpSelect').value;
  var date    = document.getElementById('attDate').value;
  var checkIn = document.getElementById('attCheckInTime').value;
  var checkOut= document.getElementById('attCheckOutTime').value;
  var status  = document.getElementById('attStatusSelect').value;
  var errEl   = document.getElementById('attFormError');

  if (!empId || !date) {
    errEl.textContent = 'Please select an employee and date.';
    errEl.style.display = 'block'; return;
  }
  if (new Date(date) > new Date()) {
    errEl.textContent = 'Cannot mark attendance for a future date.';
    errEl.style.display = 'block'; return;
  }

  var emp = employees.find(function(e) { return e.id === empId; });
  if (!emp) return;

  var records = getAttendanceRecords();
  // Remove existing record for same employee + date (overwrite)
  records = records.filter(function(r) { return !(r.empId === empId && r.date === date); });

  records.push({
    empId:    empId,
    empName:  emp.name,
    dept:     emp.dept,
    date:     date,
    checkIn:  (status==='absent'||status==='weekend') ? '—' : (checkIn || '—'),
    checkOut: (status==='absent'||status==='weekend') ? '—' : (checkOut || '—'),
    status:   status
  });
  saveAttendanceRecords(records);
  buildAttendanceTable();
  attModal.classList.remove('open');
});

// ── WORKING HOURS TABLE ───────────────────────────────────────
var workHoursData = [
  { id:'WP-1001', name:'Arjun Kumar',  dept:'Engineering', initials:'AK', workDays:5, totalHours:45, todayIn:'09:02', todayOut:'—', todayMins:360 },
  { id:'WP-1002', name:'Priya Sharma', dept:'HR',          initials:'PS', workDays:5, totalHours:46, todayIn:'08:55', todayOut:'—', todayMins:375 },
  { id:'WP-1003', name:'Ravi Shankar', dept:'Engineering', initials:'RS', workDays:5, totalHours:48, todayIn:'09:15', todayOut:'—', todayMins:340 },
  { id:'WP-1004', name:'Sneha Patel',  dept:'Finance',     initials:'SP', workDays:5, totalHours:43, todayIn:'09:30', todayOut:'—', todayMins:315 },
  { id:'WP-1005', name:'Karan Singh',  dept:'Sales',       initials:'KS', workDays:5, totalHours:44, todayIn:'09:00', todayOut:'—', todayMins:360 },
  { id:'WP-1006', name:'Ananya Roy',   dept:'Marketing',   initials:'AR', workDays:4, totalHours:36, todayIn:'—',     todayOut:'—', todayMins:0   },
  { id:'WP-1007', name:'Vijay Menon',  dept:'Engineering', initials:'VM', workDays:5, totalHours:45, todayIn:'09:10', todayOut:'—', todayMins:350 },
  { id:'WP-1008', name:'Deepa Nair',   dept:'HR',          initials:'DN', workDays:4, totalHours:35, todayIn:'—',     todayOut:'—', todayMins:0   },
];

// June 2–8: 5 working weekdays (Mon–Fri), today Sun = 8 is a holiday/weekend
// Target: 5 days × 8h = 40h
var TARGET_DAYS  = 5;
var TARGET_HOURS = 40;

function buildWorkHoursTable() {
  var tbody = document.getElementById('workHoursTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  workHoursData.forEach(function(emp) {
    var tr = document.createElement('tr');

    var empTd = document.createElement('td');
    var wrap = document.createElement('div'); wrap.style.cssText='display:flex;align-items:center;gap:8px;';
    var av = document.createElement('div'); av.className='avatar'; av.style.cssText='width:28px;height:28px;font-size:10px;flex-shrink:0;'; av.textContent=emp.initials;
    var nameDiv = document.createElement('div');
    var nm=document.createElement('div'); nm.style.cssText='font-weight:600;font-size:13px;'; nm.textContent=emp.name;
    var id=document.createElement('div'); id.style.cssText='font-size:10px;color:var(--text-muted);'; id.textContent=emp.id;
    nameDiv.appendChild(nm); nameDiv.appendChild(id); wrap.appendChild(av); wrap.appendChild(nameDiv); empTd.appendChild(wrap);
    tr.appendChild(empTd);

    function td(t){var c=document.createElement('td');c.textContent=t;return c;}
    tr.appendChild(td(emp.dept));

    // Working Days progress
    var daysTd=document.createElement('td');
    var dayColor=emp.workDays>=TARGET_DAYS?'good':emp.workDays>=TARGET_DAYS-1?'warn':'low';
    var dw=document.createElement('div'); dw.className='wh-progress';
    var dt=document.createElement('div'); dt.className='wh-bar-track';
    var df=document.createElement('div'); df.className='wh-bar-fill '+dayColor; df.style.width=Math.round((emp.workDays/TARGET_DAYS)*100)+'%';
    dt.appendChild(df); var dl=document.createElement('span'); dl.className='wh-hours-label'; dl.textContent=emp.workDays+' / '+TARGET_DAYS;
    dw.appendChild(dt); dw.appendChild(dl); daysTd.appendChild(dw); tr.appendChild(daysTd);

    // Total hours progress
    var hrsTd=document.createElement('td');
    var hrsColor=emp.totalHours>=TARGET_HOURS?'good':emp.totalHours>=TARGET_HOURS-5?'warn':'low';
    var hw=document.createElement('div'); hw.className='wh-progress';
    var ht=document.createElement('div'); ht.className='wh-bar-track';
    var hf=document.createElement('div'); hf.className='wh-bar-fill '+hrsColor; hf.style.width=Math.min(100,Math.round((emp.totalHours/TARGET_HOURS)*100))+'%';
    ht.appendChild(hf); var hl=document.createElement('span'); hl.className='wh-hours-label'; hl.textContent=emp.totalHours+'h / '+TARGET_HOURS+'h';
    hw.appendChild(ht); hw.appendChild(hl); hrsTd.appendChild(hw); tr.appendChild(hrsTd);

    var avg = emp.workDays>0?(emp.totalHours/emp.workDays).toFixed(1):'0.0';
    tr.appendChild(td(avg+'h'));

    var ot=Math.max(0,emp.totalHours-TARGET_HOURS);
    var otTd=document.createElement('td'); otTd.textContent=ot>0?'+'+ot+'h':'—';
    if(ot>0) otTd.style.cssText='color:var(--green);font-weight:600;';
    tr.appendChild(otTd);

    tr.appendChild(td(emp.todayIn));
    tr.appendChild(td(emp.todayOut));

    var todayH=Math.floor(emp.todayMins/60), todayM=emp.todayMins%60;
    var todayTd=document.createElement('td');
    todayTd.textContent=emp.todayMins>0?todayH+'h '+todayM+'m':'—';
    if(emp.todayMins>0) todayTd.style.cssText='font-weight:600;color:var(--brand);';
    tr.appendChild(todayTd);

    var stTd=document.createElement('td'); var b=document.createElement('span');
    var isPresent=emp.todayIn!=='—';
    b.className=isPresent?'badge badge-green':'badge badge-red';
    b.textContent=isPresent?'Present':'Absent';
    stTd.appendChild(b); tr.appendChild(stTd);

    tbody.appendChild(tr);
  });
}
buildWorkHoursTable();

// ── LIVE DATE LABEL ───────────────────────────────────────────
(function() {
  var el = document.getElementById('liveDate');
  if (el) el.textContent = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
})();

// ── LIVE PUNCH GRID ───────────────────────────────────────────
(function() {
  var container = document.getElementById('livePunchGrid');
  if (!container) return;
  workHoursData.forEach(function(emp) {
    var card=document.createElement('div'); card.className='punch-card';
    var header=document.createElement('div'); header.className='punch-card-header';
    var av=document.createElement('div'); av.className='punch-card-avatar'; av.textContent=emp.initials;
    var info=document.createElement('div');
    var nm=document.createElement('div'); nm.className='punch-card-name'; nm.textContent=emp.name;
    var dp=document.createElement('div'); dp.className='punch-card-dept'; dp.textContent=emp.dept;
    info.appendChild(nm); info.appendChild(dp); header.appendChild(av); header.appendChild(info);

    var isPresent=emp.todayIn!=='—';
    var badge=document.createElement('span');
    badge.className=isPresent?'badge badge-green':'badge badge-red';
    badge.textContent=isPresent?'● Working':'○ Not In'; badge.style.fontSize='11px';

    var times=document.createElement('div'); times.className='punch-card-times';
    var inItem=document.createElement('div'); inItem.className='punch-time-item';
    var inLbl=document.createElement('div'); inLbl.className='punch-time-label'; inLbl.textContent='IN';
    var inVal=document.createElement('div'); inVal.className='punch-time-val'; inVal.textContent=emp.todayIn;
    inItem.appendChild(inLbl); inItem.appendChild(inVal);
    var outItem=document.createElement('div'); outItem.className='punch-time-item';
    var outLbl=document.createElement('div'); outLbl.className='punch-time-label'; outLbl.textContent='OUT';
    var outVal=document.createElement('div'); outVal.className='punch-time-val'; outVal.textContent=emp.todayOut;
    outItem.appendChild(outLbl); outItem.appendChild(outVal);
    times.appendChild(inItem); times.appendChild(outItem);

    var hoursRow=document.createElement('div'); hoursRow.className='punch-hours';
    var hLbl=document.createElement('span'); hLbl.style.cssText='font-size:11px;color:var(--text-muted);'; hLbl.textContent='Today';
    var hVal=document.createElement('span'); hVal.className='punch-hours-val';
    if(emp.todayMins>0){ hVal.textContent=Math.floor(emp.todayMins/60)+'h '+(emp.todayMins%60)+'m'; }
    else { hVal.textContent='—'; hVal.style.color='var(--text-muted)'; }
    hoursRow.appendChild(hLbl); hoursRow.appendChild(hVal);

    card.appendChild(header); card.appendChild(badge); card.appendChild(times); card.appendChild(hoursRow);
    container.appendChild(card);
  });
})();

// ── REPORTS BARS ──────────────────────────────────────────────
(function() {
  var container = document.getElementById('reportBars');
  if (!container) return;
  var data=[
    { label:'Engineering', used:8 }, { label:'Sales', used:3 },
    { label:'Finance', used:2 },     { label:'HR', used:1 }, { label:'Marketing', used:5 },
  ];
  var max=8;
  data.forEach(function(d) {
    var item=document.createElement('div'); item.className='report-bar-item';
    var lbl=document.createElement('div'); lbl.className='report-bar-label';
    var l=document.createElement('span'); l.textContent=d.label;
    var r=document.createElement('span'); r.textContent=d.used+' leave days';
    lbl.appendChild(l); lbl.appendChild(r);
    var track=document.createElement('div'); track.className='report-bar-track';
    var fill=document.createElement('div'); fill.className='report-bar-fill'; fill.style.width=Math.round((d.used/max)*100)+'%';
    track.appendChild(fill); item.appendChild(lbl); item.appendChild(track); container.appendChild(item);
  });
})();

// ── SALARY SLIP UPLOAD (Admin → Employee) ─────────────────────
(function() {
  // Add Salary Upload screen to admin if the section exists
  var screen = document.getElementById('screen-admin-salary');
  if (!screen) return;

  var empSelect  = document.getElementById('salaryEmpSelect');
  var monthInput = document.getElementById('salaryMonth');
  var grossInput = document.getElementById('salaryGross');
  var dedInput   = document.getElementById('salaryDed');
  var netInput   = document.getElementById('salaryNet');
  var fileInput  = document.getElementById('salaryFile');
  var uploadBtn  = document.getElementById('uploadSlipBtn');
  var slipMsg    = document.getElementById('slipUploadMsg');

  if (!empSelect) return;

  // Populate employee dropdown
  employees.forEach(function(emp) {
    var opt=document.createElement('option');
    opt.value=emp.id; opt.textContent=emp.name+' ('+emp.id+')';
    empSelect.appendChild(opt);
  });

  // Auto-calc net pay
  function calcNet() {
    var g=parseFloat((grossInput.value||'0').replace(/[^0-9.]/g,''));
    var d=parseFloat((dedInput.value||'0').replace(/[^0-9.]/g,''));
    if(!isNaN(g)&&!isNaN(d)) netInput.value='₹'+(g-d).toLocaleString('en-IN');
  }
  grossInput.addEventListener('input', calcNet);
  dedInput.addEventListener('input', calcNet);

  uploadBtn.addEventListener('click', function() {
    var empId  = empSelect.value;
    var month  = monthInput.value;
    var gross  = grossInput.value.trim();
    var ded    = dedInput.value.trim();
    var net    = netInput.value.trim();
    var file   = fileInput.files[0];

    slipMsg.style.display='none';
    if (!empId||!month||!gross||!ded) {
      slipMsg.textContent='⚠️ Please fill all fields.';
      slipMsg.style.cssText='display:block;color:var(--red);font-size:13px;margin-top:8px;';
      return;
    }

    var key = 'wp_slips_' + empId;
    var slips=[];
    try { slips=JSON.parse(localStorage.getItem(key)||'[]'); } catch(e){}

    // Format month label e.g. "2026-05" → "May 2026"
    var d=new Date(month+'-01');
    var label=d.toLocaleDateString('en-IN',{month:'long',year:'numeric'});

    // Remove existing entry for same month
    slips=slips.filter(function(s){return s.month!==label;});

    var entry={month:label, gross:'₹'+gross, deductions:'₹'+ded, net:net, file:null};

    if (file) {
      // Read file as base64 data URL
      var reader=new FileReader();
      reader.onload=function(ev) {
        entry.file=ev.target.result;
        slips.unshift(entry);
        try { localStorage.setItem(key,JSON.stringify(slips)); } catch(e){
          slipMsg.textContent='⚠️ File too large for browser storage. Save without file.';
          slipMsg.style.cssText='display:block;color:var(--red);font-size:13px;margin-top:8px;';
          return;
        }
        showAdminToast('✅ Payslip uploaded for '+empSelect.options[empSelect.selectedIndex].text.split(' (')[0]);
        resetSlipForm();
        buildSlipHistory();
      };
      reader.readAsDataURL(file);
    } else {
      slips.unshift(entry);
      try { localStorage.setItem(key,JSON.stringify(slips)); } catch(e){}
      showAdminToast('✅ Salary details saved (no file attached).');
      resetSlipForm();
      buildSlipHistory();
    }
  });

  function resetSlipForm() {
    monthInput.value=''; grossInput.value=''; dedInput.value=''; netInput.value=''; fileInput.value='';
  }

  function buildSlipHistory() {
    var tbody=document.getElementById('slipHistoryBody');
    if (!tbody) return;
    tbody.innerHTML='';
    employees.forEach(function(emp) {
      var key='wp_slips_'+emp.id;
      var slips=[];
      try { slips=JSON.parse(localStorage.getItem(key)||'[]'); } catch(e){}
      slips.slice(0,3).forEach(function(s) {
        var tr=document.createElement('tr');
        function td(t){var c=document.createElement('td');c.textContent=t;return c;}
        tr.appendChild(td(emp.name)); tr.appendChild(td(s.month));
        tr.appendChild(td(s.gross)); tr.appendChild(td(s.deductions)); tr.appendChild(td(s.net));
        var fileTd=document.createElement('td');
        var fb=document.createElement('span');
        fb.className=s.file?'badge badge-green':'badge badge-yellow';
        fb.textContent=s.file?'PDF Attached':'No File';
        fileTd.appendChild(fb); tr.appendChild(fileTd);
        tbody.appendChild(tr);
      });
    });
  }
  buildSlipHistory();
})();

function showAdminToast(msg) {
  var old=document.getElementById('adminToast'); if(old) old.remove();
  var t=document.createElement('div'); t.id='adminToast'; t.textContent=msg;
  t.style.cssText='position:fixed;bottom:28px;right:28px;background:#1e1b4b;color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,.2);';
  document.body.appendChild(t);
  setTimeout(function(){if(t.parentNode)t.remove();},3000);
}
