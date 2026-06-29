import { useEffect, useState } from "react";
import type { Offense } from "../types/moderation";

function Offenders() {
  const [offenses, setOffenses] = useState<Offense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchOffenses() {
      try {
        const res = await fetch("http://localhost:3001/api/logs/offenses");
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
    <div>
      <h1>Offenders</h1>

      <input
        type="text"
        placeholder="Search by username..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <p>
        Showing {filtered.length} of {offenses.length} offenders
      </p>

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Offense Count</th>
            <th>Last Offense</th>
            <th>Ban Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((o) => (
            <tr key={o.id}>
              <td>{o.username}</td>
              <td>
                {o.count} {o.count >= 15 ? "🚨 Ban threshold reached" : ""}
              </td>
              <td>{new Date(o.lastOffenseAt).toLocaleString()}</td>
              <td>{o.isBanned ? "🔴 Banned" : "🟢 Active"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Offenders;
