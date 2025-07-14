import React, { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";

const fontUrl = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
if (!document.querySelector(`link[href="${fontUrl}"]`)) {
  const link = document.createElement("link");
  link.href = fontUrl;
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

const VAPI_PUBLIC_KEY = "0359a1c9-615f-4fa1-8b7f-8fa3d1a32973"; // too lazy

const animations = `
  @keyframes pulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(44, 182, 125, 0.7); }
    70% { transform: scale(1.03); box-shadow: 0 0 10px 15px rgba(44, 182, 125, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(44, 182, 125, 0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = animations;
document.head.appendChild(styleSheet);

function App() {
  const [vapi] = useState(() => new Vapi(VAPI_PUBLIC_KEY));
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isStopHovered, setIsStopHovered] = useState(false);

  useEffect(() => {
    vapi.on("call-start", () => {
      setConnected(true);
      log("Call started");
    });

    vapi.on("call-end", () => {
      setConnected(false);
      log("Call ended");
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "final" && message.transcript) {
        log(`${message.role}: ${message.transcript}`);
      }
      else{
        log("message:"+JSON.stringify(message));
      }
    });

    vapi.on('error', (err) => {
  console.error("Vapi Error:", err);
  log("Error: " + JSON.stringify(err));
});

    return () => {
      vapi.stop();
    };
  }, [vapi]);

  const log = (msg: string) => {
    setLogs((prevLogs) => [...prevLogs, msg]);
  };
  // main logic pretty basic , will try to add resume parsing and maybe video streaming(even though not effective here)
  const startCall = async () => {
    log("Connecting...");
    try {
      await vapi.start({
        model: {
          provider: "openai",
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "You are a friendly and professional interviewer. Ask DevOps questions and keep the conversation natural.",
          }],
        },
        voice: { provider: "vapi", voiceId: "Elliot" },
        transcriber: { provider: "deepgram", model: "nova-2", language: "en-US" },
        firstMessage: "Hello! Thanks for joining. Let's start with your experience in cloud platforms. How have you used AWS or Azure?",
        endCallPhrases: ["end call", "goodbye"],
      });
    } catch (err) {
      log(`Start failed: ${err}`);
    }
  };

  const stopCall = () => {
    vapi.stop();
    log("Call manually stopped.");
  };
  // used ai for styling
  const pageStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    margin: 0,
    padding: 0, 
    background: "linear-gradient(135deg, #181818 0%, #121212 100%)",
    fontFamily: "'Poppins', sans-serif",
    color: "#E0E0E0",
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "30px",
    width: "90%",
    maxWidth: "700px",
    padding: "50px",
    background: "#1E1E1E",
    borderRadius: "24px",
    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.6)",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: "2.8rem",
    fontWeight: "600",
    margin: 0,
    color: "#FFFFFF",
  };

  const statusStyle: React.CSSProperties = {
    fontSize: "1rem",
    fontWeight: "500",
    padding: "10px 25px",
    borderRadius: "50px",
    background: connected ? "#2CB67D" : "#3A3A3A",
    color: "#FFFFFF",
    transition: "all 0.4s ease",
    animation: connected ? "pulse 2s infinite" : "none",
  };
  
  const buttonContainerStyle: React.CSSProperties = {
      display: 'flex',
      gap: '20px'
  }

  const buttonStyle: React.CSSProperties = {
    background: "transparent",
    color: "#E0E0E0",
    border: "2px solid #555",
    padding: "12px 35px",
    fontSize: "0.9rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.08rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    borderRadius: "50px",
  };

  const buttonHoverStyle: React.CSSProperties = {
    background: "#2CB67D",
    color: "#FFFFFF",
    borderColor: "#2CB67D",
  };
  
  const stopButtonHoverStyle: React.CSSProperties = {
    background: "#FF5252",
    color: "#FFFFFF",
    borderColor: "#FF5252",
  }

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    cursor: "not-allowed",
    opacity: 0.4,
  };

  const logsContainerStyle: React.CSSProperties = {
    width: "100%",
    background: "#252525",
    borderRadius: "16px",
    padding: "25px",
    height: "250px",
    display: "flex",
    flexDirection: "column-reverse", 
    overflowY: "auto",
  };

  const logEntryStyle: React.CSSProperties = {
    animation: "fadeIn 0.5s ease",
    marginBottom: "12px",
    display: 'flex',
    flexDirection: 'column',
  };
  
  const getMessageStyle = (log: string): React.CSSProperties => {
      const isUser = log.startsWith("user:") || log.startsWith("assistant:");
      const role = isUser ? log.split(":")[0] : "system";
      
      const baseStyle: React.CSSProperties = {
          padding: '10px 15px',
          borderRadius: '12px',
          maxWidth: '80%',
          wordWrap: 'break-word',
      };
      
      if (role === 'user') {
          return { ...baseStyle, background: '#2CB67D', color: '#FFFFFF', alignSelf: 'flex-end', textAlign: 'right' };
      }
      if (role === 'assistant') {
          return { ...baseStyle, background: '#3A3A3A', color: '#E0E0E0', alignSelf: 'flex-start' };
      }
      return { fontSize: '0.85rem', color: '#888', fontStyle: 'italic', alignSelf: 'center', textAlign: 'center' };
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={headingStyle}>AI Interviewer</h1>
        <p style={statusStyle}>
          {connected ? "Connected" : "Disconnected"}
        </p>
        
        <div style={buttonContainerStyle}>
          <button
            onClick={startCall}
            disabled={connected}
            style={connected ? disabledButtonStyle : { ...buttonStyle, ...(isHovered ? buttonHoverStyle : {}) }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Start Call
          </button>
          <button
            onClick={stopCall}
            disabled={!connected}
            style={!connected ? disabledButtonStyle : { ...buttonStyle, ...(isStopHovered ? stopButtonHoverStyle : {}) }}
            onMouseEnter={() => setIsStopHovered(true)}
            onMouseLeave={() => setIsStopHovered(false)}
          >
            Stop Call
          </button>
        </div>

        <div style={logsContainerStyle}>
          {[...logs].reverse().map((log, i) => (
            <div key={i} style={logEntryStyle}>
                <p style={getMessageStyle(log)}>
                    {log.includes(':') ? log.substring(log.indexOf(':') + 1).trim() : log}
                </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;