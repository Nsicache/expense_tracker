document.addEventListener('DOMContentLoaded', () => {
  // Initial state
  let state = {
    balance: 0,
    transactions: []
  };

  // Load saved data
  function loadData() {
    const saved = localStorage.getItem('budgetData');
    if (saved) {
      state = JSON.parse(saved);
      updateUI();
    } else {
      // Set initial balance if first time
      const initialBalance = parseFloat(prompt("Enter your starting balance (₦):"));
      if (!isNaN(initialBalance)) {
        state.balance = initialBalance;
        saveData();
        updateUI();
      }
    }
  }

  // Save data
  function saveData() {
    localStorage.setItem('budgetData', JSON.stringify(state));
  }

  // Update the UI
  function updateUI() {
    document.getElementById('balance').textContent = 
      `Balance: ₦${state.balance.toLocaleString('en-NG', {minimumFractionDigits: 2})`;
    
    const transactionsList = document.getElementById('transactions');
    transactionsList.innerHTML = state.transactions
      .map(t => `
        <li>
          <span>${t.description}</span>
          <span>₦${Math.abs(t.amount).toLocaleString('en-NG', {minimumFractionDigits: 2})</span>
        </li>
      `)
      .join('');
  }

  // Add transaction
  document.getElementById('add-btn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value.trim();
    
    if (!isNaN(amount) && description && amount > 0) {
      state.balance -= amount;
      state.transactions.push({
        amount: -amount,
        description,
        date: new Date().toLocaleDateString()
      });
      
      saveData();
      updateUI();
      
      // Clear inputs
      document.getElementById('amount').value = '';
      document.getElementById('description').value = '';
    }
  });

  // Initialize
  loadData();
});
