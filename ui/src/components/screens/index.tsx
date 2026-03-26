import { ASSETS_URL } from "@/config/env";
import type { AnimeType } from "@/types/global";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

const Screens = ({ screens }: { screens: AnimeType["screens"] }) => {
  return (
    <section>
      <Dialog>
        <h2 className="text-base font-medium mb-4">Kadrlar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {screens.thumb.slice(0, 7).map((src, i) => (
            <Dialog key={i}>
              <DialogTrigger asChild>
                <div className="aspect-video rounded-lg overflow-hidden border border-border/50 cursor-pointer">
                  <img
                    src={ASSETS_URL + src}
                    alt={`kadr-${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </DialogTrigger>

              <DialogContent className="max-w-3xl p-0 overflow-hidden">
                <img
                  src={ASSETS_URL + screens.original[i]}
                  alt={`kadr-${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </Dialog>
    </section>
  );
};
export default Screens;
