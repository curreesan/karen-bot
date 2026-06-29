import { useEffect, useState } from "react";
import type { ModerationLog } from "../types/moderation";

function Logs() {
  const [logs, setLogs] = useState<ModerationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("http://localhost:3001/api/logs");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.username.toLowerCase().includes(search.toLowerCase()) ||
      log.message.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || log.category === categoryFilter;
    const matchesSeverity =
      severityFilter === "all" || log.severity === severityFilter;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Moderation Logs</h1>

      <div>
        <input
          type="text"
          placeholder="Search by username or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="hate_speech">Hate Speech</option>
          <option value="harassment">Harassment</option>
          <option value="spam">Spam</option>
          <option value="nsfw">NSFW</option>
        </select>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
        >
          <option value="all">All Severities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <p>
        Showing {filtered.length} of {logs.length} logs
      </p>

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Message</th>
            <th>Category</th>
            <th>Severity</th>
            <th>Reason</th>
            <th>Action</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((log) => (
            <tr key={log.id}>
              <td>{log.username}</td>
              <td>{log.message}</td>
              <td>{log.category}</td>
              <td>{log.severity}</td>
              <td>{log.reason}</td>
              <td>{log.action}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Logs;
