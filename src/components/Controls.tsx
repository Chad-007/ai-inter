import React, { useState } from "react";

interface ControlsProps {
  connected: boolean;
  onStart: () => void;
  onStop: () => void;
}

const Controls: React.FC<ControlsProps> = ({ connected, onStart, onStop }) => {
  const [isHoveredStart, setIsHoveredStart] = useState(false);
  const [isHoveredStop, setIsHoveredStop] = useState(false);

  const buttonStyle: {
    base: React.CSSProperties;
    hoverStart: React.CSSProperties;
    hoverStop: React.CSSProperties;
    disabled: React.CSSProperties;
  } = {
    base: {
      background: "transparent",
      color: "#E0E0E0",
      border: "2px solid #555",
      padding: "12px 35px",
      fontSize: "0.9rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.08rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      borderRadius: "50px",
    },
    hoverStart: {
      background: "#2CB67D",
      color: "#FFFFFF",
      borderColor: "#2CB67D",
    },
    hoverStop: {
      background: "#FF5252",
      color: "#FFFFFF",
      borderColor: "#FF5252",
    },
    disabled: {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    gap: "20px",
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={onStart}
        disabled={connected}
        onMouseEnter={() => setIsHoveredStart(true)}
        onMouseLeave={() => setIsHoveredStart(false)}
        style={{
          ...buttonStyle.base,
          ...(connected ? buttonStyle.disabled : isHoveredStart ? buttonStyle.hoverStart : {}),
        }}
      >
        Start call
      </button>

      <button
        onClick={onStop}
        disabled={!connected}
        onMouseEnter={() => setIsHoveredStop(true)}
        onMouseLeave={() => setIsHoveredStop(false)}
        style={{
          ...buttonStyle.base,
          ...(!connected ? buttonStyle.disabled : isHoveredStop ? buttonStyle.hoverStop : {}),
        }}
      >
        Stop call
      </button>
    </div>
  );
};

export default Controls;
