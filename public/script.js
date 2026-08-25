const storageKey = 'simple-todo.tasks'

const form = document.querySelector('#todo-form')
const input = document.querySelector('#todo-input')
const list = document.querySelector('#todo-list')
const count = document.querySelector('#task-count')
const emptyState = document.querySelector('#empty-state')
const clearDone = document.querySelector('#clear-done')

const loadTasks = () => {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return Array.isArray(savedTasks) ? savedTasks : []
  } catch {
    return []
  }
}

let tasks = loadTasks()

const saveTasks = () => {
  localStorage.setItem(storageKey, JSON.stringify(tasks))
}

const taskSummary = () => {
  if (tasks.length === 0) return 'No tasks yet'

  const openTasks = tasks.filter((task) => !task.done).length
  const taskWord = openTasks === 1 ? 'task' : 'tasks'
  return openTasks === 0 ? 'All done' : `${openTasks} ${taskWord} left`
}

const render = () => {
  list.replaceChildren()

  tasks.forEach((task) => {
    const item = document.createElement('li')
    item.className = task.done ? 'todo-item done' : 'todo-item'

    const checkbox = document.createElement('input')
    checkbox.className = 'toggle'
    checkbox.type = 'checkbox'
    checkbox.checked = task.done
    checkbox.setAttribute('aria-label', `Mark ${task.text} as ${task.done ? 'not done' : 'done'}`)
    checkbox.addEventListener('change', () => {
      tasks = tasks.map((savedTask) =>
        savedTask.id === task.id ? { ...savedTask, done: checkbox.checked } : savedTask,
      )
      saveTasks()
      render()
    })

    const text = document.createElement('span')
    text.className = 'task-text'
    text.textContent = task.text

    const deleteButton = document.createElement('button')
    deleteButton.className = 'delete'
    deleteButton.type = 'button'
    deleteButton.textContent = 'Delete'
    deleteButton.addEventListener('click', () => {
      tasks = tasks.filter((savedTask) => savedTask.id !== task.id)
      saveTasks()
      render()
    })

    item.append(checkbox, text, deleteButton)
    list.append(item)
  })

  count.textContent = taskSummary()
  emptyState.hidden = tasks.length > 0
  clearDone.hidden = tasks.every((task) => !task.done)
}

form.addEventListener('submit', (event) => {
  event.preventDefault()

  const text = input.value.trim()
  if (!text) return

  tasks = [
    { id: crypto.randomUUID(), text, done: false },
    ...tasks,
  ]
  input.value = ''
  saveTasks()
  render()
})

clearDone.addEventListener('click', () => {
  tasks = tasks.filter((task) => !task.done)
  saveTasks()
  render()
})

render()
