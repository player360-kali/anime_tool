import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/home";
import AppLayout from "@/App";
import AnimePage from "@/pages/anime";
import WatchPart from "@/pages/watchPart";
import ErrorPage from "@/pages/error";
import NotFoundPage from "./pages/not-found";
import CatalogPage from "./pages/catalog";
import LikedPage from "./pages/liked";
import HistoryPage from "./pages/history";
export const routes = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
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
      {
        path: "/catalog",
        Component: CatalogPage,
      },
      {
        path: "/liked",
        Component: LikedPage,
      },
      {
        path: "/history",
        Component: HistoryPage,
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
]);
