import { Skeleton } from "../ui/skeleton";

function AnimeSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <div className="flex gap-8">
        <Skeleton className="w-48 aspect-2/3 rounded-xl shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
export default AnimeSkeleton;
