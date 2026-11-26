// HearthLedger app: hash routing, one render per page, every control wired.
import {
  addCategory, addContribution, addGoal, addTransaction, deleteTransaction, getTotals,
  loadState, markBillPaid, money, resetDemoState, saveState, setBudgetLimit,
  transactionsToCsv, updateTransaction,
} from './store.js';
import { renderBills, renderBudget, renderGoals, renderOverview, renderTransactions } from './views.js';

const ROUTES = {
  overview: { title: 'Overview', sub: 'November 2026 · All figures in US dollars', render: renderOverview },
  budget: { title: 'Budget Envelopes', sub: 'Zero-based plan · every dollar has a job', render: renderBudget },
  transactions: { title: 'Transactions Ledger', sub: 'The shared book of everything the household spends', render: renderTransactions },
  bills: { title: 'Bills & Due Dates', sub: 'Recurring bills, subscriptions and what is still to pay', render: renderBills },
  goals: { title: 'Savings Goals', sub: 'Sinking funds the family builds a little at a time', render: renderGoals },
};

let state = loadState();
const filters = { query: '', category: '', member: '', status: '' };
let editingId = null;
let toastTimer = null;

const viewEl = document.getElementById('view');
const toastEl = document.getElementById('toast');

export function showToast(message) {
  toastEl.textContent = message;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 2600);
}

export function currentRoute() {
  const hash = (location.hash || '#/overview').replace(/^#\//, '').split('?')[0];
  return ROUTES[hash] ? hash : 'overview';
}

function renderSideCards() {
  const t = getTotals(state);
  const safe = document.getElementById('sideSafe');
  if (safe) safe.innerHTML = '<strong>Safe to spend</strong><span class="big">' + money(t.safeToSpend) + '</span><span class="sub">After ' + money(t.spent) + ' spent · ' + t.savingsRate + '% saved</span>';
  const foot = document.getElementById('footStats');
  if (foot) {
    const saved = state.goals.reduce((s, g) => s + Number(g.saved), 0);
    foot.textContent = state.transactions.length + ' transactions · ' + state.categories.length + ' envelopes · ' + money(saved) + ' saved toward goals';
  }
}

export function render() {
  const route = currentRoute();
  const page = ROUTES[route];
  document.getElementById('pageTitle').textContent = page.title;
  document.getElementById('pageSub').textContent = page.sub;
  document.querySelectorAll('[data-route]').forEach((a) => a.classList.toggle('active', a.dataset.route === route));
  viewEl.innerHTML = route === 'transactions' ? page.render(state, filters, editingId) : page.render(state);
  renderSideCards();
  const quickCategory = document.getElementById('quickCategory');
  if (quickCategory) quickCategory.innerHTML = state.categories.map((c) => '<option>' + c.name + '</option>').join('');
  document.getElementById('sidebar').classList.remove('open');
}

function go(route) {
  editingId = null;
  if (currentRoute() === route) render();
  else location.hash = '#/' + route;
}

function closeDrawer() {
  document.getElementById('quickDrawer').hidden = true;
  document.getElementById('drawerBackdrop').hidden = true;
}

function openDrawer() {
  document.getElementById('quickDrawer').hidden = false;
  document.getElementById('drawerBackdrop').hidden = false;
  const first = document.querySelector('#quickForm input');
  if (first) first.focus();
}

function downloadCsv() {
  const blob = new Blob([transactionsToCsv(state)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'hearthledger-november-2026.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Ledger exported as CSV.');
}

document.addEventListener('click', (event) => {
  const goto = event.target.closest('[data-goto]');
  if (goto) { go(goto.dataset.goto); return; }
  const slice = event.target.closest('.slice-btn');
  if (slice && slice.dataset.category) {
    filters.category = slice.dataset.category;
    filters.query = '';
    filters.member = '';
    filters.status = '';
    editingId = null;
    go('transactions');
    showToast(slice.dataset.category + ' — filtered in the ledger.');
    return;
  }
  const actionEl = event.target.closest('[data-action]');
  if (!actionEl) return;
  const action = actionEl.dataset.action;
  const id = actionEl.dataset.id;
  if (action === 'mark-paid') {
    const done = markBillPaid(state, id);
    if (done) { saveState(state); render(); showToast(done.bill.label + ' marked paid — ' + money(done.bill.amount) + ' added to the ledger.'); }
  } else if (action === 'delete-tx') {
    const row = state.transactions.find((t) => t.id === id);
    if (row && confirm('Delete "' + row.description + '" (' + money(row.amount) + ')?')) {
      deleteTransaction(state, id);
      saveState(state); render(); showToast('Transaction deleted.');
    }
  } else if (action === 'edit-tx') {
    editingId = id;
    render();
    viewEl.scrollIntoView({ behavior: 'smooth' });
  } else if (action === 'cancel-edit') {
    editingId = null;
    render();
  } else if (action === 'add-contribution') {
    const input = document.querySelector('[data-contribution="' + id + '"]');
    const amount = input ? Number(input.value) : 0;
    if (!amount || amount <= 0) { showToast('Enter an amount above zero first.'); return; }
    const goal = addContribution(state, id, amount);
    saveState(state); render();
    if (goal) showToast(money(amount) + ' added to ' + goal.name + ' — now ' + money(goal.saved) + '.');
  } else if (action === 'export-csv') {
    downloadCsv();
  } else if (action === 'reset-demo') {
    if (confirm('Reset HearthLedger to the original November demo data? Your changes will be lost.')) {
      state = resetDemoState();
      filters.query = ''; filters.category = ''; filters.member = ''; filters.status = '';
      editingId = null;
      render();
      showToast('Demo data restored.');
    }
  }
});

document.addEventListener('change', (event) => {
  const range = event.target.closest('[data-limit-range]');
  const num = event.target.closest('[data-limit-input]');
  if (range) {
    setBudgetLimit(state, range.dataset.limitRange, Number(range.value));
    saveState(state); render(); showToast('Envelope limit updated.');
    return;
  }
  if (num) {
    setBudgetLimit(state, num.dataset.limitInput, Number(num.value));
    saveState(state); render(); showToast('Envelope limit updated.');
    return;
  }
  if (event.target.id === 'txCategory') { filters.category = event.target.value; render(); }
  if (event.target.id === 'txMember') { filters.member = event.target.value; render(); }
  if (event.target.id === 'txStatus') { filters.status = event.target.value; render(); }
});

let searchTimer = null;
document.addEventListener('input', (event) => {
  if (event.target.id !== 'txSearch') return;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    filters.query = event.target.value;
    render();
    const box = document.getElementById('txSearch');
    if (box) { box.focus(); box.setSelectionRange(box.value.length, box.value.length); }
  }, 300);
});

document.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  const formId = form.getAttribute('id');
  const data = new FormData(form);
  if (formId === 'txForm') {
    const id = String(data.get('txId') || '');
    const patch = {
      description: String(data.get('description') || '').trim(),
      amount: Number(data.get('amount')),
      date: String(data.get('date')),
      category: String(data.get('category')),
      member: String(data.get('member')),
      method: String(data.get('method')),
      status: String(data.get('status')),
    };
    if (!patch.description || !patch.amount || patch.amount <= 0) { showToast('Add a description and an amount above zero.'); return; }
    if (id) { updateTransaction(state, id, patch); showToast('Transaction updated.'); }
    else { addTransaction(state, patch); showToast('Added to the ledger — totals updated.'); }
    editingId = null;
    saveState(state); render();
  } else if (formId === 'quickForm') {
    const tx = {
      description: String(data.get('description') || '').trim(),
      amount: Number(data.get('amount')),
      date: String(data.get('date')),
      category: String(data.get('category')),
      member: String(data.get('member')),
      method: String(data.get('method')),
      status: 'Paid',
    };
    if (!tx.description || !tx.amount || tx.amount <= 0) { showToast('Add a description and an amount above zero.'); return; }
    addTransaction(state, tx);
    saveState(state); closeDrawer(); form.reset();
    render();
    showToast(tx.description + ' — ' + money(tx.amount) + ' added.');
  } else if (formId === 'addCategoryForm') {
    const cat = addCategory(state, String(data.get('name') || ''), Number(data.get('limit')));
    if (!cat) return;
    saveState(state); render();
    showToast('Envelope "' + cat.name + '" added at ' + money(cat.limit) + ' per month.');
  } else if (formId === 'addGoalForm') {
    const goal = addGoal(state, String(data.get('name') || ''), Number(data.get('target')), Number(data.get('saved')), Number(data.get('monthly')));
    if (!goal) return;
    saveState(state); render();
    showToast('Goal "' + goal.name + '" added.');
  }
});

document.getElementById('quickAddBtn').addEventListener('click', openDrawer);
document.getElementById('drawerClose').addEventListener('click', closeDrawer);
document.getElementById('drawerBackdrop').addEventListener('click', closeDrawer);
document.getElementById('menuBtn').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));
document.getElementById('sideReset').addEventListener('click', () => {
  if (confirm('Reset HearthLedger to the original November demo data? Your changes will be lost.')) {
    state = resetDemoState();
    render();
    showToast('Demo data restored.');
  }
});
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeDrawer(); });
window.addEventListener('hashchange', render);

render();
