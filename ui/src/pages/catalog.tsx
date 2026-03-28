// pages/catalog.tsx
import { getCategory, getJanr } from "@/api/category";
import { CardGroup } from "@/components/card-group";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 2000 }, (_, i) =>
  String(currentYear - i),
);

const CatalogPage = () => {
  const [activeCategory, setActiveCategory] = useState<string[]>([]);
  const [activeJanr, setActiveJanr] = useState<string[]>([]);
  const [activeYear, setActiveYear] = useState<string[]>([]);

  const { data: categories, isLoading: catLoading } = useQuery({
    queryKey: ["CATEGORIES"],
    queryFn: getCategory,
  });

  const { data: janrData, isLoading: janrLoading } = useQuery({
    queryKey: ["JANR"],
    queryFn: getJanr,
  });

  const toggle = (
    value: string,
    current: string[],
    set: (v: string[]) => void,
  ) => {
    set(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    );
  };

  const hasFilter =
    activeCategory.length > 0 || activeJanr.length > 0 || activeYear.length > 0;

  return (
    <div className="py-8 space-y-6">
      <div className="container mx-auto px-4 space-y-5">
        <h1 className="text-xl font-semibold mb-6">Catalog page</h1>
        <div className="flex items-center justify-between">
          {hasFilter && (
            <Button
              variant={"outline"}
              onClick={() => {
                setActiveCategory([]);
                setActiveJanr([]);
                setActiveYear([]);
              }}
              className="text-xs text-primary hover:text-destructive transition-colors"
            >
              Clear filter
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Category
          </p>
          {catLoading ? (
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-md" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories?.data?.map((cat) => (
                <Button
                  key={cat._id}
                  size="sm"
                  variant={
                    activeCategory.includes(cat._id) ? "default" : "outline"
                  }
                  onClick={() =>
                    toggle(cat._id, activeCategory, setActiveCategory)
                  }
                  className={
                    activeCategory.includes(cat._id)
                      ? "text-white"
                      : "text-brand"
                  }
                >
                  {cat.nameuz}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Janr
          </p>
          {janrLoading ? (
            <div className="flex gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-md" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {janrData?.data?.map((j) => (
                <Button
                  key={j._id}
                  size="sm"
                  variant={activeJanr.includes(j._id) ? "default" : "outline"}
                  onClick={() => toggle(j._id, activeJanr, setActiveJanr)}
                  className={
                    activeJanr.includes(j._id) ? "text-white" : "text-brand"
                  }
                >
                  {j.nameuz}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Year
          </p>
          <div className="flex flex-wrap gap-2">
            {YEARS.map((y) => (
              <Button
                key={y}
                size="sm"
                variant={activeYear.includes(y) ? "default" : "outline"}
                onClick={() => toggle(y, activeYear, setActiveYear)}
                className={activeYear.includes(y) ? "text-white" : "text-brand"}
              >
                {y}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <CardGroup
        variant="paginated"
        category={activeCategory}
        janr={activeJanr}
        year={activeYear}
      />
    </div>
  );
};

export default CatalogPage;
