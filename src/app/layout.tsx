// src/app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <html lang="en">
      <head>
        <title>OtterMQ</title>
      </head>
      <body>
        <header className="bg-gray-800 text-white">
          <nav className="container mx-auto flex justify-between items-center p-4">
            <div className="text-2xl font-bold">
              OtterMQ
            </div>
            <form className="flex space-x-2">
              <input
                type="text"
                placeholder="Username"
                className="p-2 rounded bg-gray-700 border border-gray-600"
              />
              <input
                type="password"
                placeholder="Password"
                className="p-2 rounded bg-gray-700 border border-gray-600"
              />
              <button
                type="submit"
                className="bg-blue-500 p-2 rounded hover:bg-blue-700"
              >
                Login
              </button>
            </form>
          </nav>
        </header>
        <nav className="bg-gray-700 text-white">
          <ul className="container mx-auto flex space-x-4 p-4">
            <li>
              <a href="/overview" className="hover:text-blue-500">Overview</a>
            </li>
            <li>
              <a href="/connections" className="hover:text-blue-500">Connections</a>
            </li>
            <li>
              <a href="/exchanges" className="hover:text-blue-500">Exchanges</a>
            </li>
            <li>
              <a href="/queues" className="hover:text-blue-500">Queues</a>
            </li>
          </ul>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
};

export default Layout;
