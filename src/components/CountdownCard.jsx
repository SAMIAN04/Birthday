import Card from "./Card";
import { useEffect, useRef, useState } from "react";

const TARGET_DATE = "2026-05-13T00:00:00";

const TIME_UNITS = [
  { label: "Days", ms: 1000 * 60 * 60 * 24 },
  { label: "Hours", ms: 1000 * 60 * 60 },
  { label: "Min", ms: 1000 * 60 },
  { label: "Sec", ms: 1000 },
];

const getTimeLeft = () => {
  const target = new Date(TARGET_DATE);
  const now = new Date();
  const diff = target - now;

  if (diff <= 0) return null;

  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const BOX_CLASS =
  "flex flex-col items-center justify-center w-[70px] h-[70px] rounded-xl bg-black/10 backdrop-blur-lg border border-white/20 shadow-lg";

const CountdownCard = ({ onFinish }) => {
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [finalSeconds, setFinalSeconds] = useState(null);
  const [shake, setShake] = useState(false);

  const isFinished = finalSeconds === 0;

  // 🎞 GIF LOGIC
  const currentGif = isFinished
    ? "/excited.gif"
    : finalSeconds !== null
    ? "/count.gif"
    : "/wait.gif";

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const updated = getTimeLeft();

      // 🔥 Already passed before load
      if (!updated && finalSeconds === null) {
        setFinalSeconds(3);
        return;
      }

      // 💓 Heartbeat starts at <= 5 sec
      if (updated?.total <= 3000 && updated?.total > 0) {
        audioRef.current?.play().catch(() => {});
      }

      // 🔥 Enter cinematic final countdown
      if (
        updated?.total <= 3000 &&
        updated?.total > 0 &&
        finalSeconds === null
      ) {
        setFinalSeconds(5);
        setShake(true);
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

          // 💓 heartbeat pulse
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }

          // 📳 vibration pulse
          navigator.vibrate?.([50, 50, 50]);

          return prev - 1;
        });

        return;
      }

      // ⏳ NORMAL COUNTDOWN
      if (updated) {
        setTimeLeft(updated);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [finalSeconds, onFinish]);

  return (
    <Card buttonText="I can't wait 😏">
      {/* 💓 heartbeat audio */}
      <audio ref={audioRef} src="/heartbeat.mp3" preload="auto" />

      <div
        className={`w-[90%] h-[50%] flex flex-col items-center justify-center text-center relative floaty ${
          shake ? "animate-pulse" : ""
        }`}
      >
        {/* 💖 glowing bg */}
        <div className="absolute inset-0 blur-2xl p-8 bg-red-600 h-[420px]" />

        <div className="relative z-10 w-[90%] flex flex-col items-center gap-5">
          {/* 💬 TEXT */}
          <p
            className={
              isFinished
                ? "text-white text-2xl font-bold  animate-pulse "
                : "text-white "
            }
          >
            {isFinished
              ? "OMG IT'S THE TIME! 🎉"
              : finalSeconds !== null
              ? "Are you ready princess? 😃"
              : "Heyy beautiful 😙, something special is waiting for you 💕"}
          </p>

          {/* 🎞 GIF */}
          <img
            src={currentGif}
            alt=""
            className="w-40 drop-shadow-2xl floaty gif-shadow-romantic"
          />

          {/* 💥 FINAL COUNTDOWN */}
          {finalSeconds !== null && (
            <h1 className="text-white text-4xl font-bold ">
              {finalSeconds || ""}
            </h1>
          )}

          {/* ⏳ NORMAL COUNTDOWN */}
          {finalSeconds === null && timeLeft && (
            <div className="grid grid-cols-4 gap-3 w-full">
              {TIME_UNITS.map(({ label }, i) => {
                const values = [
                  timeLeft.days,
                  timeLeft.hours,
                  timeLeft.minutes,
                  timeLeft.seconds,
                ];

                return (
                  <div key={label} className={BOX_CLASS}>
                    <span className="text-white glow-text2">
                      {values[i]}
                    </span>

                    <span className="text-xs text-white/70 glow-text2">
                      {label}
                    </span>
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