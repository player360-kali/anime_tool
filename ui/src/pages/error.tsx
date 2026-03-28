import { Button } from "@/components/ui/button";
import { Home, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-dvh flex flex-col items-center">
      <div className="flex flex-col items-center text-center m-auto">
        <h1 className="text-brand text-4xl font-bold">
          Some thing wrong this page or app crashed
        </h1>
        <p className="font-bold text-primary text-xl my-5">
          Please reload or back to home
        </p>
        <div className="flex gap-5">
          <Button onClick={() => window.location.reload()}>
            Reload <RefreshCw className="animate-spin" />
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
    </div>
  );
}
