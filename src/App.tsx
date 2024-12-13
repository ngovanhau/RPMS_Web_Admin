import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import DashboardHome from "./pages/Home/Home";
import DashboardLayout from "./layouts/Dashboard/DashboardLayout";
import DashBoardService from "./pages/Service/Service";
import DashBoardBuidling from "./pages/Buidling/Building";
import DashBoardRoom from "./pages/Room/Room";
import Profile from "./pages/Profile/Profile";
import ChangePassWord from "./pages/ChangePassWord/ChangePassWord";
import Tenant from "./pages/Tenant/Tenant";
import DashBoardContract from "./pages/Contract/Contract";
import DashBoardAccount from "./pages/Account/Account";
import DashBoardPermission from "./pages/Permission/Permission";
import DashBoardDeposit from "./pages/Deposit/Deposit";
import DashBoardRoomStatement from "./pages/RoomStatement/RoomStatement";
import DashBoardInvoice from "./pages/Invoice/Invoice";
import DashBoardProblem from "./pages/Problem/Problem";
import DashBoardCashFlow from "./pages/Cashflow/Cashflow";
import DashBoardBooking from "./pages/Booking/Booking";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import { Toaster } from "./components/ui/toaster";
const App: React.FC = () => {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Route Login nằm ngoài layout */}
        <Route path="/" element={<Login />} />
        <Route path="/Forgotpassword" element={<ForgotPassword />} />
        {/* DashboardLayout bao bọc các tuyến đường khác */}
        <Route element={<DashboardLayout />}>
          <Route path="Dashboard" element={<DashboardHome />} />
          <Route path="Service" element={<DashBoardService />} />
          <Route path="/building" element={<DashBoardBuidling />} />
          <Route path="/room" element={<DashBoardRoom />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Changepass" element={<ChangePassWord />} />
          <Route path="/Tenant" element={<Tenant />} />
          <Route path="/Contract" element={<DashBoardContract />} />
          <Route path="/Account" element={<DashBoardAccount />} />
          <Route path="/Permission" element={<DashBoardPermission />} />
          <Route path="/Deposit" element={<DashBoardDeposit />} />
          <Route path="/RoomStatement" element={<DashBoardRoomStatement />} />
          <Route path="/Invoice" element={<DashBoardInvoice />} />
          <Route path="/Problem" element={<DashBoardProblem />} />
          <Route path="/Income-expense" element={<DashBoardCashFlow />} />
          <Route path="/Booking" element={<DashBoardBooking />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
