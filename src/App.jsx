import { useState, useRef, useEffect } from "react";
import CountdownCard from "./components/CountdownCard";
import SurpriseContent from "./components/SurpriseContent";
import confetti from "canvas-confetti";

function App() {
  const [stage, setStage] = useState("loading");
  const [rumble, setRumble] = useState(false);

  const bassRef = useRef(null);
  const heartbeatRef = useRef(null);

  // 💥 PRELOAD + CACHE EVERYTHING
  useEffect(() => {
    const assets = [
      // intro
      "/wait.gif",
      "/excited.gif",

      // audio
      "/heartbeat.mp3",
      "/happy.mp3",
      "/bgm.mp3",

      // gifs
      "/happy.gif",
      "/presents.gif",
      "/love.gif",
      "/omg.gif",
      "/kinder.gif",

      // slides
      "/1.png",
      "/2.png",
      "/3.png",
      "/4.png",
      "/5.png",
      "/6.png",
    ];

    let loaded = 0;

    const checkDone = () => {
      loaded++;

      if (loaded >= assets.length) {
        // small cinematic delay
        setTimeout(() => {
          setStage("start");
        }, 1200);
      }
    };

    assets.forEach((src) => {
      // 🎵 AUDIO PRELOAD
      if (src.endsWith(".mp3")) {
        const audio = new Audio();

        audio.src = src;
        audio.preload = "auto";

        audio.oncanplaythrough = checkDone;
        audio.onerror = checkDone;
      }

      // 🖼️ IMAGE / GIF PRELOAD
      else {
        const img = new Image();

        img.src = src;
        img.decoding = "async";

        img.onload = checkDone;
        img.onerror = checkDone;
      }
    });
  }, []);

  // 💓 heartbeat during loading
  useEffect(() => {
    if (stage === "loading" && heartbeatRef.current) {
      heartbeatRef.current.play().catch(() => {});
    }
  }, [stage]);

  const unlockEverything = () => {
    if (navigator.vibrate) {
      navigator.vibrate(1);
    }

    if (bassRef.current) {
      bassRef.current
        .play()
        .then(() => {
          bassRef.current.pause();
          bassRef.current.currentTime = 0;
        })
        .catch(() => {});
    }

    if (heartbeatRef.current) {
      heartbeatRef.current.pause();
      heartbeatRef.current.currentTime = 0;
    }

    setStage("countdown");
  };

  const triggerFakeVibration = () => {
    setRumble(true);

    let count = 0;

    const interval = setInterval(() => {
      if (bassRef.current) {
        bassRef.current.currentTime = 0;
        bassRef.current.play().catch(() => {});
      }

      if (navigator.vibrate) {
        navigator.vibrate(80);
      }

      count++;

      if (count > 8) clearInterval(interval);
    }, 100);
  };

  const handleFinish = () => {
    triggerFakeVibration();

    setTimeout(() => {
      confetti({
        particleCount: 300,
        spread: 160,
        startVelocity: 45,
      });

      setRumble(false);
      setStage("surprise");
    }, 1000);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-fuchsia-100 italic ${
        rumble ? "rumble-hard" : ""
      }`}
    >
      {/* 🔊 AUDIO */}
      <audio ref={bassRef} src="/happy.mp3" preload="auto" />
      <audio ref={heartbeatRef} src="/heartbeat.mp3" preload="auto" loop />

      {/* 🎬 LOADING SCREEN */}
      {stage === "loading" && (
        <div className="flex flex-col items-center gap-6 w-[80%] text-center">
          <p className="text-xl glow-text animate-pulse">
            Preparing something special for you 💕
          </p>

          <div className="w-16 h-16 bg-pink-400 rounded-full animate-ping"></div>
        </div>
      )}

      {/* 💖 START SCREEN */}
      {stage === "start" && (
        <div className="text-center w-[80%] gap-6 flex flex-col items-center justify-center">
          <button
            onClick={unlockEverything}
            className="bg-transparent border-none p-0 cursor-pointer active:scale-95 transition"
          >
            <img
              src="/excited.gif"
              alt="Start"
              className="w-40 drop-shadow-2xl"
            />
          </button>

          <p className="font-bold text-lg glow-text text-gray-400">
            click on my tummy 😛
          </p>
        </div>
      )}

      {/* ⏳ COUNTDOWN */}
      {stage === "countdown" && (
        <CountdownCard onFinish={handleFinish} />
      )}

      {/* 🎉 SURPRISE */}
      {stage === "surprise" && <SurpriseContent />}
    </div>
  );
}

export default App;