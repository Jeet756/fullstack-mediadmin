import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <div style={{ 
      overflowX: "hidden",
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>
      <Navbar />
      <ScrollToTop />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;