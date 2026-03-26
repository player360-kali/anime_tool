import { Outlet } from "react-router-dom";
import Nav from "@/components/nav";

function AppLayout() {
  return (
    <section>
      <Nav />
      <Outlet />
    </section>
  );
}

export default AppLayout;
