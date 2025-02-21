import { Todo } from '../types/todo';

interface StatisticsProps {
  todos: Todo[];
}

const Statistics = ({ todos }: StatisticsProps) => {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const pending = total - completed;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Total Tasks</h3>
        <p className="text-2xl font-bold text-blue-500">{total}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Completed</h3>
        <p className="text-2xl font-bold text-green-500">{completed}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Pending</h3>
        <p className="text-2xl font-bold text-yellow-500">{pending}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Completion Rate</h3>
        <p className="text-2xl font-bold text-purple-500">{completionRate}%</p>
      </div>
    </div>
  );
};

export default Statistics; 