import { useState, useRef } from "react";
import CountdownCard from "./components/CountdownCard";
import SurpriseContent from "./components/SurpriseContent";
import confetti from "canvas-confetti";

function App() {
  const [stage, setStage] = useState("start");
  // start → countdown → surprise

  const [rumble, setRumble] = useState(false);
  const bassRef = useRef(null);

  const unlockEverything = () => {
    // 🔓 unlock vibration
    if (navigator.vibrate) {
      navigator.vibrate(1);
    }

    // 🔓 unlock audio
    if (bassRef.current) {
      bassRef.current.play().then(() => {
        bassRef.current.pause();
        bassRef.current.currentTime = 0;
      }).catch(() => { });
    }

    setStage("countdown");
  };

  const triggerFakeVibration = () => {
    setRumble(true);

    let count = 0;
    const interval = setInterval(() => {
      if (bassRef.current) {
        bassRef.current.currentTime = 0;
        bassRef.current.play().catch(() => { });
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
    <div className={`min-h-screen flex items-center justify-center bg-fuchsia-100 font-poppins italic ${rumble ? "rumble-hard" : ""
      }`}>

      <audio ref={bassRef} src="/bass.mp3" />

      {/* 👇 START SCREEN */}
      {stage === "start" && (
        <div className="text-center w-[80%] gap-6 flex flex-col items-center justify-center italic">
          <button
            onClick={unlockEverything}
            className="bg-transparent border-none p-0 cursor-pointer "
          >
            <img
              src="excited.gif"
              alt="Start"
              className="w-40 drop-shadow-2xl "
            />
          </button>
         
<p className=" text- font-bold"> click on my tummy😛 </p>
        </div>
      )}

      {/* ⏳ COUNTDOWN */}
      {stage === "countdown" && (
        <CountdownCard onFinish={handleFinish} />
      )}

      {/* 🎉 SURPRISE */}
      {stage === "surprise" && (
        <SurpriseContent />
      )}
    </div>
  );
}

export default App;