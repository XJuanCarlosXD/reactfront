import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import { RouterReact, RouterVcard } from "./routes/routes";

const App = () => {
  return (
    <>
      <Router>
        {/* <RouterVcard /> */}
        <RouterReact />
      </Router>
    </>
  );
}

export default App;
