// src/App.jsx
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FishManagement from "./pages/FishManagement";
import FeedInventory from "./pages/FeedInventory";
import FeedingReminder from "./pages/FeedingReminder";
import TankDetail from "./pages/TankDetail"; // ⭐ 新增匯入 TankDetail

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-blue-900 text-white p-6">
          <h1 className="text-3xl font-bold mb-8">🐟 Aquarium</h1>
          <nav className="flex flex-col gap-4 text-lg">
            <NavLink to="/" end className={({ isActive }) => isActive ? "text-blue-300 font-bold" : "hover:text-blue-200"}>
              🏠 Dashboard
            </NavLink>
            <NavLink to="/tanks" className={({ isActive }) => isActive ? "text-blue-300 font-bold" : "hover:text-blue-200"}>
              🐠 Fish Management
            </NavLink>
            <NavLink to="/feeds" className={({ isActive }) => isActive ? "text-blue-300 font-bold" : "hover:text-blue-200"}>
              🛒 Feed Inventory
            </NavLink>
            <NavLink to="/reminder" className={({ isActive }) => isActive ? "text-blue-300 font-bold" : "hover:text-blue-200"}>
              ⏰ Feeding Reminder
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tanks" element={<FishManagement />} />
            <Route path="/feeds" element={<FeedInventory />} />
            <Route path="/reminder" element={<FeedingReminder />} />
            <Route path="/tank/:id" element={<TankDetail />} /> {/* ⭐ 新增這條路由 */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
