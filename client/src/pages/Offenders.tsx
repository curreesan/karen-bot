import { useEffect, useState } from "react";
import type { Offense } from "../types/moderation";
import { socket } from "../lib/socket";
import { useAuth } from "../hooks/useAuth";
import "../styles/offenders.css";

function Offenders() {
  const { token } = useAuth();
  const [offenses, setOffenses] = useState<Offense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchOffenses() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/logs/offenses`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        setOffenses(data);
      } catch (err) {
        console.error("Failed to fetch offenses:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOffenses();

    socket.on("new_log", fetchOffenses);

    return () => {
      socket.off("new_log", fetchOffenses);
    };
  }, [token]);

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
                {o.shouldBeBanned ? (
                  <span className="status-banned">🔴 Should Be Banned</span>
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
