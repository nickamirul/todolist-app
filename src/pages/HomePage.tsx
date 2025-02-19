import StickyHeader from '../components/StickyHeader';
import TodoList from '../components/TodoList';

const HomePage = () => (
  <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
    <StickyHeader />

    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Todo List</h1>
      <TodoList />
    </main>
  </div>
);

export default HomePage;