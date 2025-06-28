import { getTodos } from '@/lib/db/queries';
import TodoList from './todo-list';
import Link from 'next/link';

// This will be replaced by 'use cache' soon
export const dynamic = 'force-static';

export default async function Home() {
  const todos = await getTodos();

  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <main className="max-w-[350px] mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-100">
          Postgres Starter
        </h1>
        
        <div className="mb-6 text-center">
          <Link 
            href="/users" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
          >
            Quản lý người dùng
          </Link>
        </div>
        
        <TodoList initialTodos={todos} />
      </main>
    </div>
  );
}
