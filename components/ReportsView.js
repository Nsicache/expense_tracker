export class ReportsView {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('reports-view');
  }

  render() {
    const { transactions, categories } = this.app.state;
    const monthlySpending = this.calculateMonthlySpending();
    const categorySpending = this.calculateCategorySpending();

    this.container.innerHTML = `
      <div class="card">
        <h2>Monthly Overview</h2>
        <div class="report-card">
          <h3>Total Spending: ₦${this.format(monthlySpending.total)}</h3>
          <div class="sparkline">${this.renderSparkline(monthlySpending.dailyTotals)}</div>
        </div>
      </div>
      <div class="card">
        <h2>Category Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            ${categorySpending.map(cat => this.renderCategoryRow(cat)).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  calculateMonthlySpending() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = this.app.state.transactions.filter(trans => {
      const transDate = new Date(trans.date);
      return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
    });

    const dailyTotals = Array(31).fill(0); // Initialize array for 31 days
    monthlyTransactions.forEach(trans => {
      const day = new Date(trans.date).getDate() - 1; // Convert to 0-based index
      dailyTotals[day] += Math.abs(trans.amount);
    });

    return {
      total: monthlyTransactions.reduce((sum, trans) => sum + Math.abs(trans.amount), 0),
      dailyTotals
    };
  }

  calculateCategorySpending() {
    const categoryMap = {};
    this.app.state.transactions.forEach(trans => {
      if (!categoryMap[trans.category]) {
        categoryMap[trans.category] = 0;
      }
      categoryMap[trans.category] += Math.abs(trans.amount);
    });

    const totalSpent = Object.values(categoryMap).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(categoryMap)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  renderSparkline(data) {
    const max = Math.max(...data);
    if (max === 0) return '▁'.repeat(31); // Flat line if no data

    const sparklineChars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
    return data.map(value => {
      const scaled = Math.floor((value / max) * 7);
      return sparklineChars[scaled];
    }).join('');
  }

  renderCategoryRow(category) {
    return `
      <tr>
        <td>${category.name}</td>
        <td>₦${this.format(category.amount)}</td>
        <td>${category.percentage.toFixed(1)}%</td>
      </tr>
    `;
  }

  format(amount) {
    return amount.toLocaleString('en-NG', { minimumFractionDigits: 2 });
  }
}
