import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  return (
    <header className="h-16 px-10 flex items-center justify-between border-b border-[#2d16101a] dark:border-[#f5ebe61a] bg-white/50 dark:bg-[#1a080c]/50 backdrop-blur-sm z-10 sticky top-0 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#4C0519] rounded-md flex items-center justify-center">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <Link to="/" className="text-xl font-bold tracking-tight text-[#4C0519] dark:text-[#f5ebe6]">
          MUTU STUDY
        </Link>
      </div>
      <nav className="flex gap-8 font-medium text-sm uppercase tracking-widest hidden sm:flex">
        <Link 
          to="/" 
          className={`transition-opacity ${location.pathname === '/' ? 'text-[#4C0519] dark:text-white border-b border-[#4C0519] dark:border-white' : 'opacity-60 hover:opacity-100'}`}
        >
          Home
        </Link>
        <Link 
          to="/admin" 
          className={`transition-opacity ${location.pathname === '/admin' ? 'text-[#4C0519] dark:text-white border-b border-[#4C0519] dark:border-white' : 'opacity-60 hover:opacity-100'}`}
        >
          Admin Dashboard
        </Link>
      </nav>
    </header>
  );
}
