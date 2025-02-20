import { useEffect, useState } from 'react';
import { Todo } from '../types/todo';

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo: Todo = {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false,
      number: todos.length + 1,
    };

    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id).map((todo, index) => ({
      ...todo,
      number: index + 1
    })));
  };

  const handleToggleComplete = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const handleSaveEdit = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editingText.trim() } : todo
    ));
    setEditingId(null);
  };

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleAddTodo} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                     bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 dark:focus:ring-blue-400"
            aria-label="New todo input"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                     transition-colors duration-200"
            aria-label="Add todo"
          >
            Add
          </button>
        </div>
      </form>

      <ul className="space-y-3">
        {todos.map(todo => (
          <li
            key={todo.id}
            className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 
                     rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <p className='text-gray-500'>{todo.number}.</p>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo.id)}
              className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 
                       text-green-500 focus:ring-green-500 focus:ring-offset-0
                       checked:bg-green-500 checked:border-green-500 
                       accent-green-500"
              aria-label={`Mark ${todo.text} as ${todo.completed ? 'incomplete' : 'complete'}`}
            />

            {editingId === todo.id ? (
              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="flex-1 px-2 py-1 rounded border border-gray-300 
                           dark:border-gray-700 bg-white dark:bg-gray-800 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Edit todo text"
                />
                <button
                  onClick={() => handleSaveEdit(todo.id)}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg 
                           hover:bg-green-600 transition-colors duration-200"
                  aria-label="Save edit"
                >
                  Save
                </button>
              </div>
            ) : (
              <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.text}
              </span>
            )}

            {editingId !== todo.id && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleStartEdit(todo)}
                  className="p-1 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                  aria-label={`Edit ${todo.text}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="p-1 text-gray-500 hover:text-red-500 transition-colors duration-200"
                  aria-label={`Delete ${todo.text}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList; 