import { useEffect, useState } from "react";
import type { ModerationLog, Offense } from "../types/moderation";
import { socket } from "../lib/socket";
import "../styles/dashboard.css";

function Dashboard() {
  const [logs, setLogs] = useState<ModerationLog[]>([]);
  const [offenses, setOffenses] = useState<Offense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [logsRes, offensesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/logs`),
          fetch(`${import.meta.env.VITE_API_URL}/api/logs/offenses`),
        ]);
        const logsData = await logsRes.json();
        const offensesData = await offensesRes.json();
        setLogs(logsData);
        setOffenses(offensesData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    function handleNewLog(newLog: ModerationLog) {
      setLogs((prev) => [newLog, ...prev]);
    }

    socket.on("new_log", handleNewLog);

    return () => {
      socket.off("new_log", handleNewLog);
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  const totalFlagged = logs.length;
  const totalDeleted = logs.filter((l) => l.action === "deleted").length;
  const totalOffenders = offenses.length;
  const topCategory =
    logs.length > 0
      ? Object.entries(
          logs.reduce((acc: Record<string, number>, l) => {
            acc[l.category] = (acc[l.category] || 0) + 1;
            return acc;
          }, {}),
        ).sort((a, b) => b[1] - a[1])[0][0]
      : "N/A";

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Flagged</div>
          <div className="value">{totalFlagged}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Deleted</div>
          <div className="value">{totalDeleted}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Offenders</div>
          <div className="value">{totalOffenders}</div>
        </div>
        <div className="stat-card">
          <div className="label">Top Category</div>
          <div
            className="value"
            style={{ fontSize: "1rem", paddingTop: "8px" }}
          >
            {topCategory}
          </div>
        </div>
      </div>

      <h2>Recent Logs</h2>
      <div className="recent-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Message</th>
              <th>Category</th>
              <th>Severity</th>
              <th>Action</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.slice(0, 5).map((log, i) => (
              <tr key={log.id ?? `temp-${i}`}>
                <td>{log.username}</td>
                <td>{log.message}</td>
                <td>{log.category}</td>
                <td>{log.severity}</td>
                <td>{log.action}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Top Offenders</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Offenses</th>
            <th>Last Offense</th>
          </tr>
        </thead>
        <tbody>
          {offenses.slice(0, 5).map((o) => (
            <tr key={o.id}>
              <td>{o.username}</td>
              <td>
                {o.count} {o.count >= 15 ? "🚨" : ""}
              </td>
              <td>{new Date(o.lastOffenseAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
