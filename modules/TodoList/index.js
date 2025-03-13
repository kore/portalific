import { useState } from "react";
import { XCircleIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function TodoList({ configuration, updateModuleConfiguration }) {
  const [newTodo, setNewTodo] = useState("");
  const [dueDate, setDueDate] = useState("");

  let today = new Date();
  today.setHours(0, 0, 0, 0);
  let tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  let todos = configuration.todos || [];
  todos.sort(
    (a, b) => new Date(a.dueDate || tomorrow) - new Date(b.dueDate || tomorrow)
  );

  return (
    <ul className="todo-list">
      {todos
        .filter((todo) => !todo.resolved)
        .map((todo, index) => {
          const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;

          return (
            <li className="todo-list__item" key={todo.create}>
              <div className="todo-list__checkbox-container">
                <div className="todo-list__checkbox-wrapper">
                  <input
                    id={"todo-" + index}
                    aria-describedby="comments-description"
                    type="checkbox"
                    className="todo-list__checkbox"
                    onChange={() => {
                      todo.resolved = new Date().toISOString();
                      updateModuleConfiguration({ ...configuration });
                    }}
                  />
                  <label
                    htmlFor={"todo-" + index}
                    className="todo-list__checkbox-label"
                  >
                    <CheckIcon
                      className="todo-list__checkbox-icon"
                      aria-hidden="true"
                    />
                  </label>
                </div>
              </div>
              <div className="todo-list__content">
                <p className="todo-list__text">
                  {todo.text}
                </p>
                <p className="todo-list__created-date">
                  Created{" "}
                  {new Date(todo.create).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="todo-list__due-date">
                {dueDate && (
                  <p
                    className={`todo-list__due-date-text ${
                      today.toLocaleDateString() ===
                      dueDate.toLocaleDateString()
                        ? "todo-list__due-date-text--today"
                        : dueDate < today
                        ? "todo-list__due-date-text--overdue"
                        : "todo-list__due-date-text--future"
                    }`}
                  >
                    {dueDate.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      {(configuration.todos || [])
        .filter((todo) => todo.resolved && new Date(todo.resolved) > today)
        .map((todo, index) => {
          return (
            <li className="todo-list__item todo-list__item--resolved" key={todo.create}>
              <div className="todo-list__checkbox-container">
                <div className="todo-list__checkbox-wrapper todo-list__checkbox-wrapper--resolved">
                  <input
                    id={"resolved-" + index}
                    aria-describedby="comments-description"
                    type="checkbox"
                    className="todo-list__checkbox"
                    onChange={() => {
                      todo.resolved = null;
                      updateModuleConfiguration({ ...configuration });
                    }}
                  />
                  <label
                    htmlFor={"resolved-" + index}
                    className="todo-list__checkbox-label todo-list__checkbox-label--resolved"
                  >
                    <XCircleIcon
                      className="todo-list__checkbox-icon todo-list__checkbox-icon--resolved"
                      aria-hidden="true"
                    />
                  </label>
                </div>
              </div>
              <div className="todo-list__content todo-list__content--resolved">
                <p className="todo-list__text todo-list__text--resolved">{todo.text}</p>
              </div>
              <div className="todo-list__due-date" />
            </li>
          );
        })}
      <li className="todo-list__form-container">
        <form
          className="todo-list__form"
          onSubmit={(event) => {
            let todos = (configuration.todos || []).concat([
              {
                text: newTodo,
                dueDate: dueDate || null,
                create: new Date().toISOString(),
                resolved: null,
              },
            ]);

            updateModuleConfiguration({ ...configuration, todos: [...todos] });
            setNewTodo("");
            setDueDate("");

            event.preventDefault();
            event.stopPropagation();
            return false;
          }}
        >
          <input
            type="date"
            name="duedate"
            id="duedate"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="todo-list__date-input"
          />
          <input
            type="text"
            name="todo"
            id="todo"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            placeholder="Add a TODO item (with optional due date)"
            className="todo-list__text-input"
          />
        </form>
      </li>
    </ul>
  );
}
