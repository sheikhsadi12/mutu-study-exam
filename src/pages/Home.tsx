import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Download, FileText } from 'lucide-react';

interface PdfDocument {
  id: string;
  subject: string;
  chapter: string;
  url: string;
  createdAt: number;
}

export default function Home() {
  const [pdfs, setPdfs] = useState<PdfDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'pdfs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PdfDocument[];
      setPdfs(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'pdfs');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="mb-2">
        <h2 className="text-2xl font-bold italic" style={{fontFamily: 'Georgia, serif'}}>Academic Resources</h2>
        <p className="text-sm opacity-70">Browse the latest course materials and research papers.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#4C0519] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : pdfs.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-[#1a080c] rounded-[8px] border border-dashed border-[#2d161022] dark:border-[#f5ebe622] shadow-sm">
          <p className="opacity-60">No materials available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 overflow-hidden">
          {pdfs.map((pdf) => (
            <div 
              key={pdf.id}
              className="bg-white dark:bg-[#1a080c] rounded-[8px] border-t-[3px] border-[#7C2D12] shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between transition-all hover:shadow-md gap-4"
            >
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#4C0519] dark:text-[#f5ebe6] opacity-70 mb-1">{pdf.subject}</span>
                <span className="text-lg font-semibold">{pdf.chapter}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden xl:block">
                  <div className="text-[10px] uppercase opacity-40">Added</div>
                  <div className="text-xs font-mono">{new Date(pdf.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
                <a 
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-[#4C0519] text-white rounded-full text-xs font-bold uppercase tracking-tighter hover:bg-[#70102a] transition-colors whitespace-nowrap text-center"
                >
                  Download PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
