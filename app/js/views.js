// HearthLedger views: one render function per page, all reading the same state.
import { budgetAlerts, getTotals, money, money0, monthsToGoal, shortDate, spentByCategory } from './store.js';
import { budgetBarChart, spendingDonut } from './charts.js';

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function statusTag(status) {
  if (status === 'Paid') return '<span class="tag tag-green">Paid</span>';
  if (status === 'Pending') return '<span class="tag tag-amber">Pending</span>';
  return '<span class="tag tag-grey">' + esc(status) + '</span>';
}

function progressClass(pct) {
  if (pct >= 100) return 'over';
  if (pct >= 85) return 'hot';
  return '';
}

export function kpiCards(state) {
  const t = getTotals(state);
  return '<section class="grid kpis" aria-label="November totals">'
    + '<button class="kpi" type="button" data-goto="transactions"><small>Income · Nov</small><span class="val money">' + money(t.income) + '</span><span class="note">Maya $3,900 + Jordan $2,950</span></button>'
    + '<button class="kpi" type="button" data-goto="transactions"><small>Spent · Nov</small><span class="val money">' + money(t.spent) + '</span><span class="note">' + state.transactions.length + ' transactions in the ledger</span></button>'
    + '<button class="kpi accent" type="button" data-goto="budget"><small>Safe to spend</small><span class="val money">' + money(t.safeToSpend) + '</span><span class="note">After spending and goal transfers</span></button>'
    + '<button class="kpi" type="button" data-goto="goals"><small>Savings rate</small><span class="val money">' + t.savingsRate + '%</span><span class="note">' + money(t.plannedSavings) + ' set aside for goals</span></button>'
    + '</section>';
}

function alertsBlock(state) {
  const alerts = budgetAlerts(state);
  if (!alerts.length) return '<div class="alert green"><span class="dot"></span><div><b>All envelopes are on track</b><span>No category has passed 85% of its budget yet.</span></div></div>';
  return alerts.map((a) => '<div class="alert ' + a.level + '"><span class="dot"></span><div><b>' + esc(a.title) + '</b><span>' + esc(a.body) + '</span></div></div>').join('');
}

function recentRows(state, count) {
  const rows = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, count);
  return rows.map((t) => '<tr><td>' + shortDate(t.date) + '</td><td><strong>' + esc(t.description) + '</strong><br><span class="muted small">' + esc(t.member) + ' · ' + esc(t.method) + '</span></td><td>' + esc(t.category) + '</td><td style="text-align:right" class="money"><strong>' + money(t.amount) + '</strong></td></tr>').join('');
}

export function renderOverview(state) {
  const spent = spentByCategory(state);
  const t = getTotals(state);
  const dueSoon = state.bills.filter((b) => !b.paid).slice(0, 3);
  const goals = [...state.goals].sort((a, b) => (b.saved / b.target) - (a.saved / a.target)).slice(0, 2);
  return kpiCards(state)
    + '<div class="grid two-col" style="margin-top:14px">'
    + '<section class="card"><div class="card-head"><div><h2>Budget vs actual</h2><p>Every envelope, pale for the plan and solid for what left the account.</p></div><button class="linklike" type="button" data-goto="budget">Open planner →</button></div>' + budgetBarChart(state, spent) + '</section>'
    + '<section class="card"><div class="card-head"><div><h2>Where November went</h2><p>Share of the ' + money(t.spent) + ' spent so far.</p></div><button class="linklike" type="button" data-goto="transactions">See ledger →</button></div>' + spendingDonut(state, spent) + '</section>'
    + '</div>'
    + '<div class="grid two-col" style="margin-top:14px">'
    + '<section class="card"><div class="card-head"><div><h2>Budget health</h2><p>Checked live from the ledger every time this page opens.</p></div></div>' + alertsBlock(state)
    + '<h3 style="margin:14px 0 8px">Bills still to pay</h3>'
    + dueSoon.map((b) => '<div class="row-between" style="padding:7px 0;border-top:1px solid #f0e9db"><span><strong>' + esc(b.label) + '</strong> <span class="muted small">· due Nov ' + b.dueDay + '</span></span><span class="money"><strong>' + money(b.amount) + '</strong></span></div>').join('')
    + '<button class="btn btn-sm" type="button" data-goto="bills" style="margin-top:10px">Open bills tracker →</button></section>'
    + '<section class="card"><div class="card-head"><div><h2>Latest activity</h2><p>Newest first, straight from the shared ledger.</p></div><button class="linklike" type="button" data-goto="transactions">Full ledger →</button></div>'
    + '<div class="tbl-wrap"><table><thead><tr><th>Date</th><th>What</th><th>Category</th><th style="text-align:right">Amount</th></tr></thead><tbody>' + recentRows(state, 5) + '</tbody></table></div>'
    + '<h3 style="margin:16px 0 8px">Goals closest to done</h3>'
    + goals.map((g) => { const pct = Math.round((g.saved / g.target) * 100); return '<div style="margin-bottom:10px"><div class="row-between"><span><strong>' + esc(g.name) + '</strong></span><span class="small muted">' + money(g.saved) + ' of ' + money(g.target) + ' · ' + pct + '%</span></div><div class="bar-wrap" style="margin-top:6px"><div class="bar" style="width:' + Math.min(100, pct) + '%"></div></div></div>'; }).join('')
    + '</section></div>';
}

export function renderBudget(state) {
  const spent = spentByCategory(state);
  const t = getTotals(state);
  const allocatedPct = t.income > 0 ? Math.round((t.budgetTotal / t.income) * 100) : 0;
  const cards = state.categories.map((c) => {
    const s = spent[c.name] || 0;
    const pct = c.limit > 0 ? Math.round((s / c.limit) * 100) : 0;
    const left = Math.max(0, c.limit - s);
    return '<article class="env"><div class="env-head"><strong>' + esc(c.name) + '</strong><span class="pct">' + pct + '%</span></div>'
      + '<div class="bar-wrap"><div class="bar ' + progressClass(pct) + '" style="width:' + Math.min(100, pct) + '%"></div></div>'
      + '<div class="row-between small"><span>' + money(s) + ' spent of ' + money(c.limit) + '</span><span><strong>' + money(left) + '</strong> left</span></div>'
      + '<div class="env-controls"><label class="small muted" for="range-' + c.id + '">Monthly limit</label>'
      + '<input type="range" id="range-' + c.id + '" min="0" max="2500" step="10" value="' + c.limit + '" data-limit-range="' + c.id + '" aria-label="Monthly limit for ' + esc(c.name) + '">'
      + '<input type="number" min="0" step="10" value="' + c.limit + '" data-limit-input="' + c.id + '" aria-label="Monthly limit amount for ' + esc(c.name) + '"></div></article>';
  }).join('');
  const goalsStrip = state.goals.map((g) => { const pct = Math.round((g.saved / g.target) * 100); return '<div><div class="row-between small"><span><strong>' + esc(g.name) + '</strong></span><span>' + pct + '%</span></div><div class="bar-wrap" style="margin-top:6px"><div class="bar" style="width:' + Math.min(100, pct) + '%"></div></div><div class="small muted" style="margin-top:4px">' + money(g.saved) + ' of ' + money(g.target) + '</div></div>'; }).join('');
  return '<section class="card"><div class="card-head"><div><h2>Zero-based plan — November</h2><p>Income ' + money(t.income) + ' · ' + money(t.budgetTotal) + ' assigned to envelopes (' + allocatedPct + '%) · ' + money(Math.max(0, t.income - t.budgetTotal)) + ' held for goals and buffer. Drag a slider and every total moves.</p></div></div>'
    + '<div class="bar-wrap"><div class="bar" style="width:' + Math.min(100, allocatedPct) + '%"></div></div>'
    + '<p class="small muted" style="margin-top:8px">Housing and Groceries are past 85% — the alerts on the Overview page come from these same numbers.</p></section>'
    + '<div class="grid env-grid" style="margin-top:14px">' + cards + '</div>'
    + '<section class="card" style="margin-top:14px"><div class="card-head"><div><h2>Savings at a glance</h2><p>Goals keep their own jars, funded from the same income.</p></div><button class="linklike" type="button" data-goto="goals">Open goals →</button></div><div class="grid" style="grid-template-columns:repeat(4,1fr);gap:16px">' + goalsStrip + '</div></section>'
    + '<section class="card" style="margin-top:14px"><h2>Add an envelope</h2><p class="small muted">A new jar for something the family forgot to plan for.</p>'
    + '<form id="addCategoryForm" class="form-grid" style="margin-top:12px;grid-template-columns:1fr 1fr auto;align-items:end"><label>Envelope name<input name="name" required maxlength="40" placeholder="e.g. Pet care"></label><label>Monthly limit (USD)<input name="limit" type="number" min="0" step="10" value="100" required></label><button class="btn btn-primary" type="submit">Add envelope</button></form></section>';
}

export function renderTransactions(state, filters, editingId) {
  const spent = spentByCategory(state);
  const q = (filters.query || '').toLowerCase();
  let rows = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
  if (filters.category) rows = rows.filter((t) => t.category === filters.category);
  if (filters.member) rows = rows.filter((t) => t.member === filters.member);
  if (filters.status) rows = rows.filter((t) => t.status === filters.status);
  if (q) rows = rows.filter((t) => (t.description + ' ' + t.category + ' ' + t.member).toLowerCase().includes(q));
  const editing = editingId ? state.transactions.find((t) => t.id === editingId) : null;
  const catOptions = '<option value="">All categories</option>' + state.categories.map((c) => '<option' + (filters.category === c.name ? ' selected' : '') + '>' + esc(c.name) + '</option>').join('');
  const memberOptions = '<option value="">Everyone</option>' + ['Maya', 'Jordan', 'Shared', 'Leo', 'Nora'].map((m) => '<option' + (filters.member === m ? ' selected' : '') + '>' + m + '</option>').join('');
  const body = rows.length ? rows.map((t) => '<tr><td>' + shortDate(t.date) + '</td><td><strong>' + esc(t.description) + '</strong><br><span class="muted small">' + esc(t.member) + ' · ' + esc(t.method) + '</span></td><td>' + esc(t.category) + '</td><td>' + statusTag(t.status) + '</td><td style="text-align:right" class="money"><strong>' + money(t.amount) + '</strong></td><td style="white-space:nowrap"><button class="btn btn-sm" type="button" data-action="edit-tx" data-id="' + t.id + '">Edit</button> <button class="btn btn-sm" type="button" data-action="delete-tx" data-id="' + t.id + '">Delete</button></td></tr>').join('')
    : '<tr><td colspan="6"><div class="empty">No transactions match these filters. Clear the search or add one above.</div></td></tr>';
  return '<section class="card"><div class="card-head"><div><h2>' + (editing ? 'Edit transaction' : 'Add a transaction') + '</h2><p>' + (editing ? 'Change anything — totals, charts and envelopes update at once.' : 'A new row lands in the ledger and updates every page.') + '</p></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-sm" type="button" data-action="export-csv">Export CSV</button><button class="btn btn-sm" type="button" data-action="reset-demo">Reset demo data</button></div></div>'
    + '<form id="txForm" class="form-grid"><input type="hidden" name="txId" value="' + (editing ? editing.id : '') + '">'
    + '<label class="full">Description<input name="description" required maxlength="80" value="' + esc(editing ? editing.description : '') + '" placeholder="e.g. GreenMart weekly shop"></label>'
    + '<label>Amount (USD)<input name="amount" type="number" min="0.01" step="0.01" required value="' + (editing ? editing.amount : '') + '" placeholder="0.00"></label>'
    + '<label>Date<input name="date" type="date" required value="' + (editing ? editing.date : '2026-11-26') + '"></label>'
    + '<label>Category<select name="category">' + state.categories.map((c) => '<option' + (editing && editing.category === c.name ? ' selected' : '') + '>' + esc(c.name) + '</option>').join('') + '</select></label>'
    + '<label>Paid by<select name="member">' + ['Maya', 'Jordan', 'Shared', 'Leo', 'Nora'].map((m) => '<option' + (editing && editing.member === m ? ' selected' : '') + '>' + m + '</option>').join('') + '</select></label>'
    + '<label>Method<select name="method">' + ['Debit card', 'Credit card', 'Bank transfer', 'Cash', 'Auto-pay'].map((m) => '<option' + (editing && editing.method === m ? ' selected' : '') + '>' + m + '</option>').join('') + '</select></label>'
    + '<label>Status<select name="status"><option' + (editing && editing.status === 'Paid' ? ' selected' : '') + '>Paid</option><option' + (editing && editing.status === 'Pending' ? ' selected' : '') + '>Pending</option></select></label>'
    + '<button class="btn btn-primary" type="submit">' + (editing ? 'Save changes' : 'Add to ledger') + '</button>'
    + (editing ? '<button class="btn" type="button" data-action="cancel-edit">Cancel edit</button>' : '') + '</form></section>'
    + '<section class="card" style="margin-top:14px"><div class="card-head"><div><h2>The ledger — ' + rows.length + ' of ' + state.transactions.length + ' rows</h2><p>Spent so far ' + money(getTotals(state).spent) + ' across ' + state.categories.length + ' envelopes.</p></div></div>'
    + '<div class="filters"><input type="search" id="txSearch" placeholder="Search description, category or person…" value="' + esc(filters.query || '') + '" aria-label="Search transactions"><select id="txCategory" aria-label="Filter by category">' + catOptions + '</select><select id="txMember" aria-label="Filter by person">' + memberOptions + '</select><select id="txStatus" aria-label="Filter by status"><option value="">Any status</option><option' + (filters.status === 'Paid' ? ' selected' : '') + '>Paid</option><option' + (filters.status === 'Pending' ? ' selected' : '') + '>Pending</option></select></div>'
    + '<div class="tbl-wrap"><table><thead><tr><th>Date</th><th>What</th><th>Category</th><th>Status</th><th style="text-align:right">Amount</th><th></th></tr></thead><tbody>' + body + '</tbody></table></div></section>';
}

export function renderBills(state) {
  const t = getTotals(state);
  const unpaid = state.bills.filter((b) => !b.paid);
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const strip = days.map((d) => {
    const bill = state.bills.find((b) => b.dueDay === d);
    const cls = bill ? (bill.paid ? 'cal-day paid' : 'cal-day due') : 'cal-day';
    return '<span class="' + cls + '" title="' + (bill ? esc(bill.label + ' — ' + money(bill.amount)) : 'No bill due') + '">Nov ' + d + (bill ? '<br>' + money0(bill.amount) : '') + '</span>';
  }).join('');
  const rows = [...state.bills].sort((a, b) => a.dueDay - b.dueDay).map((b) => {
    const status = b.paid ? '<span class="tag tag-green">Paid ' + shortDate(b.paidDate) + '</span>' : (b.dueDay <= 15 ? '<span class="tag tag-red">Due soon</span>' : '<span class="tag tag-amber">Upcoming</span>');
    const action = b.paid ? '<span class="small muted">In the ledger</span>' : '<button class="btn btn-primary btn-sm" type="button" data-action="mark-paid" data-id="' + b.id + '">Mark as paid</button>';
    return '<div class="bill"><div class="bill-info"><strong>' + esc(b.label) + ' — ' + esc(b.payee) + '</strong><span>Due Nov ' + b.dueDay + ' · ' + esc(b.category) + ' · Auto-pay ' + (b.paid ? 'done' : 'off') + '</span></div>' + status + '<span class="money"><strong>' + money(b.amount) + '</strong></span>' + action + '</div>';
  }).join('');
  return '<div class="grid three-col"><div class="card"><small class="muted" style="font-weight:700;text-transform:uppercase;font-size:11px;letter-spacing:.06em">Fixed bills · Nov</small><div class="val" style="font-family:Georgia,serif;font-size:28px;margin:6px 0 2px">' + money(t.billsTotal) + '</div><p class="small muted">Across ' + state.bills.length + ' recurring bills and subscriptions.</p></div>'
    + '<div class="card"><small class="muted" style="font-weight:700;text-transform:uppercase;font-size:11px;letter-spacing:.06em">Already paid</small><div class="val" style="font-family:Georgia,serif;font-size:28px;margin:6px 0 2px">' + money(t.billsPaid) + '</div><p class="small muted">' + state.bills.filter((b) => b.paid).length + ' of ' + state.bills.length + ' bills settled.</p></div>'
    + '<div class="card"><small class="muted" style="font-weight:700;text-transform:uppercase;font-size:11px;letter-spacing:.06em">Still to pay</small><div class="val" style="font-family:Georgia,serif;font-size:28px;margin:6px 0 2px">' + money(round2(t.billsTotal - t.billsPaid)) + '</div><p class="small muted">' + unpaid.length + ' bills left before Nov 30.</p></div></div>'
    + '<section class="card" style="margin-top:14px"><h2>November due dates</h2><p class="small muted">Green days are settled, terracotta days still need paying.</p><div class="cal-strip">' + strip + '</div></section>'
    + '<section class="card" style="margin-top:14px"><div class="card-head"><div><h2>Recurring bills &amp; subscriptions</h2><p>Marking a bill paid writes the expense into the ledger, so the Overview totals move with it.</p></div></div>' + rows + '</section>';
}

export function renderGoals(state) {
  const totalSaved = state.goals.reduce((s, g) => s + Number(g.saved), 0);
  const totalTarget = state.goals.reduce((s, g) => s + Number(g.target), 0);
  const cards = state.goals.map((g) => {
    const pct = Math.round((g.saved / g.target) * 100);
    const months = monthsToGoal(g);
    const when = months === 0 ? 'Funded — ready to use' : months === null ? 'Set a monthly amount to see the date' : 'About ' + months + ' month' + (months === 1 ? '' : 's') + ' to go at ' + money(g.monthly) + '/mo';
    return '<article class="card goal"><div class="card-head"><div><h2>' + esc(g.name) + '</h2><p>' + esc(g.note) + '</p></div><span class="tag ' + (pct >= 75 ? 'tag-green' : pct >= 40 ? 'tag-amber' : 'tag-terra') + '">' + pct + '%</span></div>'
      + '<div class="row-between"><span class="money" style="font-family:Georgia,serif;font-size:24px"><strong>' + money(g.saved) + '</strong></span><span class="muted small">of ' + money(g.target) + ' target</span></div>'
      + '<div class="bar-wrap"><div class="bar" style="width:' + Math.min(100, pct) + '%"></div></div>'
      + '<p class="small muted" style="margin-top:8px">' + when + ' · ' + money(Math.max(0, g.target - g.saved)) + ' left to save.</p>'
      + '<div class="goal-actions"><input type="number" min="1" step="1" value="100" data-contribution="' + g.id + '" aria-label="Contribution amount for ' + esc(g.name) + '"><button class="btn btn-terra btn-sm" type="button" data-action="add-contribution" data-id="' + g.id + '">Add contribution</button></div></article>';
  }).join('');
  return '<section class="card"><div class="card-head"><div><h2>Savings goals &amp; sinking funds</h2><p>' + money(totalSaved) + ' saved toward ' + money(totalTarget) + ' across ' + state.goals.length + ' family goals. ' + money(getTotals(state).plannedSavings) + ' flows in every month.</p></div></div>'
    + '<div class="bar-wrap"><div class="bar" style="width:' + Math.min(100, Math.round((totalSaved / totalTarget) * 100)) + '%"></div></div>'
    + '<p class="small muted" style="margin-top:8px">' + Math.round((totalSaved / totalTarget) * 100) + '% of all goals funded. Contributions here are real: they update the saved total and the months-to-go estimate at once.</p></section>'
    + '<div class="grid two-col" style="margin-top:14px">' + cards + '</div>'
    + '<section class="card" style="margin-top:14px"><h2>Start a new goal</h2><p class="small muted">A holiday, a car, a course — name it and the plan starts counting.</p>'
    + '<form id="addGoalForm" class="form-grid" style="margin-top:12px"><label class="full">Goal name<input name="name" required maxlength="60" placeholder="e.g. New family car"></label><label>Target (USD)<input name="target" type="number" min="1" step="1" required value="2000"></label><label>Already saved (USD)<input name="saved" type="number" min="0" step="1" value="0"></label><label>Monthly amount (USD)<input name="monthly" type="number" min="0" step="10" value="100"></label><button class="btn btn-primary" type="submit">Add goal</button></form></section>';
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
