/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Admin from './pages/Admin';
import NoteView from './pages/NoteView';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#fffdf9] dark:bg-[#120206] text-[#2d1610] dark:text-[#f5ebe6] font-sans antialiased overflow-x-hidden">
        <Header />
        <main className="flex-grow w-full max-w-5xl mx-auto p-4 sm:p-8 flex flex-col gap-4 sm:gap-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/note/:id" element={<NoteView />} />
          </Routes>
        </main>
        <footer className="h-12 border-t border-[#2d161010] dark:border-[#f5ebe610] flex items-center justify-center px-10 text-[10px] uppercase tracking-widest opacity-40 font-semibold shrink-0">
          Mutu Study Foundation &bull; Step 1: Firebase Cloud Infrastructure &bull; 2024
        </footer>
      </div>
    </BrowserRouter>
  );
}
