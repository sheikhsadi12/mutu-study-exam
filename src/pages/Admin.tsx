import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage, handleFirestoreError, OperationType } from '../firebase';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, FileText, Lock } from 'lucide-react';

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !chapter || !file) {
      setError('Please fill in all fields and select a file.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // 1. Upload to Storage
      const fileRef = ref(storage, `pdfs/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file).catch(err => {
        throw new Error('Storage Upload Failed: ' + (err.message || 'Permissions denied.'));
      });
      const url = await getDownloadURL(fileRef);

      // 2. Save metadata to Firestore
      try {
        await addDoc(collection(db, 'pdfs'), {
          subject,
          chapter,
          url,
          createdAt: Date.now()
        });
      } catch (dbError: any) {
        handleFirestoreError(dbError, OperationType.CREATE, 'pdfs');
        throw new Error('Firestore Save Failed: ' + (dbError.message || 'Permissions denied.'));
      }

      setSuccess(true);
      setSubject('');
      setChapter('');
      setFile(null);
      (document.getElementById('pdf-upload') as HTMLInputElement).value = '';
      
    } catch (err: any) {
      console.error('Upload Process Error:', err);
      const errorMessage = err.message || 'An error occurred while uploading. Please check permissions.';
      setError(errorMessage);
      alert(errorMessage);
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
            <button className="w-full py-4 bg-[#4C0519] text-white rounded-md font-bold uppercase tracking-widest text-sm shadow-xl shadow-[#4C051922] active:transform active:scale-[0.98] transition-all">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-[#1a080c] rounded-[8px] border-t-[3px] border-[#7C2D12] shadow-lg p-8 flex flex-col w-full max-w-md lg:max-w-lg">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4C0519]"></span>
          Admin Upload
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6 flex-grow">
        {error && (
          <div className="flex items-center gap-2 p-4 text-sm text-red-900 dark:text-red-200 bg-red-100 dark:bg-red-900/30 rounded-md">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-2 p-4 text-sm text-green-900 dark:text-green-200 bg-green-100 dark:bg-green-900/30 rounded-md">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p>Successfully uploaded the material!</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="subject" className="block text-[11px] uppercase font-bold tracking-widest opacity-60">
              Subject Name
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Quantum Physics"
              className="w-full px-4 py-3 bg-[#fffdf9] dark:bg-[#120206] border border-[#2d161022] dark:border-[#f5ebe622] rounded-md focus:outline-none focus:border-[#4C0519] text-sm transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="chapter" className="block text-[11px] uppercase font-bold tracking-widest opacity-60">
              Chapter Name
            </label>
            <input
              id="chapter"
              type="text"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="e.g. Wave-Particle Duality"
              className="w-full px-4 py-3 bg-[#fffdf9] dark:bg-[#120206] border border-[#2d161022] dark:border-[#f5ebe622] rounded-md focus:outline-none focus:border-[#4C0519] text-sm transition-all"
            />
          </div>

          <div className="space-y-2 mb-8">
            <label htmlFor="pdf-upload" className="block text-[11px] uppercase font-bold tracking-widest opacity-60">
              Document File (PDF)
            </label>
            <div className="cursor-pointer group">
              <label 
                htmlFor="pdf-upload" 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#2d161022] dark:border-[#f5ebe622] rounded-md bg-[#fffdf9] dark:bg-[#120206] p-4 text-center cursor-pointer hover:bg-white dark:hover:bg-[#1a080c] transition-colors relative"
              >
                <UploadCloud className="w-8 h-8 opacity-20 mb-2" />
                <span className="text-xs opacity-50">{file ? file.name : "Click or drag PDF to upload"}</span>
                <input 
                  id="pdf-upload" 
                  type="file" 
                  accept="application/pdf"
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
            {file && (
              <p className="text-sm font-medium text-[#4C0519] mt-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Selected
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#4C0519] text-white rounded-md font-bold uppercase tracking-widest text-sm shadow-xl shadow-[#4C051922] active:transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all mt-4"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Deploying...</span>
            </>
          ) : (
            <span>Deploy to Database</span>
          )}
        </button>
      </form>
      </div>
    </div>
  );
}
