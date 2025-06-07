// src/pages/FeedInventory.jsx

import { useEffect, useState } from "react";

function FeedInventory() {
  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/feeds/inventory")
      .then(res => res.json())
      .then(data => setFeeds(data));
  }, []);

  const getStatus = (qty, threshold) => {
    return qty < threshold
      ? { text: "Need Restock", color: "text-red-600" }
      : { text: "Sufficient", color: "text-green-600" };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">🛒 Feed Inventory</h1>

      <table className="min-w-full bg-white rounded shadow-md overflow-hidden">
        <thead className="bg-blue-100 text-left">
          <tr>
            <th className="px-6 py-3">Feed Name</th>
            <th className="px-6 py-3">Quantity (kg)</th>
            <th className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {feeds.map((feed, idx) => {
            const quantityKg = feed.RemainingQuantity.toFixed(1);
            const status = getStatus(feed.RemainingQuantity, feed.RestockThreshold);
            return (
              <tr key={idx} className="border-t">
                <td className="px-6 py-4">{feed.FeedName}</td>
                <td className="px-6 py-4">{quantityKg}</td>
                <td className={`px-6 py-4 font-semibold ${status.color}`}>{status.text}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default FeedInventory;
