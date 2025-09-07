import { useState, useEffect } from "react";

const Notes = () => {
  const [notes, setNotes] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState<string>("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    if (noteInput.trim()) {
      setNotes([...notes, noteInput]);
      setNoteInput("");
    }
  };

  const handleDeleteNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const handleEditNote = (index: number) => {
    setEditIndex(index);
    setEditValue(notes[index]);
  };

  const handleSaveEdit = () => {
    if (editIndex !== null && editValue.trim()) {
      const updatedNotes = [...notes];
      updatedNotes[editIndex] = editValue;
      setNotes(updatedNotes);
      setEditIndex(null);
      setEditValue("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Notes</h1>
      <div className="mb-4 flex">
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
      <ul className="w-full max-w-md">
        {notes.map((note, idx) => (
          <li key={idx} className="mb-3 flex items-center">
            {editIndex === idx ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="border px-2 py-1 flex-1 mr-2"
                />
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditIndex(null)}
                  className="bg-gray-400 text-white px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">{note}</span>
                <button
                  onClick={() => handleEditNote(idx)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteNote(idx)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;