export class TransactionHistory {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('transactions-view');
  }
  
  render() {
    const { transactions } = this.app.state;
    
    this.container.innerHTML += `
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
              <th></th>
            </tr>
          </thead>
          <tbody id="transactions-list">
            ${transactions.map(trans => this.renderTransaction(trans)).join('')}
          </tbody>
        </table>
      </div>
    `;
    
    // Setup search
    document.getElementById('trans-search').addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      document.querySelectorAll('#transactions-list tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
      });
    });
  }
  
  renderTransaction(transaction) {
    return `
      <tr>
        <td>${transaction.date}</td>
        <td>${transaction.payee}</td>
        <td>${transaction.category}</td>
        <td style="color: ${transaction.amount < 0 ? 'var(--danger)' : 'var(--success)'}">
          $${Math.abs(transaction.amount).toFixed(2)}
        </td>
        <td>${transaction.notes || ''}</td>
        <td>
          <button class="delete-trans-btn" data-id="${transaction.id}">Delete</button>
        </td>
      </tr>
    `;
  }
}