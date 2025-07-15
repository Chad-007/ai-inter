import React, { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';
import TopicSelector from './components/TopicSelector';
import Controls from './components/Controls';
import LogsDisplay from './components/LogsDisplay';
import firstMessages from './lib/firstMessages';
import FuturisticAvatar from './components/Avatar';
import { Link } from "react-router-dom";
const VAPI_PUBLIC_KEY = "0359a1c9-615f-4fa1-8b7f-8fa3d1a32973";

function App() {
  const [selectedTopic, setSelectedTopic] = useState("DevOps");
  const [vapi] = useState(() => new Vapi(VAPI_PUBLIC_KEY));
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

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
      if (message.type === "transcript" && message.transcriptType === "final") {
        log(`${message.role}: ${message.transcript}`);
      }
    });

    return () => {
      vapi.stop();
    };
  }, [vapi]);

  const log = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  const startCall = async () => {
    log("Connecting...");
    await vapi.start({
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [{
          role: "system",
          content: `You are a friendly and professional interviewer. Ask ${selectedTopic} questions and keep the conversation natural. If the candidate gives a vague answer, ask follow-ups.`
        }],
      },
      voice: { provider: "vapi", voiceId: "Elliot" },
      transcriber: { provider: "deepgram", model: "nova-2", language: "en-US" },
      firstMessage: firstMessages[selectedTopic],
      endCallPhrases: ["end call", "goodbye"],
    });
  };

  const stopCall = () => {
    vapi.stop();
    log("Call manually stopped.");
  };

  return (
    <div
  style={{
    padding: "40px",
    fontFamily: "Poppins, sans-serif",
    color: "#fff",
    background: "#121212",
    minHeight: "100vh"
  }}
>
  <h1 style={{ textAlign: "center", fontSize: "2.5rem" }}>ai interview</h1>
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px"
  }}>
    <FuturisticAvatar />
    <TopicSelector selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
    <p style={{ fontWeight: 500 }}>{connected ? "Connected" : "Disconnected"}</p>
    <Controls connected={connected} onStart={startCall} onStop={stopCall} />
    <LogsDisplay logs={logs} />
    <Link to="/leaderboard">
      <button style={{ marginTop: "20px" }}>View Leaderboard</button>
    </Link>
  </div>
</div>

  );
}

export default App;
