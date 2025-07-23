export class BudgetDashboard {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('dashboard-view');
  }

  render() {
    const { balance = 0, categories = [], transactions = [] } = this.app.state;

    // Add default spent = 0 if not present
    const sanitizedCategories = categories.map(cat => ({
      ...cat,
      spent: typeof cat.spent === 'number' ? cat.spent : 0,
    }));

    const totalSpent = sanitizedCategories.reduce((sum, cat) => sum + cat.spent, 0);
    const remaining = balance - totalSpent;

    const topCategories = sanitizedCategories
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5);

    this.container.innerHTML = `
      <div class="card">
        <h2>Budget Summary</h2>
        <ul class="summary-list">
          <li><strong>Total Budget:</strong> ${this.format(balance)}</li>
          <li><strong>Spent:</strong> ${this.format(totalSpent)}</li>
          <li><strong>Remaining:</strong> ${this.format(remaining)}</li>
        </ul>
      </div>

      <div class="card">
        <h2>Top Categories</h2>
        <ul class="category-list">
          ${topCategories.map(cat => `
            <li>
              <strong>${cat.name}</strong>: ${this.format(cat.spent)}
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  format(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) return '₦0.00';
    return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2 });
  }
}
