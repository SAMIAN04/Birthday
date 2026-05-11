import { motion } from "framer-motion";

const Latter = () => {
  const text =
    "Happy Birthday to the sweetest soul who ever came into my life. 💖 You make my world softer, brighter, and so much more beautiful just by being in it. Every smile of yours feels like magic to me, and today I just want you to feel as loved as you make me feel every single day. Happy Birthday my pretty princess…........ I love you more than words could ever explain. ";

  const letters = Array.from(text);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.035,
        delayChildren: 0.7,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 4,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.18,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-[90%] flex justify-start flex-col items-start gap-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="
          relative
          text-[#83033ae3]
          text-[17px]
          leading-[2]
          tracking-[0.01em]
          max-w-[340px]
          text-left
          whitespace-pre-wrap
        word-spacing-wide
        drop-shadow-[0_2px_4px_rgba(131,3,58,0.2)]
          
        "
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            variants={childVariants}
            className="inline font-apple tracking-wide"
          >
                {letter}
                
          </motion.span>
        ))}

        {/* The Signature */}
       
          </motion.div>
           <motion.div
          variants={childVariants}
          className=" flex self-end mt-8 italic opacity-80 font-apple  text-[#83033ae3] drop-shadow-[0_2px_4px_rgba(131,3,58,0.2)]"
          style={{ fontSize: "15px" }}
        >
          — Your man 😌💕
        </motion.div>
    </div>
  );
};

export default Latter;