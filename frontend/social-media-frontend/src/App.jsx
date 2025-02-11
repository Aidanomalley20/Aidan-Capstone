import { BrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import { useDispatch } from "react-redux";
import { logoutUser } from "./redux/slices/authSlice";
import { useEffect } from "react";

function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleUnload = () => {
      dispatch(logoutUser());
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [dispatch]);
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        {user && <Navbar />}
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
