import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Todo } from '../types/todo';
import { SortableItem } from './SortableItem';
import FilterBar from './FilterBar';
import Statistics from './Statistics';

interface EditingState {
  id: string | null;
  text: string;
  priority: Todo['priority'];
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  
  const [newTodo, setNewTodo] = useState('');
  const [editing, setEditing] = useState<EditingState>({
    id: null,
    text: '',
    priority: 'medium'
  });
  const [filters, setFilters] = useState({
    search: '',
    priority: '',
    category: '',
    status: '',
  });
  const [newTodoPriority, setNewTodoPriority] = useState<Todo['priority']>('medium');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo: Todo = {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false,
      number: todos.length + 1,
      priority: newTodoPriority,
      dueDate: null,
      category: 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTodos([...todos, todo]);
    setNewTodo('');
    setNewTodoPriority('medium');
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id).map((todo, index) => ({
      ...todo,
      number: index + 1
    })));
  };

  const handleToggleComplete = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { 
        ...todo, 
        completed: !todo.completed,
        updatedAt: new Date().toISOString()
      } : todo
    ));
  };

  const handleStartEdit = (todo: Todo) => {
    setEditing({
      id: todo.id,
      text: todo.text,
      priority: todo.priority
    });
  };

  const handleSaveEdit = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { 
        ...todo, 
        text: editing.text.trim(),
        priority: editing.priority,
        updatedAt: new Date().toISOString()
      } : todo
    ));
    setEditing({ id: null, text: '', priority: 'medium' });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, index) => ({
          ...item,
          number: index + 1
        }));
      });
    }
  };

  // Filter todos based on current filters
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(filters.search.toLowerCase());
    const matchesPriority = !filters.priority || todo.priority === filters.priority;
    const matchesStatus = !filters.status || 
      (filters.status === 'completed' ? todo.completed : !todo.completed);
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Statistics todos={todos} />
      <FilterBar onFilterChange={setFilters} />
      
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
          <select
            value={newTodoPriority}
            onChange={(e) => setNewTodoPriority(e.target.value as Todo['priority'])}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-800 focus:outline-none focus:ring-2
                     focus:ring-blue-500 dark:focus:ring-blue-400"
            aria-label="Select priority"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredTodos}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-3">
            {filteredTodos.map((todo) => (
              <SortableItem
                key={todo.id}
                id={todo.id}
                todo={todo}
                editing={editing}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
                onStartEdit={handleStartEdit}
                onSaveEdit={handleSaveEdit}
                setEditing={setEditing}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TodoList; 