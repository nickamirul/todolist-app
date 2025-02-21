import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '../types/todo';

interface SortableItemProps {
  id: string;
  todo: Todo;
  editing: {
    id: string | null;
    text: string;
    priority: Todo['priority'];
  };
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (todo: Todo) => void;
  onSaveEdit: (id: string) => void;
  setEditing: (editing: { id: string | null; text: string; priority: Todo['priority'] }) => void;
}

export const SortableItem = ({
  id,
  todo,
  editing,
  onToggleComplete,
  onDelete,
  onStartEdit,
  onSaveEdit,
  setEditing,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 
                rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div
        className="cursor-move px-2 text-gray-400 hover:text-gray-600"
        {...listeners}
      >
        ⋮⋮
      </div>
      
      <p className='text-gray-500'>{todo.number}.</p>
      
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggleComplete(todo.id)}
        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 
                 text-green-500 focus:ring-green-500 focus:ring-offset-0
                 checked:bg-green-500 checked:border-green-500 
                 accent-green-500"
        aria-label={`Mark ${todo.text} as ${todo.completed ? 'incomplete' : 'complete'}`}
      />

      {editing.id === todo.id ? (
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            value={editing.text}
            onChange={(e) => setEditing({ ...editing, text: e.target.value })}
            className="flex-1 px-2 py-1 rounded border border-gray-300 
                     dark:border-gray-700 bg-white dark:bg-gray-800 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Edit todo text"
          />
          <select
            value={editing.priority}
            onChange={(e) => setEditing({ ...editing, priority: e.target.value as Todo['priority'] })}
            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-800 focus:outline-none focus:ring-2
                     focus:ring-blue-500"
            aria-label="Edit priority"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            onClick={() => onSaveEdit(todo.id)}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg 
                     hover:bg-green-600 transition-colors duration-200"
            aria-label="Save edit"
          >
            Save
          </button>
        </div>
      ) : (
        <>
          <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
            {todo.text}
          </span>
          <span className={`px-2 py-1 rounded text-sm ${
            todo.priority === 'high' ? 'bg-red-100 text-red-800' :
            todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {todo.priority}
          </span>
        </>
      )}

      {editing.id !== todo.id && (
        <div className="flex gap-2">
          <button
            onClick={() => onStartEdit(todo)}
            className="p-1 text-gray-500 hover:text-blue-500 transition-colors duration-200"
            aria-label={`Edit ${todo.text}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(todo.id)}
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
  );
}; 