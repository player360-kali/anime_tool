import { cn } from "@/lib/utils";
import type { SeriaTypes } from "@/types/global";
import { Play } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const Parts = ({ series }: { series: SeriaTypes[] }) => {
  const { sId = "", pId = "" } = useParams();
  const navigate = useNavigate();
  console.log(sId, pId);

  return (
    <section>
      <h2 className="text-base font-medium mb-4">
        Qismlar
        <span className="ml-2 text-sm text-muted-foreground font-normal">
          ({series.length} ta)
        </span>
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {series.map((s) => (
          <button
            key={s._id}
            className={cn(
              "cursor-pointer flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-colors",
              s.status === "active"
                ? "bg-primary/10 border-primary/40 text-primary hover:bg-primary/20"
                : "bg-muted/50 border-border/50 text-muted-foreground hover:bg-muted",
              pId === s._id ? "bg-brand text-white font-bold" : "",
            )}
            onClick={() => navigate("/anime/" + sId + "/" + s._id)}
          >
            <Play className="size-3" />
            {s.name.uz.replace("-qism", "")}
          </button>
        ))}
      </div>
    </section>
  );
};
export default Parts;
