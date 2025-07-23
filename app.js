document.addEventListener('DOMContentLoaded', () => {
  // State management
  const state = {
    balance: 100000, // ₦100,000 starting balance
    transactions: [],
    categories: [
      { name: "Food", budget: 30000, spent: 0 },
      { name: "Transport", budget: 20000, spent: 0 },
      { name: "Entertainment", budget: 10000, spent: 0 }
    ]
  };

  // DOM elements
  const elements = {
    balance: document.getElementById('balance'),
    addTransactionBtn: document.getElementById('add-transaction'),
    transactionForm: document.getElementById('transaction-form'),
    cancelTransactionBtn: document.getElementById('cancel-transaction'),
    submitTransactionBtn: document.getElementById('submit-transaction'),
    transactionsList: document.getElementById('transactions-list'),
    categoriesList: document.getElementById('categories-list'),
    amountInput: document.getElementById('amount'),
    descriptionInput: document.getElementById('description'),
    categorySelect: document.getElementById('category')
  };

  // Initialize app
  function init() {
    loadState();
    setupEventListeners();
    updateUI();
  }

  // Event listeners
  function setupEventListeners() {
    elements.addTransactionBtn.addEventListener('click', showTransactionForm);
    elements.cancelTransactionBtn.addEventListener('click', hideTransactionForm);
    elements.submitTransactionBtn.addEventListener('click', addTransaction);
  }

  // UI functions
  function showTransactionForm() {
    elements.transactionForm.style.display = 'block';
  }

  function hideTransactionForm() {
    elements.transactionForm.style.display = 'none';
    elements.amountInput.value = '';
    elements.descriptionInput.value = '';
  }

  // Core logic
  function addTransaction() {
    const amount = parseFloat(elements.amountInput.value);
    const description = elements.descriptionInput.value.trim();
    const category = elements.categorySelect.value;

    if (!isNaN(amount) {
      // Update balance
      state.balance -= amount;
      
      // Add transaction
      state.transactions.unshift({
        amount: -amount,
        description,
        category,
        date: new Date().toISOString().split('T')[0]
      });

      // Update category
      const categoryObj = state.categories.find(c => c.name === category);
      if (categoryObj) categoryObj.spent += amount;

      // Limit transactions to last 20
      if (state.transactions.length > 20) {
        state.transactions.pop();
      }

      saveState();
      updateUI();
      hideTransactionForm();
    }
  }

  // Update all UI elements
  function updateUI() {
    updateBalance();
    updateTransactions();
    updateCategories();
  }

  function updateBalance() {
    elements.balance.textContent = `Balance: ₦${formatCurrency(state.balance)}`;
  }

  function updateTransactions() {
    elements.transactionsList.innerHTML = state.transactions
      .map(t => `
        <li>
          <span>${t.description}</span>
          <span class="amount ${t.amount < 0 ? 'expense' : 'income'}">
            ₦${formatCurrency(Math.abs(t.amount))} (${t.category})
          </span>
        </li>
      `)
      .join('');
  }

  function updateCategories() {
    elements.categoriesList.innerHTML = state.categories
      .map(c => {
        const percentage = (c.spent / c.budget) * 100;
        return `
          <li>
            <div class="category-header">
              <span>${c.name}</span>
              <span>₦${formatCurrency(c.spent)} / ₦${formatCurrency(c.budget)}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%;
                background: ${percentage > 90 ? '#e74c3c' : percentage > 70 ? '#f39c12' : '#2ecc71'}">
              </div>
            </div>
          </li>
        `;
      })
      .join('');
  }

  // Helper functions
  function formatCurrency(amount) {
    return amount.toLocaleString('en-NG', { minimumFractionDigits: 2 });
  }

  // Local storage
  function saveState() {
    localStorage.setItem('budget-app-state', JSON.stringify(state));
  }

  function loadState() {
    const saved = localStorage.getItem('budget-app-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
    }
  }

  // Start the app
  init();
});
