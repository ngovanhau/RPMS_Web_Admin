import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";

const App: React.FC = () => {
  return(
    <Router>  
      <div className="flex flex-col h-full bg-red-500">
        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/Home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};
export default App;