import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// shared UI
import Navbar  from './Components/Navbar';
import Footer  from './Components/Footer';

// pages
import Home     from './Pages/Home';
import About    from './Pages/About';
import Latest   from './Pages/Latest';
import Features from './Pages/Features';
import Learn    from './Pages/Learn';

/* ---------- layout that wraps every page with navbar + footer ---------- */
function Layout() {
  return (
    <>
      <Navbar />

      {/* main content area gets a light grey bg just like your Home page */}
      <main className="min-h-screen bg-[#e0e2e4] text-[#625750]">
        <Outlet />  {/*  ← current route renders here */}
      </main>

      <Footer />
    </>
  );
}

/* --------------------------- router shell ------------------------------ */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"       element={<Home />} />
          <Route path="about"    element={<About />} />
          <Route path="latest"   element={<Latest />} />
          <Route path="features" element={<Features />} />
          <Route path="learn"    element={<Learn />} />
        </Route>
      </Routes>
    </Router>
  );
}