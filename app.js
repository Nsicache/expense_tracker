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
    this.init();
  }

  async init() {
    const data = await loadData();
    if (data) {
      this.state = data;
      this.showApp();
    } else {
      this.showSetup();
    }
  }

  showSetup() {
    document.getElementById('setup-view').classList.add('active-view');
    document.getElementById('app').classList.remove('active-view');

    document.getElementById('save-balance').addEventListener('click', () => {
      const balanceInput = document.getElementById('initial-balance');
      const balance = parseFloat(balanceInput.value);

      if (isNaN(balance) || balance <= 0) {
        balanceInput.classList.add('error');
        alert("Please enter a valid positive amount");
        return;
      }

      this.state = {
        initialized: true,
        balance,
        categories: [
          { name: "Food", assigned: 0, spent: 0 },
          { name: "Transport", assigned: 0, spent: 0 },
          { name: "Rent", assigned: 0, spent: 0 }
        ],
        transactions: []
      };

      saveData(this.state);
      this.showApp();
    });
  }

  showApp() {
    document.getElementById('setup-view').classList.remove('active-view');
    document.getElementById('app').classList.add('active-view');

    this.components = {
      dashboard: new BudgetDashboard(this),
      transactionForm: new TransactionForm(this),
      transactionHistory: new TransactionHistory(this),
      reports: new ReportsView(this)
    };

    this.setupNavigation();
    this.state.currentView = 'dashboard';
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
