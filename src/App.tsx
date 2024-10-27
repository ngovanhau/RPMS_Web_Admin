import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import DashboardHome from "./pages/Home/Home";
import DashboardLayout from "./layouts/Dashboard/DashboardLayout";
import DashBoardService from "./pages/Service/Service";
import DashBoardBuidling from "./pages/Buidling/Building";
const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Route Login nằm ngoài layout */}
                <Route path="/" element={<Login />} />
                
                {/* DashboardLayout bao bọc các tuyến đường khác */}
                <Route element={<DashboardLayout />}>
                    <Route path="Dashboard" element={<DashboardHome />} />
                    <Route path="Service" element={<DashBoardService />} />
                    <Route path="Building" element={<DashBoardBuidling />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
