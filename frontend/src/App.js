import React, { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("CEO");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:8000/rephrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setResponse("Error connecting to backend.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h2>🗣️ Local Rephraser</h2>

      <textarea
        rows={5}
        cols={60}
        placeholder="Enter text to rephrase..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ fontSize: 16 }}
      />

      <br /><br />

      <label>Select tone: </label>
      <select value={tone} onChange={(e) => setTone(e.target.value)}>
        <option value="CEO">CEO</option>
        <option value="teenager">Teenager</option>
        <option value="comedian">Comedian</option>
        <option value="professor">Professor</option>
      </select>

      <br /><br />

      <button onClick={handleSubmit} style={{ fontSize: 16 }}>
        Rephrase
      </button>

      <p>{loading ? "⏳ Rephrasing..." : null}</p>

      {response && (
        <div style={{ marginTop: 20 }}>
          <h3>✨ Rephrased Output:</h3>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
