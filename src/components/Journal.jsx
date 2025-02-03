import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';

const Journal = () => {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);

  // Fetch entries from Firestore
  useEffect(() => {
    const q = query(collection(db, 'entries'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Add a new entry to Firestore
  const addEntry = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'entries'), {
        text: entry,
        timestamp: new Date()
      });
      setEntry('');
    } catch (error) {
      console.error('Error adding entry:', error.message);
    }
  };

  return (
    <div>
      <h2>Journal Entries</h2>
      <form onSubmit={addEntry}>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write your journal entry..."
        />
        <button type="submit">Add Entry</button>
      </form>
      <ul>
        {entries.map(entry => (
          <li key={entry.id}>{entry.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default Journal;