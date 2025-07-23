export class TransactionForm {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('transactions-view');
  }

  render() {
    const { categories } = this.app.state;

    this.container.innerHTML = `
      <div class="card">
        <h2>New Transaction</h2>
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
            <label for="trans-category">Category</label>
            <select id="trans-category" required>
              <option value="" disabled selected>Select category</option>
              ${categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="trans-amount">Amount (₦)</label>
            <input type="number" id="trans-amount" step="0.01" required>
          </div>
          <div class="form-group">
            <label for="trans-notes">Notes</label>
            <textarea id="trans-notes" rows="2"></textarea>
          </div>
          <button type="submit">Add Transaction</button>
        </form>
      </div>
    `;

    document.getElementById('transaction-form').addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();

    const date = document.getElementById('trans-date').value;
    const payee = document.getElementById('trans-payee').value.trim();
    const category = document.getElementById('trans-category').value;
    const amount = parseFloat(document.getElementById('trans-amount').value);
    const notes = document.getElementById('trans-notes').value.trim();

    if (!date || !payee || !category || isNaN(amount)) {
      alert('Please fill in all required fields.');
      return;
    }

    const transaction = {
      id: crypto.randomUUID(),
      date,
      payee,
      category,
      amount: -Math.abs(amount), // expenses are negative
      notes
    };

    const updatedCategories = this.app.state.categories.map(cat => {
      if (cat.name === category) {
        return { ...cat, spent: cat.spent + Math.abs(transaction.amount) };
      }
      return cat;
    });

    this.app.updateState({
      transactions: [...this.app.state.transactions, transaction],
      categories: updatedCategories
    });

    e.target.reset();
  }
}
