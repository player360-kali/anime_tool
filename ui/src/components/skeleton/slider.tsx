import { Skeleton } from "@/components/ui/skeleton";

const SliderSkeleton = () => {
  return (
    <div className="w-full h-dvh relative">
      <div className="w-full px-5 flex flex-col items-center text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  max-w-xl text-white">
        <Skeleton className="w-75 h-75 border-4 rounded-xl object-cover cursor-pointer hover:grayscale-45 transition-all" />
        <Skeleton className="w-full h-8 mt-10 mb-3" />
        <Skeleton className="w-full h-8" />
        <div className="w-full flex flex-col gap-2 mt-6">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
        </div>
      </div>
      <div>
        <Skeleton className="w-50 h-4 flex items-center justify-center gap-5 absolute bottom-5 left-1/2 right-1/2  transform -translate-x-1/2 -translate-y-1/2">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton className="w-3 h-3 border" key={i} />
            ))}
        </Skeleton>
      </div>
      <Skeleton className="w-8 h-8 rounded-full absolute left-8 top-1/2 bottom-1/2 transform -translate-y-1/2" />
      <Skeleton className="w-8 h-8 rounded-full absolute right-8 top-1/2 bottom-1/2 transform -translate-y-1/2" />
    </div>
  );
};
export default SliderSkeleton;
