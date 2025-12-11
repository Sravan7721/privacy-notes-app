import React, { useState, useEffect } from "react";
import { encrypt, decrypt } from "./utils/crypto";
import * as db from "./utils/db";
import { v4 as uuid } from "uuid";
import NoteEditor from "./components/NoteEditor";
import NoteList from "./components/NoteList";

export default function App() {
  const [locked, setLocked] = useState(true);
  const [pass, setPass] = useState("");
  const [notes, setNotes] = useState([]);
  const [editing, setEditing] = useState(null);

  async function load() {
    const all = await db.getAll();

    const decrypted = all.map((n) => {
      const plain = decrypt(n.encryptedContent, pass) || "";
      return {
        ...n,
        content: plain,
        preview: plain.substring(0, 120),
      };
    });

    setNotes(decrypted);
  }

  async function saveNote(title, content) {
    const encryptedContent = encrypt(content, pass);

    const note = {
      id: editing?.id || uuid(),
      title,
      encryptedContent,
      createdAt: editing?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    await db.save(note);
    setEditing(null);
    load();
  }

  async function deleteNote(id) {
    await db.remove(id);
    load();
  }

  function handleUnlock() {
    if (pass.trim() === "") return;
    setLocked(false);
    load();
  }

  return (
    <div className="app">
      <h1>Privacy Notes</h1>

      {locked ? (
        <div className="card">
          <p>Enter passphrase to unlock notes:</p>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <button onClick={handleUnlock}>Unlock</button>
        </div>
      ) : (
        <>
          <button onClick={() => setLocked(true)}>Lock</button>

          <NoteEditor onSave={saveNote} editing={editing} />

          <NoteList
            notes={notes}
            onDelete={deleteNote}
            onEdit={(n) => setEditing(n)}
          />
        </>
      )}
    </div>
  );
}
