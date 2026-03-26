import { createRoot } from "react-dom/client";
import "@/global.css";
import { RouterProvider } from "react-router";
import { routes } from "@/routes.tsx";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/providers/queryClient.ts";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools client={queryClient} />
    <RouterProvider router={routes} />
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 1500,
        className: "bg-brand font-bold! text-white!",
      }}
    />
  </QueryClientProvider>,
);
