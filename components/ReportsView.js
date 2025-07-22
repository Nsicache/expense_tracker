export class ReportsView {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('reports-view');
  }
  
  render() {
    const { transactions, categories } = this.app.state;
    
    // Calculate monthly spending
    const monthlySpending = this.calculateMonthlySpending();
    const categorySpending = this.calculateCategorySpending();
    
    this.container.innerHTML = `
      <div class="card">
        <h2>Monthly Overview</h2>
        <div class="report-card">
          <h3>Total Spending: $${monthlySpending.total.toFixed(2)}</h3>
          <div class="sparkline">
            ${this.renderSparkline(monthlySpending.dailyTotals)}
          </div>
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
              <th>Chart</th>
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
    const { transactions } = this.app.state;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filter transactions for current month
    const monthlyTransactions = transactions.filter(trans => {
      const transDate = new Date(trans.date);
      return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
    });
    
    // Calculate daily totals
    const dailyTotals = {};
    monthlyTransactions.forEach(trans => {
      const day = trans.date.split('-')[2];
      dailyTotals[day] = (dailyTotals[day] || 0) + Math.abs(trans.amount);
    });
    
    // Fill in missing days with 0
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const filledDailyTotals = Array.from({ length: daysInMonth }, (_, i) => {
      const day = (i + 1).toString().padStart(2, '0');
      return dailyTotals[day] || 0;
    });
    
    return {
      total: monthlyTransactions.reduce((sum, trans) => sum + Math.abs(trans.amount), 0),
      dailyTotals: filledDailyTotals
    };
  }
  
  calculateCategorySpending() {
    const { categories } = this.app.state;
    const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
    
    return categories
      .filter(cat => cat.spent > 0)
      .map(cat => ({
        name: cat.name,
        amount: cat.spent,
        percentage: totalSpent > 0 ? (cat.spent / totalSpent) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }
  
  renderSparkline(data) {
    if (!data.length) return '';
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    // Simple text-based sparkline using block elements
    const sparkline = data.map(value => {
      if (range === 0) return '▁';
      const scaled = Math.round(((value - min) / range) * 7);
      const blocks = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
      return blocks[scaled];
    }).join('');
    
    return sparkline;
  }
  
  renderCategoryRow(category) {
    return `
      <tr>
        <td>${category.name}</td>
        <td>$${category.amount.toFixed(2)}</td>
        <td>${category.percentage.toFixed(1)}%</td>
        <td>
          <div class="sparkline">
            ${'▇'.repeat(Math.round(category.percentage / 10))}
          </div>
        </td>
      </tr>
    `;
  }
}