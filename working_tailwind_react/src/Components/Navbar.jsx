import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="relative z-5 bg-[#625750] shadow-md py-7">
      <nav className="flex justify-between items-center px-5 text-sm max-w-screen-xl mx-auto">
        <div className="font-bold text-6xl text-white mr-12">TALQS</div>
        <ul className="flex gap-6 text-white text-lg justify-end flex-1">
          <li><Link to="/about" className="hover:underline">About</Link></li>
          <li><Link to="/latest" className="hover:underline">Latest</Link></li>
          <li><Link to="/features" className="hover:underline">Top Features</Link></li>
          <li><Link to="/learn" className="hover:underline">Learn</Link></li>
        </ul>
      </nav>
    </div>
  );
}
