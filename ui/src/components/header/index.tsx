import SliderSkeleton from "@/components/skeleton/slider";
import { getSliders } from "@/api/sliders";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPagination,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ASSETS_URL } from "@/config/env";
import type { SliderTypes } from "@/types/global";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { data: sliders, isLoading: isSlidersLoading } = useQuery({
    queryKey: ["SLIDERS"],
    queryFn: async () => await getSliders(),
  });
  const navigate = useNavigate();
  if (isSlidersLoading) return <SliderSkeleton />;
  if (!sliders?.data) return "No content";
  return (
    <header className="h-dvh">
      <Carousel
        className="w-full h-full relative select-none"
        opts={{ loop: true }}
      >
        <CarouselContent>
          {sliders.data.map((slides: SliderTypes) => (
            <CarouselItem key={slides._id}>
              <div className="relative h-dvh md:h-[calc(100dvh-60px)] w-full">
                <img
                  src={ASSETS_URL + slides.serial.screens.original[0]}
                  alt={slides.serial.name.uz}
                  className="w-full h-full object-cover"
                />

                <div className="h-full absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent" />

                <div className="w-full h-full px-5 flex flex-col items-center text-center absolute top-[60%] md:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  max-w-xl text-white">
                  <img
                    className="w-75 h-75 border-4 rounded-xl object-cover cursor-pointer grayscale-25 hover:grayscale-0 transition-all duration-500 hover:scale-105"
                    src={ASSETS_URL + slides.serial.image}
                    onClick={() => navigate("/anime/" + slides.serial._id)}
                  />

                  <h1 className="text-4xl mt-10 font-bold text-brand">
                    {slides.serial.name.uz.slice(
                      0,
                      slides.serial.name.uz.length - 5,
                    )}
                  </h1>

                  <p className="mt-3 text-sm text-gray-300 line-clamp-3">
                    {slides.serial.description.uz}
                  </p>
                  <Button
                    className="w-full mt-8 md:hidden"
                    onClick={() => navigate("/anime/" + slides.serial._id)}
                  >
                    Watch
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselNext className="absolute right-8 bg-brand" />
        <CarouselPrevious className="absolute left-8 bg-brand" />
        <CarouselPagination />
      </Carousel>
    </header>
  );
};

export default Header;
