import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Embedded CSS for animations
const breathingStyles = `
@keyframes breathe {
    0% { transform: scale(1); }
    33% { transform: scale(1.5); }
    66% { transform: scale(1.5); }
    100% { transform: scale(1); }
}
.breathing-circle {
    animation: breathe 6s infinite ease-in-out;
    animation-play-state: paused;
}
.breathing-circle.active {
    animation-play-state: running;
}
.fade-in {
    animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}
`;

const PHASES = [
  { name: "in", text: "Breathe In", duration: 2000 },
  { name: "hold", text: "Hold", duration: 2000 },
  { name: "out", text: "Breathe Out", duration: 2000 },
  { name: "rest", text: "Rest", duration: 1000 },
];

export default function BreathingExercise({ onClose }) {
  const [isActive, setIsActive] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [instruction, setInstruction] = useState("Ready to begin");

  const phaseTimer = useRef(null);
  const circleRef = useRef(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(phaseTimer.current);
      document.body.style.overflow = "auto";
    };
  }, []);

  // Handle phase progression
  useEffect(() => {
    if (isActive) {
      runPhase();
    } else {
      clearTimeout(phaseTimer.current);
      setInstruction("Ready to begin");
      if (circleRef.current) {
        circleRef.current.classList.remove("active");
        circleRef.current.style.animation = "none";
        circleRef.current.style.transform = "scale(1)";
      }
    }
    // eslint-disable-next-line
  }, [isActive]);

  function runPhase() {
    const phase = PHASES[phaseIdx];
    setInstruction(phase.text);

    if (circleRef.current) {
      if (phase.name === "rest") {
        circleRef.current.classList.remove("active");
        circleRef.current.style.animation = "none";
        circleRef.current.style.transform = "scale(1)";
      } else {
        circleRef.current.classList.add("active");
        circleRef.current.style.animation = "";
        circleRef.current.style.transform = "";
      }
    }

    phaseTimer.current = setTimeout(() => {
      setPhaseIdx((prevIdx) => (prevIdx + 1) % PHASES.length);
    }, phase.duration);
  }

  useEffect(() => {
    if (isActive) {
      runPhase();
    }
    // eslint-disable-next-line
  }, [phaseIdx]);

  // Button styles
  const activeButton =
    "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700";
  const inactiveButton =
    "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700";

  // Toggle start/stop
  function toggleActive() {
    setIsActive((prev) => {
      if (prev) {
        clearTimeout(phaseTimer.current);
        setPhaseIdx(0);
        setInstruction("Ready to begin");
        return false;
      } else {
        setPhaseIdx(0);
        return true;
      }
    });
  }

  return createPortal(
    <div>
      <style>{breathingStyles}</style>
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        tabIndex={-1}
        onClick={(e) => {
          if (e.target === e.currentTarget && onClose) onClose();
        }}
      >
        <div className="bg-[#edeaff] rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-2 relative fade-in">
          {/* Close Button */}
          {onClose && (
            <button
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 group"
              onClick={onClose}
              aria-label="Close"
            >
              <svg
                className="w-4 h-4 text-gray-600 group-hover:text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Breathing Exercise
            </h2>
            <p className="text-gray-600">Find your calm with guided breathing</p>
          </div>

          {/* Circle + Instructions */}
          <div className="flex flex-col items-center mb-12">
            <div className="mb-10 h-8 flex items-center">
              <span className="text-lg font-medium text-gray-700 transition-all duration-300">
                {instruction}
              </span>
            </div>

            <div className="relative flex items-center justify-center mb-10">
              <div
                ref={circleRef}
                className="breathing-circle w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full shadow-lg flex items-center justify-center transition-transform duration-500"
              >
                <div className="w-20 h-20 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-white bg-opacity-50 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Button */}
          <div className="text-center">
            <button
              className={`text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                isActive ? activeButton : inactiveButton
              }`}
              onClick={toggleActive}
            >
              {isActive ? "Stop" : "Start"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
