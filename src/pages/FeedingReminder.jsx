// src/pages/FeedReminder.jsx

function FeedReminder() {
  const reminders = [
    { tankId: 1, lastFeed: "2024-05-30 09:00", intervalHrs: 12 },
    { tankId: 2, lastFeed: "2024-05-30 15:30", intervalHrs: 24 },
    { tankId: 3, lastFeed: "2024-05-31 08:00", intervalHrs: 6 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-orange-700">🕒 Feeding Reminder</h1>

      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-orange-100 text-left">
            <th className="px-6 py-3">Tank ID</th>
            <th className="px-6 py-3">Last Fed Time</th>
            <th className="px-6 py-3">Feed Interval (hrs)</th>
            <th className="px-6 py-3">Next Feed Due</th>
          </tr>
        </thead>
        <tbody>
          {reminders.map((r) => {
            const nextFeed = new Date(new Date(r.lastFeed).getTime() + r.intervalHrs * 3600000);
            return (
              <tr key={r.tankId} className="hover:bg-orange-50">
                <td className="px-6 py-4 font-semibold">Tank {r.tankId}</td>
                <td className="px-6 py-4">{r.lastFeed}</td>
                <td className="px-6 py-4">{r.intervalHrs} hrs</td>
                <td className="px-6 py-4 text-red-600">{nextFeed.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default FeedReminder;
