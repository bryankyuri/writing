import Image from "next/image";
import Link from "next/link";
import ThemeSwitch from "../Components/ThemeSwitch";

export const Header = () => {
  type menuItem = {
    label: string;
    url: string;
    child: any;
  };
  const menuItems = [
    {
      label: "Home",
      url: "/",
      child: []
      // child: [{ label: "Object Writing", url: "/" }],
    },
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

  return (
    <div className="w-full py-2 shadow-md dark:shadow-[rgba(255,255,255,0.1)]">
      <div className="max-w-[1080px] flex justify-between items-center text-[black] mx-auto">
        <Link href="/" className="text-[16px] font-jakarta-sans">
          <Image
            src="/logo.png"
            alt="logo"
            width={100}
            height={100}
            className="dark:invert"
          />
        </Link>
        <div className="flex items-center">
          <div className="flex mr-4">
            {menuItems.map((item: menuItem) => {
              return (
                <>
                  {item.child ? (
                    <div className="mx-4 dark:text-white">{item.label}</div>
                  ) : (
                    <>
                      <Link
                        key={item.url}
                        href={item.url}
                        className="mx-4 dark:text-white"
                      >
                        {item.label}
                      </Link>
                    </>
                  )}
                </>
              );
            })}
          </div>

          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
};
