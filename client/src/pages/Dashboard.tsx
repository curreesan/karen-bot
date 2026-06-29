import { useEffect, useState } from "react";
import type { ModerationLog, Offense } from "../types/moderation";

function Dashboard() {
  const [logs, setLogs] = useState<ModerationLog[]>([]);
  const [offenses, setOffenses] = useState<Offense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [logsRes, offensesRes] = await Promise.all([
          fetch("http://localhost:3001/api/logs"),
          fetch("http://localhost:3001/api/logs/offenses"),
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
    <div>
      <h1>Dashboard</h1>

      <div>
        <div>Total Flagged: {totalFlagged}</div>
        <div>Total Deleted: {totalDeleted}</div>
        <div>Total Offenders: {totalOffenders}</div>
        <div>Top Category: {topCategory}</div>
      </div>

      <h2>Recent Logs</h2>
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
          {logs.slice(0, 5).map((log) => (
            <tr key={log.id}>
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
              <td>{o.count}</td>
              <td>{new Date(o.lastOffenseAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
