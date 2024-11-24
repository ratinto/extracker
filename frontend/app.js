const apiBase = 'http://localhost:3000/api/expenses'; // Replace with your backend API URL
let expenses = [];

async function loadExpenses() {
  try {
    const response = await fetch(apiBase);
    expenses = await response.json();
    renderExpenseList();
    updateTotalExpenseAndSavings();
    renderExpenseChart();
  } catch (error) {
    console.error('Error loading expenses:', error);
  }
}

function renderExpenseList() {
  const expenseList = document.getElementById('expenseList');
  expenseList.innerHTML = '';
  expenses.forEach((expense) => {
    const expenseItem = document.createElement('div');
    expenseItem.classList.add('card', 'mb-3');
    expenseItem.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">Amount: $${expense.amount}</h5>
        <p><strong>Category:</strong> ${expense.category}</p>
        <p><strong>Description:</strong> ${expense.description}</p>
        <p><strong>Date:</strong> ${expense.date}</p>
        <button onclick="deleteExpense('${expense._id}')" class="btn btn-danger">Delete</button>
      </div>
    `;
    expenseList.appendChild(expenseItem);
  });
}

async function deleteExpense(id) {
  try {
    const response = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
    const result = await response.json();
    alert(result.message);
    loadExpenses(); // Reload the expenses list after deleting
  } catch (error) {
    console.error('Error deleting expense:', error);
  }
}

async function addExpense() {
  const amount = document.getElementById('amount').value;
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value;
  const date = document.getElementById('date').value;

  const expenseData = {
    amount,
    category,
    description,
    date,
  };

  try {
    const response = await fetch(apiBase, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
    });
    const result = await response.json();
    alert(result.message);
    loadExpenses(); // Reload the expenses after adding
  } catch (error) {
    console.error('Error adding expense:', error);
  }
}

function updateTotalExpenseAndSavings() {
  let totalExpense = 0;
  let totalSavings = 0;

  expenses.forEach(expense => {
    totalExpense += expense.amount;
    totalSavings += (expense.amount <= 100) ? expense.amount : 0; // Example condition for savings
  });

  document.getElementById('totalExpense').textContent = totalExpense;
  document.getElementById('totalSavings').textContent = totalSavings;
}

function renderExpenseChart() {
  const categories = {
    Expense: 0,
    Investment: 0,
    Saving: 0
  };

  expenses.forEach(expense => {
    if (categories[expense.category] !== undefined) {
      categories[expense.category] += expense.amount;
    }
  });

  const data = {
    labels: ['Expense', 'Investment', 'Saving'],
    datasets: [{
      label: 'Expense by Category',
      data: [categories.Expense, categories.Investment, categories.Saving],
      backgroundColor: ['#ff5733', '#33c1ff', '#75ff33'],
      hoverOffset: 4
    }]
  };

  const config = {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      }
    }
  };

  const ctx = document.getElementById('expenseChart').getContext('2d');
  new Chart(ctx, config); // Create the chart using Chart.js
}

// Call loadExpenses when the page loads
window.onload = function() {
  loadExpenses();
};
