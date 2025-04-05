import "./App.css";
import { useState, useEffect, lazy } from "react";
const LandingPage = lazy(() => import("./components/home/LandingPage"));
const MerchandisePage = lazy(() => import("./components/MerchandisePage"));
const Eventpage = lazy(() => import("./components/Events/Eventpage"));
const EventRegistration = lazy(() => import("./components/Events/EventRegistration"));
const DashboardPage = lazy(() => import("./components/protected_routes/DashboardPage"));
const Signup = lazy(() => import("./components/login/Signup"));
const Login = lazy(() => import("./components/login/Login"));
const EmailVerify = lazy(() => import("./components/login/EmailVerify"));
const ResetPassword = lazy(() => import("./components/login/ResetPassword"));
const ForgotPassword = lazy(() => import("./components/login/ForgotPassword"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));
const AllEvents = lazy(() => import("./components/Events/allevents/AllinoneEvents"));
const WorkshopPage = lazy(() => import("./components/workshop/WorkshopPage"));
import Loading from "./components/Loading"

import { ProtectedRoute } from "./components/protected_routes/AuthRoutes";
import { BrowserRouter as Router, Routes, Route, redirect } from "react-router-dom";
const Notifications = lazy(() => import("./components/protected_routes/Notifications"));
import { Toaster } from "react-hot-toast";
import { logoutCall } from "./services/http/auth";
import { uri } from "./config/endpoints";
import AdminPage from "./components/Admin/AdminPage";
import AdminLogin from "./components/Admin/AdminLogin";
import AccommodationPage from "./components/accommodation/AccommodationPage";

const Referral = lazy(() => import("./components/login/Referral"));


function App() {
  const [user, setUser] = useState("");
  const [checking, setChecking] = useState(true);

  const handleLogout = async () => {
    setUser("");
    localStorage.removeItem("sid");
    localStorage.removeItem("providerID");
    await logoutCall();
  };

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const token = localStorage.getItem("sid");
    if (token) await verifyToken(token);
    setChecking(false);
  }

  const verifyToken = async (token) => {
    const response = await fetch(`${uri.resources.USERS}/${token}`, {
      credentials: 'include'
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data);
    } else {
      setUser("");
      localStorage.removeItem("sid");
      redirect("/login");
    }
    setChecking(false);
  };

  return (
    <>
      <Router>
        <Routes>
          <Route index element={<LandingPage setUser={setUser} />} />
          <Route element={checking ? <Loading /> : <ProtectedRoute accessAllowed={!!user} redirectTo="/login" />}>
            <Route
              path="/dashboard"
              element={<DashboardPage userDetails={user} logout={handleLogout} />}
            />
          </Route>
          <Route path="/events" element={<Eventpage />} />
          {/*           <Route path="/events/:category/:eventID" element={<AllEvents />} />
          <Route path="/events/:category/:eventID/:registration" element={<EventRegistration />} /> */}
          <Route path="/events/:eventID" element={<AllEvents />} />
          <Route path="/events/:eventID/:registration" element={<EventRegistration />} />
          <Route>
            {/* <Route path="/merchandise" element={
             <ProtectedRoute checkUserSession={checkUserSession} logout={logout}>
             <MerchandisePage />
           </ProtectedRoute>
              } /> */}
            <Route path="/merchandise" element={<MerchandisePage />} />
          </Route>
          <Route path="/events" element={<Eventpage />} />
          <Route path="/eventregistration" element={<EventRegistration />} />
          <Route path="/notifications" element={<Notifications user={user} />} />
          <Route
            path="/signup"
            element={<Signup user={user} setUser={setUser} />}
          />
          <Route
            path="/login"
            element={<Login user={user} setUser={setUser} />}
          />
          <Route path="/referral" element={<Referral />} />
          <Route path="/verify" element={<EmailVerify />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/workshop" element={<WorkshopPage />} />
          <Route path="/accommodation" element={<AccommodationPage />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/details" element={<AdminPage />} />
        </Routes>
      </Router>
      <Toaster
        toastOptions={{
          duration: 2000,
          style: {
            backgroundColor: "#141414",
            borderRadius: "0px",
            fontSize: "18px",
            padding: "12px",
            color: "white",
            borderTop: "1px solid #b60000",
            borderLeft: "1px solid #b60000",
            borderBottom: "1px solid #532e8f",
            borderRight: "1px solid #532e8f",
            zIndex: 1005,
            textAlign: "center",
            fontFamily: "var(--font-sometypeMono)"
          }
        }}
        containerStyle={{
          top: "15vh",
          right: "35vw",
          left: "35vw",
        }}
      />
    </>
  );
}

export default App;
