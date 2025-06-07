import { useEffect, useState } from "react";

function FeedReminder() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/feeding/reminder")
      .then(res => res.json())
      .then(data => setReminders(data));
  }, []);

  return (
    <div className="p-6 bg-gradient-to-b from-orange-50 to-white min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-orange-800">🕒 Feeding Reminder</h1>

      {reminders.length === 0 ? (
        <p className="text-gray-500 italic">All tanks are well-fed at the moment.</p>
      ) : (
        reminders.map((r) => (
          <div key={r.TankID} className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-orange-400">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-orange-700">Tank {r.TankID}</h2>
              <span className="text-sm text-red-600 font-semibold">{r.Status}</span>
            </div>

            <div className="text-gray-700 space-y-1">
              <p>
                <span className="font-semibold">Last Feed Time:</span>{" "}
                {new Date(r.LastFeedTime).toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <p>
                <span className="font-semibold">Feed Interval:</span> {r.FeedIntervalHours} hours
              </p>
            </div>

            {/* Feeds */}
            <div className="mt-5">
              <h3 className="text-lg font-semibold mb-2 text-orange-600">Required Feeds:</h3>
              {r.Feeds.length === 0 ? (
                <p className="text-gray-500 italic">No feed preferences found.</p>
              ) : (
                <table className="min-w-full border text-sm rounded overflow-hidden">
                  <thead>
                    <tr className="bg-orange-100 text-orange-900">
                      <th className="px-4 py-2 text-left">Feed Name</th>
                      <th className="px-4 py-2 text-left">Remaining</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.Feeds.map((feed) => (
                      <tr key={feed.FeedID} className="border-t hover:bg-orange-50">
                        <td className="px-4 py-2">{feed.FeedName}</td>
                        <td className="px-4 py-2">{feed.RemainingQuantity}</td>
                        <td className="px-4 py-2">
                          {feed.RemainingQuantity < feed.RestockThreshold ? (
                            <span className="text-red-600 font-semibold">⚠ Low Stock</span>
                          ) : (
                            <span className="text-green-600">OK</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default FeedReminder;
