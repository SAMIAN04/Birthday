const Card = ({ children, onNext, buttonText = "Next 💕" }) => {
  return (
    <div className="absolute w-full h-full bg-white rounded-3xl shadow-2xl p-8  flex flex-col justify-between animate-slideIn">
      
          <div className="flex-1 flex items-center justify-center text-center bg-pink-100 rounded-xl p-6">
        {children}
      </div>

      {onNext && (
        <button
          onClick={onNext}
          className="mt-4 bg-pink-400 text-white py-2 rounded-full hover:scale-105 transition"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default Card;