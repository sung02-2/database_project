import { useState, useEffect } from "react";

function FishManagement() {
  const [mode, setMode] = useState("add");
  const [groupName, setGroupName] = useState("");
  const [habitat, setHabitat] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [availableTanks, setAvailableTanks] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [tankList, setTankList] = useState([]);
  const [selectedTank, setSelectedTank] = useState("");
  const [tankFish, setTankFish] = useState([]);

  useEffect(() => {
    if (mode === "remove") {
      fetch("http://localhost:5000/api/fish/tanks")
        .then(res => res.json())
        .then(data => setTankList(data));
    }
  }, [mode]);

  const handleCheck = () => {
    if (!groupName || !habitat || !groupSize || isNaN(groupSize)) return;

    fetch("http://localhost:5000/api/fish/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: groupName,
        size: parseInt(groupSize),
        habitat: habitat
      })
    })
      .then(res => res.json())
      .then(data => setAvailableTanks(data));
  };

  const handleAddFishGroup = (tankId) => {
    fetch("http://localhost:5000/api/fish/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: groupName,
        size: parseInt(groupSize),
        habitat: habitat,
        tank_id: tankId
      })
    })
      .then(res => res.json())
      .then(data => {
        setSuccessMessage(data.message || "Fish group added successfully!");
        setAvailableTanks([]);
        setGroupName("");
        setGroupSize("");
        setHabitat("");
      });
  };

  const handleViewTankFish = () => {
    if (!selectedTank) return;
    fetch(`http://localhost:5000/api/fish/tank-fish/${selectedTank}`)
      .then(res => res.json())
      .then(data => setTankFish(data));
  };

  const handleRemoveFish = (fishId) => {
    fetch(`http://localhost:5000/api/fish/remove/${fishId}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => setTankFish(prev => prev.filter(f => f.FishID !== fishId)));
  };

  const getColor = (before, after) => {
    if (before === after) return "text-gray-700";
    if (after === "high") return "text-red-600 font-bold";
    if (after === "medium") return "text-yellow-600 font-semibold";
    return "text-green-700 font-semibold";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-800">🐠 Fish Management</h1>

      <div className="space-y-4 max-w-xl">
        <div className="flex gap-4">
          <label>
            <input type="radio" value="add" checked={mode === "add"} onChange={() => setMode("add")} className="mr-2" />
            Add Fish Group
          </label>
          <label>
            <input type="radio" value="remove" checked={mode === "remove"} onChange={() => setMode("remove")} className="mr-2" />
            Remove Fish Group
          </label>
        </div>

        {mode === "add" && (
          <>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Fish Group Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="e.g., Yellow Group A"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Habitat</label>
              <select
                value={habitat}
                onChange={(e) => setHabitat(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">-- Select habitat --</option>
                <option value="freshwater">Freshwater</option>
                <option value="brackish">Brackish</option>
                <option value="marine">Marine</option>
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

            {successMessage && (
              <p className="mt-4 text-green-700 font-medium">✅ {successMessage}</p>
            )}

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Suggested Tanks</h2>
              {availableTanks.length > 0 ? (
                <table className="min-w-full bg-white border rounded shadow">
                  <thead>
                    <tr className="bg-green-100 text-left">
                      <th className="px-4 py-2">Tank ID</th>
                      <th className="px-4 py-2">Before</th>
                      <th className="px-4 py-2">After</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableTanks.map((tank, idx) => (
                      <tr key={idx} className="hover:bg-green-50">
                        <td className="px-4 py-2">Tank {tank.TankID}</td>
                        <td className="px-4 py-2 capitalize">{tank.CrowdingBefore}</td>
                        <td className={`px-4 py-2 capitalize ${getColor(tank.CrowdingBefore, tank.CrowdingAfter)}`}>
                          {tank.CrowdingAfter}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleAddFishGroup(tank.TankID)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            📥 Add
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 italic">No suitable tank found or input missing.</p>
              )}
            </div>
          </>
        )}

        {mode === "remove" && (
          <div className="mt-6">
            <label className="block text-lg font-medium text-gray-700 mb-1">Select Tank</label>
            <select
              value={selectedTank}
              onChange={(e) => setSelectedTank(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">-- Choose a tank --</option>
              {tankList.map(t => (
                <option key={t.TankID} value={t.TankID}>Tank {t.TankID}</option>
              ))}
            </select>
            <button
              onClick={handleViewTankFish}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              🐟 View Fish Groups
            </button>

            {tankFish.length > 0 && (
              <table className="mt-4 min-w-full bg-white border rounded shadow">
                <thead>
                  <tr className="bg-red-100 text-left">
                    <th className="px-4 py-2">Fish Group</th>
                    <th className="px-4 py-2">Size</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tankFish.map((fish, idx) => (
                    <tr key={idx} className="hover:bg-red-50">
                      <td className="px-4 py-2">{fish.Name}</td>
                      <td className="px-4 py-2">{fish.Size}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleRemoveFish(fish.FishID)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          ❌ Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FishManagement;