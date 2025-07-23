export class TransactionHistory {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('transactions-view');
  }

  render() {
    const { transactions } = this.app.state;

    this.container.insertAdjacentHTML('beforeend', `
      <div class="card">
        <h2>Transaction History</h2>
        <div class="form-group">
          <input type="text" id="trans-search" placeholder="Search transactions...">
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Payee</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="transactions-list">
            ${transactions.map(trans => this.renderTransaction(trans)).join('')}
          </tbody>
        </table>
      </div>
    `);

    // Search functionality
    document.getElementById('trans-search').addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      document.querySelectorAll('#transactions-list tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
      });
    });

    // Delete button handlers
    document.querySelectorAll('.delete-trans-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleDelete(e));
    });
  }

  renderTransaction(transaction) {
    return `
      <tr>
        <td>${transaction.date}</td>
        <td>${transaction.payee}</td>
        <td>${transaction.category}</td>
        <td style="color: ${transaction.amount < 0 ? 'var(--danger)' : 'var(--success)'}">
          ₦${Math.abs(transaction.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
        </td>
        <td>${transaction.notes || ''}</td>
        <td>
          <button class="delete-trans-btn" data-id="${transaction.id}">Delete</button>
        </td>
      </tr>
    `;
  }

  handleDelete(e) {
    const transId = e.target.dataset.id;
    const transaction = this.app.state.transactions.find(t => t.id === transId);
    
    if (!transaction) return;

    // Refund category spent amount
    const updatedCategories = this.app.state.categories.map(cat => {
      if (cat.name === transaction.category) {
        return { ...cat, spent: cat.spent - Math.abs(transaction.amount) };
      }
      return cat;
    });

    this.app.updateState({
      transactions: this.app.state.transactions.filter(t => t.id !== transId),
      categories: updatedCategories
    });
  }
}
