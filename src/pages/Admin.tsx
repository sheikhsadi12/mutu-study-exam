import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { CheckCircle2, AlertCircle, Loader2, Lock, Link as LinkIcon, Code } from 'lucide-react';

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [activeTab, setActiveTab] = useState<'link' | 'html'>('link');

  // Form State - Material Link
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [url, setUrl] = useState('');

  // Form State - HTML Note
  const [htmlSubject, setHtmlSubject] = useState('');
  const [htmlTopic, setHtmlTopic] = useState('');
  const [htmlContent, setHtmlContent] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
    }
  };

  const handleMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !chapter || !url) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await addDoc(collection(db, 'materials'), {
        subject,
        chapter,
        url,
        createdAt: Date.now()
      });
      setSuccess(true);
      setSubject('');
      setChapter('');
      setUrl('');
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, 'materials');
      setError('Firestore Save Failed: ' + (err.message || 'Permissions denied.'));
    } finally {
      setLoading(false);
    }
  };

  const handleHtmlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!htmlSubject || !htmlTopic || !htmlContent) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await addDoc(collection(db, 'html_notes'), {
        subject: htmlSubject,
        topic: htmlTopic,
        htmlContent,
        createdAt: Date.now()
      });
      setSuccess(true);
      setHtmlSubject('');
      setHtmlTopic('');
      setHtmlContent('');
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, 'html_notes');
      setError('Firestore Save Failed: ' + (err.message || 'Permissions denied.'));
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="w-full flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white dark:bg-[#1a080c] rounded-[8px] border-t-[3px] border-[#7C2D12] shadow-lg p-8 flex flex-col w-full max-w-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#4C0519] dark:text-[#f5ebe6]" />
            Admin Login
          </h3>
          <form onSubmit={handleLogin} className="space-y-6 flex-grow">
            {passwordError && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-900 bg-red-100 dark:bg-red-900/30 dark:text-red-200 rounded-md">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{passwordError}</p>
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-[11px] uppercase font-bold tracking-widest opacity-60">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-[#fffdf9] dark:bg-[#120206] border border-[#2d161022] dark:border-[#f5ebe622] rounded-md focus:outline-none focus:border-[#4C0519] text-sm transition-all"
              />
            </div>
            <button className="w-full py-4 bg-[#4C0519] text-white rounded-md font-bold uppercase tracking-widest text-sm shadow-xl shadow-[#4C051922] active:transform active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-[#1a080c] rounded-[8px] border-t-[3px] border-[#7C2D12] shadow-lg p-4 sm:p-8 flex flex-col w-full max-w-2xl">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4C0519]"></span>
          Admin Dashboard
        </h3>

        <div className="flex gap-2 mb-6 bg-[#2d16100a] dark:bg-[#f5ebe60a] p-1 rounded-md">
          <button 
            type="button"
            onClick={() => { setActiveTab('link'); setError(''); setSuccess(false); }}
            className={`flex-1 py-2 text-xs uppercase font-bold tracking-widest rounded transition-all flex items-center justify-center gap-2 ${activeTab === 'link' ? 'bg-white dark:bg-[#1a080c] text-[#4C0519] dark:text-[#f5ebe6] shadow' : 'opacity-60 hover:opacity-100'}`}
          >
            <LinkIcon className="w-3.5 h-3.5" /> Material Link
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab('html'); setError(''); setSuccess(false); }}
            className={`flex-1 py-2 text-xs uppercase font-bold tracking-widest rounded transition-all flex items-center justify-center gap-2 ${activeTab === 'html' ? 'bg-white dark:bg-[#1a080c] text-[#4C0519] dark:text-[#f5ebe6] shadow' : 'opacity-60 hover:opacity-100'}`}
          >
            <Code className="w-3.5 h-3.5" /> HTML Note
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-4 mb-6 text-sm text-red-900 dark:text-red-200 bg-red-100 dark:bg-red-900/30 rounded-md">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="whitespace-pre-wrap">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-2 p-4 mb-6 text-sm text-green-900 dark:text-green-200 bg-green-100 dark:bg-green-900/30 rounded-md">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p>Successfully saved!</p>
          </div>
        )}

        {activeTab === 'link' ? (
          <form onSubmit={handleMaterialSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[11px] uppercase font-bold tracking-widest opacity-60">Subject Name</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Quantum Physics"
                  className="w-full px-4 py-3 bg-[#fffdf9] dark:bg-[#120206] border border-[#2d161022] dark:border-[#f5ebe622] rounded-md focus:outline-none focus:border-[#4C0519] text-sm transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] uppercase font-bold tracking-widest opacity-60">Chapter Name</label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="e.g. Wave-Particle Duality"
                  className="w-full px-4 py-3 bg-[#fffdf9] dark:bg-[#120206] border border-[#2d161022] dark:border-[#f5ebe622] rounded-md focus:outline-none focus:border-[#4C0519] text-sm transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] uppercase font-bold tracking-widest opacity-60">Material URL (PDF / Drive)</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-[#fffdf9] dark:bg-[#120206] border border-[#2d161022] dark:border-[#f5ebe622] rounded-md focus:outline-none focus:border-[#4C0519] text-sm transition-all text-blue-600 dark:text-blue-400"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#4C0519] text-white rounded-md font-bold uppercase tracking-widest text-sm shadow-xl shadow-[#4C051922] active:transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all mt-4"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Deploying...</span></> : <span>Deploy Material</span>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleHtmlSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[11px] uppercase font-bold tracking-widest opacity-60">Subject Name</label>
                <input
                  type="text"
                  value={htmlSubject}
                  onChange={(e) => setHtmlSubject(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-4 py-3 bg-[#fffdf9] dark:bg-[#120206] border border-[#2d161022] dark:border-[#f5ebe622] rounded-md focus:outline-none focus:border-[#4C0519] text-sm transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] uppercase font-bold tracking-widest opacity-60">Topic Title</label>
                <input
                  type="text"
                  value={htmlTopic}
                  onChange={(e) => setHtmlTopic(e.target.value)}
                  placeholder="e.g. Data Structures Overview"
                  className="w-full px-4 py-3 bg-[#fffdf9] dark:bg-[#120206] border border-[#2d161022] dark:border-[#f5ebe622] rounded-md focus:outline-none focus:border-[#4C0519] text-sm transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] uppercase font-bold tracking-widest opacity-60">Raw HTML Content</label>
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  placeholder="<h1>Title</h1><p>Content...</p>"
                  className="w-full h-64 px-4 py-3 font-mono text-xs bg-[#fffdf9] dark:bg-[#120206] border border-[#2d161022] dark:border-[#f5ebe622] rounded-md focus:outline-none focus:border-[#4C0519] transition-all resize-y"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#4C0519] text-white rounded-md font-bold uppercase tracking-widest text-sm shadow-xl shadow-[#4C051922] active:transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all mt-4"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Deploying...</span></> : <span>Publish HTML Note</span>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

