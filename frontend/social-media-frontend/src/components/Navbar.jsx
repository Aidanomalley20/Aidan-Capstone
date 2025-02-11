import { NavLink } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineMessage,
  AiOutlineBell,
  AiOutlineUser,
} from "react-icons/ai";

const Navbar = () => {
  return (
    <>
      <nav className="bg-white shadow-md fixed top-0 w-full z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-600">
            <NavLink to="/">SocialApp</NavLink>
          </h1>

          <div className="flex space-x-8 text-gray-600 text-3xl">
            <NavLink to="/" className="relative group hover:text-indigo-600">
              <AiOutlineHome />
              <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                Home
              </span>
            </NavLink>

            <NavLink
              to="/search"
              className="relative group hover:text-indigo-600"
            >
              <AiOutlineSearch />
              <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                Search
              </span>
            </NavLink>

            <NavLink
              to="/messages"
              className="relative group hover:text-indigo-600"
            >
              <AiOutlineMessage />
              <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                Messages
              </span>
            </NavLink>

            <NavLink
              to="/notifications"
              className="relative group hover:text-indigo-600"
            >
              <AiOutlineBell />
              <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                Notifications
              </span>
            </NavLink>

            <NavLink
              to="/profile"
              end
              className="relative group hover:text-indigo-600"
              onClick={() => console.log("Profile link clicked!")}
            >
              <AiOutlineUser />
              <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                Profile
              </span>
            </NavLink>
          </div>
        </div>
      </nav>

      <div className="mt-20"></div>
    </>
  );
};

export default Navbar;
