// src/pages/Dashboard.jsx

function Dashboard() {
  const tankStats = {
    tankCount: 8,
    feedRemaining: 25,
    warningCount: 2,
  };

  const tankList = [
    { id: 1, cleanliness: "GOOD", crowd: "Moderate", temp: 26.5 },
    { id: 2, cleanliness: "GOOD", crowd: "Moderate", temp: 26.5 },
    { id: 3, cleanliness: "GOOD", crowd: "Moderate", temp: 26.5 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-blue-800">🐟 Aquarium Dashboard</h1>

      {/* 上方統計卡片 */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm uppercase tracking-wide font-semibold">Number of Tanks</p>
          <p className="text-4xl font-bold mt-2">{tankStats.tankCount}</p>
        </div>
        <div className="bg-green-100 border-l-4 border-green-500 text-green-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm uppercase tracking-wide font-semibold">Feed Remaining</p>
          <p className="text-4xl font-bold mt-2">{tankStats.feedRemaining} kg</p>
        </div>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm uppercase tracking-wide font-semibold">Warnings</p>
          <p className="text-4xl font-bold mt-2">{tankStats.warningCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 左側：魚缸卡片列表 */}
        <div className="col-span-2 space-y-4">
          {tankList.map((tank) => (
            <div key={tank.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Tank {tank.id}</h3>
              <p className="text-gray-600">🧼 Cleanliness: <span className="font-medium text-green-600">{tank.cleanliness}</span></p>
              <p className="text-gray-600">👥 Crowded Level: <span className="font-medium">{tank.crowd}</span></p>
              <p className="text-gray-600">🌡️ Current Temp: <span className="font-medium">{tank.temp}°C</span></p>
              <button className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">View Detail</button>
            </div>
          ))}
        </div>

        {/* 右側：異常列表 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-red-700 mb-4">🚨 Abnormal Tank List</h3>
          <p className="text-gray-500 italic">No alerts at the moment.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;