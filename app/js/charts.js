// HearthLedger charts: pure SVG, drawn from the ledger, no libraries.
import { money0, round2 } from './store.js';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Paired bars: budget limit (pale) against actual spend (solid) per envelope.
export function budgetBarChart(state, spent) {
  const rows = state.categories.map((c) => ({ name: c.name, limit: Number(c.limit), spent: round2(spent[c.name] || 0), color: c.color }));
  const max = Math.max(100, ...rows.map((r) => Math.max(r.limit, r.spent)));
  const rowH = 44, labelW = 168, chartW = 560, chartX = labelW + 8, top = 8;
  const height = top + rows.length * rowH + 26;
  let body = '';
  rows.forEach((r, i) => {
    const y = top + i * rowH;
    const limitW = (r.limit / max) * chartW;
    const spentW = (r.spent / max) * chartW;
    const over = r.spent > r.limit;
    body += '<text x="0" y="' + (y + 13) + '" font-size="12" fill="#22302a" font-weight="600">' + esc(r.name.length > 22 ? r.name.slice(0, 21) + '…' : r.name) + '</text>';
    body += '<text x="0" y="' + (y + 28) + '" font-size="11" fill="#6f7a72">' + money0(r.spent) + ' of ' + money0(r.limit) + '</text>';
    body += '<rect x="' + chartX + '" y="' + (y + 2) + '" width="' + limitW.toFixed(1) + '" height="10" rx="5" fill="#e5dccb"/>';
    body += '<rect class="slice-btn" data-category="' + esc(r.name) + '" x="' + chartX + '" y="' + (y + 16) + '" width="' + Math.max(2, spentW).toFixed(1) + '" height="10" rx="5" fill="' + (over ? '#b3402e' : r.color) + '"><title>' + esc(r.name) + ': spent ' + money0(r.spent) + ' of ' + money0(r.limit) + '</title></rect>';
    if (over) body += '<text x="' + (chartX + spentW + 6) + '" y="' + (y + 25) + '" font-size="11" fill="#b3402e" font-weight="700">over</text>';
  });
  body += '<text x="' + chartX + '" y="' + (height - 6) + '" font-size="11" fill="#6f7a72">Pale bar = budget · Solid bar = spent · Click a solid bar to see its transactions</text>';
  return '<svg class="chart-svg" viewBox="0 0 ' + (chartX + chartW + 10) + ' ' + height + '" role="img" aria-label="Budget versus actual spending per category">' + body + '</svg>';
}

// Donut: share of November spending by envelope, with a readable legend.
export function spendingDonut(state, spent) {
  const rows = state.categories
    .map((c) => ({ name: c.name, spent: round2(spent[c.name] || 0), color: c.color }))
    .filter((r) => r.spent > 0)
    .sort((a, b) => b.spent - a.spent);
  const total = rows.reduce((s, r) => s + r.spent, 0) || 1;
  const cx = 110, cy = 110, rOuter = 92, rInner = 58;
  let body = '';
  let angle = -Math.PI / 2;
  for (const row of rows) {
    const frac = row.spent / total;
    const sweep = frac * Math.PI * 2;
    const large = sweep > Math.PI ? 1 : 0;
    const x1 = cx + rOuter * Math.cos(angle), y1 = cy + rOuter * Math.sin(angle);
    const x2 = cx + rOuter * Math.cos(angle + sweep), y2 = cy + rOuter * Math.sin(angle + sweep);
    const x3 = cx + rInner * Math.cos(angle + sweep), y3 = cy + rInner * Math.sin(angle + sweep);
    const x4 = cx + rInner * Math.cos(angle), y4 = cy + rInner * Math.sin(angle);
    if (frac >= 0.999) {
      body += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOuter + '" fill="' + row.color + '"/>';
    } else {
      body += '<path class="slice-btn" data-category="' + esc(row.name) + '" d="M ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' A ' + rOuter + ' ' + rOuter + ' 0 ' + large + ' 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' L ' + x3.toFixed(1) + ' ' + y3.toFixed(1) + ' A ' + rInner + ' ' + rInner + ' 0 ' + large + ' 0 ' + x4.toFixed(1) + ' ' + y4.toFixed(1) + ' Z" fill="' + row.color + '"><title>' + esc(row.name) + ': ' + money0(row.spent) + ' (' + Math.round(frac * 100) + '%)</title></path>';
    }
    angle += sweep;
  }
  body += '<text x="' + cx + '" y="' + (cy - 6) + '" text-anchor="middle" font-size="22" font-weight="700" fill="#22302a">' + money0(total) + '</text>';
  body += '<text x="' + cx + '" y="' + (cy + 14) + '" text-anchor="middle" font-size="11" fill="#6f7a72">spent in Nov</text>';
  const svg = '<svg class="chart-svg" viewBox="0 0 220 220" style="max-width:230px;margin:0 auto" role="img" aria-label="Share of spending by category">' + body + '</svg>';
  const legend = rows.map((row) => '<span><i style="background:' + row.color + '"></i>' + esc(row.name) + ' · ' + Math.round((row.spent / total) * 100) + '%</span>').join('');
  return svg + '<div class="legend" style="justify-content:center">' + legend + '</div>';
}
