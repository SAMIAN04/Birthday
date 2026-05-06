import Card from "./Card";
import { useEffect, useRef, useState } from "react";

const TARGET_DATE = "2026-05-04T14:21:00";

const TIME_UNITS = [
  { label: "Days",  ms: 1000 * 60 * 60 * 24 },
  { label: "Hours", ms: 1000 * 60 * 60 },
  { label: "Min",   ms: 1000 * 60 },
  { label: "Sec",   ms: 1000 },
];

const getTimeLeft = () => new Date(TARGET_DATE) - new Date();

const BOX_CLASS =
  "flex flex-col items-center justify-center w-[70px] h-[70px] rounded-xl bg-black/10 backdrop-blur-lg border border-white/20 shadow-lg";

const CountdownCard = ({ onFinish }) => {
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [finalSeconds, setFinalSeconds] = useState(null);

  const isFinished = finalSeconds === 0;

  // 🎞 GIF LOGIC
  const currentGif = isFinished
    ? "/excited.gif"
    : finalSeconds !== null
    ? "/count.gif"
    : "/wait.gif";

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const diff = getTimeLeft();

      // 🔥 If already passed before load
      if (diff <= 0 && finalSeconds === null) {
        setFinalSeconds(5);
        return;
      }

      // 🔥 Enter final 3 seconds
      if (diff <= 3000 && diff > 0 && finalSeconds === null) {
        setFinalSeconds(5);
        return;
      }

      // 🔥 FINAL COUNTDOWN MODE
      if (finalSeconds !== null) {
        setFinalSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            onFinish?.();
            return 0;
          }

          // 💓 heartbeat
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }

          // 📳 vibration
          if (navigator.vibrate) {
            navigator.vibrate(120);
          }

          return prev - 1;
        });

        return;
      }

      // ⏳ NORMAL COUNTDOWN
      if (diff > 0) {
        setTimeLeft(diff);
      }

    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [finalSeconds, onFinish]);

  return (
    <Card buttonText="I can't wait 😏">
      <audio ref={audioRef} src="/heartbeat.mp3" />

      <div className="w-[90%] h-[50%] flex flex-col items-center justify-center text-center relative floaty">
        <div className="absolute inset-0 blur-2xl  p-8 bg-red-600" />

        <div className="relative z-10 w-[90%] flex flex-col items-center gap-5">

          {/* 💥 TEXT */}
      
<p className={
  isFinished
    ? "text-white text-2xl font-bold animate-pulse glow-text2"
    : "text-pink-200 glow-text2"
}>
  {isFinished
    ? "OMG IT'S THE TIME! 🎉"
    : finalSeconds !== null 
      ? "Are you ready princess? 😃" // Shows when count.gif is active
      : "Heyy beautiful 😙, something special is waiting for you 💕"}
</p>
          {/* 🎞 GIF */}
          <img
            src={currentGif}
            alt=""
            className="w-40 drop-shadow-2xl floaty gif-shadow-romantic "
          />

          {/* 💥 FINAL 3 SEC */}
          {finalSeconds !== null && (
            <h1 className="text-white text-4xl font-bold">
              {finalSeconds || ""}
            </h1>
          )}

          {/* ⏳ NORMAL COUNTDOWN */}
          {finalSeconds === null && timeLeft > 0 && (
            <div className="grid grid-cols-4 gap-3 w-full">
              {TIME_UNITS.map(({ label, ms }, i) => {
                const prev = TIME_UNITS[i - 1]?.ms ?? Infinity;
                const value = Math.floor((timeLeft % prev) / ms);

                return (
                  <div key={label} className={BOX_CLASS}>
                    <span className="text-white glow-text">{value}</span>
                    <span className="text-xs text-white/70 glow-text">{label}</span>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </Card>
  );
};

export default CountdownCard;