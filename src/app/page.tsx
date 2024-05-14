"use client";

import Image from "next/image";
import { IoIosArrowDropdown, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useEffect, useState } from "react";
import { LuAlarmClock } from "react-icons/lu";

export default function Home() {
  const START_MINUTES = "10";
  const START_SECOND = "00";
  const START_DURATION = 10;
  const [language, setLanguage] = useState("English");
  const [type, setType] = useState(1);
  const [currentMinutes, setMinutes] = useState(START_MINUTES);
  const [currentSeconds, setSeconds] = useState(START_SECOND);
  const [isStop, setIsStop] = useState(false);
  const [duration, setDuration] = useState<number>(START_DURATION);
  const [isRunning, setIsRunning] = useState(false);
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
  return (
    <div className="flex min-h-screen flex-col items-center justify-start">
      <div className="h-[120px] flex items-center w-full shadow-sm max-w-[1080px] bg-[#ffc778] dark:bg-[#000] mt-[48px] py-4 px-8 rounded-lg">
        <div className="w-full flex justify-between items-center dark:text-white">
          <div className="text-[42px] font-bold">Object Writing</div>
          <div className="flex">
            <Menu>
              <MenuButton className="py-3 ml-4  leading-none flex font-semibold min-w-[211px] justify-between">
                Language : {language}{" "}
                <IoIosArrowDropdown
                  size={18}
                  strokeWidth={4}
                  className="ml-2"
                />
              </MenuButton>
              <MenuItems
                anchor="bottom"
                className="bg-[#f7e8d3] dark:bg-[#414141] text-left w-[200px] p-4 rounded-lg shadow-lg font-medium"
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
      <div className="h-[400px]  max-w-[1080px] flex items-center w-full  mt-[24px] mb-[24px]">
        <div className="shadow-lg w-full bg-[#fceba5] border-1 dark:bg-[#000] py-8 px-8 rounded-lg mr-4 h-full">
          <div className="w-full flex flex-col">
            <div className="w-full flex">
              <button
                onClick={() => {
                  type !== 1 ? setType(1) : "";
                }}
                className={`mr-4 rounded-full ${
                  type === 1
                    ? "bg-black text-white dark:bg-[#fff] dark:text-black "
                    : "border-2 border-black text-black dark:text-white dark:border-white"
                }  px-5 py-3 leading-none`}
              >
                Word of the day
              </button>
              <button
                onClick={() => {
                  type !== 2 ? setType(2) : "";
                }}
                className={`mr-4  ${
                  type !== 1
                    ? "bg-black text-white dark:bg-[#fff] dark:text-black "
                    : "border-2 border-black text-black dark:text-white dark:border-white"
                } rounded-full px-5 py-3  leading-none`}
              >
                Random Word Generator
              </button>
            </div>
            <div className="text-[60px] font-bold h-[300px] w-full flex items-center justify-center text-center italic">
              <div className=" border-b-2 pb-2 border-black dark:border-white">
                kelam
              </div>
            </div>
          </div>
        </div>
        <div className="shadow-lg w-full max-w-[400px] bg-[#faebd7] dark:bg-[#000] py-4 px-8 rounded-lg h-full">
          <div className="text-[32px] text-center font-bold flex items-center justify-center">
            <LuAlarmClock className="mr-4" /> Timer
          </div>
          <div className="time w-full flex justify-center mt-[48px]">
            <div className="bg-black text-white text-[86px] w-[130px] text-center rounded-lg">
              {currentMinutes}
            </div>
            <span className="mx-3 text-[86px]">:</span>
            <div className="bg-black text-white text-[86px] w-[130px] text-center rounded-lg">
              {currentSeconds}
            </div>
          </div>
          <div className="flex mt-[48px] w-full justify-center ">
            <div>
              {!isRunning && !isStop && (
                <button
                  onClick={startHandler}
                  className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-24px  rounded-full w-[100px]"
                >
                  START
                </button>
              )}
              {isRunning && (
                <button
                  onClick={stopHandler}
                  className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-24px  rounded-full w-[100px]"
                >
                  STOP
                </button>
              )}

              {isStop && (
                <button
                  onClick={resumeHandler}
                  className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-24px  rounded-full w-[100px]"
                >
                  RESUME
                </button>
              )}
            </div>
            <div className="w-[32px]"></div>
            <button
              onClick={resetHandler}
              disabled={!isRunning && !isStop}
              className="border-black text-black dark:border-white dark:text-white border-2 px-4 py-2 text-24px  rounded-full w-[100px]"
            >
              RESET
            </button>
          </div>
        </div>
      </div>
      <div className="w-full shadow-sm max-w-[1080px] bg-[#ffe0b5] dark:bg-[#000] mb-[24px] py-8 px-8 rounded-lg">
        <span className="font-bold">Instructions:</span>
        {` Set a timer for 10 minutes and free-write based on the
        prompt until the timer finishes. Use all "seven senses": the five conventional ones
        (sight, touch, hearing, smell, taste), along with organic sense
        (awareness of your body) and kinesthetic sense (awareness of movement
        and your spatial relation to the outside word). According to the book
        Writing Better Lyrics by Pat Pattison, you should stop writing the
        moment the timer goes off. The best time to do the writing exercise is
        first thing each morning so that your mind is primed to think and
        observe with a writer's perspective throughout the day.`}
      </div>
    </div>
  );
}
