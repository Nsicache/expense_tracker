export class TransactionForm {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('transactions-view');
  }
  
  render() {
    const { categories } = this.app.state;
    
    this.container.innerHTML = `
      <div class="card">
        <h2>Add Transaction</h2>
        <form id="transaction-form">
          <div class="form-group">
            <label for="trans-date">Date</label>
            <input type="date" id="trans-date" required>
          </div>
          <div class="form-group">
            <label for="trans-payee">Payee</label>
            <input type="text" id="trans-payee" required>
          </div>
          <div class="form-group">
            <label for="trans-amount">Amount</label>
            <input type="number" id="trans-amount" min="0.01" step="0.01" required>
          </div>
          <div class="form-group">
            <label for="trans-category">Category</label>
            <select id="trans-category" required>
              <option value="">Select a category</option>
              ${categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="trans-notes">Notes</label>
            <input type="text" id="trans-notes">
          </div>
          <button type="submit">Add Transaction</button>
        </form>
      </div>
    `;
    
    document.getElementById('transaction-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTransaction();
    });
    
    // Set default date to today
    document.getElementById('trans-date').valueAsDate = new Date();
  }
  
  addTransaction() {
    const date = document.getElementById('trans-date').value;
    const payee = document.getElementById('trans-payee').value.trim();
    const amount = parseFloat(document.getElementById('trans-amount').value);
    const category = document.getElementById('trans-category').value;
    const notes = document.getElementById('trans-notes').value.trim();
    
    if (!payee || isNaN(amount) || !category) return;
    
    const newTransaction = {
      id: Date.now().toString(),
      date,
      payee,
      amount: -Math.abs(amount), // Always treat as expense
      category,
      notes
    };
    
    // Update category spent amount
    const updatedCategories = this.app.state.categories.map(cat => {
      if (cat.name === category) {
        return {
          ...cat,
          spent: cat.spent + Math.abs(amount)
        };
      }
      return cat;
    });
    
    this.app.updateState({
      transactions: [newTransaction, ...this.app.state.transactions],
      categories: updatedCategories
    });
    
    // Reset form
    document.getElementById('transaction-form').reset();
    document.getElementById('trans-date').valueAsDate = new Date();
  }
}