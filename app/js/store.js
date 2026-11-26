// HearthLedger state: one household, one month, stored locally.
// Every figure on screen is computed from this seed, never typed twice.
const STORAGE_KEY = 'hearthledger-v1';

export const MEMBERS = ['Maya', 'Jordan', 'Shared', 'Leo', 'Nora'];
export const METHODS = ['Debit card', 'Credit card', 'Bank transfer', 'Cash', 'Auto-pay'];
export const MONTH_LABEL = 'November 2026';
export const INCOME_TOTAL = 6850;

export function seedState() {
  return {
    version: 1,
    month: '2026-11',
    household: 'The Hartley Family',
    incomes: [
      { id: 'i1', source: 'Maya Hartley — Product Designer', amount: 3900, date: '2026-11-01' },
      { id: 'i2', source: 'Jordan Hartley — Teacher', amount: 2950, date: '2026-11-01' },
    ],
    categories: [
      { id: 'c1', name: 'Housing & Utilities', limit: 2110, color: '#1e4d3b' },
      { id: 'c2', name: 'Groceries', limit: 720, color: '#c96f4a' },
      { id: 'c3', name: 'Childcare & Education', limit: 980, color: '#d9a441' },
      { id: 'c4', name: 'Transport & Fuel', limit: 430, color: '#5f7f8c' },
      { id: 'c5', name: 'Healthcare', limit: 320, color: '#9b6b8f' },
      { id: 'c6', name: 'Dining Out', limit: 280, color: '#b3402e' },
      { id: 'c7', name: 'Leisure & Fun', limit: 240, color: '#7a9a5b' },
      { id: 'c8', name: 'Household & Personal', limit: 260, color: '#8a7a5b' },
    ],
    transactions: [
      { id: 't1', date: '2026-11-01', description: 'Mortgage — Hartley Home Loan', category: 'Housing & Utilities', member: 'Shared', amount: 1850.00, method: 'Bank transfer', status: 'Paid' },
      { id: 't2', date: '2026-11-05', description: 'Electric — City Power', category: 'Housing & Utilities', member: 'Shared', amount: 128.40, method: 'Auto-pay', status: 'Paid' },
      { id: 't3', date: '2026-11-07', description: 'Internet — Fiber 500', category: 'Housing & Utilities', member: 'Shared', amount: 79.00, method: 'Auto-pay', status: 'Paid' },
      { id: 't4', date: '2026-11-12', description: 'Water & Sewer — City Water', category: 'Housing & Utilities', member: 'Shared', amount: 41.20, method: 'Auto-pay', status: 'Paid' },
      { id: 't5', date: '2026-11-02', description: 'GreenMart weekly shop', category: 'Groceries', member: 'Maya', amount: 186.75, method: 'Debit card', status: 'Paid' },
      { id: 't6', date: '2026-11-07', description: 'GreenMart top-up shop', category: 'Groceries', member: 'Jordan', amount: 142.30, method: 'Debit card', status: 'Paid' },
      { id: 't7', date: '2026-11-09', description: 'Farmers market', category: 'Groceries', member: 'Maya', amount: 38.50, method: 'Cash', status: 'Paid' },
      { id: 't8', date: '2026-11-14', description: 'GreenMart weekly shop', category: 'Groceries', member: 'Maya', amount: 168.90, method: 'Debit card', status: 'Paid' },
      { id: 't9', date: '2026-11-18', description: 'Corner Market', category: 'Groceries', member: 'Jordan', amount: 52.40, method: 'Debit card', status: 'Paid' },
      { id: 't10', date: '2026-11-21', description: 'GreenMart weekly shop', category: 'Groceries', member: 'Maya', amount: 121.15, method: 'Debit card', status: 'Paid' },
      { id: 't11', date: '2026-11-03', description: 'Little Oaks Preschool — November', category: 'Childcare & Education', member: 'Jordan', amount: 650.00, method: 'Bank transfer', status: 'Paid' },
      { id: 't12', date: '2026-11-10', description: 'Leo piano lessons', category: 'Childcare & Education', member: 'Maya', amount: 120.00, method: 'Debit card', status: 'Paid' },
      { id: 't13', date: '2026-11-17', description: 'Nora school supplies', category: 'Childcare & Education', member: 'Maya', amount: 48.75, method: 'Debit card', status: 'Paid' },
      { id: 't14', date: '2026-11-04', description: 'Fuel — Shell', category: 'Transport & Fuel', member: 'Jordan', amount: 46.20, method: 'Debit card', status: 'Paid' },
      { id: 't15', date: '2026-11-11', description: 'Metro card top-up', category: 'Transport & Fuel', member: 'Maya', amount: 34.00, method: 'Debit card', status: 'Paid' },
      { id: 't16', date: '2026-11-15', description: 'Fuel — Shell', category: 'Transport & Fuel', member: 'Jordan', amount: 48.90, method: 'Debit card', status: 'Paid' },
      { id: 't17', date: '2026-11-22', description: 'Car service — oil & brakes', category: 'Transport & Fuel', member: 'Shared', amount: 189.00, method: 'Credit card', status: 'Paid' },
      { id: 't18', date: '2026-11-06', description: 'Pharmacy — prescriptions', category: 'Healthcare', member: 'Maya', amount: 42.80, method: 'Debit card', status: 'Paid' },
      { id: 't19', date: '2026-11-13', description: 'Dental checkup — Leo', category: 'Healthcare', member: 'Shared', amount: 95.00, method: 'Debit card', status: 'Paid' },
      { id: 't20', date: '2026-11-19', description: 'Family clinic copay', category: 'Healthcare', member: 'Jordan', amount: 35.00, method: 'Debit card', status: 'Paid' },
      { id: 't21', date: '2026-11-08', description: 'Saffron Bistro — family dinner', category: 'Dining Out', member: 'Shared', amount: 68.40, method: 'Credit card', status: 'Paid' },
      { id: 't22', date: '2026-11-15', description: 'Pizza night', category: 'Dining Out', member: 'Jordan', amount: 32.50, method: 'Debit card', status: 'Paid' },
      { id: 't23', date: '2026-11-20', description: 'Riverside Cafe — brunch', category: 'Dining Out', member: 'Maya', amount: 54.25, method: 'Credit card', status: 'Paid' },
      { id: 't24', date: '2026-11-24', description: 'Thai takeout', category: 'Dining Out', member: 'Shared', amount: 41.80, method: 'Debit card', status: 'Paid' },
      { id: 't25', date: '2026-11-09', description: 'Cinema — family movie', category: 'Leisure & Fun', member: 'Shared', amount: 46.00, method: 'Credit card', status: 'Paid' },
      { id: 't26', date: '2026-11-23', description: 'Board games & books', category: 'Leisure & Fun', member: 'Maya', amount: 38.90, method: 'Debit card', status: 'Paid' },
      { id: 't27', date: '2026-11-07', description: 'Hardware store — bulbs & fixings', category: 'Household & Personal', member: 'Jordan', amount: 27.60, method: 'Debit card', status: 'Paid' },
      { id: 't28', date: '2026-11-16', description: 'Haircut — Maya', category: 'Household & Personal', member: 'Maya', amount: 58.00, method: 'Debit card', status: 'Paid' },
    ],
    bills: [
      { id: 'b1', payee: 'Hartley Home Loan', label: 'Mortgage', amount: 1850.00, dueDay: 1, category: 'Housing & Utilities', paid: true, paidDate: '2026-11-01' },
      { id: 'b2', payee: 'Little Oaks Preschool', label: 'Preschool — November', amount: 650.00, dueDay: 3, category: 'Childcare & Education', paid: true, paidDate: '2026-11-03' },
      { id: 'b3', payee: 'City Power', label: 'Electric', amount: 128.40, dueDay: 5, category: 'Housing & Utilities', paid: true, paidDate: '2026-11-05' },
      { id: 'b4', payee: 'Fiber 500', label: 'Internet', amount: 79.00, dueDay: 7, category: 'Housing & Utilities', paid: true, paidDate: '2026-11-07' },
      { id: 'b5', payee: 'City Water', label: 'Water & Sewer', amount: 41.20, dueDay: 12, category: 'Housing & Utilities', paid: true, paidDate: '2026-11-12' },
      { id: 'b6', payee: 'NorthCare Health', label: 'Health insurance', amount: 214.00, dueDay: 15, category: 'Healthcare', paid: false, paidDate: null },
      { id: 'b7', payee: 'SafeDrive Auto', label: 'Car insurance', amount: 96.50, dueDay: 20, category: 'Transport & Fuel', paid: false, paidDate: null },
      { id: 'b8', payee: 'Riverside Gym', label: 'Family gym', amount: 54.00, dueDay: 25, category: 'Leisure & Fun', paid: false, paidDate: null },
    ],
    goals: [
      { id: 'g1', name: '6-Month Emergency Fund', target: 18000, saved: 11240, monthly: 500, note: 'Six months of essentials, kept in a high-yield savings account.' },
      { id: 'g2', name: 'Family Vacation — Bali 2027', target: 3200, saved: 1850, monthly: 300, note: 'Flights and a family villa for two weeks in July.' },
      { id: 'g3', name: 'Home Maintenance Reserve', target: 5000, saved: 2340, monthly: 210, note: 'Roof check in spring, then the water heater.' },
      { id: 'g4', name: 'Annual Tax & Insurance', target: 2400, saved: 1975, monthly: 180, note: 'Property tax and the annual insurance renewal.' },
    ],
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions) || !Array.isArray(parsed.categories)) return seedState();
    return parsed;
  } catch {
    return seedState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetDemoState() {
  const fresh = seedState();
  saveState(fresh);
  return fresh;
}

export function round2(n) {
  return Math.round(n * 100) / 100;
}

export function spentByCategory(state) {
  const spent = {};
  for (const c of state.categories) spent[c.name] = 0;
  for (const t of state.transactions) {
    if (t.status === 'Paid' || t.status === 'Pending') {
      spent[t.category] = round2((spent[t.category] || 0) + Number(t.amount));
    }
  }
  return spent;
}

export function getTotals(state) {
  const income = state.incomes.reduce((s, i) => s + Number(i.amount), 0);
  const spent = state.transactions
    .filter((t) => t.status !== 'Cancelled')
    .reduce((s, t) => s + Number(t.amount), 0);
  const plannedSavings = state.goals.reduce((s, g) => s + Number(g.monthly), 0);
  const safeToSpend = round2(income - spent - plannedSavings);
  const savingsRate = income > 0 ? Math.round(((income - spent) / income) * 1000) / 10 : 0;
  const budgetTotal = state.categories.reduce((s, c) => s + Number(c.limit), 0);
  const billsTotal = state.bills.reduce((s, b) => s + Number(b.amount), 0);
  const billsPaid = state.bills.filter((b) => b.paid).reduce((s, b) => s + Number(b.amount), 0);
  return { income: round2(income), spent: round2(spent), plannedSavings: round2(plannedSavings), safeToSpend, savingsRate, budgetTotal: round2(budgetTotal), billsTotal: round2(billsTotal), billsPaid: round2(billsPaid) };
}

export function budgetAlerts(state) {
  const spent = spentByCategory(state);
  const alerts = [];
  for (const c of state.categories) {
    const pct = c.limit > 0 ? (spent[c.name] / c.limit) * 100 : 0;
    if (pct >= 100) alerts.push({ level: 'red', title: c.name + ' is over its envelope', body: 'Spent ' + money(spent[c.name]) + ' of ' + money(c.limit) + ' (' + Math.round(pct) + '%). Move money from another envelope or hold the next shop.' });
    else if (pct >= 85) alerts.push({ level: 'amber', title: c.name + ' is almost spent', body: 'Spent ' + money(spent[c.name]) + ' of ' + money(c.limit) + ' (' + Math.round(pct) + '%) with days left in November. Plan the remaining shops carefully.' });
  }
  return alerts;
}

export function addTransaction(state, tx) {
  const id = 't' + Date.now().toString(36);
  const row = { id, status: 'Paid', member: 'Shared', method: 'Debit card', ...tx, amount: round2(Number(tx.amount)) };
  state.transactions.push(row);
  state.transactions.sort((a, b) => (a.date < b.date ? 1 : -1));
  return row;
}

export function updateTransaction(state, id, patch) {
  const row = state.transactions.find((t) => t.id === id);
  if (!row) return null;
  Object.assign(row, patch, { amount: patch.amount !== undefined ? round2(Number(patch.amount)) : row.amount });
  return row;
}

export function deleteTransaction(state, id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
}

export function setBudgetLimit(state, categoryId, limit) {
  const cat = state.categories.find((c) => c.id === categoryId);
  if (cat) cat.limit = Math.max(0, round2(Number(limit) || 0));
  return cat;
}

export function addCategory(state, name, limit) {
  const colors = ['#4a7c59', '#a85b38', '#7c6aa8', '#3e6b7a', '#b07d2b'];
  const cat = { id: 'c' + Date.now().toString(36), name: name.trim(), limit: round2(Number(limit) || 0), color: colors[state.categories.length % colors.length] };
  state.categories.push(cat);
  return cat;
}

export function markBillPaid(state, billId, paidDate) {
  const bill = state.bills.find((b) => b.id === billId);
  if (!bill || bill.paid) return null;
  bill.paid = true;
  bill.paidDate = paidDate || '2026-11-26';
  const row = addTransaction(state, {
    date: bill.paidDate, description: bill.label + ' — ' + bill.payee, category: bill.category, member: 'Shared', amount: bill.amount, method: 'Auto-pay', status: 'Paid',
  });
  return { bill, row };
}

export function addContribution(state, goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return null;
  goal.saved = round2(goal.saved + Number(amount));
  return goal;
}

export function addGoal(state, name, target, saved, monthly) {
  const goal = { id: 'g' + Date.now().toString(36), name: name.trim(), target: round2(Number(target)), saved: round2(Number(saved) || 0), monthly: round2(Number(monthly) || 0), note: 'Added by the family this month.' };
  state.goals.push(goal);
  return goal;
}

export function monthsToGoal(goal) {
  const left = Math.max(0, goal.target - goal.saved);
  if (left <= 0) return 0;
  if (!goal.monthly || goal.monthly <= 0) return null;
  return Math.ceil(left / goal.monthly);
}

export function money(n) {
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function money0(n) {
  return '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function shortDate(iso) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const parts = String(iso).split('-');
  if (parts.length !== 3) return iso;
  return months[Number(parts[1]) - 1] + ' ' + Number(parts[2]);
}

export function transactionsToCsv(state) {
  const head = 'Date,Description,Category,Member,Amount,Method,Status';
  const lines = [...state.transactions]
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .map((t) => [t.date, '"' + t.description.replace(/"/g, '""') + '"', '"' + t.category + '"', t.member, Number(t.amount).toFixed(2), t.method, t.status].join(','));
  return [head, ...lines].join('\n');
}
