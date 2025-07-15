interface Props {
  logs: string[];
}

const LogsDisplay = ({ logs }: Props) => {
  const getStyle = (log: string): React.CSSProperties => {
    const role = log.startsWith("user:") ? "user" :
                 log.startsWith("assistant:") ? "assistant" : "system";
    const base: React.CSSProperties = {
      padding: '10px 15px',
      borderRadius: '12px',
      maxWidth: '80%',
      wordWrap: 'break-word',
    };
    if (role === "user") return { ...base, background: '#2CB67D', color: '#fff', alignSelf: "flex-end" };
    if (role === "assistant") return { ...base, background: '#3A3A3A', color: '#E0E0E0', alignSelf: "flex-start" };
    return { ...base, fontStyle: "italic", color: "#888", textAlign: "center" };
  };

  return (
    <div style={{
      width: "50%",
      background: "#252525",
      borderRadius: "16px",
      padding: "25px",
      height: "250px",
      display: "flex",
      flexDirection: "column-reverse",
      overflowY: "auto",
    }}>
      {[...logs].reverse().map((log, i) => (
        <div key={i} style={{ animation: "fadeIn 0.5s ease", marginBottom: "12px" }}>
          <p style={getStyle(log)}>
            {log.includes(":") ? log.split(":").slice(1).join(":").trim() : log}
          </p>
        </div>
      ))}
    </div>
  );
};

export default LogsDisplay;
