"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import cal from "@/assets/cal.jpeg";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowBigRightIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Tools from "@/components/Tools";
import Footer from "@/components/Footer";
import ProjectsFragment from "@/components/ProjectsFragment";

// Animation configuration - adjust these to control timing
const CONFIG = {
  displayDuration: 2500, // How long each phrase stays visible (ms)
  wordStaggerDelay: 0.1, // Delay between words starting to animate (seconds)
  maxStaggerDelay: 0.7, // Maximum total stagger time to ensure all words animate properly (seconds)
};

const textArray: string[] = [
  "Video Editing",
  "Developing Beautiful Websites",
  "UI/UX Designs",
  "Web Development",
  "Learning New Frameworks",
  "Analyzing Data",
  // You can add more items here and they'll work automatically
];

const AnimatedText: React.FC = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
      setKey((prev) => prev + 1);
    }, CONFIG.displayDuration);

    return () => clearInterval(interval);
  }, []);

  const currentText = textArray[currentTextIndex];
  const words = currentText.split(" ");

  // Calculate appropriate stagger delay based on word count
  // This ensures that all words will begin animating within the maxStaggerDelay time
  const wordCount = words.length;
  const actualStaggerDelay = Math.min(
    CONFIG.wordStaggerDelay,
    CONFIG.maxStaggerDelay / Math.max(1, wordCount - 1)
  );

  return (
    <div className="font-extralight min-w-full px-0 md:px-6 h-24 flex items-center overflow-hidden">
      <div className="relative w-full text-center" key={key}>
        {words.map((word, wordIndex) => (
          <span
            key={wordIndex}
            className={`inline-block animate-swipe-in-out text-center`}
            style={{
              animationDelay: `${wordIndex * actualStaggerDelay}s`,
              opacity: 0,
              position: "relative",
            }}
          >
            {word}&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div className="overflow-x-hidden animate-fade-in">
      <div
        id="landing"
        className="w-screen h-screen relative overflow-hidden animate-fade animate-duration-500"
      >
        <Image
          className="absolute inset-0 object-cover w-full h-full brightness-50"
          src={cal}
          width={1920}
          height={1080}
          alt="cover"
          objectFit="cover"
        />

        <div
          className="relative flex justify-center lg:justify-start items-center 
        h-full w-full container mx-auto"
        >
          <Card
            className="flex flex-col justify-center backdrop-blur-md gap-4 md:gap-6
          bg-white/30 dark:bg-black/30 border border-white/20
           dark:border-white/10 shadow-lg mx-4"
          >
            <CardContent>
              <CardHeader>
                <div>
                  <div className="text-xl md:text-3xl font-bold">
                    hi! i&apos;m <span>rin</span> and i like{" "}
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl xl:text-6xl font-bold text-center w-full">
                    <AnimatedText />
                  </div>
                </div>
              </CardHeader>
              <div className="text-lg">
                hey there. i&apos;m a ubco student majoring in cs and ds.
                i&apos;m passionate about building websites with modern
                technologies.
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Link href="/projects">
                <Button size="lg" className="w-full">
                  View Projects
                  <ArrowBigRightIcon />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="container mx-auto border-x w-full border-dashed py-10"></div>
      <Separator />

      <div className="h-auto w-screen">
        <Card className="relative gap-0 border-none shadow-none py-0">
          <CardHeader className="gap-0 px-0 w-full">
            <CardTitle
              className="absolute w-screen mx-0 text-4xl md:text-6xl px-0 text-center font-extralight
              bg-gradient-to-b from-background from-10% via-background/50 via-80% to-transparent to-100% py-20"
            >
              Powering my creativity
              <br />
              with modern tools
            </CardTitle>
            <CardContent className="px-0 flex justify-center w-full overflow-hidden">
              <Tools />
            </CardContent>
            <CardFooter
              className="absolute flex justify-center bottom-0 w-screen mx-0 text-center font-extralight 
            bg-gradient-to-t from-background from-30% via-background/50 via-80% to-transparent to-100% py-20 not-dark:text-accent-foreground/10 dark:text-accent"
            >
              (best viewed on desktop)
            </CardFooter>
          </CardHeader>
        </Card>
      </div>

      <Separator />

      <div className="container mx-auto border-x w-full border-dashed py-10"></div>
      <div className="border-b w-full border-dashed"></div>
      <Card className="container mx-auto rounded-none border-y-0 shadow-none">
        <ProjectsFragment />
      </Card>

      <Footer />
    </div>
  );
};

export default Home;
