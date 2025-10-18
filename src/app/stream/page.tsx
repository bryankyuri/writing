"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IoPlayCircle, IoStopCircle, IoMusicalNotes, IoSettingsSharp } from "react-icons/io5";
import { BsPeopleFill } from "react-icons/bs";
import { FaPlay, FaStop } from "react-icons/fa";
import Image from "next/image";

// Types
interface StreamMetadata {
  title: string;
  artist: string;
  album: string | null;
  artwork_url: string | null;
}

interface RadioStream {
  id: number;
  name: string;
  mount_point: string;
  url: string;
  bitrate: number;
  format: string;
  description: string | null;
  status: "online" | "offline";
  max_listeners: number;
  current_listeners: number;
  metadata: StreamMetadata;
  last_updated: string;
  is_primary: boolean;
}

interface ApiResponse {
  success: boolean;
  data: {
    streams: RadioStream[];
  };
}

// Configuration
const API_BASE = "http://localhost";
const WS_HOST = "localhost";
const WS_PORT = 6001;
const WS_KEY = "kngkrm58yq2mcuirbnkr";

export default function StreamPage() {
  const [streams, setStreams] = useState<RadioStream[]>([]);
  const [selectedStream, setSelectedStream] = useState<RadioStream | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);
  const [isPausedManually, setIsPausedManually] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const echoRef = useRef<any>(null);
  const currentStreamUrlRef = useRef<string>("");

  // Load streams from API
  const loadStreams = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/streams`);
      const data: ApiResponse = await response.json();

      const parsedStreams = data.data.streams.map((stream) => ({
        ...stream,
        metadata:
          typeof stream.metadata === "string"
            ? JSON.parse(stream.metadata)
            : stream.metadata,
      }));

      setStreams(parsedStreams);

      if (parsedStreams.length > 0) {
        const firstStream = parsedStreams[0];
        try {
          // Fetch fresh data
          const streamResponse = await fetch(`${API_BASE}/api/streams/${firstStream.id}`);
          const streamData = await streamResponse.json();
          const freshStream = streamData.data.stream;

          setSelectedStream(freshStream);
          currentStreamUrlRef.current = freshStream.url;

          if (audioRef.current) {
            audioRef.current.src = freshStream.url;
          }
        } catch (error) {
          console.error("Failed to load initial stream:", error);
        }
      }
    } catch (error) {
      console.error("Failed to load streams:", error);
    }
  }, []);

  const initializeEcho = useCallback(() => {
    // Dynamic import for client-side only
    if (typeof window === "undefined") return;

    import("pusher-js").then((PusherModule) => {
      import("laravel-echo").then((EchoModule) => {
        try {
          const PusherClass = PusherModule.default;
          const EchoClass = EchoModule.default;

          // @ts-ignore
          window.Pusher = PusherClass;

          const echo = new EchoClass({
            broadcaster: "pusher",
            key: WS_KEY,
            wsHost: WS_HOST,
            wsPort: WS_PORT,
            wssPort: WS_PORT,
            forceTLS: false,
            disableStats: true,
            enabledTransports: ["ws", "wss"],
            cluster: "mt1",
          });

          echoRef.current = echo;

          // @ts-ignore
          if (echo.connector?.pusher) {
            // @ts-ignore
            const pusher = echo.connector.pusher;

            pusher.connection.bind("connected", () => {
              console.log("✅ WebSocket connected");
              setIsConnected(true);
            });

            pusher.connection.bind("disconnected", () => {
              console.warn("⚠️ WebSocket disconnected");
              setIsConnected(false);
            });

            pusher.connection.bind("error", (err: any) => {
              console.error("❌ WebSocket error:", err);
              setIsConnected(false);
            });
          }
        } catch (error) {
          console.error("Failed to initialize Echo:", error);
          setIsConnected(false);
        }
      });
    });
  }, []);

  const subscribeToStreamEvents = useCallback((streamId: number) => {
    if (!echoRef.current) return;

    try {
      console.log(`📡 Subscribing to stream.${streamId}`);
      console.log(`📡 Echo instance:`, echoRef.current);
      
      const channel = echoRef.current.channel(`stream.${streamId}`);
      
      console.log(`📺 Channel created:`, channel);
      console.log(`📺 Channel name:`, channel.name);

      channel
        .listen(".MetadataUpdated", (event: any) => {
          console.log("🎵 🎉 METADATA EVENT RECEIVED! 🎉", event);
          
          // Update metadata directly
          setSelectedStream((prev) => {
            if (!prev) return prev;
            return { ...prev, metadata: event.metadata };
          });
          
          setShowUpdateIndicator(true);
          setTimeout(() => setShowUpdateIndicator(false), 2000);
        })
        .listen(".ListenerCountUpdated", (event: any) => {
          console.log("👥 🎉 LISTENER COUNT EVENT RECEIVED! 🎉", event);
          
          // Update listener count directly
          setSelectedStream((prev) => {
            if (!prev) return prev;
            return { ...prev, current_listeners: event.count };
          });
        })
        .listen(".StreamStatusChanged", (event: any) => {
          console.log("📻 🎉 STREAM STATUS EVENT RECEIVED! 🎉", event);
          
          // Update status directly
          setSelectedStream((prev) => {
            if (!prev) return prev;
            return { ...prev, status: event.status };
          });
        });
      
      // Listen to ALL events (debug catch-all)
      // @ts-ignore
      if (channel.subscription && channel.subscription.bind) {
        console.log("🔍 Setting up catch-all event listener...");
        // @ts-ignore
        channel.subscription.bind_global((eventName: string, data: any) => {
          console.log("🌐 ANY EVENT RECEIVED:", eventName, data);
        });
      }
      
    } catch (error) {
      console.error("Failed to subscribe:", error);
    }
  }, []);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();

    // Radio behavior: monitor pause/resume
    const handlePause = () => {
      if (!audioRef.current?.ended) {
        setIsPausedManually(true);
        console.log("⏸️ Stream paused manually");
      }
    };

    const handlePlay = () => {
      // If user resumes after pause, force reconnect to live position
      if (isPausedManually && currentStreamUrlRef.current) {
        console.log("🔄 Resuming live stream - reconnecting to current position...");
        
        const freshUrl = currentStreamUrlRef.current + "?live=" + Date.now();
        
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeAttribute("src");
          audioRef.current.src = freshUrl;
          audioRef.current.preload = "none";
          audioRef.current.load();

          setTimeout(() => {
            audioRef.current
              ?.play()
              .then(() => {
                console.log("✅ Stream reconnected to live position");
              })
              .catch((err) => {
                console.error("❌ Autoplay failed:", err);
              });
          }, 50);
        }

        setIsPausedManually(false);
      }
    };

    audioRef.current.addEventListener("pause", handlePause);
    audioRef.current.addEventListener("play", handlePlay);

    return () => {
      audioRef.current?.removeEventListener("pause", handlePause);
      audioRef.current?.removeEventListener("play", handlePlay);
      audioRef.current?.pause();
    };
  }, [isPausedManually]);

  // Load streams from API
  useEffect(() => {
    loadStreams();
  }, [loadStreams]);

  // Initialize WebSocket
  useEffect(() => {
    initializeEcho();

    return () => {
      if (echoRef.current) {
        echoRef.current.disconnect();
      }
    };
  }, [initializeEcho]);

  // Subscribe to selected stream events when stream or Echo changes
  useEffect(() => {
    const streamId = selectedStream?.id;
    
    if (streamId && echoRef.current && isConnected) {
      console.log(`🔔 Subscribing to real-time updates for stream ${streamId}`);
      subscribeToStreamEvents(streamId);

      return () => {
        if (echoRef.current) {
          console.log(`🔕 Unsubscribing from stream ${streamId}`);
          echoRef.current.leave(`stream.${streamId}`);
        }
      };
    }
  }, [selectedStream?.id, isConnected, subscribeToStreamEvents]);

  const selectStream = async (stream: RadioStream) => {
    try {
      // Leave previous channel
      if (selectedStream && echoRef.current) {
        echoRef.current.leave(`stream.${selectedStream.id}`);
      }

      // Fetch fresh data
      const response = await fetch(`${API_BASE}/api/streams/${stream.id}`);
      const data = await response.json();
      const freshStream = data.data.stream;

      setSelectedStream(freshStream);
      currentStreamUrlRef.current = freshStream.url;

      if (audioRef.current) {
        audioRef.current.src = freshStream.url;
      }

      // Subscribe to new stream
      if (echoRef.current) {
        subscribeToStreamEvents(freshStream.id);
      }
    } catch (error) {
      console.error("Failed to select stream:", error);
    }
  };

  const handlePlay = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const handleStop = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setIsPausedManually(true);
  };

  const togglePlayStop = () => {
    if (isPlaying) {
      handleStop();
    } else {
      handlePlay();
    }
  };

  return (
    <div className="min-h-[calc(100vh-116px)] bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-pink-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative"
      >
        {/* Settings Button (Gear Icon) */}
        {/* <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSettings(!showSettings)}
          className="absolute -top-4 -right-4 z-20 bg-yellow-200 dark:bg-yellow-500 p-3 rounded-full shadow-lg"
        >
          <IoSettingsSharp className="text-2xl text-gray-700 dark:text-gray-200" />
        </motion.button> */}

        {/* Player Card */}
        <div className="bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl overflow-hidden relative">
          {/* Decorative Background Circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200 dark:bg-yellow-500 rounded-full blur-3xl opacity-50 -mt-10 -mr-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-200 dark:bg-yellow-500 rounded-full blur-3xl opacity-50 -mb-20 -ml-20"></div>

          {/* Artwork Section */}
          <div className="relative pt-16 pb-8 px-8">
            <div className="relative">
              {/* Circular Artwork */}
              <div className="w-full aspect-square rounded-full overflow-hidden shadow-2xl border-8 border-white dark:border-gray-700 bg-gradient-to-br from-purple-400 to-indigo-600 relative">
                {selectedStream?.metadata?.artwork_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedStream.metadata.artwork_url}
                    alt="Album Artwork"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white">
                    <IoMusicalNotes className="text-6xl mb-2 opacity-80" />
                    <h1 className="text-3xl font-bold">ESC</h1>
                    <h2 className="text-3xl font-bold">Radio</h2>
                  </div>
                )}
              </div>

              {/* Update Indicator */}
              <AnimatePresence>
                {showUpdateIndicator && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
                  >
                    🎵 New Song!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Player Info */}
          <div className="px-8 pb-8 text-center relative z-10">
            {/* Now Playing */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                {selectedStream?.metadata?.title || "Loading..."}
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400">
                {selectedStream?.metadata?.artist || "-"}
              </p>
            </div>

            {/* Wave Animation Wrapper (fixed height) */}
            <div className="h-12 mb-6 flex items-center justify-center">
              <AnimatePresence>
                {isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-center gap-1"
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-yellow-500 to-amber-500 rounded-full"
                        animate={{
                          height: ["20px", "45px", "20px"],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Play/Stop Button (Single Circular Button) */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlayStop}
                className="relative w-20 h-20 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-500 shadow-2xl flex items-center justify-center group"
              >
                {/* Animated ring when playing */}
                {isPlaying && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-yellow-400"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                <AnimatePresence mode="wait">
                  {isPlaying ? (
                    <motion.div
                      key="stop"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaStop className="text-white text-2xl" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="play"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                      className="ml-1"
                    >
                      <FaPlay className="text-white text-2xl" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSettings(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
              />

              {/* Settings Panel */}
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute top-12 right-0 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 z-40 border-2 border-gray-100 dark:border-gray-700"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Select Quality
                </h3>

                <div className="space-y-4">
                  {streams
                    .filter((stream) => !stream.name.toLowerCase().includes("fallback"))
                    .map((stream) => (
                      <motion.button
                        key={stream.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          selectStream(stream);
                          setShowSettings(false);
                        }}
                        className={`w-full text-center px-4 py-3 rounded-xl transition-all ${
                          selectedStream?.id === stream.id
                            ? "bg-gradient-to-r from-yellow-200 to-yellow-400 text-black shadow-lg"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                        }`}
                      >
                        <div className="font-bold text-lg">
                          {stream.bitrate}kbps
                        </div>
                      </motion.button>
                    ))}
                </div>

                <button
                  onClick={() => setShowSettings(false)}
                  className="mt-4 w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
