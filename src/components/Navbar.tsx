"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MoonIcon, SunIcon } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import githublogo from "@/assets/icons/githublogo.png";
import instagramlogo from "@/assets/icons/instagramlogo.png";
import linkedinlogo from "@/assets/icons/linkedinlogo.png";
import maillogo from "@/assets/icons/maillogo.png";
import rmlogo from "@/assets/rmlogov2.png";
import IconLink from "@/components/IconLink";
import Image from "next/image";

// Theme Toggle Button component
function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="button"
      className="p-2 outline rounded-xl flex"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const items = ["Home", "Projects", "Contacts"];
  const [open, setOpen] = useState(false);

  const linkIcons = [
    {
      href: "https://www.instagram.com/rin.m04/?theme=dark",
      imgSrc: instagramlogo,
      alt: "instagram",
    },
    {
      href: "mailto:phurinmeng.suo@gmail.com",
      imgSrc: maillogo,
      alt: "mail",
    },

    {
      href: "https://www.github.com/rinmeng/v2-rinmeng",
      imgSrc: githublogo,
      alt: "github",
    },
    {
      href: "https://www.linkedin.com/in/rin-m-b28910234/",
      imgSrc: linkedinlogo,
      alt: "linkedin",
    },
  ];

  return (
    <div>
      <div className="fixed left-1/2 top-0 z-50 mt-4 md:mt-7 w-11/12 max-w-7xl -translate-x-1/2">
        <div className="w-full rounded-full border bg-background/80 backdrop-blur-md shadow-sm">
          <div className="w-full flex justify-between items-center py-4 px-2 lg:px-4">
            {/* Logo */}
            <Link href="/">
              <Image
                src={rmlogo}
                alt="KDT Logo"
                className="w-16 h-auto dark:invert-0 not-dark:invert-100 ml-4"
                width={64}
                height={64}
                priority
              />
            </Link>

            <div>
              {/* Navigation Links - Desktop */}
              <div className="hidden lg:flex items-center gap-2">
                <div className="flex items-center gap-2 lg:gap-4">
                  <ThemeToggle />
                  {items.map((item) => {
                    const path = item.toLowerCase();
                    const itemPath = path === "home" ? "" : path;
                    const isActive =
                      pathname === `/${itemPath}` ||
                      (pathname === "/" && item === "Home");

                    return (
                      <Button
                        key={item}
                        asChild
                        variant={isActive ? "default" : "outline"}
                        className="text-base font-medium"
                      >
                        <Link href={`/${itemPath}`}>{item}</Link>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden h-auto flex items-center gap-4">
                <ThemeToggle />
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <div role="button" className="p-2 outline rounded-xl">
                      <Menu />
                    </div>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader className="flex items-center">
                      <SheetTitle className="mt-10">
                        <Image
                          src={rmlogo}
                          alt="RM Logo"
                          className="w-28 h-auto mx-auto dark:invert-0 not-dark:invert-100"
                          width={112}
                          height={112}
                          priority
                        />
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col items-center justify-center space-y-4 text-xl w-1/2 mx-auto">
                      <div className="flex items-center justify-center">
                        <ThemeToggle />
                      </div>
                      {items.map((item) => {
                        const path = item.toLowerCase();
                        const itemPath = path === "home" ? "" : path;
                        const isActive =
                          pathname === `/${itemPath}` ||
                          (pathname === "/" && item === "Home");

                        return (
                          <Button
                            key={item}
                            asChild
                            variant={isActive ? "default" : "ghost"}
                            onClick={() => setOpen(false)}
                            className="w-full justify-center text-lg"
                          >
                            <Link href={`/${itemPath}`}>{item}</Link>
                          </Button>
                        );
                      })}
                      <div className="flex flex-col items-center gap-4"></div>
                      <div className="w-full flex justify-center">
                        <IconLink links={linkIcons} />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="mr-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
