import { BudgetDashboard } from './components/BudgetDashboard.js';
import { TransactionForm } from './components/TransactionForm.js';
import { TransactionHistory } from './components/TransactionHistory.js';
import { ReportsView } from './components/ReportsView.js';
import { loadData, saveData } from './utils/storage.js';

class App {
  constructor() {
    this.state = {
      initialized: false,
      balance: 0,
      categories: [],
      transactions: []
    };
    
    this.checkInitialization();
  }

  async checkInitialization() {
    const data = await loadData();
    if (data) {
      this.state = data;
      this.showApp();
    } else {
      this.showSetup();
    }
  }

  showSetup() {
    document.getElementById('setup-view').style.display = 'block';
    document.getElementById('app').style.display = 'none';
    
    document.getElementById('save-balance').addEventListener('click', () => {
      const balance = parseFloat(document.getElementById('initial-balance').value);
      if (!isNaN(balance) {
        this.state = {
          initialized: true,
          balance,
          categories: [],
          transactions: []
        };
        saveData(this.state);
        this.showApp();
      }
    });
  }

  showApp() {
    document.getElementById('setup-view').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    this.init();
  }

  // ... rest of your existing app code ...
}

class App {
  constructor() {
    this.state = {
      currentView: 'dashboard',
      balance: 1000000,
      categories: [
        { name: 'Food', assigned: 50000, spent: 0 },
        { name: 'Transport', assigned: 20000, spent: 0 },
        { name: 'Rent', assigned: 300000, spent: 0 }
      ],
      transactions: []
    };
    this.init();
  }

  async init() {
    const data = await loadData();
    if (data) this.state = data;

    this.components = {
      dashboard: new BudgetDashboard(this),
      transactionForm: new TransactionForm(this),
      transactionHistory: new TransactionHistory(this),
      reports: new ReportsView(this)
    };

    this.setupNavigation();
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
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
    document.querySelectorAll('.nav-btn').forEach(b => 
      b.classList.toggle('active', b.dataset.view === this.state.currentView));

    const currentView = document.getElementById(`${this.state.currentView}-view`);
    currentView.classList.add('active-view');

    if (this.state.currentView === 'transactions') {
      this.components.transactionForm.render();
      this.components.transactionHistory.render();
    } else {
      this.components[this.state.currentView].render();
    }
  }

  updateState(newState) {
    this.state = { ...this.state, ...newState };
    saveData(this.state);
    this.renderView();
  }
}

new App();
