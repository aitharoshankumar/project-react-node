import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [festivals, setFestivals] = useState([]);

  useEffect(() => {
    fetch("http://13.217.112.73:5000/api/festivals")
      .then((res) => res.json())
      .then((data) => setFestivals(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="app-container">
      <h1 className="app-title">Top 10 Indian Festivals</h1>

      {festivals.map((festival, index) => (
        <div
          key={index}
          className={`festival-card card-${index % 10}`}
        >
          <div className="festival-name">
            {festival.name}
          </div>
          <div className="festival-date">
            {festival.date}
          </div>
          <div className="festival-desc">
            {festival.description}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;

