import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import RouterReact from "./routes/routes";

const App = () => {
  return (
    <>
      <div className="video-bg">
        <video width="320" height="240" autoPlay loop muted>
          <source src="https://assets.codepen.io/3364143/7btrrd.mp4" type="video/mp4" />
        </video>
      </div>
      <Router>
        <RouterReact />
      </Router>
    </>
  );
}

export default App;
