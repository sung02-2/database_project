// src/pages/FeedInventory.jsx
function FeedInventory() {
  const feeds = [
    { name: "Tropical Feed", type: "Granular", quantity: 12.5 },
    { name: "Goldfish Feed", type: "Flake", quantity: 3.1 },
    { name: "Marine Feed", type: "Pellet", quantity: 8.0 },
  ];

  const getStatus = (qty) => {
    if (qty < 5) return { text: "Low", color: "text-red-600" };
    if (qty < 10) return { text: "Medium", color: "text-yellow-600" };
    return { text: "Sufficient", color: "text-green-600" };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">🛒 Feed Inventory</h1>

      <table className="min-w-full bg-white rounded shadow-md overflow-hidden">
        <thead className="bg-blue-100 text-left">
          <tr>
            <th className="px-6 py-3">Feed Name</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Quantity (kg)</th>
            <th className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {feeds.map((feed, idx) => {
            const status = getStatus(feed.quantity);
            return (
              <tr key={idx} className="border-t">
                <td className="px-6 py-4">{feed.name}</td>
                <td className="px-6 py-4">{feed.type}</td>
                <td className="px-6 py-4">{feed.quantity}</td>
                <td className={`px-6 py-4 font-semibold ${status.color}`}>
                  {status.text}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default FeedInventory;
