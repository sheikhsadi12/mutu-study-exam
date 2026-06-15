import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Link } from 'react-router-dom';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let allItems: any[] = [];
    let materialsLoaded = false;
    let htmlNotesLoaded = false;

    const maybeUpdateState = () => {
      if (materialsLoaded && htmlNotesLoaded) {
        allItems.sort((a, b) => b.createdAt - a.createdAt);
        setItems([...allItems]);
        setLoading(false);
      }
    };

    const qMaterials = query(collection(db, 'materials'), orderBy('createdAt', 'desc'));
    const unsubMaterials = onSnapshot(qMaterials, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, type: 'material', ...doc.data() }));
      allItems = allItems.filter(item => item.type !== 'material').concat(docs);
      materialsLoaded = true;
      maybeUpdateState();
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'materials');
      materialsLoaded = true;
      maybeUpdateState();
    });

    const qHtml = query(collection(db, 'html_notes'), orderBy('createdAt', 'desc'));
    const unsubHtml = onSnapshot(qHtml, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, type: 'html', ...doc.data() }));
      allItems = allItems.filter(item => item.type !== 'html').concat(docs);
      htmlNotesLoaded = true;
      maybeUpdateState();
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'html_notes');
      htmlNotesLoaded = true;
      maybeUpdateState();
    });

    return () => { unsubMaterials(); unsubHtml(); };
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
      ) : items.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-[#1a080c] rounded-[8px] border border-dashed border-[#2d161022] dark:border-[#f5ebe622] shadow-sm">
          <p className="opacity-60">No materials or notes available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 overflow-hidden">
          {items.map((item) => (
            <div 
              key={item.id}
              className="bg-white dark:bg-[#1a080c] rounded-[8px] border-t-[3px] border-[#7C2D12] shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between transition-all hover:shadow-md gap-4"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#4C0519] dark:text-[#f5ebe6] opacity-70">{subjectDisplay(item)}</span>
                  <span className="text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded-sm bg-[#2d161010] dark:bg-[#f5ebe610] opacity-80">
                    {item.type === 'material' ? 'Link' : 'HTML Note'}
                  </span>
                </div>
                <span className="text-lg font-semibold">{item.type === 'material' ? item.chapter : item.topic}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="text-left sm:text-right">
                  <div className="text-[10px] uppercase opacity-40">Added</div>
                  <div className="text-xs font-mono">{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
                {item.type === 'material' ? (
                  <a 
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 bg-[#4C0519] text-white rounded-full text-xs font-bold uppercase tracking-tighter hover:bg-[#70102a] transition-colors whitespace-nowrap text-center outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4C0519]"
                  >
                    Download Material
                  </a>
                ) : (
                  <Link 
                    to={`/note/${item.id}`}
                    className="px-5 py-2 bg-transparent text-[#4C0519] dark:text-[#f5ebe6] border border-[#4C0519] dark:border-[#f5ebe6] rounded-full text-xs font-bold uppercase tracking-tighter hover:bg-[#4C0519]/5 dark:hover:bg-[#f5ebe6]/10 transition-colors whitespace-nowrap text-center outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4C0519]"
                  >
                    Read Full Note
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function subjectDisplay(item: any) {
  return item.subject || 'Unknown Subject';
}

