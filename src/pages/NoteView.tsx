import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { ChevronLeft, MessageSquare, Send, User } from 'lucide-react';

export default function NoteView() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchNote = async () => {
      try {
        const docRef = doc(db, 'html_notes', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNote({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.READ, 'html_notes');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();

    const q = query(
      collection(db, 'comments'),
      where('noteId', '==', id),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(docs);
    });

    return () => unsubscribe();
  }, [id]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;
    
    setCommenting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        noteId: id,
        text: newComment,
        author: 'Anonymous Student',
        createdAt: Date.now()
      });
      setNewComment('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'comments');
    } finally {
      setCommenting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-4 border-[#4C0519] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center p-12 bg-white dark:bg-[#1a080c] rounded-[8px] border border-dashed border-[#2d161022] dark:border-[#f5ebe622]">
        <p className="opacity-60">Note not found.</p>
        <Link to="/" className="text-[#4C0519] font-bold mt-4 inline-block hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div>
        <Link to="/" className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#4C0519] dark:text-[#f5ebe6] opacity-70 hover:opacity-100 transition-opacity mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Resources
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{note.topic}</h1>
        <div className="flex items-center gap-4 text-xs font-mono opacity-60">
          <span className="bg-[#2d161010] dark:bg-[#f5ebe610] px-2 py-1 rounded">{note.subject}</span>
          <span>{new Date(note.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a080c] rounded-[8px] border-t-[3px] border-[#7C2D12] shadow-sm p-6 sm:p-10 prose prose-stone dark:prose-invert max-w-none prose-headings:font-sans prose-headings:tracking-tight prose-a:text-[#4C0519] dark:prose-a:text-[#f5ebe6]">
        <div dangerouslySetInnerHTML={{ __html: note.htmlContent }} />
      </div>

      <div className="border-t border-[#2d16101a] dark:border-[#f5ebe61a] pt-8">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
          <MessageSquare className="w-5 h-5 text-[#4C0519] dark:text-[#f5ebe6]" />
          Community Discussion
        </h3>

        <div className="bg-white dark:bg-[#1a080c] rounded-[8px] border border-[#2d161022] dark:border-[#f5ebe622] shadow-sm p-4 sm:p-6 mb-8 flex flex-col gap-6">
          {comments.length === 0 ? (
            <p className="text-sm opacity-60 text-center py-4">No comments yet. Start the discussion!</p>
          ) : (
            <div className="flex flex-col gap-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#4C0519]/10 dark:bg-[#f5ebe6]/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-[#4C0519] dark:text-[#f5ebe6]" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-bold">{comment.author}</span>
                      <span className="text-[10px] opacity-50 font-mono tracking-tighter">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm opacity-90 leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleComment} className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-[#4C0519] flex items-center justify-center shrink-0 mt-1">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-grow relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add to the discussion..."
              className="w-full px-4 py-3 pb-12 bg-white dark:bg-[#1a080c] border border-[#2d161022] dark:border-[#f5ebe622] rounded-md focus:outline-none focus:border-[#4C0519] text-sm transition-all resize-none min-h-[100px]"
            />
            <div className="absolute bottom-3 right-3">
              <button
                type="submit"
                disabled={commenting || !newComment.trim()}
                className="w-8 h-8 bg-[#4C0519] text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-opacity hover:opacity-90 active:scale-95"
              >
                {commenting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send className="w-4 h-4 -ml-0.5" />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
