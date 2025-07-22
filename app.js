import { BudgetDashboard } from './components/BudgetDashboard.js';
import { TransactionForm } from './components/TransactionForm.js';
import { TransactionHistory } from './components/TransactionHistory.js';
import { ReportsView } from './components/ReportsView.js';
import { loadData, saveData } from './utils/storage.js';

class App {
  constructor() {
    this.state = {
      currentView: 'dashboard',
      balance: 0,
      categories: [],
      transactions: []
    };
    
    this.init();
  }
  
  async init() {
    // Load data from localStorage
    const data = await loadData();
    if (data) {
      this.state = data;
    }
    
    // Initialize components
    this.budgetDashboard = new BudgetDashboard(this);
    this.transactionForm = new TransactionForm(this);
    this.transactionHistory = new TransactionHistory(this);
    this.reportsView = new ReportsView(this);
    
    // Setup navigation
    this.setupNavigation();
    
    // Render initial view
    this.renderView();
  }
  
  setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.currentView = btn.dataset.view;
        this.renderView();
      });
    });
  }
  
  renderView() {
    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === this.state.currentView);
    });
    
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active-view');
    });
    
    // Show current view
    document.getElementById(`${this.state.currentView}-view`).classList.add('active-view');
    
    // Render the appropriate component
    switch(this.state.currentView) {
      case 'dashboard':
        this.budgetDashboard.render();
        break;
      case 'transactions':
        this.transactionForm.render();
        this.transactionHistory.render();
        break;
      case 'reports':
        this.reportsView.render();
        break;
    }
  }
  
  updateState(newState) {
    this.state = { ...this.state, ...newState };
    saveData(this.state);
    this.renderView();
  }
}

// Initialize the app
new App();