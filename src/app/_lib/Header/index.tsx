import Image from "next/image";
import Link from "next/link";
import ThemeSwitch from "../Components/ThemeSwitch";

export const Header = () => {
  type menuItem = {
    label: string;
    url: string;
  };
  const menuItems = [
    // {
    //   label: "Home",
    //   url: "/",
    // },
    {
      label: "About",
      url: "/about",
    },
    // {
    //   label: "Pricing",
    //   url: "/pricing",
    // },
    {
      label: "Support",
      url: "/support",
    },
  ];
  return (
    <div className="w-full py-2 shadow-md dark:shadow-[rgba(255,255,255,0.1)]">
      <div className="max-w-[1080px] flex justify-between items-center text-[black] mx-auto">
        <div className="text-[16px] font-jakarta-sans">
          <Image src="/logo.png" alt="logo" width={100} height={100} className="dark:invert"/>
        </div>
        <div className="flex items-center">
          <div className="flex mr-4">
            {menuItems.map((item: menuItem) => {
              return (
                <Link key={item.url} href={item.url} className="mx-4 dark:text-white">
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="flex bg-[#121212] dark:bg-[#ffc778] rounded-[25px] py-[8px] px-[12px] items-center">
            <div><ThemeSwitch/></div>
          </div>
        </div>
      </div>
    </div>
  );
};
