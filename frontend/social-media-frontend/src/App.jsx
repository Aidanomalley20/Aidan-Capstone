import { BrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

function App() {
  const { user } = useSelector((state) => state.auth);

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
