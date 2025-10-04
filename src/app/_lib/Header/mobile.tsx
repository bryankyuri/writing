import Image from "next/image";
import Link from "next/link";
import ThemeSwitch from "../Components/ThemeSwitch";
import { GiHamburgerMenu } from "react-icons/gi";
import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "motion/react";
import { FaInstagram } from "react-icons/fa";
import { PiLinktreeLogoBold } from "react-icons/pi";

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
      label: "About",
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
            src="/logo-esc.png"
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
            className="w-screen h-screen bg-[#fceba5] fixed left-0 top-0 z-10 pb-8 pt-2 dark:bg-black overflow-y-auto"
          >
            <div className="flex px-6 items-center justify-between">
              <Image
                src="/logo-esc.png"
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
              {/* {menuItems.map((item: menuItem) => {
                return (
                  <div
                    key={item.url}
                    href={item.url}
                    className=" mb-6 dark:text-white"
                  >
                    {item.label}
                  </div>
                );
              })} */}
              <div className="font-medium text-[32px]">
                About Earhouse Songwriting Club
              </div>
              <div className="mt-8 mb-8 leading-6">
                Earhouse Songwriting Club (ESC) merupakan sebuah komunitas yang
                terbentuk sejak 2014. Diprakasai oleh duo Endah N Rhesa.
                Bertujuan untuk mengumpulkan dan mewadahi orang-orang yang
                tertarik berkreasi, khususnya dalam bidang menulis lagu. <br />
                <br />
                ESC dibentuk agar teman-teman semuua bisa terwadahi untuk saling
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
