import React, { useState, useEffect } from 'react';
import { StickyNote, Plus, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import db, { type Note } from '../db';

export function NotesTab() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const allNotes = await db.notes.orderBy('timestamp').reverse().toArray();
    setNotes(allNotes);
  };

  const handleAddNote = async () => {
    if (!newNoteText.trim()) return;

    await db.notes.add({
      content: newNoteText,
      timestamp: new Date()
    });

    setNewNoteText('');
    setIsAdding(false);
    loadNotes();
  };

  const handleDeleteNote = async (id: number) => {
    await db.notes.delete(id);
    loadNotes();
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Important Notes</h1>
          <p className="text-gray-500">Keep track of product requirements and stock</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-coffee-dark text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-coffee-dark/20 hover:bg-[#6b7280] transition-colors"
        >
          <Plus size={20} />
          Add Note
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-[32px] shadow-sm mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <StickyNote size={24} className="text-coffee-dark" />
            New Note
          </h2>
          <textarea
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="E.g., We are out of whip cream, milk is running low..."
            className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-coffee-dark resize-none text-gray-900 mb-4"
            autoFocus
          />
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setIsAdding(false)}
              className="px-6 py-3 rounded-2xl font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNote}
              disabled={!newNoteText.trim()}
              className="flex items-center gap-2 bg-coffee-dark text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-coffee-dark/20 hover:bg-[#6b7280] transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              Save Note
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-yellow-50 p-6 rounded-[32px] shadow-sm border border-yellow-200/50 relative group"
            >
              <button
                onClick={() => handleDeleteNote(note.id!)}
                className="absolute top-4 right-4 p-2 bg-white/50 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <Trash2 size={16} />
              </button>
              <div className="flex items-start gap-3 mb-4">
                <StickyNote size={20} className="text-yellow-600 shrink-0 mt-1" />
                <p className="text-gray-800 font-medium whitespace-pre-wrap">{note.content}</p>
              </div>
              <p className="text-xs text-yellow-600/70 font-medium text-right mt-4">
                {new Date(note.timestamp).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {notes.length === 0 && !isAdding && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
            <StickyNote size={48} className="mb-4 text-gray-300" />
            <p className="font-medium text-lg">No notes yet</p>
            <p className="text-sm">Click "Add Note" to create one</p>
          </div>
        )}
      </div>
    </div>
  );
}
