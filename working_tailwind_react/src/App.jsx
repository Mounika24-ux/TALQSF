import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import Landing from "./Pages/Landing";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Latest from "./Pages/Latest";
import Features from "./Pages/Features";
import Learn from "./Pages/Learn";
import History from "./Pages/History";




function Layout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#e0e2e4] text-[#625750]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Entry landing page */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Main TALCAS pages */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/latest" element={<Latest />} />
          <Route path="/features" element={<Features />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/history" element={<History />} />
  
        </Route>
      </Routes>
    </Router>
  );
}
