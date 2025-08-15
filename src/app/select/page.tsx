'use client';

import { Header } from "@/components/common/Header";
import { SelectionForm } from "./_components/SelectionForm";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import { Footer } from "@/components/common/Footer";
import { motion } from "framer-motion";
import { AnimatedDiv } from "@/components/common/AnimatedDiv";

interface DirectoryStructure {
  [key: string]: any;
}

async function getDirectoryStructure(): Promise<DirectoryStructure> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/universities`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch universities data");
  }

  return res.json();
}

export default async function SelectPage() {
  let directoryStructure: DirectoryStructure | null = null;
  let error: string | null = null;

  try {
    directoryStructure = await getDirectoryStructure();
  } catch (e: any) {
    error = e.message || "An unexpected error occurred while fetching data.";
  }

  if (error) {
    return <ErrorDisplay errorMessage={error} />;
  }

  if (!directoryStructure || Object.keys(directoryStructure).length === 0) {
    return (
      <>
        <Header />
        <main className="flex flex-1 justify-center items-center px-4 py-16 sm:py-20 lg:py-28 bg-background">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="text-3xl font-bold mb-4">No Syllabus Data Found</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Please ensure your <code>'universities'</code> folder and its subdirectories
              contain valid syllabus data.
            </p>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background">
        <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
          <AnimatedDiv>
            <div className="max-w-4xl mx-auto w-full">
              <div className="mb-10 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">
                  Select Your Course
                </h2>
                <p className="mt-2 text-muted-foreground text-sm sm:text-base">
                  Browse through your university’s available syllabus modules.
                </p>
              </div>
              <div className="bg-card shadow-lg rounded-lg p-6 sm:p-8 border border-border">
                <SelectionForm directoryStructure={directoryStructure} />
              </div>
            </div>
          </AnimatedDiv>
        </section>
      </main>
      <Footer />
    </div>
  );
}