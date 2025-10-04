"use client";
import { ThemeProvider } from "next-themes";
import { Header } from "./_lib/Header";
import { useContext } from "react";
import { AppContext } from "./_lib/Context/appContext";
import Image from "next/image";
import { HeaderMobile } from "./_lib/Header/mobile";
import { motion, AnimatePresence } from "motion/react";

const varFadeInOut = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
  exit: {
    opacity: 0,
    y: "100%",
    transition: { duration: 0.4, transitionTimingFunction: "ease-in-out" },
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  const { screenWidth } = useContext(AppContext);
  const deviceType =
    screenWidth > 0 ? (screenWidth > 1080 ? "Desktop" : "Mobile") : "Loading";
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AnimatePresence>
        {deviceType === "Loading" ? (
          <motion.div
            className="w-full h-screen flex flex-col justify-center items-center"
            variants={varFadeInOut}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Image
              src={"/logo-esc.png"}
              alt=""
              width={150}
              height={150}
              className="mb-4 dark:invert"
              priority
            />
            <span className="text-[16px]">Loading...</span>
          </motion.div>
        ) : deviceType === "Desktop" ? (
          <>
            <Header />
            <main>{children}</main>
          </>
        ) : (
          <>
            <HeaderMobile />
            <main>{children}</main>
          </>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
}
