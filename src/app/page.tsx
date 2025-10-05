"use client";

import { IoIosArrowDropdown, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { LuAlarmClock } from "react-icons/lu";
import { AppContext } from "./_lib/Context/appContext";
import { GrInfo } from "react-icons/gr";
import { motion, AnimatePresence } from "motion/react";
import { IoCloseOutline, IoSearch } from "react-icons/io5";
import { format, differenceInDays } from "date-fns";
import { dataKBBI } from "@/app/_lib/model/arrayKBBI";
import { dataEN } from "@/app/_lib/model/arrayEN";
import { GoArrowUpRight } from "react-icons/go";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";

// KBBI API Interfaces
interface KbbiMeaning {
  id: number;
  kbbi_entry_id: number;
  kelas:
    | string
    | Array<{
        kode: string;
        nama: string;
        deskripsi: string;
      }>;
  submakna: string | string[];
  info: string;
  contoh: string | string[];
  created_at: string;
  updated_at: string;
}

interface KbbiEntry {
  id: number;
  lema: string;
  kata_dasar: string[];
  bentuk_tidak_baku: string[];
  varian: string[];
  etimologi: string;
  meanings: KbbiMeaning[];
  kata_turunan: string[];
  gabungan_kata: string[];
  peribahasa: string[];
  idiom: string[];
  created_at: string;
  updated_at: string;
}

interface KbbiApiResponse {
  status: "success" | "error";
  data: KbbiEntry[];
  error?: boolean;
  message?: string;
}

// Helper function to safely parse JSON arrays
const parseJsonArray = (field: string | string[]): string[] => {
  if (Array.isArray(field)) {
    return field;
  }
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

// Helper function to safely parse kelas field
const parseKelasArray = (
  field:
    | string
    | Array<{
        kode: string;
        nama: string;
        deskripsi: string;
      }>
): Array<{
  kode: string;
  nama: string;
  deskripsi: string;
}> => {
  if (Array.isArray(field)) {
    return field;
  }
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

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
  const [infoType, setInfoType] = useState(1);

  const [showModalInstruction, setShowModalInstruction] = useState(false);
  const [showModalCredits, setShowModalCredits] = useState(false);

  // Dictionary modal state
  const [showDictionaryModal, setShowDictionaryModal] = useState(false);
  const [dictionarySearchTerm, setDictionarySearchTerm] = useState("");
  const [dictionaryData, setDictionaryData] = useState<KbbiApiResponse>({
    status: "success",
    data: [],
  });
  const [isLoadingDictionary, setIsLoadingDictionary] = useState(false);
  const [isDirectWordLookup, setIsDirectWordLookup] = useState(false);

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

  // Dictionary search function
  const fetchDictionaryData = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setIsLoadingDictionary(true);
    try {
      const response = await fetch(
        `https://api-esc.vloodplein.com/api/kbbi/search?keyword=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data: KbbiApiResponse = await response.json();
      setDictionaryData(data);
    } catch (error) {
      setDictionaryData({
        status: "error",
        data: [],
        error: true,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch dictionary data",
      });
    } finally {
      setIsLoadingDictionary(false);
    }
  };

  const handleDictionarySearch = () => {
    if (dictionarySearchTerm.trim()) {
      fetchDictionaryData(dictionarySearchTerm.trim());
    }
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

  // Manage body overflow when modals are open
  useEffect(() => {
    const isAnyModalOpen = showDictionaryModal || showModalInstruction || showModalCredits;
    
    if (isAnyModalOpen) {
      // Hide body overflow when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body overflow when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDictionaryModal, showModalInstruction, showModalCredits]);

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
          <button
            className="flex items-center mt-6 mb-2 text-[12px] font-bold"
            onClick={() => {
              setShowModalCredits(true);
            }}
          >
            <div className="w-[24px] h-[24px] mr-2 ml-8 flex justify-center items-center rounded-full font-bold bg-[#ffc778] dark:text-black">
              C
            </div>
            <div className="border-b-2 border-black pb-1 dark:border-white">
              Credits
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
              <button
                onClick={() => {
                  if (language === "Indonesian") {
                    setDictionarySearchTerm(wordContent);
                    setIsDirectWordLookup(true);
                    setShowDictionaryModal(true);
                    fetchDictionaryData(wordContent);
                  } else {
                    window.open(
                      `https://www.oxfordlearnersdictionaries.com/definition/english/${wordContent}`,
                      "_blank"
                    );
                  }
                }}
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
                    "Find it in dictionary"
                  ) : (
                    <>Find it in dictionary</>
                  )}
                </div>
                <GoArrowUpRight className="ml-1" />
              </button>
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
          <div className="flex">
            <button
              className="flex mb-6 items-center"
              onClick={() => setInfoType(1)}
            >
              <div className="w-[32px] h-[32px] mr-2 flex text-[20px] justify-center items-center rounded-full bg-[#ffc778] dark:text-black">
                <GrInfo className="ml-[2px]" strokeWidth={4} />
              </div>
              <div
                className={`${
                  infoType === 1 ? "border-b-2" : ""
                } border-black pb-1 font-bold dark:border-white`}
              >
                Instruction
              </div>
            </button>
            <button
              className="flex mb-6 items-center ml-8"
              onClick={() => setInfoType(2)}
            >
              <div className="w-[32px] h-[32px] mr-2 flex text-[20px] font-bold justify-center items-center rounded-full bg-[#ffc778] dark:text-black">
                C
              </div>
              <div
                className={`${
                  infoType === 2 ? "border-b-2" : ""
                } border-black pb-1 font-bold dark:border-white`}
              >
                Credits
              </div>
            </button>
          </div>
          {infoType === 1 ? (
            <div className="italic leading-6">
              {`Atur pengingat waktu selama 10 menit dan lakukan "free-writing" berdasarkan
            "Word of The Day" atau "Random Word Generator" sampai waktu habis. Gunakan ketujuh indra :
            lima indra biasa (penglihatan, perabaan, pendengaran, penciuman, pengecapan),
            ditambah dengan indra organik (kesadaran tubuh Anda) dan indra kinestetik
            (kesadaran gerakan dan hubungan spasial Anda dengan dunia luar).`}
              <br />
              <br />
              <div className="w-full border-b-2 border-black border-dashed dark:border-white "></div>
              <br />
              {`Set a timer for 10 minutes and free-write based on the
            prompt until the timer finishes. Use all "seven senses": the five conventional ones
            (sight, touch, hearing, smell, taste), along with organic sense
            (awareness of your body) and kinesthetic sense (awareness of movement
              and your spatial relation to the outside word).`}
            </div>
          ) : (
            <div className="italic leading-6">
              {`Website yang kami buat dengan bangga terinspirasi dari buku "Writing Better Lyrics" karya Pat Pattison dan situs objectwriting.com, menghadirkan platform untuk berlatih menulis penulisan kreatif.
`}
              <br />
              <br />
              <div className="w-full border-b-2 border-black border-dashed dark:border-white"></div>
              <br />
              {`
Our website is proudly inspired by Pat Pattison's book "Writing Better Lyrics" and the site objectwriting.com, providing a platform for practicing creative writing.`}
            </div>
          )}
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
              <div className="italic leading-6">
                {`Atur pengingat waktu selama 10 menit dan lakukan "free-writing" berdasarkan
"Word of The Day" atau "Random Word Generator" sampai waktu habis. Gunakan ketujuh indra :
lima indra biasa (penglihatan, perabaan, pendengaran, penciuman, pengecapan),
ditambah dengan indra organik (kesadaran tubuh Anda) dan indra kinestetik
(kesadaran gerakan dan hubungan spasial Anda dengan dunia luar).`}
                <br />
                <br />
                <div className="w-full border-b-2 border-black border-dashed dark:border-white"></div>
                <br />
                {`Set a timer for 10 minutes and free-write based on the
        "Word of The Day" or "Random Word Generator" until the timer finishes. Use all "seven senses": the five conventional ones
        (sight, touch, hearing, smell, taste), along with organic sense
        (awareness of your body) and kinesthetic sense (awareness of movement
          and your spatial relation to the outside word).`}
              </div>
            </div>
          </motion.div>
        )}

        {!isDesktop && showModalCredits && (
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
                  <div className="w-[24px] h-[24px] mr-2 font-bold flex justify-center items-center rounded-full bg-[#ffc778] dark:text-black">
                    C
                  </div>
                  <div className="border-b-2 border-black pb-1underline pb-1 font-bold dark:border-white">
                    Credits
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowModalCredits(false);
                  }}
                  className="text-[32px]"
                >
                  <IoCloseOutline />
                </button>
              </div>
              <div className="italic leading-6">
                {`Website yang kami buat dengan bangga terinspirasi dari buku "Writing Better Lyrics" karya Pat Pattison dan situs objectwriting.com, menghadirkan platform untuk berlatih menulis penulisan kreatif.`}
                <br />
                <br />
                <div className="w-full border-b-2 border-black border-dashed dark:border-white"></div>
                <br />
                {`Our website is proudly inspired by Pat Pattison's book "Writing Better Lyrics" and the site objectwriting.com, providing a platform for practicing creative writing.`}
              </div>
            </div>
          </motion.div>
        )}

        {/* Dictionary Modal */}
        {showDictionaryModal && (
          <motion.div
            variants={varFadeInOutFullMobile}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full p-4 h-screen fixed top-0 left-0 bg-[#000000b0] dark:bg-[#19191970] flex justify-center items-center z-50 overflow-hidden"
            onClick={(e) => {
              // Close modal if clicking on backdrop
              if (e.target === e.currentTarget) {
                setShowDictionaryModal(false);
                setDictionaryData({ status: "success", data: [] });
                setDictionarySearchTerm("");
                setIsDirectWordLookup(false);
              }
            }}
          >
            <div
              className={`shadow-lg bg-[#fff0da] dark:bg-black dark:text-white rounded-xl dark:shadow-[#c2c2c240] ${
                isDesktop ? "w-[800px] max-h-[90vh]" : "w-full max-h-[90vh]"
              } flex flex-col overflow-hidden`}
              onClick={(e) => {
                // Prevent modal close when clicking inside the modal content
                e.stopPropagation();
              }}
            >
              {/* Header - Fixed at top */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">📖</div>
                  <h2 className="text-xl font-bold">
                    Kamus Besar Bahasa Indonesia
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowDictionaryModal(false);
                    setDictionaryData({ status: "success", data: [] });
                    setDictionarySearchTerm("");
                    setIsDirectWordLookup(false);
                  }}
                  className="text-2xl hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-2 transition-colors"
                >
                  <IoCloseOutline />
                </button>
              </div>

              {/* Search Term Display - Fixed */}
              <div className="p-6 underline border-black dark:border-white px-1 text-[28px] font-bold w-full flex items-center justify-center text-center italic flex-shrink-0">
                {dictionarySearchTerm}
              </div>

              {/* Search Input - Fixed (only show if not direct word lookup) */}
              {!isDirectWordLookup && (
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={dictionarySearchTerm}
                        onChange={(e) =>
                          setDictionarySearchTerm(e.target.value)
                        }
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleDictionarySearch()
                        }
                        placeholder="Masukkan kata yang ingin dicari..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffc778] focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleDictionarySearch}
                      disabled={
                        isLoadingDictionary || !dictionarySearchTerm.trim()
                      }
                      className="px-6 py-3 bg-[#ffc778] hover:bg-[#ffb84d] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <IoSearch className="text-lg" />
                      {isLoadingDictionary ? "Mencari..." : "Cari"}
                    </button>
                  </div>
                </div>
              )}

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto">
                {isLoadingDictionary ? (
                  <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffc778] mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Mencari kata dalam kamus...
                      </p>
                    </div>
                  </div>
                ) : dictionaryData.status === "error" ? (
                  <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                      <p className="text-red-600 dark:text-red-400 mb-2">
                        Terjadi kesalahan
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {dictionaryData.message}
                      </p>
                    </div>
                  </div>
                ) : dictionaryData.data.length === 0 ? (
                  <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {dictionarySearchTerm
                          ? "Kata tidak ditemukan"
                          : "Masukkan kata untuk mencari"}
                      </p>
                      {dictionarySearchTerm && (
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Coba gunakan kata lain atau periksa ejaan
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    {dictionaryData.data.map((entry, index) => (
                        <div
                          key={entry.id}
                          className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
                        >
                          {/* Main Word */}
                          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                            {entry.lema}
                          </h2>

                          {/* Additional Info */}
                          <div className="space-y-2 mb-4 text-sm">
                            {entry.kata_dasar &&
                              parseJsonArray(entry.kata_dasar).length > 0 && (
                                <div>
                                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                                    Kata Dasar:{" "}
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {parseJsonArray(entry.kata_dasar).join(
                                      ", "
                                    )}
                                  </span>
                                </div>
                              )}

                            {entry.bentuk_tidak_baku &&
                              parseJsonArray(entry.bentuk_tidak_baku).length >
                                0 && (
                                <div>
                                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                                    Bentuk Tidak Baku:{" "}
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {parseJsonArray(
                                      entry.bentuk_tidak_baku
                                    ).join(", ")}
                                  </span>
                                </div>
                              )}

                            {entry.varian &&
                              parseJsonArray(entry.varian).length > 0 && (
                                <div>
                                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                                    Varian:{" "}
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {parseJsonArray(entry.varian).join(", ")}
                                  </span>
                                </div>
                              )}

                            {entry.etimologi && (
                              <div>
                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                  Etimologi:{" "}
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">
                                  {entry.etimologi}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Meanings */}
                          <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                              Arti:
                            </h3>
                            {entry.meanings.map((meaning, meaningIndex) => (
                              <div
                                key={meaning.id}
                                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                              >
                                {/* Word Class */}
                                {meaning.kelas &&
                                  parseKelasArray(meaning.kelas).length > 0 && (
                                    <div className="mb-2">
                                      {parseKelasArray(meaning.kelas).map(
                                        (kelas, kelasIndex) => (
                                          <span
                                            key={kelasIndex}
                                            className="inline-block bg-[#ffc778] text-black text-xs px-2 py-1 rounded-full mr-2 font-medium"
                                          >
                                            {typeof kelas === "string"
                                              ? kelas
                                              : `${kelas.nama} (${kelas.kode})`}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  )}

                                {/* Definition */}
                                <div className="mb-3 text-sm">
                                  <span className="text-gray-900 dark:text-gray-100">
                                    {meaningIndex + 1}.{" "}
                                  </span>
                                  <span className="text-gray-800 dark:text-gray-200">
                                    {Array.isArray(meaning.submakna)
                                      ? meaning.submakna.join(", ")
                                      : meaning.submakna}
                                  </span>
                                  {meaning.info && (
                                    <span className="text-gray-600 dark:text-gray-400 italic ml-2">
                                      ({meaning.info})
                                    </span>
                                  )}
                                </div>

                                {/* Examples */}
                                {meaning.contoh &&
                                  parseJsonArray(meaning.contoh).length > 0 && (
                                    <div className="mt-3">
                                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Contoh:
                                      </span>
                                      <div className="mt-1 space-y-1">
                                        {parseJsonArray(meaning.contoh).map(
                                          (example, exampleIndex) => (
                                            <div
                                              key={exampleIndex}
                                              className="text-sm text-gray-600 dark:text-gray-400 italic"
                                            >
                                              • {example}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>

                          {/* Additional Sections */}
                          {((entry.kata_turunan &&
                            parseJsonArray(entry.kata_turunan).length > 0) ||
                            (entry.gabungan_kata &&
                              parseJsonArray(entry.gabungan_kata).length > 0) ||
                            (entry.peribahasa &&
                              parseJsonArray(entry.peribahasa).length > 0) ||
                            (entry.idiom &&
                              parseJsonArray(entry.idiom).length > 0)) && (
                            <div className="mt-6 space-y-3 text-sm">
                              {entry.kata_turunan &&
                                parseJsonArray(entry.kata_turunan).length >
                                  0 && (
                                  <div>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                                      Kata Turunan:{" "}
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                      {parseJsonArray(entry.kata_turunan).join(
                                        ", "
                                      )}
                                    </span>
                                  </div>
                                )}

                              {entry.gabungan_kata &&
                                parseJsonArray(entry.gabungan_kata).length >
                                  0 && (
                                  <div>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                                      Gabungan Kata:{" "}
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                      {parseJsonArray(entry.gabungan_kata).join(
                                        ", "
                                      )}
                                    </span>
                                  </div>
                                )}

                              {entry.peribahasa &&
                                parseJsonArray(entry.peribahasa).length > 0 && (
                                  <div>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                                      Peribahasa:{" "}
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                      {parseJsonArray(entry.peribahasa).join(
                                        ", "
                                      )}
                                    </span>
                                  </div>
                                )}

                              {entry.idiom &&
                                parseJsonArray(entry.idiom).length > 0 && (
                                  <div>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                                      Idiom:{" "}
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                      {parseJsonArray(entry.idiom).join(", ")}
                                    </span>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
