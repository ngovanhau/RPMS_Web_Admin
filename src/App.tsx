import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";

const App: React.FC = () => {
  return(
    <Router>  
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/Home" element={<Home />} />
      </Routes>
    </Router>
  );
};
export default App;