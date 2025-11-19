import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowBigRightIcon, ArrowRight } from "lucide-react";
import React from "react";
import Link from "next/link";

// Import all logos
import ViteLogo from "@/assets/logos/vite-svgrepo-com.svg";
import ReactLogo from "@/assets/logos/react-svgrepo-com.svg";
import TailwindCSSLogo from "@/assets/logos/tailwindcss-icon-svgrepo-com.svg";
import ExpressLogo from "@/assets/logos/express-svgrepo-com.svg";
import ShadCNUILogo from "@/assets/logos/shadcnui-white.svg";
import DockerLogo from "@/assets/logos/docker-svgrepo-com.svg";
import NodeJSLogo from "@/assets/logos/node-js-svgrepo-com.svg";
import HTML5Logo from "@/assets/logos/html-5-svgrepo-com.svg";
import CSS3Logo from "@/assets/logos/css-svgrepo-com.svg";
import GitLogo from "@/assets/logos/git-svgrepo-com.svg";
import PostgreSQLLogo from "@/assets/logos/postgresql-svgrepo-com.svg";
import JavaScriptLogo from "@/assets/logos/javascript-svgrepo-com.svg";
import TypeScriptLogo from "@/assets/logos/typescript-svgrepo-com.svg";
import VercelLogo from "@/assets/logos/vercel-fill-white.svg";
import SupabaseLogo from "@/assets/logos/supabase-seeklogo.svg";
import JavaLogo from "@/assets/logos/java-svgrepo-com.svg";
import AndroidStudioLogo from "@/assets/logos/androidstudio-svgrepo-com.svg";
import FirebaseLogo from "@/assets/logos/firebase-svgrepo-com.svg";
// import PythonLogo from "@/assets/logos/python-svgrepo-com.svg";
import GitHubLogo from "@/assets/logos/github-white.svg";
import MySQLLogo from "@/assets/logos/mysql-svgrepo-com.svg";
import CSharpLogo from "@/assets/logos/csharp-svgrepo-com.svg";
import UnityLogo from "@/assets/logos/unity-svgrepo-com.svg";
import NextJSLogo from "@/assets/logos/next-js-svgrepo-com.svg";

// import images
import KDT from "@/assets/projects/KDT.png";
import RM from "@/assets/projects/RM.png";
import PC8TH from "@/assets/projects/PC8TH.png";
import CTMS from "@/assets/projects/CTMS.png";
import HIKELOWNA from "@/assets/projects/HIKELOWNA.png";
import PHIL331 from "@/assets/projects/PHIL331.png";
import COSC416 from "@/assets/projects/COSC416.png";
import SEAC from "@/assets/projects/SEAC.png";
import NSSS from "@/assets/projects/NSSS.png";

import Image, { StaticImageData } from "next/image";

interface ProjectFragmentProps {
  title: string;
  stacks?: string[];
  imgSrc: StaticImageData;
  description: string;
  link?: string;
  github_link?: string;
}

const projects = [
  {
    title: "KPop Dance Team's Website",

    imgSrc: KDT,
    description: `I oversaw the Digital Producer role where I was in charge of their website development, maintenance. 
      I also developed a custom CMS for them to manage their website content such as links, positions, and sponsors.
      Multiple iterations of the website were created, now it is in its v4 stage, built with NextJS and shadcn/ui with optimized SEO and performance.`,
    link: "https://kdtsuo.vercel.app",
    github_link: "https://github.com/kdtsuo/v4",
    stacks: [
      HTML5Logo,
      CSS3Logo,
      JavaScriptLogo,
      TypeScriptLogo,
      NodeJSLogo,
      NextJSLogo,
      ReactLogo,
      TypeScriptLogo,
      TailwindCSSLogo,
      ShadCNUILogo,
      VercelLogo,
      SupabaseLogo,
      PostgreSQLLogo,
    ],
  },
  {
    title: "next-shadcn-supabase-starter",
    imgSrc: NSSS,
    description: `A comprehensive starter template with everything you need to build modern web applications. 
    Features enterprise-grade security with Supabase Auth, email verification, protected routes, and middleware proxy. 
    Built with cutting-edge technologies including Next.js 15 App Router, TypeScript, Tailwind CSS, and Shadcn UI. 
    Includes scalable architecture with API versioning, server components, and modular design for optimal developer experience.`,
    link: "https://template.rinm.dev",
    github_link: "https://github.com/rinmeng/next-shadcn-supabase-starter",
    stacks: [
      NextJSLogo,
      ReactLogo,
      TypeScriptLogo,
      TailwindCSSLogo,
      ShadCNUILogo,
      SupabaseLogo,
      PostgreSQLLogo,
      VercelLogo,
      NodeJSLogo,
      HTML5Logo,
      CSS3Logo,
      GitLogo,
      GitHubLogo,
    ],
  },
  {
    title: "SEACSUO's Website",

    imgSrc: SEAC,
    description: `Developed a now, production-ready website for the South East Asian Club (SEAC) 
    that highlights the club’s mission, events, and merchandise. As the lead Web Developer, 
    I designed and built a custom CMS to allow executives to easily manage and update content.`,
    link: "https://seacsuo.vercel.app",
    github_link: "https://github.com/seacsuo/v2",
    stacks: [
      HTML5Logo,
      CSS3Logo,
      TypeScriptLogo,
      NodeJSLogo,
      NextJSLogo,
      ReactLogo,
      TypeScriptLogo,
      TailwindCSSLogo,
      ShadCNUILogo,
      VercelLogo,
      SupabaseLogo,
      PostgreSQLLogo,
    ],
  },
  {
    title: "Collaborative Task Management System (CTMS)",
    imgSrc: CTMS,
    stacks: [
      HTML5Logo,
      CSS3Logo,
      ViteLogo,
      ReactLogo,
      JavaScriptLogo,
      NodeJSLogo,
      ExpressLogo,
      PostgreSQLLogo,
      GitLogo,
      GitHubLogo,
      DockerLogo,
    ],
    description: `
    CTMS is role-based task management system that I developed for a course project 
    with my group members. I was the assumed scrum master and I was also in charge of 
    developing both the frontend and backend of the system.
    This was my first full exposure to full-stack development and RESTful APIs.
    `,
    github_link: "https://github.com/rinmeng/NodeNinjas",
  },
  {
    title: "3 Big Booms",
    imgSrc: COSC416,
    stacks: [UnityLogo, CSharpLogo],
    description: `This is a game development project in Unity that 
    I developed with my team members for a course project. It was a Retro Game Jam with a 
    "twist" theme, where we transformed a Bomberman game into a 2D platformer game.
    I was in charge of the game design and development, where I designed the game's mechanics,
    such as power-ups, enemy AI, and weapons.`,
    link: "https://stewdio.itch.io/3-big-booms",
    github_link: "https://github.com/eagno/cosc416-Project",
  },
  {
    title: "PHIL331 Project DCE Surveys",
    imgSrc: PHIL331,
    stacks: [
      HTML5Logo,
      CSS3Logo,
      JavaScriptLogo,
      NodeJSLogo,
      ViteLogo,
      ReactLogo,
      TailwindCSSLogo,
      ShadCNUILogo,
      VercelLogo,
      SupabaseLogo,
      PostgreSQLLogo,
    ],
    description: `This PHIL331 is a project website that I developed for my course. 
    I am in charge of the website development, making sure that the website
    is functional and intuitive so that the users can easily take the surveys, and 
    the data is collected properly. The main skills gained here are mainly using graphs
    from shadcn/ui and Supabase's Auth Policies configuration.`,
    link: "https://phil331.vercel.app",
    github_link: "https://github.com/rinmeng/phil331",
  },

  {
    title: "Personal Website",
    imgSrc: RM,
    stacks: [
      HTML5Logo,
      CSS3Logo,
      JavaScriptLogo,
      TypeScriptLogo,
      NodeJSLogo,
      ViteLogo,
      NextJSLogo,
      ReactLogo,
      TypeScriptLogo,
      ShadCNUILogo,
      TailwindCSSLogo,
      VercelLogo,
    ],
    description: `There are many stages to my personal website development. This website follows similar iterations to KPop Dance Team's website, 
    where I went from a simple HTML/CSS website, to NodeJS TailwindCSS, to ReactJS + TailwindCSS, to Vite + ReactTS + shadcn/ui,
    and now to NextJS + ReactTS + shadcn/ui.`,
    link: "https://rinmeng.vercel.app",
    github_link: "https://github.com/rinmeng/v4-rinmeng",
  },

  {
    title: "PC8TH",
    imgSrc: PC8TH,
    stacks: [
      HTML5Logo,
      CSS3Logo,
      TailwindCSSLogo,
      NodeJSLogo,
      JavaScriptLogo,
      ExpressLogo,
      MySQLLogo,
      DockerLogo,
    ],
    description: `PC8th is an PC parts e-commerce website that me and my partner developed for a course project. 
    It is my first exposure to backend development and I learned an immense amount of how backend system works. 
    This project was honorably mentioned by the professor of the course.`,
    github_link: "https://github.com/rinmeng/pc8th",
  },
  {
    title: "hikelowna",
    imgSrc: HIKELOWNA,
    stacks: [JavaLogo, AndroidStudioLogo, FirebaseLogo],
    description: `hikelowna is a hiking trail management system that I developed for a course project with my group members. 
    This was my first exposure to Android development and I learned a lot about how Android apps are developed 
    and how they interact with the backend.`,
    github_link: "https://github.com/rinmeng/hikelowna",
  },
];

const ProjectFragment: React.FC<ProjectFragmentProps> = ({
  title,
  imgSrc,
  description,
  link,
  stacks,
  github_link,
}) => {
  return (
    <Card className='grid grid-cols-1 xl:grid-cols-3 gap-0 '>
      <Card className='border-l-0 border-none rounded-none shadow-none py-2'>
        <CardContent className='p-2 md:p-6 '>
          <AspectRatio ratio={16 / 9}>
            <Image
              className='h-full w-full object-cover'
              src={imgSrc}
              alt={title}
              width={1920}
              height={1080}
              style={{ objectFit: "cover" }}
            />
          </AspectRatio>
        </CardContent>
      </Card>

      <Card className='w-full xl:col-span-2 border-none shadow-none py-2'>
        <CardHeader>
          <CardTitle className='text-3xl md:text-4xl font-extralight text-center xl:text-left'>
            {title}
          </CardTitle>
          <CardDescription className='flex flex-col space-y-2'>
            <div className='text-center xl:text-left'>Skills Gained & Used</div>
            {stacks && (
              <div className='flex items-center justify-center xl:justify-start flex-wrap gap-2 not-dark:invert-100 dark:invert-0'>
                {stacks.map((stack, index) => (
                  <Image
                    key={`${stack}-${index}`}
                    className='w-6 h-auto'
                    src={stack}
                    alt={stack}
                    width={24}
                    height={24}
                  />
                ))}
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-base md:text-lg'>{description}</div>
        </CardContent>
        <CardFooter className='flex flex-wrap justify-end gap-4'>
          {github_link && (
            <Button
              variant={"secondary"}
              size='lg'
              className='w-full md:w-auto'
              onClick={() => window.open(github_link)}
            >
              View Repository
              <ArrowBigRightIcon />
            </Button>
          )}
          {link && (
            <Button
              size='lg'
              className='w-full md:w-auto'
              onClick={() => window.open(link)}
            >
              View Project
              <ArrowBigRightIcon />
            </Button>
          )}
        </CardFooter>
      </Card>
    </Card>
  );
};

const ProjectsFragment: React.FC<{ limitDisplay?: boolean }> = ({
  limitDisplay = false,
}) => {
  // If limitDisplay is true, only show the first 3 projects
  const displayedProjects = limitDisplay ? projects.slice(0, 3) : projects;

  return (
    <div className='container mx-auto px-0 '>
      <div className='flex w-full flex-col items-center justify-start h-auto'>
        <Card className='w-full border-t-0 border-x-0 border-b-0 rounded-none shadow-none'>
          <CardHeader>
            <CardTitle className='text-4xl md:text-6xl font-extralight'>
              Projects
            </CardTitle>
            <CardDescription className='text-sm md:text-base'>
              Here are some of the projects I&apos;ve worked on.
            </CardDescription>
          </CardHeader>
          <div
            className='container border-t-0 border-x-0
           border-b rounded-none w-full border-dashed'
          ></div>
          <CardContent className='space-y-6 md:space-y-4 '>
            {displayedProjects.map((project) => (
              <ProjectFragment key={project.title} {...project} />
            ))}

            {limitDisplay && (
              <div className='flex justify-center pt-6'>
                <Link href='/projects'>
                  <Button size='lg' variant='outline' className='group'>
                    See More
                    <ArrowRight />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectsFragment;
