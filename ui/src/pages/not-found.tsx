import { Button } from "@/components/ui/button";
import { ArrowDown, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100dvh-60px)] flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-purple-900/20 via-black to-pink-900/20" />

      <div className="relative z-10 text-center px-4">
        <h1 className="text-7xl md:text-9xl font-extrabold tracking-widest bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text animate-pulse">
          404
        </h1>

        <h2 className="mt-4 text-primary text-2xl md:text-3xl font-bold">
          Page not founda (X_X)
        </h2>

        <p className="mt-2 text-gray-400 max-w-md mx-auto">
          Sorry... Your page not found, please go back or go to home page!
        </p>

        <div className="flex justify-center mt-5 items-center gap-5">
          <Button onClick={() => navigate(-1)}>
            <ArrowDown className="animate-bounce rotate-90" /> Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant={"outline"}
            className="text-primary"
          >
            Home <Home className="size-3 animate-ping" />
          </Button>
        </div>
      </div>

      <div className="absolute w-125 h-125 bg-pink-500/10 rounded-full blur-3xl -top-25 -left-25" />
      <div className="absolute w-100 h-100 bg-purple-500/10 rounded-full blur-3xl -bottom-25 -right-25" />
    </div>
  );
}
