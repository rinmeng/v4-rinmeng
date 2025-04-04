"use client";
import Footer from "@/components/Footer";
import ProjectsFragment from "@/components/ProjectsFragment";
import { Card, CardContent } from "@/components/ui/card";

export default function Projects() {
  return (
    <div className="animate-fade-in">
      <div className=" container py-16 mx-auto rounded-none shadow-none border-y-0 border-x"></div>
      <Card className="relative animate-fade animate-duration-500 py-0 border-none shadow-none gap-0">
        <div className="border-b w-full border-dashed"></div>
        <CardContent className="container mx-auto px-0 border-y-0 border-x rounded-none">
          <ProjectsFragment limitDisplay={false} />
        </CardContent>
      </Card>

      <Footer />
    </div>
  );
}
