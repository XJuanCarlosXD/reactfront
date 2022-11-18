import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import RouterReact from "./routes/routes";
import { onAuthStateChanged } from "firebase/auth";
import { Toaster } from 'react-hot-toast';
import { auth } from "./firebase/firebase";

const App = () => {
  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Sign-in provider: " + user.providerId);
        console.log("  Provider-specific UID: " + user.uid);
        console.log("  Name: " + user.displayName);
        console.log("  Email: " + user.email);
        console.log("  Photo URL: " + user.photoURL);
      } else {
        // User is signed out
        // ...
      }
    });
  }, [])
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
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </>
  );
}

export default App;
