import { useState, useRef, useEffect } from "react";
import CountdownCard from "./components/CountdownCard";
import SurpriseContent from "./components/SurpriseContent";
import confetti from "canvas-confetti";

function App() {
  const [stage, setStage] = useState("loading");
  const [isReady, setIsReady] = useState(false);
  const [rumble, setRumble] = useState(false);
  const [percent, setPercent] = useState(0); // Progress tracker

  const bassRef = useRef(null);
  const heartbeatRef = useRef(null);

  useEffect(() => {
    // 1. LIST EVERY ASSET: Include all photos from your SurpriseContent here!
    const assets = [
      "/wait.gif",
      "/excited.gif",
      "/heartbeat.mp3",
      "/happy.mp3",
      // Add all your slider images here so they don't "pop in" later
      "/photo1.jpg", 
      "/photo2.jpg",
      "/photo3.jpg"
    ];

    let loadedCount = 0;

    const updateProgress = () => {
      loadedCount++;
      const p = Math.floor((loadedCount / assets.length) * 100);
      setPercent(p);

      if (loadedCount === assets.length) {
        setTimeout(() => {
          setIsReady(true);
          setStage("start");
        }, 1200); // Gentle delay for cinematic feel
      }
    };

    assets.forEach((src) => {
      if (src.endsWith(".mp3")) {
        const audio = new Audio();
        audio.src = src;
        audio.oncanplaythrough = updateProgress;
        audio.load(); // Force browser to start downloading
      } else {
        const img = new Image();
        img.src = src;
        img.onload = updateProgress;
        img.onerror = updateProgress; // Don't get stuck if an image fails
      }
    });
  }, []);

  // Sync heartbeat with loading
  useEffect(() => {
    if (stage === "loading" && heartbeatRef.current) {
      heartbeatRef.current.play().catch(() => {});
    }
  }, [stage]);

  const unlockEverything = () => {
    if (heartbeatRef.current) heartbeatRef.current.pause();
    // Start background music immediately when she clicks
    if (bassRef.current) {
      bassRef.current.play().catch(() => {});
    }
    setStage("countdown");
  };

  const handleFinish = () => {
    setRumble(true);
    // Fake vibration/rumble effect
    setTimeout(() => {
      confetti({ particleCount: 300, spread: 160 });
      setRumble(false);
      setStage("surprise");
    }, 1000);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-fuchsia-100 font-poppins italic transition-all duration-700 ${
      rumble ? "rumble-hard" : ""
    }`}>
      
      <audio ref={bassRef} src="/happy.mp3" loop />
      <audio ref={heartbeatRef} src="/heartbeat.mp3" loop />

      {stage === "loading" && (
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-pink-400 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-pink-600">
              {percent}%
            </div>
          </div>
          <p className=" glow-text text-lg font-medium animate-pulse">
            Getting things ready for you...
          </p>
        </div>
      )}

      {stage === "start" && (
        <div className="text-center flex flex-col items-center gap-6">
          <button onClick={unlockEverything} className="active:scale-90 transition-transform">
            <img src="/excited.gif" alt="Start" className="w-44 drop-shadow-2xl" />
          </button>
          <p className="glow-text font-bold tracking-wide">
            click on my tummy 😛
          </p>
        </div>
      )}

      {stage === "countdown" && <CountdownCard onFinish={handleFinish} />}
      {stage === "surprise" && <SurpriseContent />}
    </div>
  );
}

export default App;