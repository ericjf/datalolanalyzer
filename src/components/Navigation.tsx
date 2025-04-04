import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm mb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex space-x-8 py-4">
          <Link
            href="/"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              pathname === '/'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Análise de Time
          </Link>
          <Link
            href="/compare"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              pathname === '/compare'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Comparativo
          </Link>
        </div>
      </div>
    </nav>
  );
} 