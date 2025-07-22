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
        <div>Total Balance: $${balance.toFixed(2)}</div>
        <div>Unassigned: $${unassigned.toFixed(2)}</div>
      </div>
      
      <div class="card">
        <h2>Categories</h2>
        ${categories.map(cat => this.renderCategory(cat)).join('')}
        <button id="add-category-btn">Add Category</button>
      </div>
    `;
    
    document.getElementById('add-category-btn').addEventListener('click', () => this.showAddCategoryForm());
  }
  
  renderCategory(category) {
    const remaining = category.assigned - category.spent;
    const percentSpent = (category.spent / category.assigned) * 100;
    
    return `
      <div class="category-item">
        <div>
          <strong>${category.name}</strong>
          <div>Assigned: $${category.assigned.toFixed(2)} | Spent: $${category.spent.toFixed(2)} | Remaining: $${remaining.toFixed(2)}</div>
          <div class="category-progress">
            <div class="category-progress-bar" style="width: ${percentSpent}%; background: ${percentSpent > 90 ? 'var(--danger)' : percentSpent > 70 ? 'var(--warning)' : 'var(--success)'}"></div>
          </div>
        </div>
        <div>
          <button class="assign-btn" data-cat="${category.name}">Assign</button>
        </div>
      </div>
    `;
  }
  
  showAddCategoryForm() {
    this.container.innerHTML += `
      <div class="card" id="add-category-form">
        <h3>Add New Category</h3>
        <div class="form-group">
          <label for="category-name">Name</label>
          <input type="text" id="category-name" placeholder="e.g. Groceries">
        </div>
        <div class="form-group">
          <label for="category-assigned">Amount to Assign</label>
          <input type="number" id="category-assigned" min="0" step="0.01">
        </div>
        <button id="save-category-btn">Save Category</button>
        <button id="cancel-category-btn">Cancel</button>
      </div>
    `;
    
    document.getElementById('save-category-btn').addEventListener('click', () => {
      const name = document.getElementById('category-name').value.trim();
      const assigned = parseFloat(document.getElementById('category-assigned').value);
      
      if (name && !isNaN(assigned)) {
        const newCategory = {
          name,
          assigned,
          spent: 0
        };
        
        this.app.updateState({
          categories: [...this.app.state.categories, newCategory]
        });
      }
    });
    
    document.getElementById('cancel-category-btn').addEventListener('click', () => {
      this.render();
    });
  }
}