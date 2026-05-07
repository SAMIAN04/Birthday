import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

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
              {stage === "gift" ? "Click on the gift birthday Girl 😘" : "I have somthing more for you....😉"}
            </p>
          </motion.div>
        )}

        {stage === "story" && (
          <motion.div
            key="story-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 w-[90%] h-full"
            onClick={nextSlide}
          >
            <motion.img
              key={current.img}
              src={current.img}
              initial={{ opacity: 0, scale: 0.8, rotate: isRight ? -5 : 5, y: 50 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }} 
              className={`absolute w-56 h-96 object-cover rounded-2xl border-4 border-white/30 shadow-2xl  ${
                isRight ? "right-4 top-16" : "left-4 top-12"
              }`}
            />
            
            <motion.div 
              key={current.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={` w-full absolute px-1 glow-text2 text-2xl drop-shadow-2xl leading-tight ${
                isRight ? "bottom-32 text-left" : "bottom-32 text-right"
              }`}
            >
              {typed}
              <motion.span 
                animate={{ opacity: [0, 1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
              >|</motion.span>
            </motion.div>
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
      className="glow-text text-2xl mb-4"
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
    exit={{ opacity: 0 }}
    transition={{ duration: 0.45 }}
    className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10"
  >
    <motion.h2
      initial={{ y: 25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.55,
        ease: "easeOut",
      }}
      className="glow-text text-xl mt-8 font-black drop-shadow-xl tracking-tight bend-text"
    >
      I LOVE YOU SO MUCH MY PRETTY PRINCESS 💖
    </motion.h2>

    <motion.img
      src="/love.gif"
      alt="love"
      loading="eager"
      decoding="async"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: 0.15,
        duration: 0.6,
        ease: "easeOut",
      }}
      className="w-80 drop-shadow-2xl gif-shadow-romantic will-change-transform"
    />

    <motion.p
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.5,
      }}
      className="glow-text font-bold text-xl px-4 leading-relaxed w-[90%]"
    >
      Thank you for being the best part of my life.
      May your day be as beautiful as your smile.
      Happy Birthday my love of life! 🎂✨
    </motion.p>
  </motion.div>
)}
      </AnimatePresence>
    </motion.div>
  );
}