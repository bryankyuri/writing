"use client";

import { useContext } from "react";
import { AppContext } from "./_lib/Context/appContext";

export default function Home() {


  const { screenWidth } = useContext(AppContext);
  const isDesktop = screenWidth > 1080;

  return (
    <div
      className={`${
        isDesktop ? "" : "px-4"
      } my-8 flex min-h-screen flex-col items-center justify-start`}
    >
      404 Not Found
    </div>
  );
}
