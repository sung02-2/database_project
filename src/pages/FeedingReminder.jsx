// src/pages/FeedReminder.jsx

import { useEffect, useState } from "react";

function FeedReminder() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/feeding/reminder")
      .then(res => res.json())
      .then(data => setReminders(data));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-orange-700">🕒 Feeding Reminder</h1>

      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-orange-100 text-left">
            <th className="px-6 py-3">Tank ID</th>
            <th className="px-6 py-3">Last Fed Time</th>
            <th className="px-6 py-3">Feed Interval (hrs)</th>
            <th className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {reminders.map((r) => (
            <tr key={r.TankID} className="hover:bg-orange-50">
              <td className="px-6 py-4 font-semibold">Tank {r.TankID}</td>
              <td className="px-6 py-4">
                {new Date(r.LastFeedTime).toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </td>
              <td className="px-6 py-4">{r.FeedIntervalHours}</td>
              <td className="px-6 py-4 text-red-600 font-semibold">{r.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FeedReminder;
