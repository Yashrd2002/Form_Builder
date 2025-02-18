export default function WaveLoader() {
    return (
      <div className="flex justify-center items-center ">
        <div className="relative flex space-x-2">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className={`w-2 h-8 bg-[#B0EB0A] animate-wave`}
              style={{ animationDelay: `${index * 0.2}s` }}
            ></div>
          ))}
        </div>
        <style jsx>{`
          @keyframes wave {
            0%, 100% {
              transform: scaleY(0.5);
            }
            50% {
              transform: scaleY(1);
            }
          }
  
          .animate-wave {
            animation: wave 1s infinite ease-in-out;
          }
        `}</style>
      </div>
    );
  }
  