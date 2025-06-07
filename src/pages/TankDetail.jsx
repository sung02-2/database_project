import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TankDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tank, setTank] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/tank/${id}`)  // ✅ 改為正確路徑
      .then((res) => res.json())
      .then((data) => setTank(data))
      .catch(() => setTank(null));
  }, [id]);

  if (!tank) {
    return <div className="p-6 text-red-600">❌ Tank not found or loading...</div>;
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        🐠 Tank {tank.TankID} Details
      </h1>

      <ul className="text-gray-800 space-y-3 text-lg">
        <li>📦 Capacity: {tank.Capacity}</li>
        <li>🌍 Habitat: {tank.Habitat}</li>
        <li>🌊 Salinity: {tank.Salinity}</li>
        <li>👥 Crowding Level: {tank.CrowdingLevel}</li>
        <li>🩼 Cleanliness Level: {tank.CleanlinessLevel}</li>
        <li>
          ⏰ Last Feed Time:{" "}
          {tank.LastFeedTime
            ? new Date(tank.LastFeedTime).toLocaleString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
            : "N/A"}
        </li>
        <li>🕒 Feed Interval: {tank.FeedIntervalHours} hours</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">🐟 Fish in This Tank</h2>
      {tank.FishSpecies.length === 0 ? (
        <p className="text-gray-500 italic">No fish in this tank.</p>
      ) : (
        <ul className="list-disc list-inside text-gray-700">
          {tank.FishSpecies.map((fish, index) => (
            <li key={index}>
              {fish.SpeciesName} – {fish.Size} cm2
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TankDetail;
