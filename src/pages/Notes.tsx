import { useState } from "react";

const Notes = () => {
  const [notes, setNotes] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState<string>("");

  const handleAddNote = () => {
    if (noteInput.trim()) {
      setNotes([...notes, noteInput]);
      setNoteInput("");
    }
  };

  const handleEditNote = (index: number, newText: string) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = newText;
    setNotes(updatedNotes);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Notes</h1>
        <div className="mb-4">
          <input
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            className="border px-2 py-1 mr-2"
            placeholder="Write a note..."
          />
          <button
            onClick={handleAddNote}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Add Note
          </button>
        </div>
        <ul>
          {notes.map((note, idx) => (
            <li key={idx} className="mb-2 flex items-center">
              <input
                type="text"
                value={note}
                onChange={(e) => handleEditNote(idx, e.target.value)}
                className="border px-2 py-1 flex-1"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notes;