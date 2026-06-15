import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, User } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check initial system/saved preference
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
    
    // Close dropdown on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="h-16 px-6 sm:px-10 flex items-center justify-between border-b border-[#2d16101a] dark:border-[#f5ebe61a] bg-white/50 dark:bg-[#1a080c]/50 backdrop-blur-sm z-10 sticky top-0 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#4C0519] rounded-md flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <Link to="/" className="text-xl font-bold tracking-tight text-[#4C0519] dark:text-[#f5ebe6]">
          MUTU STUDY
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <nav className="gap-8 font-medium text-sm uppercase tracking-widest hidden sm:flex items-center">
          <Link 
            to="/" 
            className={`transition-opacity ${location.pathname === '/' ? 'text-[#4C0519] dark:text-white border-b border-[#4C0519] dark:border-white' : 'opacity-60 hover:opacity-100'}`}
          >
            Home
          </Link>
        </nav>
        
        <div className="flex items-center gap-4 border-l border-[#2d16101a] dark:border-[#f5ebe61a] pl-4 sm:pl-6 ml-2 sm:ml-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[#2d16100a] dark:hover:bg-[#f5ebe61a] transition-colors opacity-70 hover:opacity-100"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full bg-[#4C0519]/10 dark:bg-[#4C0519]/30 flex items-center justify-center hover:bg-[#4C0519]/20 transition-colors"
              aria-label="User menu"
            >
              <User className="w-5 h-5 text-[#4C0519] dark:text-[#f5ebe6]" />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-[8px] bg-white dark:bg-[#1a080c] shadow-lg border border-[#2d16101a] dark:border-[#f5ebe61a] py-1 z-50">
                <Link 
                  to="/admin" 
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm uppercase tracking-wider font-bold text-[#4C0519] dark:text-[#f5ebe6] hover:bg-[#4C0519]/5 dark:hover:bg-[#4C0519]/20 transition-colors"
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
