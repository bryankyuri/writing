import Image from "next/image";
import Link from "next/link";
import ThemeSwitch from "../Components/ThemeSwitch";
import { GiHamburgerMenu } from "react-icons/gi";
import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

const varFadeInOutMobile = {
  hidden: { opacity: 0, y: "300px" },
  visible: { opacity: 1, y: "0", transition: { duration: 0.2 } },
  exit: { opacity: 1, y: "100%", transition: { duration: 0.2 } },
};

export const HeaderMobile = () => {
  type menuItem = {
    label: string;
    url: string;
  };

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const menuItems = [
    {
      label: "Home",
      url: "/",
    },
    {
      label: "About",
      url: "/",
    },
    {
      label: "Support",
      url: "/",
    },
  ];

  useEffect(() => {
    setShowMenu(false);
  }, []);

  return (
    <div className="w-full py-2 shadow-md dark:shadow-[rgba(255,255,255,0.1)] px-6">
      <div className="max-w-[1080px] flex justify-between items-center text-[black] mx-auto">
        <button
          className="dark:text-white text-[18px]"
          onClick={() => setShowMenu(true)}
        >
          <GiHamburgerMenu />
        </button>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="logo"
            width={60}
            height={60}
            className="dark:invert"
          />
        </Link>

        <ThemeSwitch />
      </div>
      <AnimatePresence>
        {showMenu && (
          <motion.div
            variants={varFadeInOutMobile}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-screen h-screen bg-[#fceba5] fixed left-0 top-0 z-10 pb-8 pt-2 dark:bg-black"
          >
            <div className="flex px-6 items-center justify-between">
              <Image
                src="/logo.png"
                alt="logo"
                width={100}
                height={100}
                className="dark:invert"
              />
              <button
                className="dark:text-white text-[48px]"
                onClick={() => setShowMenu(false)}
              >
                <IoCloseOutline />
              </button>
            </div>
            <div className="flex flex-col my-8 px-6">
              {menuItems.map((item: menuItem) => {
                return (
                  <Link
                    key={item.url}
                    href={item.url}
                    className=" mb-6 dark:text-white"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
