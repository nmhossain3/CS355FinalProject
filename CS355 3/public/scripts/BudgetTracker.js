export default class BudgetTracker {
  constructor(el) {
    // setting the innerHTML of the element passed to this constructor
    this.root = document.querySelector(el)
    this.root.innerHTML = BudgetTracker.html()
    
    // DOM selectors so we can easily reference the HTML elements throughout the code
    this.statsContainer = document.querySelector('.stats-container')
    this.table = document.querySelector('.transactions-table')
    this.tableBody = document.querySelector('.transactions')
    this.form = document.querySelector('#transactionForm')
    this.date = document.querySelector('#date')
    this.description = document.querySelector('#description')
    this.amount = document.querySelector('#amount')
    this.type = document.querySelector('#type')
    this.income = document.querySelector('#income')
    this.expenses = document.querySelector('#expenses')
    this.balance = document.querySelector('#balance')

    // Event listeners for submitting the form, and when deleting a transaction
    this.form.addEventListener('submit', this.addTransaction.bind(this))
    this.table.addEventListener('click', this.deleteTransaction.bind(this))

    // Initial load
    this.load();
  }

  static html() {
    return `
      <div class="budget-tracker">
        <h1 class="mb-md">Budget Tracker</h1>
        <p class="lead mb-lg">Track your income and expenses over time.</p>
        <div class="stats-container hidden">
          <div class="stat">
            <span id="balance" class="stat-value color-green mb-sm count">$0</span>
            <h5 class="stat-title">Balance</h5>
          </div>
          <div class="stat">
            <span id="income" class="stat-value color-green mb-sm count">+$0</span>
            <h5 class="stat-title">Income</h5>
          </div>
          <div class="stat">
            <span id="expenses" class="stat-value color-red mb-sm count">-$0</span>
            <h5 class="stat-title">Expenses</h5>
          </div>
        </div>
        <form id="transactionForm" class="budget-form" autocomplete="off">
          <input id="date" type="text" placeholder="MM/DD/YYYY" />
          <input id="description" type="text" placeholder="Description" />
          <input id="amount" type="text" placeholder="$0.00" />
          <div class="select-wrapper">
            <select id="type">
              <option value="">Type</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
          <button id="submitBtn" class="btn" type="submit">Submit</button>
        </form>
        <div class="transactions-table-container">
          <table class="transactions-table hidden">
            <thead>
              <tr class="table-header">
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody class="transactions"></tbody>
          </table>
        </div>
      </div>
    `
  }

  load() {
    // Initializes the datepicker
    new Datepicker(this.date, {});

    // Fetches all transactions and statistics (balance, income, expenses)
    this.renderTransactions()
    this.renderStatistics()
  }

  /*
    fetch makes an API get request to our NodeJS/Express backend
    to retrieve all transactions in the database.

    This leads to app.get('/') inside of our app.js file
  */
  renderTransactions() {
    fetch('http://localhost:3001/')
      .then(response => response.json())
      .then(transactions => {
        /*
          If there are no transactions, hide the table,
          Else we add a table row for each transaction
        */
        if (!transactions || !transactions.length) {
          this.table.classList.add('hidden')
          this.statsContainer.classList.add('hidden')
        } else {
          this.table.classList.remove('hidden')
          this.statsContainer.classList.remove('hidden')
          
          for (const transaction of transactions) {
            this.addRow(transaction)
          }
        }
      })
  }

  addTransaction(e) {
    /*
      e is the event object. we call e.preventDefault() to prevent the form from submitting.
      If we don't do this, the page refreshes!
    */
    e.preventDefault()

    /*
      Very standard form validation - could use some upgrading
    */
    if (
      this.date.value === '' ||
      this.description.value === '' ||
      this.amount.value === '' ||
      this.type.value === ''
    ) {
      alert("Please fill in all the form fields to submit a transaction")
      return
    }

    if (isNaN(this.amount.value)) {
      alert("Amount must be a number")
      return
    }

    /* 
      POST request to the backend
      This sends all the data from the form to app.post('/create') in app.js
    */
    fetch('http://localhost:3001/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: this.date.value,
        description: this.description.value,
        amount: this.amount.value,
        type: this.type.value
      })
    })
    .then(response => response.json())
    .then(data => {
      this.addRow(data.transaction)
      this.showToast('Successfully added a transaction 🎉')
      this.renderStatistics()
      this.clearFields()
    })
  }

  // method for rendering Balance, Income, and Expenses
  renderStatistics() {
    fetch('http://localhost:3001/statistics')
      .then(response => response.json())
      .then(data => {
        this.income.textContent = `+$${data.income.toFixed(2)}`
        this.expenses.textContent = `-$${data.expenses.toFixed(2)}`

        if (data.balance < 0) {
          this.balance.textContent = `-$${data.balance.toFixed(2) * -1}`
          this.balance.classList.add('color-red')
          this.balance.classList.remove('color-green')
        } else {
          this.balance.textContent = `$${data.balance.toFixed(2)}`
          this.balance.classList.add('color-green')
          this.balance.classList.remove('color-red')
        }
      })
  }

  addRow(transaction) {
    // First, we create a new table row
    const tr = document.createElement('tr')
    
    // Creating a delete button for last table cell
    const deleteButtonTd = document.createElement('td')
    const deleteButton = document.createElement('button')
    deleteButton.classList.add('btn', 'btn-danger')
    deleteButton.textContent = 'Delete'
    /*
      Attaching the transaction ID as a data attribute to the button.
      So whenever we attempt to delete a transaction, we'll have convenient access to the ID
    */
    deleteButton.dataset.transactionId = transaction._id
    deleteButtonTd.appendChild(deleteButton)

    // Don't need to show these values in the new table row, so deleted
    delete transaction.__v
    delete transaction._id

    /*
      Looping through each property in a transaction object:
      date, description, type, amount
      Then creating a table cell for each property,
      and appending each table cell in the row created above
    */
    for (const prop in transaction) {
      const td = document.createElement('td')
      td.innerHTML = transaction[prop];

      if (prop === 'amount' && transaction.type === 'Income') {
        td.innerHTML = transaction[prop].toFixed(2)
        td.innerHTML = `+$${td.innerHTML}`
        td.classList.add('color-green')
      } else if (prop === 'amount' && transaction.type === 'Expense') {
        td.innerHTML = transaction[prop].toFixed(2)
        td.innerHTML = `-$${td.innerHTML}`
        td.classList.add('color-red')
      }

      tr.appendChild(td)
    }

    // append the delete button LAST
    tr.appendChild(deleteButtonTd)

    // then we append the entire row to the table body
    this.tableBody.appendChild(tr)
    this.table.classList.remove('hidden')
    this.statsContainer.classList.remove('hidden')
  }

  deleteTransaction(e) {
    // whatever element we clicked inside of the table
    const target = e.target

    /*
      accessing the transactionId that we attached to the delete button earlier inside of addRow()
      if a transactionId data attribute exists on the target element clicked, then we delete the row.
    */
    if (target.dataset.transactionId) {
      const td = target.parentNode
      const tr = td.parentNode

      /* 
        DELETE request to the backend
        This sends the transaction ID to app.delete('/transaction/:id') in app.js
      */
      fetch(`http://localhost:3001/transaction/${target.dataset.transactionId}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
        this.showToast('Successfully deleted the transaction 🎉')
        this.renderStatistics()
        tr.remove()

        // if there are no rows in the table, hide it
        if (!this.tableBody.rows.length) {
          this.table.classList.add('hidden')
          this.statsContainer.classList.add('hidden')
        }
      })
    } else {
      return
    }
  }

  /*
    Thought it was cool to add a Toast whenever a transaction is added/delete
    Why? Aesthetics.
  */
  showToast(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "bottom", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      }
    }).showToast()
  }

  clearFields() {
    this.date.value = ''
    this.description.value = ''
    this.amount.value = ''
    this.type.value = ''
  }
}

new BudgetTracker('#budgetTracker')