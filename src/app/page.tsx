"use client";

import Image from "next/image";
import { IoIosArrowDropdown, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { LuAlarmClock } from "react-icons/lu";
import { AppContext } from "./_lib/Context/appContext";
import { GrInfo } from "react-icons/gr";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline, IoSearch } from "react-icons/io5";
import { format, differenceInDays } from "date-fns";
import { dataKBBI } from "@/app/_lib/model/arrayKBBI";
import { dataEN } from "@/app/_lib/model/arrayEN";
import { GoArrowUpRight } from "react-icons/go";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";

const varFadeInOutFullMobile = {
  hidden: { opacity: 0, transition: { duration: 0.2 } },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 1, transition: { duration: 0.2 } },
};

export default function Home() {
  const START_MINUTES = "10";
  const START_SECOND = "00";
  const START_DURATION = 10;
  const [language, setLanguage] = useState("Indonesian");
  const [type, setType] = useState(1);
  const [currentMinutes, setMinutes] = useState(START_MINUTES);
  const [currentSeconds, setSeconds] = useState(START_SECOND);
  const [isStop, setIsStop] = useState(false);
  const [duration, setDuration] = useState<number>(START_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [wodId, setWodId] = useState("");
  const [wodEn, setWodEn] = useState("");
  const [randomId, setRandomId] = useState("");
  const [randomEn, setRandomEn] = useState("");

  const [showModalInstruction, setShowModalInstruction] = useState(false);

  const { screenWidth } = useContext(AppContext);
  const isDesktop = screenWidth > 1080;

  const shuffle = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const generateRandom = useCallback((array: string[]) => {
    const shuffledArray = shuffle(array);
    return shuffledArray[0];
  }, []);

  const generateNew = () => {
    if (language === "Indonesian") {
      setRandomId(generateRandom(dataKBBI()));
    } else {
      setRandomEn(generateRandom(dataEN()));
    }
  };

  useEffect(() => {
    const firstday = new Date("2024-05-16");
    const today = new Date(format(new Date(), "yyyy-MM-dd"));
    const difDay = differenceInDays(today, firstday);
    const arrayId = dataKBBI();
    const arrayEn = dataEN();
    console.log(difDay)
    setWodId(arrayId[difDay]);
    setWodEn(arrayEn[difDay]);
    setRandomId(generateRandom(arrayId));
    setRandomEn(generateRandom(arrayEn));
    setShowModalInstruction(false);
  }, [generateRandom]);

  const startHandler = () => {
    setDuration(parseInt(START_SECOND, 10) + 60 * parseInt(START_MINUTES, 10));
    // setMinutes(60 * 5);
    // setSeconds(0);
    setIsRunning(true);
  };
  const stopHandler = () => {
    // stop timer
    setIsStop(true);
    setIsRunning(false);
  };
  const resetHandler = () => {
    setMinutes(START_MINUTES);
    setSeconds(START_SECOND);
    setIsRunning(false);
    setIsStop(false);
    setDuration(START_DURATION);
  };

  const resumeHandler = () => {
    let newDuration =
      parseInt(currentMinutes, 10) * 60 + parseInt(currentSeconds, 10);
    setDuration(newDuration);

    setIsRunning(true);
    setIsStop(false);
  };

  useEffect(() => {
    if (isRunning === true) {
      let timer: number = duration;
      var minutes, seconds;
      const interval = setInterval(function () {
        if (--timer <= 0) {
          resetHandler();
        } else {
          const newMinute = (timer / 60).toString();
          const newSecond = (timer % 60).toString();
          minutes = parseInt(newMinute, 10);
          seconds = parseInt(newSecond, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          setMinutes(`${minutes}`);
          setSeconds(`${seconds}`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [duration, isRunning]);

  const wordContent =
    type === 1
      ? language === "Indonesian"
        ? wodId
        : wodEn
      : language === "Indonesian"
      ? randomId
      : randomEn;
  return (
    <div
      className={`${
        isDesktop ? "" : "px-4"
      } flex min-h-screen flex-col items-center justify-start`}
    >
      <div
        className={`${
          isDesktop
            ? "h-[120px] mt-[48px] py-4 px-8 rounded-lg"
            : "mt-[24px] py-2 px-4 rounded-lg"
        } flex items-center w-full shadow-sm max-w-[1080px] bg-[#ffc778] dark:bg-[#000] dark:shadow-[#c2c2c210]`}
      >
        <div
          className={`w-full flex justify-between items-center dark:text-white`}
        >
          <div
            className={`${isDesktop ? "text-[42px]" : "text-[18px]"} font-bold`}
          >
            Object Writing
          </div>
          <div className="flex ">
            <Menu>
              <MenuButton
                className={`py-3 ml-4 leading-none flex font-semibold justify-between items-center ${
                  isDesktop ? "min-w-[234px]" : "min-w-[155px] text-[11px]"
                }`}
              >
                <div className={`${isDesktop ? "w-[110px]" : "w-[70px]"} `}>
                  Language :{" "}
                </div>

                <div
                  className={`flex justify-between items-center ${
                    isDesktop ? "w-[124px]" : "w-[85px]"
                  }`}
                >
                  {language}{" "}
                  <IoIosArrowDropdown
                    strokeWidth={4}
                    className={`ml-2 ${
                      isDesktop ? "text-[18px]" : "text-[14px]"
                    }`}
                  />
                </div>
              </MenuButton>
              <MenuItems
                anchor="bottom"
                className={`bg-[#f7e8d3] dark:bg-[#414141] text-left ${
                  isDesktop ? "w-[200px] p-4" : "w-[160px] text-[11px] py-2"
                } rounded-lg shadow-lg font-medium dark:shadow-[#c2c2c210]`}
              >
                <MenuItem>
                  <button
                    onClick={() => {
                      language !== "English" ? setLanguage("English") : "";
                    }}
                    className="block w-full text-left data-[focus]:bg-[#ffc778] dark:data-[focus]:bg-black py-2 px-3 rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      English{" "}
                      {language === "English" ? (
                        <IoMdCheckmarkCircleOutline />
                      ) : (
                        ""
                      )}
                    </div>
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => {
                      language !== "Indonesian"
                        ? setLanguage("Indonesian")
                        : "";
                    }}
                    className="block w-full text-left data-[focus]:bg-[#ffc778] dark:data-[focus]:bg-black py-2 px-3 rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      Indonesian{" "}
                      {language === "Indonesian" ? (
                        <IoMdCheckmarkCircleOutline />
                      ) : (
                        ""
                      )}
                    </div>
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
            {/* <div className=""></div> */}
          </div>
        </div>
      </div>

      {!isDesktop && (
        <div className="w-full flex justify-end px-2">
          <button
            className="flex items-center mt-6 mb-2 text-[12px] font-bold"
            onClick={() => {
              setShowModalInstruction(true);
            }}
          >
            <div className="w-[24px] h-[24px] mr-2 flex justify-center items-center rounded-full bg-[#ffc778] dark:text-black">
              <GrInfo className="ml-[-1px]" strokeWidth={4} />
            </div>
            <div className="border-b-2 border-black pb-1 dark:border-white">
              Instruction
            </div>
          </button>
        </div>
      )}

      <div
        className={`flex w-full ${
          isDesktop
            ? "h-[435px] max-w-[1080px] items-center mt-[24px] mb-[24px]"
            : "flex-col mt-[12px] mb-[12px]"
        } `}
      >
        <div
          className={`${
            isDesktop ? "mr-4 h-full p-12" : "mb-6 px-4 py-6 text-[11px]"
          } shadow-lg w-full bg-[#fceba5] border-1 dark:bg-[#000]  rounded-lg dark:shadow-[#c2c2c210]`}
        >
          <div className="w-full flex flex-col">
            <div className="w-full flex font-medium">
              <button
                onClick={() => {
                  type !== 1 ? setType(1) : "";
                }}
                className={`mr-4 rounded-full ${
                  type === 1
                    ? "bg-black text-white dark:bg-[#fff] dark:text-black "
                    : "border-2 border-black text-black dark:text-white dark:border-white"
                }  ${isDesktop ? "px-5 py-3" : "p-3"} leading-none`}
              >
                Word of The Day
              </button>
              <button
                onClick={() => {
                  type !== 2 ? setType(2) : "";
                }}
                className={`${
                  type !== 1
                    ? "bg-black text-white dark:bg-[#fff] dark:text-black "
                    : "border-2 border-black text-black dark:text-white dark:border-white"
                } rounded-full  ${
                  isDesktop ? "px-5 py-3" : "p-3"
                }  leading-none`}
              >
                Random Word Generator
              </button>
            </div>
            <div
              className={`${
                isDesktop
                  ? "text-[48px] min-h-[270px]"
                  : "text-[36px] min-h-[250px]"
              }  font-bold  w-full flex items-center justify-center text-center italic`}
            >
              <div className=" underline pb-2 border-black dark:border-white px-1">
                {wordContent}
              </div>
            </div>
            <div className="w-ful flex items center justify-between text-[16px]">
              <div>
                {type === 2 && (
                  <button
                    onClick={() => {
                      generateNew();
                    }}
                    className={`rounded-full py-1 pr-3 pl-2 bg-[#ffc778] dark:text-black font-bold ${
                      isDesktop ? "text-[14px]" : "text-[12px]"
                    } flex items-center`}
                  >
                    <GiPerspectiveDiceSixFacesRandom
                      className={`mr-1 ${
                        isDesktop ? "text-[32px]" : "text-[28px]"
                      }`}
                    />
                    Generate
                  </button>
                )}
              </div>
              <a
                href={
                  language === "Indonesian"
                    ? `https://kbbi.kemdikbud.go.id/entri/${wordContent}`
                    : `https://www.oxfordlearnersdictionaries.com/definition/english/${wordContent}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="italic underline flex items-center"
              >
                <div className="w-[24px] h-[24px] mr-2 flex text-[16px] justify-center items-center rounded-full bg-[#ffc778] dark:text-black">
                  <IoSearch className="ml-[2px]" strokeWidth={4} />
                </div>
                <div
                  className={`font-semibold ${
                    isDesktop ? "text-[14px]" : "text-[11px]"
                  }`}
                >
                  {language === "Indonesian" ? (
                    "Find Dictionary"
                  ) : (
                    <>Find Dictionary</>
                  )}
                </div>
                <GoArrowUpRight className="ml-1" />
              </a>
            </div>
          </div>
        </div>
        <div
          className={`${
            isDesktop ? "w-full max-w-[400px] py-4 px-8 " : "w-full px-4 py-6"
          } shadow-lg  bg-[#faebd7] dark:bg-[#000] rounded-lg h-full flex flex-col justify-center items-center dark:shadow-[#c2c2c210]`}
        >
          <div
            className={`${
              isDesktop ? "text-[32px]" : "text-[24px]"
            } text-center font-bold flex items-center justify-center`}
          >
            <LuAlarmClock className="mr-4" /> Timer
          </div>
          <div
            className={`time w-full flex justify-center ${
              isDesktop ? "mt-[36px]" : "mt-[24px]"
            }`}
          >
            <div
              className={`flex justify-center items-center bg-black dark:bg-[#121212] text-white ${
                isDesktop
                  ? "text-[86px] w-[130px]"
                  : "text-[60px] w-[100px] h-[100px]"
              } text-center rounded-lg`}
            >
              {currentMinutes}
            </div>
            <span
              className={`mx-3 ${isDesktop ? "text-[86px]" : "text-[60px]"}`}
            >
              :
            </span>
            <div
              className={`flex justify-center items-center bg-black dark:bg-[#121212] text-white ${
                isDesktop
                  ? "text-[86px] w-[130px]"
                  : "text-[60px] w-[100px] h-[100px]"
              } text-center rounded-lg`}
            >
              {currentSeconds}
            </div>
          </div>
          <div
            className={`flex ${
              isDesktop ? "mt-[48px]" : "mt-[24px]"
            } w-full justify-center `}
          >
            <div>
              {!isRunning && !isStop && (
                <button
                  onClick={startHandler}
                  className={`border-black dark:border-white border-2 bg-black text-white dark:bg-white dark:text-black ${
                    isDesktop
                      ? "px-4 py-2 w-[100px]"
                      : "text-[14px] px-3 py-1 w-[85px]"
                  } font-semibold rounded-full`}
                >
                  START
                </button>
              )}
              {isRunning && (
                <button
                  onClick={stopHandler}
                  className={`border-black dark:border-white border-2 bg-black text-white dark:bg-white dark:text-black ${
                    isDesktop
                      ? "px-4 py-2 w-[100px]"
                      : "text-[14px] px-3 py-1 w-[85px]"
                  } font-semibold rounded-full`}
                >
                  STOP
                </button>
              )}

              {isStop && (
                <button
                  onClick={resumeHandler}
                  className={`border-black dark:border-white border-2 bg-black text-white dark:bg-white dark:text-black ${
                    isDesktop
                      ? "px-4 py-2 w-[100px]"
                      : "text-[14px] px-3 py-1 w-[85px]"
                  } font-semibold rounded-full`}
                >
                  RESUME
                </button>
              )}
            </div>
            <div className="w-[32px]"></div>
            <button
              onClick={resetHandler}
              disabled={!isRunning && !isStop}
              className={`border-black text-black dark:border-white dark:text-white border-2 ${
                isDesktop
                  ? "px-4 py-2 w-[100px]"
                  : "text-[14px] px-3 py-1 w-[85px]"
              } rounded-full `}
            >
              RESET
            </button>
          </div>
        </div>
      </div>
      {isDesktop && (
        <div className="w-full shadow-sm max-w-[1080px] bg-[#fff0da] dark:bg-[#000] mb-[24px] py-8 px-8 text-[14px] rounded-lg text-justify dark:shadow-[#c2c2c210]">
          <div className="flex mb-6 items-center">
            <div className="w-[32px] h-[32px] mr-2 flex text-[20px] justify-center items-center rounded-full bg-[#ffc778] dark:text-black">
              <GrInfo className="ml-[2px]" strokeWidth={4} />
            </div>
            <div className="border-b-2 border-black pb-1 font-bold dark:border-white">
              Instruction
            </div>
          </div>
          {` Set a timer for 10 minutes and free-write based on the
        prompt until the timer finishes. Use all "seven senses": the five conventional ones
        (sight, touch, hearing, smell, taste), along with organic sense
        (awareness of your body) and kinesthetic sense (awareness of movement
          and your spatial relation to the outside word).`}
          <br />
          <br />
          {`According to the book
          Writing Better Lyrics by Pat Pattison, you should stop writing the
          moment the timer goes off. The best time to do the writing exercise is
          first thing each morning so that your mind is primed to think and
          observe with a writer's perspective throughout the day.`}
        </div>
      )}
      <AnimatePresence>
        {!isDesktop && showModalInstruction && (
          <motion.div
            variants={varFadeInOutFullMobile}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full p-8 h-screen fixed top-0 left-0 bg-[#000000b0] dark:bg-[#19191970] flex justify-center items-center"
          >
            <div className="w-full shadow-lg px-6 py-8 bg-[#fff0da] dark:bg-black dark:text-white rounded-xl text-[12px] leading-[20px] text-justify dark:shadow-[#c2c2c240]">
              <div className="flex w-full items-center justify-between  mb-6">
                <div className="flex">
                  <div className="w-[24px] h-[24px] mr-2 flex justify-center items-center rounded-full bg-[#ffc778] dark:text-black">
                    <GrInfo className="ml-[-1px]" strokeWidth={4} />
                  </div>
                  <div className="border-b-2 border-black pb-1underline pb-1 font-bold dark:border-white">
                    Instruction
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowModalInstruction(false);
                  }}
                  className="text-[32px]"
                >
                  <IoCloseOutline />
                </button>
              </div>

              {` Set a timer for 10 minutes and free-write based on the
        prompt until the timer finishes. Use all "seven senses": the five conventional ones
        (sight, touch, hearing, smell, taste), along with organic sense
        (awareness of your body) and kinesthetic sense (awareness of movement
          and your spatial relation to the outside word).`}
              <br />
              <br />
              {`According to the book
          Writing Better Lyrics by Pat Pattison, you should stop writing the
          moment the timer goes off. The best time to do the writing exercise is
          first thing each morning so that your mind is primed to think and
          observe with a writer's perspective throughout the day.`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
