import { Link, NavLink } from "react-router-dom";
import { SearchInput } from "@/components/nav/search-input";
import { TextAlignJustify } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createElement } from "react";
import { TypographyH2, TypographyP } from "@/components/ui/typography";

const Nav = () => {
  const navLinks = (
    <>
      <NavLink to={"/"}>Home</NavLink>
      <NavLink to={"/category"}>Category</NavLink>
      <NavLink to={"/search"}>Search</NavLink>
      <NavLink to={"/like"}>Like</NavLink>
    </>
  );
  return (
    <nav className="w-full backdrop-blur-xs bg-brand sticky top-0 z-20 h-15">
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-accent to-primary"></div>
      <div className="container h-full flex justify-between gap-5 items-center py-1.5 px-5 md:px-0 mx-auto">
        <Link to={"/"} className="h-12 flex gap-5">
          <img
            className="w-12 h-full object-cover flex items-center"
            src="/favicon.svg"
            alt="icon"
          />
          <TypographyH2 className="hidden md:block select-none border-none">
            Player360
          </TypographyH2>
        </Link>
        <div className="w-full md:w-120 flex">
          <SearchInput />
        </div>
        {createElement("div", {
          children: navLinks,
          className: "hidden lg:flex font-bold gap-5",
        })}

        <Sheet>
          <SheetTrigger asChild>
            <TextAlignJustify className="block lg:hidden cursor-pointer" />
          </SheetTrigger>

          <SheetContent className="flex flex-col items-start">
            <SheetHeader>
              <SheetTitle>
                <TypographyP className="text-xl font-bold">Menu</TypographyP>
              </SheetTitle>
              <SheetDescription>Menu's modal</SheetDescription>
            </SheetHeader>
            {createElement("div", {
              children: navLinks,
              className:
                "flex flex-col items-center mt-[25%] mx-auto font-bold gap-5",
            })}
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
export default Nav;
