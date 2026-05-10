import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Latter from "./Latter";

const slides = [
  {
    img: "/1.png",
    text: "This smile… yeah, this is where it all started 🙂"
  },
  {
    img: "/2.png",
    text: "Didn’t realize it then… but I was already getting addicted to it 😍"
  },
  {
    img: "/3.png",
    text: "Turns out she’s been the cutest since forever 🥺"
  },
  {
    img: "/4.png",
    text: "she is sooo perfect and precious💞,Now it’s kinda hard not to notice her in everything. "
  },
  {
    img: "/5.png",
    text: "Somehow… that little girl stolen my heart and I don’t even want it back 💘"
  },
  {
    img: "/6.png",
    text: "And this cutest smile… still melting my heart every single time 💖"
  },
];

export default function SurpriseContent() {
  const [stage, setStage] = useState("intro");
  const [gif, setGif] = useState("/happy.gif");
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");

  const typingIdx = useRef(0);
  const autoNextTimer = useRef(null);
  const audioRef = useRef(null);

  const current = slides[index];
  const isRight = index % 2 === 0;

  // 🚀 CACHING & PRELOADING
  useEffect(() => {
    const allImages = ["/bg.png", "/happy.gif", "/presents.gif", "/love.gif", "/omg.gif", "/kinder.gif", ...slides.map(s => s.img)];
    allImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    audioRef.current = new Audio("/bgm.mp3");
    audioRef.current.loop = true;
    audioRef.current.preload = "auto";
  }, []);

  // 🎁 INTRO → GIFT
  useEffect(() => {
    const timer = setTimeout(() => {
      setGif("/presents.gif");
      setStage("gift");
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const startStory = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Playback deferred:", e));
    }
    setStage("story");
    setIndex(0);
  };

  const nextSlide = () => {
    if (index < slides.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      setStage("final1");
    }
  };

  // 💬 READABLE TYPE EFFECT (Perfectly Calibrated Speed)
  useEffect(() => {
    if (stage !== "story" || !current) return;

    setTyped("");
    typingIdx.current = 0;
    if (autoNextTimer.current) clearTimeout(autoNextTimer.current);

    const textToType = current.text;
    const interval = setInterval(() => {
      if (typingIdx.current < textToType.length) {
        setTyped(textToType.substring(0, typingIdx.current + 1));
        typingIdx.current += 1;
      } else {
        clearInterval(interval);
        // Wait 1.5 seconds after typing finishes for extra reading time before flipping slides
        autoNextTimer.current = setTimeout(() => {
          nextSlide();
        }, 1500);
      }
    }, 100); // 🟢 Slower typing speed (100ms per character for readable pacing)

    return () => {
      clearInterval(interval);
      if (autoNextTimer.current) clearTimeout(autoNextTimer.current);
    };
  }, [index, stage]);

  // 💖 KINDER STAGE TIMING (Extended to stay active longer)
  useEffect(() => {
    if (stage === "final1") {
      const t = setTimeout(() => setStage("final2"), 4000); // 🟢 Stays active for 4 seconds overall (3s base + 1s extra)
      return () => clearTimeout(t);
    }
  }, [stage]);

  return (
    <motion.div className="fixed inset-0 bg-pink-100/10 z-50 overflow-hidden flex justify-center">

      <AnimatePresence>
        {stage === "story" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <img src="/bg.png" alt="background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {(stage === "intro" || stage === "gift") && (
          <motion.div
            key="gift-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative z-10 flex flex-col items-center justify-center gap-4"
          >
            <motion.img
              src={gif}
              className="w-60 cursor-pointer gif-shadow-romantic "
              animate={stage === "gift" ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
              onClick={stage === "gift" ? startStory : undefined}
            />
            <p className="glow-text font-bold text-center px-4">
              {stage === "gift" ? "click on the misterybox birthday girl 😘" : "I have somthing more for you....😉"}
            </p>
          </motion.div>
        )}

       {stage === "story" && (
  <motion.div
    key="story-stage"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative z-10 w-full h-full overflow-hidden  flex items-center justify-center"
    onClick={nextSlide}
  >
    {/* 🌸 FLOATING EMOJIS */}
    {Array.from({ length: 18 }).map((_, i) => {
      const emojis = ["💖", "✨", "🎀", "💞", "🌸", "💕", "🥺", "💘"];

      return (
        <motion.div
          key={i}
          initial={{
            y: "120vh",
            x: `${Math.random() * 100}vw`,
            opacity: 0,
            scale: 0.6,
          }}
          animate={{
            y: "-20vh",
            x: `${Math.random() * 100}vw`,
            opacity: [0, 0.4, 0.2, 0],
            rotate: [0, 20, -20],
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "linear",
          }}
          className="absolute text-2xl pointer-events-none select-none"
          style={{ filter: "blur(0.3px)" }}
        >
          {emojis[i % emojis.length]}
        </motion.div>
      );
    })}

    {/* 📸 + 💬 CENTER STACK */}
    <div className="flex flex-col items-center justify-center gap-8">

      {/* 📸 PHOTO FRAME (CENTERED) */}
      <motion.div
        key={current.img}
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 16,
        }}
        className="relative"
      >
        {/* glow */}
        <div className="absolute inset-0 scale-110 blur-2xl bg-pink-300/30 rounded-[18px]" />

        {/* paper frame */}
        <div className="relative  p-3 pb-10 rounded-[14px]
                        shadow-[0_25px_60px_rgba(0,0,0,0.25)]
                         rotate-[1deg]">

          <img
            src={current.img}
            className="w-60 h-[24rem] object-cover rounded-[10px] contrast-105 rotate-6"
          />

          {/* tape */}
          <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-14 h-4 bg-pink-100/70 rotate-[-4deg] shadow-sm" />
        </div>
      </motion.div>

      {/* 💬 TEXT (CENTERED UNDER IMAGE) */}
      <motion.div
        key={current.text}
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-[85%] text-white text-[22px] md:text-[26px]
                   font-medium leading-relaxed tracking-[-0.02em]"
      >
        {typed}

        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.9 }}
          className="inline-block ml-1 text-pink-100"
        >
          |
        </motion.span>
      </motion.div>

    </div>
  </motion.div>
)}
        {/* 💖 FINAL STAGE 1 */}
        {stage === "final1" && (
          <motion.div
            key="final1-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10"
          >
            {/* ✨ PRELOAD HIDDEN GIF */}
            <img
              src="/love.gif"
              alt=""
              className="hidden"
              loading="eager"
              decoding="async"
            />

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="glow-text text-xl mb-4 w-[90%]"
            >
              Here is a kinder for you my crazy little babygirl 😚
            </motion.h2>

            <motion.img
              src="/kinder.gif"
              alt="kinder joy surprise"
              loading="eager"
              decoding="async"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
              className="w-64 gif-shadow-romantic will-change-transform"
            />
          </motion.div>
        )}

        {/* 💖 FINAL STAGE 2 */}
        {stage === "final2" && (
          <motion.div
            key="final2-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          >
            <div className="relative w-full max-w-[420px] h-[580px] flex items-center justify-center">

              {/* 💌 ENVELOPE - Scales small and fades behind the letter */}
              <motion.div
                animate={{
                  scale: [1, 1, 0.4],
                  opacity: [1, 1, 0],
                  y: [0, 0, 100],
                }}
                transition={{
                  delay: 2, // Starts right after letter is fully "out"
                  duration: 1.5,
                  ease: "backIn"
                }}
                className="absolute w-[360px] h-[240px] z-10"
              >
                <div className="absolute inset-0 bg-[#f9c9d9] rounded-xl shadow-lg" />

                {/* Flap */}
                <motion.div
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: 160 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  style={{ transformOrigin: "top", transformStyle: "preserve-3d" }}
                  className="absolute top-0 left-0 w-full h-full z-30"
                >
                  <div className="w-full h-full bg-pink-300 [clip-path:polygon(0%_0%,50%_50%,100%_0%)]" />
                </motion.div>

                {/* Fold Geometry */}
                <div className="absolute inset-0 z-20">
                  <div className="absolute inset-0 bg-[#fbcfe8] [clip-path:polygon(0%_0%,45%_50%,0%_100%)]" />
                  <div className="absolute inset-0 bg-[#fbcfe8] [clip-path:polygon(100%_0%,55%_50%,100%_100%)]" />
                  <div className="absolute inset-0 bg-[#f9c9d9] [clip-path:polygon(0%_100%,50%_45%,100%_100%)] shadow-inner" />
                </div>
              </motion.div>

              {/* 📄 THE LETTER - Centers and types out text */}
              <motion.div
                initial={{ y: 50, scale: 0.8, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                transition={{
                  delay: 1.2,
                  duration: 1.2,
                  ease: [0.34, 1.3, 0.64, 1]
                }}
                className="
          relative
          z-40
          w-[90vw]
          max-w-[380px]
          h-[580px]
          bg-[#fffefb]
          rounded-sm
          shadow-[0_20px_60px_rgba(0,0,0,0.12)]
          border border-[#f0e6d6]
          px-8 py-12
          flex flex-col items-center
        "
              >
                {/* Subtle Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] pointer-events-none" />

                
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 3.2, type: "spring", damping: 12 }}
                  className="mb-8 flex items-center justify-center flex-col gap-6"
                >
                  <img src="/love.gif" className="w-40 h-36 object-cover rounded-2xl rotate-2 " />
                   <Latter/> 
                </motion.div>

              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}