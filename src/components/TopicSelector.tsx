interface Props {
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
}

const TopicSelector = ({ selectedTopic, setSelectedTopic }: Props) => (
  <>
    <label style={{ fontWeight: "500", marginBottom: "8px" }}>
      select  the topic:
    </label>
    <select
      value={selectedTopic}
      onChange={(e) => setSelectedTopic(e.target.value)}
      style={{
        padding: "12px 20px",
        borderRadius: "12px",
        background: "#1F1F1F",
        color: "#E0E0E0",
        fontWeight: "500",
        fontSize: "1rem",
        border: "2px solid #2CB67D",
        outline: "none",
        marginBottom: "10px",
        appearance: "none",
        cursor: "pointer",
        boxShadow: "0 0 8px rgba(44,182,125,0.2)",
        transition: "all 0.3s ease"
      }}
    >
      <option value="DevOps">DevOps</option>
      <option value="Frontend">Frontend</option>
      <option value="Backend">Backend</option>
      <option value="Full Stack">Full Stack</option>
      <option value="AI/ML">AI/ML</option>
      <option value="Cybersecurity">Cybersecurity</option>
      <option value="Data Structures">Data Structures & Algorithms</option>
    </select>
  </>
);

export default TopicSelector;
