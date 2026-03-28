import { getCategory } from "@/api/category";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SkeletonCategory from "@/components/skeleton/category";
import { CardGroup } from "@/components/card-group";

const Category = () => {
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["CATEGORIES"],
    queryFn: async () => await getCategory(),
  });

  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const firstCategoryId = categories?.data?.[0]?._id;
  const activeCategory = currentCategory ?? firstCategoryId;

  if (isCategoriesLoading) return <SkeletonCategory />;
  if (!categories?.data) return "No content";

  return (
    <section className="w-full py-5">
      <div className="container mx-auto">
        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
          {categories.data.map((category) => (
            <Button
              key={category._id}
              onClick={() => setCurrentCategory(category._id)}
              variant={activeCategory === category._id ? "default" : "outline"}
              className={
                activeCategory === category._id ? "text-white" : "text-brand"
              }
            >
              {category.nameuz}
            </Button>
          ))}
        </div>
      </div>
      <CardGroup category={[activeCategory || ""]} />
    </section>
  );
};
export default Category;
