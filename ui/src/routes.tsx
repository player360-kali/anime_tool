import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/home";
import AppLayout from "@/App";
import AnimePage from "./pages/anime";
import WatchPart from "./pages/watchPart";
export const routes = createBrowserRouter([
  {
    Component: AppLayout,
    children: [
      {
        path: "/",
        Component: HomePage,
      },
      {
        path: "/anime/:sId",
        Component: AnimePage,
      },

      {
        path: "/anime/:sId/:pId",
        Component: WatchPart,
      },
    ],
  },
]);
