// src/pages/FishManagement.jsx

import { useState, useEffect } from "react";

function FishManagement() {
  const [mode, setMode] = useState("add"); // 'add' or 'remove'
  const [speciesList, setSpeciesList] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [availableTanks, setAvailableTanks] = useState([]);

  useEffect(() => {
    if (mode === "add") {
      fetch("http://localhost:5000/api/fish/species")
        .then(res => res.json())
        .then(data => setSpeciesList(data));
    }
  }, [mode]);

  const handleCheck = () => {
    if (!selectedSpecies || !groupSize || isNaN(groupSize)) return;
    fetch("http://localhost:5000/api/fish/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ species: selectedSpecies, size: parseInt(groupSize) })
    })
      .then(res => res.json())
      .then(data => setAvailableTanks(data));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-800">🐠 Fish Management</h1>

      <div className="space-y-4 max-w-xl">
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              value="add"
              checked={mode === "add"}
              onChange={() => setMode("add")}
              className="mr-2"
            />
            Add Fish Group
          </label>
          <label>
            <input
              type="radio"
              value="remove"
              checked={mode === "remove"}
              onChange={() => setMode("remove")}
              className="mr-2"
            />
            Remove Fish Group
          </label>
        </div>

        {mode === "add" && (
          <>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Select fish species</label>
              <select
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">-- Select species --</option>
                {speciesList.map((sp, idx) => (
                  <option key={idx} value={sp}>{sp}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Group size</label>
              <input
                type="number"
                value={groupSize}
                onChange={(e) => setGroupSize(e.target.value)}
                className="w-40 border rounded p-2"
              />
            </div>

            <button
              onClick={handleCheck}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              🔍 Find Available Tanks
            </button>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Suggested Tanks</h2>
              {availableTanks.length > 0 ? (
                <ul className="list-disc ml-6 text-gray-800">
                  {availableTanks.map((tank, idx) => (
                    <li key={idx}>Tank {tank.TankID} - Remaining capacity: {tank.RemainingCapacity}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No suitable tank found or input missing.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FishManagement;
