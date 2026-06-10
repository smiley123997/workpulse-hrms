/* ============================================================
   WorkPulse HRMS — Employee Dashboard
   ============================================================ */

// ── AUTH CHECK — stop everything if not logged in ────────────
var CURRENT_USER = (function() {
  try {
    var raw = sessionStorage.getItem('wp_user');
    if (!raw) { window.location.replace('login.html'); return null; }
    var u = JSON.parse(raw);
    if (!u || u.role === 'admin') { window.location.replace('login.html'); return null; }
    return u;
  } catch(e) { window.location.replace('login.html'); return null; }
})();

// Stop execution if redirecting
if (!CURRENT_USER) { throw 0; }

/* ============================================================
   ALL CODE BELOW ONLY RUNS IF USER IS VALID
   ============================================================ */

// ── POPULATE USER INFO ────────────────────────────────────────
document.getElementById('sidebarAvatar').textContent   = CURRENT_USER.initials;
document.getElementById('sidebarName').textContent     = CURRENT_USER.name;
document.getElementById('sidebarRole').textContent     = CURRENT_USER.designation;
document.getElementById('topbarAvatar').textContent    = CURRENT_USER.initials;
document.getElementById('profileAvatarLg').textContent = CURRENT_USER.initials;
document.getElementById('profileName').textContent     = CURRENT_USER.name;
document.getElementById('profileRole').textContent     = CURRENT_USER.designation + ' — ' + CURRENT_USER.dept;

// ── LOGOUT ───────────────────────────────────────────────────
document.getElementById('logoutBtn').addEventListener('click', function(e) {
  e.preventDefault();
  sessionStorage.removeItem('wp_user');
  window.location.href = 'login.html';
});

// ── NAVIGATION ───────────────────────────────────────────────
document.querySelectorAll('.nav-item[data-screen]').forEach(function(item) {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    var screen = this.getAttribute('data-screen');
    document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
    var el = document.getElementById('screen-' + screen);
    if (el) el.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
    this.classList.add('active');
    document.getElementById('sidebar').classList.remove('open');
  });
});

document.getElementById('menuToggle').addEventListener('click', function() {
  document.getElementById('sidebar').classList.toggle('open');
});

// ── LIVE CLOCK ────────────────────────────────────────────────
setInterval(function() {
  var now = new Date();
  var el = document.getElementById('liveClock');
  if (el) el.textContent = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
}, 1000);

// ── GREETING ─────────────────────────────────────────────────
(function() {
  var h = new Date().getHours();
  var g = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
  document.getElementById('greetingText').textContent = g + ', ' + CURRENT_USER.name.split(' ')[0] + ' 👋';
  var dl = document.getElementById('todayDateLabel');
  if (dl) dl.textContent = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
})();

// ── CHECK IN / OUT ────────────────────────────────────────────
var state = { in: false, out: false, inTime: null, outTime: null, secs: 0, timer: null };

function pad(n) { return String(n).padStart(2,'0'); }
function ftime(d) { return d ? pad(d.getHours())+':'+pad(d.getMinutes()) : '--:--'; }
function fhms(s)  { return pad(Math.floor(s/3600))+':'+pad(Math.floor((s%3600)/60))+':'+pad(s%60); }
function fhm(s)   { return Math.floor(s/3600)+'h '+Math.floor((s%3600)/60)+'m'; }

function refreshCheckin() {
  var dot  = document.getElementById('checkinDot');
  var ttl  = document.getElementById('checkinTitle');
  var sub  = document.getElementById('checkinSub');
  var btn  = document.getElementById('checkInBtn');
  var icon = document.getElementById('checkInBtnIcon');
  var txt  = document.getElementById('checkInBtnText');
  if (!dot) return;

  if (!state.in && !state.out) {
    dot.className = 'checkin-status-dot';
    ttl.textContent = 'Not Checked In';
    sub.textContent = 'Tap Check In to start your session';
    btn.className = 'btn btn-checkin'; btn.disabled = false;
    btn.style.opacity = '1'; btn.style.cursor = 'pointer';
    icon.textContent = '▶'; txt.textContent = 'Check In';
  } else if (state.in && !state.out) {
    dot.className = 'checkin-status-dot active';
    ttl.textContent = 'Currently Working';
    sub.textContent = 'Checked in at ' + ftime(state.inTime);
    btn.className = 'btn btn-checkin checked-in'; btn.disabled = false;
    icon.textContent = '⏹'; txt.textContent = 'Check Out';
  } else {
    dot.className = 'checkin-status-dot done';
    ttl.textContent = 'Session Complete';
    sub.textContent = 'Great work! Total: ' + fhm(state.secs);
    btn.disabled = true; btn.style.opacity = '.5'; btn.style.cursor = 'not-allowed';
  }

  document.getElementById('displayCheckIn').textContent  = ftime(state.inTime);
  document.getElementById('displayCheckOut').textContent = ftime(state.outTime);
  document.getElementById('checkinTimer').textContent    = fhms(state.secs);
  document.getElementById('statCheckIn').textContent     = (state.in||state.out) ? ftime(state.inTime) : '--:--';
  document.getElementById('statHours').textContent       = fhm(state.secs);

  var ai = document.getElementById('attCheckIn'),   ao = document.getElementById('attCheckOut');
  var at = document.getElementById('attTotalHours'), as2 = document.getElementById('attStatus');
  if (ai) ai.textContent = ftime(state.inTime);
  if (ao) ao.textContent = ftime(state.outTime);
  if (at) at.textContent = fhm(state.secs);
  if (as2) {
    if (!state.in && !state.out)  as2.innerHTML = '<span class="badge badge-yellow">Not Started</span>';
    else if (state.in)            as2.innerHTML = '<span class="badge badge-green">In Progress</span>';
    else                          as2.innerHTML = '<span class="badge badge-blue">Complete</span>';
  }
}

document.getElementById('checkInBtn').addEventListener('click', function() {
  if (!state.in && !state.out) {
    state.in = true; state.inTime = new Date();
    state.timer = setInterval(function() { state.secs++; refreshCheckin(); }, 1000);
  } else if (state.in && !state.out) {
    state.in = false; state.out = true; state.outTime = new Date();
    clearInterval(state.timer);
  }
  refreshCheckin();
});
refreshCheckin();

// ── CALENDAR (June 2026) ──────────────────────────────────────
(function() {
  var grid = document.getElementById('calendarGrid');
  if (!grid) return;
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(function(d) {
    var h = document.createElement('div'); h.className='cal-day-head'; h.textContent=d; grid.appendChild(h);
  });
  // June 2026 starts on Monday (day index 1)
  var startDay = 1, today = new Date().getDate();
  for (var e=0; e<startDay; e++) {
    var em=document.createElement('div'); em.className='cal-day empty'; grid.appendChild(em);
  }
  for (var d=1; d<=30; d++) {
    var cell=document.createElement('div');
    var dow=(startDay+d-1)%7;
    var cls='cal-day';
    if (d===today) cls+=' today';
    else if (dow===0||dow===6) cls+=' weekend';
    else if (d<today) cls+=' present';
    cell.className=cls; cell.textContent=d; grid.appendChild(cell);
  }
})();

// ── LEAVE BARS ────────────────────────────────────────────────
(function() {
  var c = document.getElementById('leaveBars');
  if (!c) return;
  [{label:'Casual Leave',used:3,total:12,color:'#6366f1'},
   {label:'Sick Leave',  used:2,total:8, color:'#22c55e'},
   {label:'Earned Leave',used:5,total:15,color:'#f59e0b'},
   {label:'Comp Off',    used:1,total:4, color:'#3b82f6'}].forEach(function(t) {
    var w=document.createElement('div'); w.className='leave-bar-item';
    var lb=document.createElement('div'); lb.className='leave-bar-label';
    var l=document.createElement('span'); l.textContent=t.label;
    var r=document.createElement('span'); r.textContent=t.used+' / '+t.total+' days';
    lb.appendChild(l); lb.appendChild(r);
    var tr=document.createElement('div'); tr.className='leave-bar-track';
    var f=document.createElement('div'); f.className='leave-bar-fill';
    f.style.width=Math.round((t.used/t.total)*100)+'%'; f.style.background=t.color;
    tr.appendChild(f); w.appendChild(lb); w.appendChild(tr); c.appendChild(w);
  });
})();

// ── UPCOMING HOLIDAYS ─────────────────────────────────────────
(function() {
  var c = document.getElementById('holidayList');
  if (!c) return;
  var list = getHolidays();
  var now  = new Date();
  var upcoming = list.filter(function(h) { return new Date(h.date+'T00:00:00') >= now; }).slice(0,5);
  if (!upcoming.length) {
    var p=document.createElement('p'); p.style.cssText='color:var(--text-muted);font-size:13px;';
    p.textContent='No upcoming holidays.'; c.appendChild(p); return;
  }
  upcoming.forEach(function(h) {
    var item=document.createElement('div'); item.className='holiday-item';
    var nm=document.createElement('div'); nm.className='holiday-name'; nm.textContent=h.name;
    var dt=document.createElement('div'); dt.className='holiday-date'; dt.textContent=formatHolidayDate(h.date);
    item.appendChild(nm); item.appendChild(dt); c.appendChild(item);
  });
})();

// ── LEAVE STORE ───────────────────────────────────────────────
var LEAVE_KEY = 'wp_leaves_' + CURRENT_USER.id;

function getLeaves() {
  try { var r=localStorage.getItem(LEAVE_KEY); return r?JSON.parse(r):defaultLeaves(); }
  catch(e) { return defaultLeaves(); }
}
function saveLeaves(list) { try { localStorage.setItem(LEAVE_KEY, JSON.stringify(list)); } catch(e){} }
function defaultLeaves() {
  return [
    {id:1,type:'Casual Leave', from:'2026-06-10',to:'2026-06-12',days:3,reason:'Family function', status:'pending'},
    {id:2,type:'Sick Leave',   from:'2026-05-28',to:'2026-05-29',days:2,reason:'Fever and rest',  status:'approved'},
    {id:3,type:'Earned Leave', from:'2026-04-15',to:'2026-04-19',days:5,reason:'Travel',           status:'approved'},
    {id:4,type:'Comp Off',     from:'2026-03-22',to:'2026-03-22',days:1,reason:'Weekend overtime', status:'rejected'},
  ];
}
function daysBetween(f,t) {
  var d1=new Date(f),d2=new Date(t);
  return Math.max(1,Math.round((d2-d1)/(864e5))+1);
}
function fdate(s) {
  try { return new Date(s+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}); }
  catch(e){return s;}
}

// ── RECENT REQUESTS ───────────────────────────────────────────
(function() {
  var c = document.getElementById('recentRequests');
  if (!c) return;
  var bm={pending:'badge-yellow',approved:'badge-green',rejected:'badge-red'};
  getLeaves().slice(-4).reverse().forEach(function(r) {
    var item=document.createElement('div'); item.className='request-item';
    var info=document.createElement('div'); info.className='request-info';
    var tp=document.createElement('div'); tp.className='request-type'; tp.textContent=r.type;
    var dt=document.createElement('div'); dt.className='request-date'; dt.textContent=fdate(r.from)+' – '+fdate(r.to);
    info.appendChild(tp); info.appendChild(dt);
    var b=document.createElement('span'); b.className='badge '+(bm[r.status]||'badge-blue');
    b.textContent=r.status.charAt(0).toUpperCase()+r.status.slice(1);
    item.appendChild(info); item.appendChild(b); c.appendChild(item);
  });
})();

// ── LEAVE HISTORY ─────────────────────────────────────────────
function buildLeaveHistory() {
  var tbody = document.getElementById('leaveHistoryBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  var leaves = getLeaves();
  var bm = {pending:'badge-yellow',approved:'badge-green',rejected:'badge-red'};
  if (!leaves.length) {
    var tr=document.createElement('tr');
    var td=document.createElement('td'); td.colSpan=6;
    td.style.cssText='text-align:center;color:var(--text-muted);padding:24px;';
    td.textContent='No leave requests yet. Click "+ Apply Leave" to submit one.';
    tr.appendChild(td); tbody.appendChild(tr); return;
  }
  leaves.slice().reverse().forEach(function(r) {
    var tr=document.createElement('tr');
    function td(t){var c=document.createElement('td');c.textContent=t;return c;}
    tr.appendChild(td(r.type)); tr.appendChild(td(fdate(r.from))); tr.appendChild(td(fdate(r.to)));
    tr.appendChild(td(r.days+' day'+(r.days>1?'s':'')));
    tr.appendChild(td(r.reason));
    var st=document.createElement('td'); var b=document.createElement('span');
    b.className='badge '+(bm[r.status]||'badge-blue');
    b.textContent=r.status.charAt(0).toUpperCase()+r.status.slice(1);
    st.appendChild(b); tr.appendChild(st); tbody.appendChild(tr);
  });
}
buildLeaveHistory();

// ── AUTO-REFRESH leave status every 10s (picks up admin decisions) ──
setInterval(function() {
  buildLeaveHistory();
  var c = document.getElementById('recentRequests');
  if (c) {
    c.innerHTML = '';
    var bm2={pending:'badge-yellow',approved:'badge-green',rejected:'badge-red'};
    getLeaves().slice(-4).reverse().forEach(function(r) {
      var item=document.createElement('div'); item.className='request-item';
      var info=document.createElement('div'); info.className='request-info';
      var tp=document.createElement('div'); tp.className='request-type'; tp.textContent=r.type;
      var dt=document.createElement('div'); dt.className='request-date'; dt.textContent=fdate(r.from)+' – '+fdate(r.to);
      info.appendChild(tp); info.appendChild(dt);
      var b=document.createElement('span'); b.className='badge '+(bm2[r.status]||'badge-blue');
      b.textContent=r.status.charAt(0).toUpperCase()+r.status.slice(1);
      item.appendChild(info); item.appendChild(b); c.appendChild(item);
    });
  }
}, 10000);

// ── LEAVE MODAL ───────────────────────────────────────────────
var leaveModal = document.getElementById('leaveModal');

document.getElementById('openLeaveModal').addEventListener('click', function() {
  document.getElementById('leaveType').value   = 'Casual Leave';
  document.getElementById('leaveFrom').value   = '';
  document.getElementById('leaveTo').value     = '';
  document.getElementById('leaveReason').value = '';
  document.getElementById('leaveFormError').style.display = 'none';
  leaveModal.classList.add('open');
});

function closeLeaveModal() { leaveModal.classList.remove('open'); }
document.getElementById('closeLeaveModal').addEventListener('click', closeLeaveModal);
document.getElementById('cancelLeave').addEventListener('click', closeLeaveModal);
leaveModal.addEventListener('click', function(e) { if (e.target===leaveModal) closeLeaveModal(); });

document.getElementById('submitLeaveBtn').addEventListener('click', function() {
  var type   = document.getElementById('leaveType').value;
  var from   = document.getElementById('leaveFrom').value;
  var to     = document.getElementById('leaveTo').value;
  var reason = document.getElementById('leaveReason').value.trim();
  var err    = document.getElementById('leaveFormError');
  err.style.display = 'none';

  if (!from)     { err.textContent='Please select a From date.';              err.style.display='block'; return; }
  if (!to)       { err.textContent='Please select a To date.';                err.style.display='block'; return; }
  if (to < from) { err.textContent='To date cannot be before From date.';     err.style.display='block'; return; }
  if (!reason)   { err.textContent='Please enter a reason for your leave.';   err.style.display='block'; return; }

  var leaves = getLeaves();
  var newId  = leaves.reduce(function(m,l){return l.id>m?l.id:m;},0)+1;
  var entry  = {
    id:newId, type:type, from:from, to:to,
    days:daysBetween(from,to), reason:reason, status:'pending',
    empId:CURRENT_USER.id, submittedBy:CURRENT_USER.name,
    dept:CURRENT_USER.dept, initials:CURRENT_USER.initials,
    submittedAt:new Date().toISOString()
  };
  leaves.push(entry);
  saveLeaves(leaves);

  try {
    var q=JSON.parse(localStorage.getItem('wp_approvals')||'[]');
    q.push(entry);
    localStorage.setItem('wp_approvals',JSON.stringify(q));
  } catch(e){}

  closeLeaveModal();
  buildLeaveHistory();
  showToast('✅ Leave request submitted!');
});

// ── ATTENDANCE LOG ────────────────────────────────────────────
(function() {
  var tbody = document.getElementById('attendanceLogBody');
  if (!tbody) return;
  var rows=[
    {date:'Jun 9, Mon (Today)',ci:'—',    co:'—',    h:'—',     s:'today'  },
    {date:'Jun 8, Sun',        ci:'—',    co:'—',    h:'—',     s:'weekend'},
    {date:'Jun 7, Sat',        ci:'—',    co:'—',    h:'—',     s:'weekend'},
    {date:'Jun 6, Fri',        ci:'09:04',co:'18:12',h:'9h 08m',s:'present'},
    {date:'Jun 5, Thu',        ci:'09:00',co:'18:05',h:'9h 05m',s:'present'},
    {date:'Jun 4, Wed',        ci:'08:57',co:'18:10',h:'9h 13m',s:'present'},
    {date:'Jun 3, Tue',        ci:'09:11',co:'17:55',h:'8h 44m',s:'present'},
    {date:'Jun 2, Mon',        ci:'09:08',co:'18:20',h:'9h 12m',s:'present'},
  ];
  var bm={present:'badge-green',absent:'badge-red',leave:'badge-yellow',weekend:'badge-blue',today:'badge-purple'};
  var lm={present:'Present',absent:'Absent',leave:'On Leave',weekend:'Weekend',today:'Today'};
  rows.forEach(function(r) {
    var tr=document.createElement('tr');
    if(r.s==='today') tr.style.background='var(--brand-light)';
    function td(t){var c=document.createElement('td');c.textContent=t;return c;}
    tr.appendChild(td(r.date));tr.appendChild(td(r.ci));tr.appendChild(td(r.co));tr.appendChild(td(r.h));
    var st=document.createElement('td');var b=document.createElement('span');
    b.className='badge '+(bm[r.s]||'badge-blue');b.textContent=lm[r.s]||r.s;
    st.appendChild(b);tr.appendChild(st);tbody.appendChild(tr);
  });
})();

// ── PROFILE ───────────────────────────────────────────────────
(function() {
  var p=document.getElementById('personalDetails');
  var e=document.getElementById('employmentDetails');
  if(!p||!e) return;
  function row(cont,k,v){
    var r=document.createElement('div');r.className='detail-row';
    var dk=document.createElement('div');dk.className='detail-key';dk.textContent=k;
    var dv=document.createElement('div');dv.className='detail-val';dv.textContent=v;
    r.appendChild(dk);r.appendChild(dv);cont.appendChild(r);
  }
  row(p,'Full Name',CURRENT_USER.name);
  row(p,'Email',CURRENT_USER.email);
  row(p,'Employee ID',CURRENT_USER.id);
  row(e,'Department',CURRENT_USER.dept);
  row(e,'Designation',CURRENT_USER.designation);
  row(e,'Join Date',CURRENT_USER.joinDate);
})();

// ── PAYSLIP (admin-uploaded slips via localStorage) ───────────
(function() {
  var tbody = document.getElementById('payslipBody');
  if (!tbody) return;
  var slipKey = 'wp_slips_' + CURRENT_USER.id;
  var slips = [];
  try { slips = JSON.parse(localStorage.getItem(slipKey)||'[]'); } catch(e){}

  // Default slips if none uploaded yet
  if (!slips.length) {
    slips = [
      {month:'May 2026',  gross:'₹75,000',deductions:'₹8,250',net:'₹66,750',file:null},
      {month:'April 2026',gross:'₹75,000',deductions:'₹8,250',net:'₹66,750',file:null},
      {month:'March 2026',gross:'₹75,000',deductions:'₹8,250',net:'₹66,750',file:null},
    ];
  }

  slips.forEach(function(r) {
    var tr=document.createElement('tr');
    function td(t){var c=document.createElement('td');c.textContent=t;return c;}
    tr.appendChild(td(r.month));tr.appendChild(td(r.gross));tr.appendChild(td(r.deductions));tr.appendChild(td(r.net));
    var st=document.createElement('td');var b=document.createElement('span');
    b.className='badge badge-green';b.textContent='Paid';st.appendChild(b);tr.appendChild(st);

    var ac=document.createElement('td');
    if (r.file) {
      var a=document.createElement('a');
      a.href=r.file; a.download='Payslip_'+r.month.replace(' ','_')+'.pdf';
      a.className='btn btn-sm btn-primary'; a.textContent='📥 Download';
      a.style.textDecoration='none';
      ac.appendChild(a);
    } else {
      var btn=document.createElement('button');
      btn.className='btn btn-sm btn-outline'; btn.textContent='Not uploaded';
      btn.disabled=true; btn.style.opacity='.5';
      ac.appendChild(btn);
    }
    tr.appendChild(ac); tbody.appendChild(tr);
  });
})();

// ── TOAST ─────────────────────────────────────────────────────
function showToast(msg) {
  var old=document.getElementById('wpToast'); if(old) old.remove();
  var t=document.createElement('div'); t.id='wpToast';
  t.textContent=msg;
  t.style.cssText='position:fixed;bottom:28px;right:28px;background:#1e1b4b;color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,.2);';
  document.body.appendChild(t);
  setTimeout(function(){if(t.parentNode)t.remove();},3000);
}
