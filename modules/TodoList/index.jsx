import { useState } from 'react'
import { XCircleIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function TodoList ({ configuration, updateModuleConfiguration }) {
  const [newTodo, setNewTodo] = useState('')
  const [dueDate, setDueDate] = useState('')

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  const todos = configuration.todos || []
  todos.sort(
    (a, b) => new Date(a.dueDate || tomorrow) - new Date(b.dueDate || tomorrow)
  )

  return (
    <ul className='todo-list'>
      {todos
        .filter((todo) => !todo.resolved)
        .map((todo, index) => {
          const dueDate = todo.dueDate ? new Date(todo.dueDate) : null
          const status =
            today.toLocaleDateString() === dueDate?.toLocaleDateString()
              ? 'today'
              : dueDate < today
                ? 'overdue'
                : 'future'

          return (
            <li className='todo-item' key={todo.create}>
              <div className='todo-checkbox'>
                <div className='todo-checkbox-wrapper'>
                  <input
                    id={'todo-' + index}
                    aria-describedby='comments-description'
                    type='checkbox'
                    onChange={() => {
                      todo.resolved = new Date().toISOString()
                      updateModuleConfiguration({ ...configuration })
                    }}
                  />
                  <label htmlFor={'todo-' + index}>
                    <CheckIcon aria-hidden='true' />
                  </label>
                </div>
              </div>
              <div className='todo-content'>
                <p className='todo-text'>{todo.text}</p>
                <p className='todo-created'>
                  Created{' '}
                  {new Date(todo.create).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className='todo-due'>
                {dueDate && (
                  <p className='todo-due-text' data-status={status}>
                    {dueDate.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      {(configuration.todos || [])
        .filter((todo) => todo.resolved && new Date(todo.resolved) > today)
        .map((todo, index) => {
          return (
            <li className='todo-item' data-resolved key={todo.create}>
              <div className='todo-checkbox'>
                <div className='todo-checkbox-wrapper'>
                  <input
                    id={'resolved-' + index}
                    aria-describedby='comments-description'
                    type='checkbox'
                    onChange={() => {
                      todo.resolved = null
                      updateModuleConfiguration({ ...configuration })
                    }}
                  />
                  <label htmlFor={'resolved-' + index}>
                    <XCircleIcon aria-hidden='true' />
                  </label>
                </div>
              </div>
              <div className='todo-content'>
                <p className='todo-text'>{todo.text}</p>
              </div>
              <div className='todo-due' />
            </li>
          )
        })}
      <li className='todo-form'>
        <form
          onSubmit={(event) => {
            const todos = (configuration.todos || []).concat([
              {
                text: newTodo,
                dueDate: dueDate || null,
                create: new Date().toISOString(),
                resolved: null
              }
            ])

            updateModuleConfiguration({ ...configuration, todos: [...todos] })
            setNewTodo('')
            setDueDate('')

            event.preventDefault()
            event.stopPropagation()
            return false
          }}
        >
          <input
            type='date'
            name='duedate'
            id='duedate'
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
          <input
            type='text'
            name='todo'
            id='todo'
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            placeholder='Add a TODO item (with optional due date)'
          />
        </form>
      </li>
    </ul>
  )
}
