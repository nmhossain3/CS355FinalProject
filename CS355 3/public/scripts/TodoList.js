export default class TodoList {
  constructor(el) {
    this.root = document.querySelector(el);
    this.root.innerHTML = TodoList.html();

    // Selectors
    this.todoForm = document.querySelector('#todoForm')
    this.todoInput = document.querySelector('#todoInput')
    this.submitBtn = document.querySelector('#submitBtn')
    this.todoList = document.querySelector('#todoList')

    this.todoForm.addEventListener('submit', this.addTodo.bind(this))
    this.todoList.addEventListener('click', this.manageTodos)
  }

  static html() {
    return `
    <div class="container">
      <div class="card">
        <h1 class="mb-md">Todo List</h1>
        <p class="lead mb-lg">Stay organized by listing out all of your tasks for the day.</p>
        <form id="todoForm">
          <input id="todoInput" type="text" placeholder="Enter Task Name" />
          <button id="submitBtn" type="submit" class="btn">Submit</button>
        </form>
        <ul id="todoList">
        </ul>
      </div>
    </div>
    `
  }

  addTodo(e) {
    e.preventDefault()
    const { value } = this.todoInput

    const li = document.createElement('li')
    li.classList.add('todo-item')

    const label = document.createElement('label')
    label.classList.add('label')
    label.textContent = value

    const checkbox = document.createElement('input')
    checkbox.classList.add('checkbox')
    checkbox.setAttribute('type', 'checkbox')

    const input = document.createElement('input')
    input.classList.add('hidden', 'edit-todo-input')
    input.value = value

    const editBtn = document.createElement('button')
    editBtn.classList.add('btn', 'btn-sm', 'edit')
    editBtn.textContent = 'Edit'

    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('btn', 'btn-sm', 'btn-danger', 'delete')
    deleteBtn.textContent = 'Delete'

    li.appendChild(checkbox)
    li.appendChild(label)
    li.appendChild(input)
    li.appendChild(editBtn)
    li.appendChild(deleteBtn)

    this.todoList.appendChild(li)

    this.todoInput.value = ""
    this.todoInput.focus()
  }

  manageTodos(e) {
    const el = e.target
    const parent = el.parentElement
    const editInput = parent.getElementsByClassName('edit-todo-input')[0]
    const editBtn = parent.getElementsByClassName('edit')[0]
    const deleteBtn = parent.getElementsByClassName('delete')[0]
    const checkbox = parent.getElementsByClassName('checkbox')[0]
    const label = parent.getElementsByClassName('label')[0]

    if (el.classList.contains('delete')) {
      el.parentElement.remove()
    } else if (el.classList.contains('checkbox')) {
      el.nextElementSibling.classList.toggle('line-through')
    } else if (el.classList.contains('edit')) {
      checkbox.classList.add('hidden')
      label.classList.add('hidden')
      deleteBtn.classList.add('hidden')
      editBtn.classList.add('hidden')

      const submitBtn = document.createElement('button')
      submitBtn.textContent = 'Submit'
      submitBtn.classList.add('btn', 'btn-submit-edit', 'btn-success')

      const cancelBtn = document.createElement('button')
      cancelBtn.textContent = 'Cancel'
      cancelBtn.classList.add('btn', 'btn-cancel', 'btn-grey')

      editInput.classList.remove('hidden')
      parent.appendChild(submitBtn)
      parent.appendChild(cancelBtn)

      submitBtn.addEventListener('click', function() {
        label.textContent = editInput.value
        editInput.classList.add('hidden')
        editInput.value = label.textContent

        checkbox.classList.remove('hidden')
        label.classList.remove('hidden')
        deleteBtn.classList.remove('hidden')
        editBtn.classList.remove('hidden')

        submitBtn.remove()
        cancelBtn.remove()
      })

      cancelBtn.addEventListener('click', function() {
        editInput.classList.add('hidden')

        checkbox.classList.remove('hidden')
        label.classList.remove('hidden')
        deleteBtn.classList.remove('hidden')
        editBtn.classList.remove('hidden')

        submitBtn.remove()
        cancelBtn.remove()
      })
    }
  }
}

new TodoList('#todoApp')