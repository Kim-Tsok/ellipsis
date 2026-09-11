'use client';

import { useState } from 'react';
import { createNote, expandNoteWithContext, organizeUserNotes } from '@/app/actions/notes';
import ButtonPrimary from '@/components/ButtonPrimary';
import { Button } from '@/components/ui/button';

export default function NotesPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteIdToExpand, setNoteIdToExpand] = useState('');
  const [expandedContent, setExpandedContent] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await createNote(title, content);
    setTitle('');
    setContent('');
    setLoading(false);
    alert('Note uploaded with vector embedding!');
  }

  async function handleExpand() {
    setLoading(true);
    const result = await expandNoteWithContext(noteIdToExpand);
    setExpandedContent(result || '');
    setLoading(false);
  }

  async function handleOrganize() {
    setLoading(true);
    await organizeUserNotes();
    setLoading(false);
    alert('Notes categorized successfully!');
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Upload Note</h2>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <textarea
          placeholder="Content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <ButtonPrimary type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Upload'}
        </ButtonPrimary>
      </form>

      <hr style={{ margin: '30px 0' }} />

      <h2 className="font-serif text-2xl mb-6">AI Actions</h2>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <ButtonPrimary onClick={handleOrganize} disabled={loading}>
          Organize
        </ButtonPrimary>
      </div>

      <div>
        <input
          type="text"
          placeholder="Paste Note ID"
          value={noteIdToExpand}
          onChange={(e) => setNoteIdToExpand(e.target.value)}
          style={{ padding: 8, marginRight: 8 }}
        />
        <ButtonPrimary onClick={handleExpand} disabled={loading}>
          Expand Note with Context
        </ButtonPrimary>
      </div>

      {expandedContent && (
        <div style={{ marginTop: 20, padding: 16, background: '#f5f5f5' }}>
          <h3>AI Expanded Version:</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{expandedContent}</p>
        </div>
      )}
    </div>
  );
}