import { useEffect, useState } from "react";
import type { Offense } from "../types/moderation";
import "../styles/offenders.css";

function Offenders() {
  const [offenses, setOffenses] = useState<Offense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchOffenses() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/logs/offenses`,
        );
        const data = await res.json();
        setOffenses(data);
      } catch (err) {
        console.error("Failed to fetch offenses:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffenses();
  }, []);

  const filtered = offenses.filter((o) =>
    o.username.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="offenders-page">
      <h1>Offenders</h1>

      <div className="offenders-search">
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <p className="offenders-count">
        Showing {filtered.length} of {offenses.length} offenders
      </p>

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Offense Count</th>
            <th>Last Offense</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((o) => (
            <tr key={o.id}>
              <td>{o.username}</td>
              <td>
                <span className="offense-count">{o.count}</span>
                {o.count >= 15 && (
                  <span className="ban-warning">🚨 Ban threshold reached</span>
                )}
              </td>
              <td>{new Date(o.lastOffenseAt).toLocaleString()}</td>
              <td>
                {o.isBanned ? (
                  <span className="status-banned">🔴 Banned</span>
                ) : (
                  <span className="status-active">🟢 Active</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Offenders;
