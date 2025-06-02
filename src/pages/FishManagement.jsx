// src/pages/FishManagement.jsx

import { useState } from "react";

function FishManagement() {
  const [species, setSpecies] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [availableTanks, setAvailableTanks] = useState([]);

  const tanks = [
    { id: 1, name: "Tank 1", capacity: 20, currentFish: 12 },
    { id: 2, name: "Tank 2", capacity: 10, currentFish: 9 },
    { id: 3, name: "Tank 3", capacity: 15, currentFish: 4 },
  ];

  const handleCheck = () => {
    if (!groupSize || isNaN(groupSize)) return;
    const size = parseInt(groupSize);
    const result = tanks.filter(t => t.capacity - t.currentFish >= size);
    setAvailableTanks(result);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-800">🐠 Fish Management</h1>

      <div className="space-y-4 max-w-xl">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-1">
            Enter the species of new fish group
          </label>
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="e.g. Goldfish"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-1">
            Group size
          </label>
          <input
            type="number"
            value={groupSize}
            onChange={(e) => setGroupSize(e.target.value)}
            className="w-40 border rounded p-2"
            placeholder="e.g. 5"
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
              {availableTanks.map(tank => (
                <li key={tank.id}>
                  {tank.name} - Remaining capacity: {tank.capacity - tank.currentFish}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No suitable tank found or input missing.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FishManagement;
