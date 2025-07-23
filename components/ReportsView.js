export class ReportsView {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('reports-view');
  }

  render() {
    const { transactions } = this.app.state;

    const byMonth = this.groupByMonth(transactions);

    this.container.innerHTML = `
      <div class="card">
        <h2>Monthly Spending Report</h2>
        ${Object.keys(byMonth).map(month => `
          <h3>${month}</h3>
          <ul class="report-list">
            ${byMonth[month].map(tx => `
              <li>
                ${tx.date}: ₦${Math.abs(tx.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })} on ${tx.category} (${tx.payee})
              </li>
            `).join('')}
          </ul>
        `).join('')}
      </div>
    `;
  }

  groupByMonth(transactions) {
    const groups = {};
    transactions.forEach(tx => {
      const date = new Date(tx.date);
      const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!groups[month]) groups[month] = [];
      groups[month].push(tx);
    });
    return groups;
  }
}
