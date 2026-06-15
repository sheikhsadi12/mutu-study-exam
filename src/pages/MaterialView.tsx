import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { ChevronLeft } from 'lucide-react';
import PDFReader from '../components/PDFReader';

export default function MaterialView() {
  const { id } = useParams<{ id: string }>();
  const [material, setMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchMaterial = async () => {
      try {
        const docRef = doc(db, 'materials', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMaterial({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'materials');
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-4 border-[#4C0519] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="text-center p-12 bg-white dark:bg-[#1a080c] rounded-[8px] border border-dashed border-[#2d161022] dark:border-[#f5ebe622]">
        <p className="opacity-60">Material not found.</p>
        <Link to="/" className="text-[#4C0519] font-bold mt-4 inline-block hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div>
        <Link to="/" className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#4C0519] dark:text-[#f5ebe6] opacity-70 hover:opacity-100 transition-opacity mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Resources
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{material.chapter}</h1>
        <div className="flex items-center gap-4 text-xs font-mono opacity-60">
          <span className="bg-[#2d161010] dark:bg-[#f5ebe610] px-2 py-1 rounded">{material.subject}</span>
          <span>{new Date(material.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="border-t-[4px] border-[#7C2D12] rounded-[2px] shadow-2xl relative w-full group">
        <PDFReader url={material.url} title={material.chapter} />
      </div>
    </div>
  );
}
