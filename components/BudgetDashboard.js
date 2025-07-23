export class BudgetDashboard {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('dashboard-view');
  }

  render() {
    const { balance, categories } = this.app.state;
    const assignedTotal = categories.reduce((sum, cat) => sum + cat.assigned, 0);
    const unassigned = balance - assignedTotal;

    this.container.innerHTML = `
      <div class="card balance-card">
        <div>Total Balance: ₦${this.format(balance)}</div>
        <div>Unassigned: ₦${this.format(unassigned)}</div>
      </div>
      
      <div class="card">
        <h2>Categories</h2>
        ${categories.map(cat => this.renderCategory(cat)).join('')}
        <button id="add-category-btn">Add Category</button>
      </div>
    `;

    this.setupEventListeners();
  }

  renderCategory(category) {
    const remaining = category.assigned - category.spent;
    const percentSpent = (category.spent / category.assigned) * 100 || 0;

    return `
      <div class="category-item" data-category="${category.name}">
        <div>
          <strong>${category.name}</strong>
          <div>Assigned: ₦${this.format(category.assigned)} | Spent: ₦${this.format(category.spent)} | Remaining: ₦${this.format(remaining)}</div>
          <div class="category-progress">
            <div class="category-progress-bar" 
                 style="width: ${percentSpent}%;
                        background: ${this.getProgressColor(percentSpent)}">
            </div>
          </div>
        </div>
        <button class="assign-btn">Assign Funds</button>
      </div>
    `;
  }

  format(amount) {
    return amount.toLocaleString('en-NG', { minimumFractionDigits: 2 });
  }

  getProgressColor(percent) {
    return percent > 90 ? 'var(--danger)' : 
           percent > 70 ? 'var(--warning)' : 'var(--success)';
  }

  setupEventListeners() {
    document.getElementById('add-category-btn')?.addEventListener('click', () => {
      this.showAddCategoryForm();
    });

    document.querySelectorAll('.assign-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const categoryName = e.target.closest('.category-item').dataset.category;
        this.handleAssign(categoryName);
      });
    });
  }

  handleAssign(categoryName) {
    const { balance, categories } = this.app.state;
    const unassigned = balance - categories.reduce((sum, cat) => sum + cat.assigned, 0);

    const amount = parseFloat(prompt(`Amount to assign to ${categoryName} (Available: ₦${this.format(unassigned)}:`));
    
    if (!isNaN(amount) && amount > 0) {
      if (amount > unassigned) {
        alert(`Only ₦${this.format(unassigned)} available!`);
        return;
      }

      const updatedCategories = categories.map(cat => 
        cat.name === categoryName 
          ? { ...cat, assigned: cat.assigned + amount }
          : cat
      );

      this.app.updateState({ categories: updatedCategories });
    }
  }

  showAddCategoryForm() {
    this.container.insertAdjacentHTML('beforeend', `
      <div class="card" id="add-category-form">
        <h3>Add Category</h3>
        <div class="form-group">
          <input type="text" id="new-category-name" placeholder="Name" required>
        </div>
        <div class="form-group">
          <input type="number" id="new-category-amount" placeholder="Amount (₦)" min="0" required>
        </div>
        <button id="confirm-add-category">Save</button>
        <button id="cancel-add-category">Cancel</button>
      </div>
    `);

    document.getElementById('confirm-add-category').addEventListener('click', () => {
      const name = document.getElementById('new-category-name').value.trim();
      const amount = parseFloat(document.getElementById('new-category-amount').value);

      if (name && !isNaN(amount)) {
        this.app.updateState({
          categories: [
            ...this.app.state.categories,
            { name, assigned: amount, spent: 0 }
          ]
        });
      }
    });

    document.getElementById('cancel-add-category').addEventListener('click', () => {
      document.getElementById('add-category-form').remove();
    });
  }
}
