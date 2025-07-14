import { useEffect, useState } from 'react';
import Vapi from '@vapi-ai/web';

const VAPI_PUBLIC_KEY = "0359a1c9-615f-4fa1-8b7f-8fa3d1a32973";

function App() {
  const [vapi] = useState(() => new Vapi(VAPI_PUBLIC_KEY));// initiaze vapi with key
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    vapi.on('call-start', () => {
      console.log("call started");
      setConnected(true);
      log("call started");
    });

    vapi.on('call-end', () => {
      console.log("call ended");
      setConnected(false);
      log("call ended");
    });

    vapi.on('message', (message) => {
      console.log("Message:", message);
      if (message.type === "transcript" && message.transcriptType === "final") {
        log(`${message.role}: ${message.transcript}`);
      }
    });
    vapi.on('error', (err) => {
      console.error("Vapi Error:", err);
      log("Error: " + (err.message || err.toString()));
    });

    return () => {
      vapi.stop();
    };
  }, [vapi]);

  const log = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
  };

  const startCall = async () => {
    log("Starting call...");
    try {
      await vapi.start({
        model: {
          provider: "openai",
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an interviewer asking DevOps questions based on the user's responses. Keep it natural and like a real interview."
            }
          ]
        },
        voice: {
          provider: "vapi",
          voiceId: "Elliot"
        },
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en-US"
        },
        firstMessage: "Hello, let's begin the DevOps interview. Tell me about your experience with Docker.", // start with random(message)
        endCallMessage: "Thanks for your time. ending the interview.",
        endCallPhrases: ["end call", "goodbye", "bye"],
        maxDurationSeconds: 300,
        silenceTimeoutSeconds: 30
      });
    } catch (err) {
      log("start failed: " + err);
      console.error(err);
    }
  };

  const stopCall = () => {
    vapi.stop();
    log("Manually stopped the call");
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <h1>Vapi AI Interviewer(minimal or demo)</h1>
      <p>Status: <strong>{connected ? "connected" : "disconnected"}</strong></p>

      <button onClick={startCall} disabled={connected} style={{ marginRight: 10 }}>
        Start Call
      </button>
      <button onClick={stopCall} disabled={!connected}>
        Stop Call
      </button>

      <div style={{ marginTop: 30 }}>
        <h3> transcripts and  logs</h3>
        <div style={{
          background: "#f9fafb",
          padding: 10,
          border: "1px solid #ddd",
          height: 200,
          overflowY: "auto"
        }}>
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
