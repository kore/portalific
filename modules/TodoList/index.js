import { useState } from "react";
import { XIcon, CheckIcon } from "@heroicons/react/outline";

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
    <ul>
      {todos
        .filter((todo) => !todo.resolved)
        .map((todo, index) => {
          const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;

          return (
            <li className="relative flex items-start pb-2" key={todo.create}>
              <div className="flex items-center">
                <div className="relative h-8 w-8 pt-1">
                  <input
                    id={"todo-" + index}
                    aria-describedby="comments-description"
                    type="checkbox"
                    className="hidden"
                    onChange={() => {
                      todo.resolved = new Date().toISOString();
                      updateModuleConfiguration({ ...configuration });
                    }}
                  />
                  <label
                    htmlFor={"todo-" + index}
                    className="absolute h-8 w-8 rounded-full border-2 border-gray-500 bg-gray-100/50 hover:border-primary-500 hover:bg-primary-800 dark:bg-gray-900/50 hover:dark:bg-primary-200"
                  >
                    <CheckIcon
                      className="h-full w-full p-1 text-gray-500/30 hover:text-primary-500"
                      aria-hidden="true"
                    />
                  </label>
                </div>
              </div>
              <div className="ml-3 grow text-sm">
                <p className="font-medium text-black dark:text-white">
                  {todo.text}
                </p>
                <p className="italic text-gray-500">
                  Created{" "}
                  {new Date(todo.create).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="ml-3 text-sm">
                {dueDate && (
                  <p
                    className={
                      today.toLocaleDateString() ===
                      dueDate.toLocaleDateString()
                        ? "text-black dark:text-white"
                        : dueDate < today
                        ? "text-red-500"
                        : "text-gray-500"
                    }
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
            <li className="relative flex items-start pb-2" key={todo.create}>
              <div className="flex items-center">
                <div className="relative h-8 w-8 pt-1 pl-3">
                  <input
                    id={"resolved-" + index}
                    aria-describedby="comments-description"
                    type="checkbox"
                    className="hidden"
                    onChange={() => {
                      todo.resolved = null;
                      updateModuleConfiguration({ ...configuration });
                    }}
                  />
                  <label
                    htmlFor={"resolved-" + index}
                    className="absolute h-5 w-5 rounded-full border-2 border-gray-500 bg-gray-100/50 hover:border-primary-500 hover:bg-primary-800 dark:bg-gray-900/50 hover:dark:bg-primary-200"
                  >
                    <XIcon
                      className="h-full w-full text-gray-500/30 hover:text-primary-500"
                      aria-hidden="true"
                    />
                  </label>
                </div>
              </div>
              <div className="ml-3 grow py-1 text-sm">
                <p className="font-medium text-gray-500">{todo.text}</p>
              </div>
              <div className="ml-3 text-sm" />
            </li>
          );
        })}
      <li className="mt-2">
        <form
          className="flex items-start"
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
            className="mx-1 h-6 border-b-2 border-gray-500 bg-transparent text-sm focus:outline-none"
          />
          <input
            type="text"
            name="todo"
            id="todo"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            placeholder="Add a TODO item (with optional due date)"
            className="mx-1 h-6 grow border-b-2 border-gray-500 bg-transparent text-sm focus:outline-none"
          />
        </form>
      </li>
    </ul>
  );
}
