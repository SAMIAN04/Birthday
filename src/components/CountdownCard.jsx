import Card from "./Card";
import { useEffect, useRef, useState } from "react";

const TARGET_DATE = "2026-05-05T20:19:00";

const TIME_UNITS = [
  { label: "Days",  ms: 1000 * 60 * 60 * 24 },
  { label: "Hours", ms: 1000 * 60 * 60 },
  { label: "Min",   ms: 1000 * 60 },
  { label: "Sec",   ms: 1000 },
];

const getTimeLeft = () => Math.max(0, new Date(TARGET_DATE) - new Date());

const BOX_CLASS =
  "flex flex-col items-center justify-center w-[70px] h-[70px] rounded-xl bg-black/10 backdrop-blur-lg border border-white/20 shadow-lg";

const CountdownCard = ({ onFinish }) => {
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  const [timeLeft, setTimeLeft]       = useState(getTimeLeft);
  const [finalSeconds, setFinalSeconds] = useState(null);
  const [gif, setGif]                 = useState("/wait.gif");

  const isFinished = finalSeconds === 0;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const diff = getTimeLeft();

      if (diff > 0) {
        setTimeLeft(diff);
        return;
      }

      // Target passed → run 7-second finale
      setFinalSeconds((prev) => {
        if (prev === null) return 7;
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onFinish?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [onFinish]);

  useEffect(() => {
    if (isFinished) setGif("/excited.gif");
  }, [isFinished]);

  return (
    <Card buttonText="I can't wait 😏">
      <audio ref={audioRef} src="/heartbeat.mp3" loop />

      <div className="w-[90%] h-[50%] flex flex-col items-center justify-center text-center relative floaty">
        <div className="absolute inset-0 blur-2xl bg-red-600 p-8" />

        <div className="relative z-10 w-[90%] flex flex-col items-center gap-5">

          {/* Header text */}
          <p className={isFinished
            ? "text-white text-2xl font-bold glow-text animate-pulse"
            : "text-pink-200 glow-text"
          }>
            {isFinished ? "OMG IT'S THE TIME! 🎉" : "Wait with me like a good girl"}
          </p>

          {/* GIF */}
          <img src={gif} alt="" className="w-40 drop-shadow-2xl floaty" />

          {/* Finale countdown */}
          {finalSeconds !== null && (
            <h1 className="text-white text-3xl font-bold">
              {finalSeconds || "🎉"}
            </h1>
          )}

          {/* Normal countdown grid */}
          {finalSeconds === null && timeLeft > 0 && (
            <div className="grid grid-cols-4 gap-3 w-full">
              {TIME_UNITS.map(({ label, ms }, i) => {
                const prev = TIME_UNITS[i - 1]?.ms ?? Infinity;
                const value = Math.floor((timeLeft % prev) / ms);
                return (
                  <div key={label} className={BOX_CLASS}>
                    <span className="text-white">{value}</span>
                    <span className="text-xs text-white/70">{label}</span>
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