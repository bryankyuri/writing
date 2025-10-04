"use-client";

import Image from "next/image";
import Link from "next/link";
import ThemeSwitch from "../Components/ThemeSwitch";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { PiLinktreeLogoBold } from "react-icons/pi";

const varFadeInOutFullMobile = {
  hidden: { opacity: 0, transition: { duration: 0.2 } },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 1, transition: { duration: 0.2 } },
};

export const Header = () => {
  type menuItem = {
    label: string;
    url: string;
  };
  const menuItems = [
    {
      label: "About",
      url: "/",
      child: null,
    },
    {
      label: "Support",
      url: "/",
      child: null,
    },
  ];

  const [showModalAbout, setShowModalAbout] = useState(false);

  return (
    <div className="w-full py-2 shadow-md dark:shadow-[rgba(255,255,255,0.1)]">
      <div className="max-w-[1080px] flex justify-between items-center text-[black] mx-auto">
        <Link href="/" className="text-[16px] font-jakarta-sans">
          <Image
            src="/logo-esc.png"
            alt="logo"
            width={100}
            height={100}
            className="dark:invert"
          />
        </Link>
        <div className="flex items-center">
          <div className="flex mr-4">
            {/* {menuItems.map((item: menuItem) => {
              return (
                <>
                  <Link
                    key={item.url}
                    href={item.url}
                    className="mx-4 dark:text-white"
                  >
                    {item.label}
                  </Link>
                </>
              );
            })} */}
            <button
              className="mx-4 dark:text-white border-b-2 border-black dark:border-white"
              onClick={() => setShowModalAbout(true)}
            >
              About
            </button>
          </div>

          <ThemeSwitch />
        </div>
      </div>
      <AnimatePresence>
        {showModalAbout && (
          <motion.div
            variants={varFadeInOutFullMobile}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full p-8 h-screen fixed top-0 left-0 bg-[#000000b0] dark:bg-[#19191970] flex justify-center items-center"
          >
            <div className="w-full max-w-[500px] shadow-lg px-6 py-8 bg-[#fff0da] dark:bg-black dark:text-white rounded-xl text-left dark:shadow-[#c2c2c240]">
              <div className="flex w-full items-center justify-between  mb-6">
                <Image
                  src="/logo-esc.png"
                  alt="logo"
                  width={100}
                  height={100}
                  className="dark:invert"
                />
                <button
                  onClick={() => {
                    setShowModalAbout(false);
                  }}
                  className="text-[32px]"
                >
                  <IoCloseOutline />
                </button>
              </div>
              <div className="font-medium text-[32px] leading-none">
                About Earhouse Songwriting Club
              </div>
              <div className="mt-8 mb-8 leading-6">
                Earhouse Songwriting Club (ESC) merupakan sebuah komunitas yang
                terbentuk sejak 2014. Diprakasai oleh duo Endah N Rhesa.
                Bertujuan untuk mengumpulkan dan mewadahi orang-orang yang
                tertarik berkreasi, khususnya dalam bidang menulis lagu. <br/><br/>ESC
                dibentuk agar teman-teman semuua bisa terwadahi untuk saling
                bertukar pikiran dan saling belajar satu sama lain.
              </div>

              <div className="flex flex-col">
                <Link
                  href="https://www.instagram.com/earhousesongwritingclub/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center my-2"
                >
                  <div className="mr-2 rounded-full w-[24px] h-[24px] bg-black dark:bg-white dark:text-black flex justify-center items-center text-white">
                    <FaInstagram />
                  </div>{" "}
                  <div className="underline">earhousesongwritingclub</div>
                </Link>
                <Link
                  href="https://linktr.ee/earhouse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center my-2"
                >
                  <div className="mr-2 rounded-full w-[24px] h-[24px] bg-black dark:bg-white dark:text-black flex justify-center items-center text-white">
                    <PiLinktreeLogoBold />
                  </div>
                  <div className="underline">linktr.ee/earhouse</div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
