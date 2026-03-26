import { Skeleton } from "../ui/skeleton";

const SkeletonCategory = () => {
  return (
    <div className="container py-5 mx-auto flex flex-wrap gap-x-4 gap-y-2 justify-center">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="w-30 h-8" />
        ))}
    </div>
  );
};
export default SkeletonCategory;
