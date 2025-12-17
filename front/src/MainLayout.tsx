import { Outlet } from "react-router";
import Header from "./components/molecules/Header";
import Footer from "./components/molecules/Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex overflow-hidden flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
