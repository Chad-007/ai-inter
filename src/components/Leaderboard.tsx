import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

interface LeaderboardEntry {
  email: string;
  score: number;
  duration: number;
  completed_at: string;
}

interface TopicOverview {
  topic: string;
  total_interviews: number;
  avg_score: number;
  highest_score: number;
}

const Leaderboard = () => {
  const { topic } = useParams<{ topic?: string }>();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [topics, setTopics] = useState<TopicOverview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (topic) {
          const res = await fetch(`http://localhost:3001/leaderboard/${topic}`);
          const data = await res.json();
          setEntries(data);
        } else {
          const res = await fetch("http://localhost:3001/leaderboard");
          const data = await res.json();
          setTopics(data);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [topic]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "Inter, system-ui, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#fff",
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "40px 20px",
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", color: "#00ff88", marginBottom: "10px" }}>
            {topic ? `${topic} Leaderboard` : "Interview Leaderboard"}
          </h1>
          <Link to="/" style={{ color: "#00ff88", textDecoration: "none" }}>
            ← Back to Interview
          </Link>
        </div>

        {topic ? (
          <div style={{
            background: "#1a1a1a",
            borderRadius: "12px",
            padding: "30px",
            border: "1px solid #2a2a2a",
          }}>
            {entries.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666" }}>
                No interviews completed for {topic} yet.
              </p>
            ) : (
              entries.map((entry, index) => (
                <div key={index} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "15px 0",
                  borderBottom: index < entries.length - 1 ? "1px solid #333" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <div style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: index === 0 ? "#ffd700" : index === 1 ? "#c0c0c0" : index === 2 ? "#cd7f32" : "#00ff88",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}>
                      {index + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: "600" }}>{entry.email}</div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {new Date(entry.completed_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: "#00ff88" }}>
                      {entry.score}%
                    </div>
                    {entry.duration && (
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {formatDuration(entry.duration)}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {topics.map((topicData) => (
              <Link
                key={topicData.topic}
                to={`/leaderboard/${topicData.topic}`}
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  background: "#1a1a1a",
                  borderRadius: "12px",
                  padding: "25px",
                  border: "1px solid #2a2a2a",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }} 
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#00ff88")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
                >
                  <h3 style={{ color: "#00ff88", marginBottom: "15px", fontSize: "1.5rem" }}>
                    {topicData.topic}
                  </h3>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ color: "#ccc" }}>Total Interviews:</span>
                    <span style={{ fontWeight: "bold" }}>{topicData.total_interviews}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ color: "#ccc" }}>Average Score:</span>
                    <span style={{ fontWeight: "bold" }}>{Math.round(topicData.avg_score)}%</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#ccc" }}>Highest Score:</span>
                    <span style={{ fontWeight: "bold", color: "#00ff88" }}>{topicData.highest_score}%</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
