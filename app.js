// Simple working implementation
document.addEventListener('DOMContentLoaded', () => {
  console.log("App started!");
  
  const state = {
    balance: 10000, // ₦10,000 starting balance
    transactions: []
  };

  // Display
  function updateDisplay() {
    document.getElementById('balance').textContent = 
      `Current Balance: ₦${state.balance.toLocaleString('en-NG')}`;
  }

  // Test transaction
  document.getElementById('add-transaction').addEventListener('click', () => {
    state.balance -= 500;
    state.transactions.push({
      amount: -500,
      description: "Test transaction"
    });
    updateDisplay();
    console.log("Transaction added:", state.transactions);
  });

  // Initialize
  updateDisplay();
});
