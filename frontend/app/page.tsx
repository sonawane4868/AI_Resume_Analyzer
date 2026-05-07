
import { Metadata } from "next";
import HomeWrapper from "./HomePage/HomeWrapper";

export const metadata: Metadata = {
  title: "AI Resume Analyzer | Smart Hiring Platform",

  description:
    "Analyze resumes using AI-powered semantic matching and ATS scoring.",

  // openGraph: {
  //   title: "AI Resume Analyzer",
  //   description:
  //     "AI-powered resume analysis platform.",
  //   images: ["/og-home.png"],
  // },
};

export default function Home() {
 

  return (
    <>
    <HomeWrapper/>    
    </>
  );
}
