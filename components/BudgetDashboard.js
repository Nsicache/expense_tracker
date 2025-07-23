export class BudgetDashboard {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('dashboard-view');
  }

  render() {
    const { balance, categories } = this.app.state;
    const totalAllocated = categories.reduce((sum, cat) => sum + cat.amount, 0);
    const unallocated = balance - totalAllocated;

    this.container.innerHTML = `
      <div class="card">
        <h2>Budget Overview</h2>
        <p><strong>Total Balance:</strong> ₦${this.format(balance)}</p>
        <p><strong>Unallocated Funds:</strong> ₦${this.format(unallocated)}</p>
      </div>
      <div class="card">
        <h2>Categories</h2>
        <ul class="category-list">
          ${categories.map(cat => `
            <li>
              <strong>${cat.name}</strong><br>
              Allocated: ₦${this.format(cat.amount)}<br>
              Spent: ₦${this.format(cat.spent)}<br>
              Remaining: ₦${this.format(cat.amount - cat.spent)}
            </li>
          `).join('')}
        </ul>
        <button id="add-category-btn">Add Category</button>
      </div>
    `;

    document.getElementById('add-category-btn').addEventListener('click', () => this.addCategoryPrompt());
  }

  addCategoryPrompt() {
    const name = prompt('Enter new category name:');
    const amountStr = prompt('Enter amount to allocate:');
    const amount = parseFloat(amountStr);

    if (!name || isNaN(amount) || amount <= 0) {
      alert('Invalid input. Please try again.');
      return;
    }

    const { balance, categories } = this.app.state;
    const totalAllocated = categories.reduce((sum, cat) => sum + cat.amount, 0);
    const unallocated = balance - totalAllocated;

    if (amount > unallocated) {
      alert('Insufficient unallocated funds.');
      return;
    }

    const newCategory = { name, amount, spent: 0 };
    this.app.updateState({
      categories: [...categories, newCategory]
    });
  }

  format(amount) {
    return amount.toLocaleString('en-NG', { minimumFractionDigits: 2 });
  }
}
