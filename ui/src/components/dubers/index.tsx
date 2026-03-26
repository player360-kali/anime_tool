import { ASSETS_URL } from "@/config/env";
import type { TranslatorType } from "@/types/global";

const Dubers = ({ translator }: { translator: TranslatorType[] }) => (
  <section>
    <h2 className="text-base font-medium mb-4">Ovoz berganlar</h2>
    <div className="flex flex-wrap gap-3">
      {translator.map((t) => (
        <div
          key={t._id}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/60 border border-border/50"
        >
          <img
            src={ASSETS_URL + t.image}
            alt={t.name}
            className="size-7 rounded-full object-cover"
          />
          <span className="text-xs font-medium">{t.name}</span>
        </div>
      ))}
    </div>
  </section>
);
export default Dubers;
