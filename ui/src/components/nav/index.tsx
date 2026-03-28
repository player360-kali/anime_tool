import { Link, NavLink } from "react-router-dom";
import { SearchInput } from "@/components/nav/search-input";
import { Heart, History, LayoutGrid, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { to: "/catalog", label: "Catalog", icon: LayoutGrid },
  { to: "/liked", label: "Liked", icon: Heart },
  { to: "/history", label: "History", icon: History },
];

const NavLinks = ({ onClick }: { onClick?: () => void }) => (
  <>
    {links.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground",
            isActive ? "text-primary" : "text-muted-foreground",
          )
        }
      >
        <Icon className="size-4" />
        {label}
      </NavLink>
    ))}
  </>
);

const Nav = () => {
  return (
    <nav className="sticky top-0 z-20 w-full border-b border-border/40 bg-background/60 backdrop-blur-md">
      <div className="container relative mx-auto flex justify-between h-14 items-center gap-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 after:hidden">
          <img src="/favicon.svg" alt="logo" className="size-8" />
          <span className="hidden font-bold md:block">Anime tool</span>
        </Link>

        <div className="w-70 md:w-full absolute left-1/2 right-1/2 transform -translate-x-1/2 max-w-sm">
          <SearchInput />
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <NavLinks />
        </div>

        <div className="flex lg:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md hover:bg-muted transition-colors">
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader className="mb-6">
                <SheetTitle className="flex items-center gap-2">
                  <img src="/favicon.svg" alt="logo" className="size-6" />
                  Anime tool
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1">
                {links.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )
                    }
                  >
                    <Icon className="size-4" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
