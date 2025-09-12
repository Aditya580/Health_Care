// import React, {useState, useRef, useEffect} from "react";
// import {createPortal} from "react-dom";

// const timeOptions = [3, 5, 10, 15, 20, 25, 30, 35, 40];

// const TimerCard = ({onclose}) => {
//     const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
//     const [totalMinutes, setTotalMinutes] = useState(timeOptions[0]);
//     const [currentSeconds, setCurrentSeconds] = useState(timeOptions[0] * 60);
//     const [originalSeconds, setOriginalSeconds] = useState(timeOptions[0] * 60);
//     const [isRunning, setIsRunning] = useState(false);
//     const [isCompleted, setIsCompleted] = useState(false);

//     const timerInterval = useRef(null);

//     // Web Audio API for completion sound
//     const playCompletionSound = () => {
//         const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//         const frequencies = [800, 1000, 800, 1000, 1200];
//         let startTime = audioContext.currentTime;
//         frequencies.forEach((freq, index) => {
//             const oscillator = audioContext.createOscillator();
//             const gainNode = audioContext.createGain();
//             oscillator.connect(gainNode);
//             gainNode.connect(audioContext.destination);
//             oscillator.frequency.setValueAtTime(freq, startTime + index * 0.2);
//             oscillator.type = "sine";
//             gainNode.gain.setValueAtTime(0, startTime + index * 0.2);
//             gainNode.gain.linearRampToValueAtTime(0.3, startTime + index * 0.2 + 0.05);
//             gainNode.gain.linearRampToValueAtTime(0, startTime + index * 0.2 + 0.15);
//             oscillator.start(startTime + index * 0.2);
//             oscillator.stop(startTime + index * 0.2 + 0.15);
//         });
//     };

//     // Timer logic
//     useEffect(() => {
//         if (isRunning && !isCompleted) {
//             timerInterval.current = setInterval(() => {
//                 setCurrentSeconds((prev) => {
//                     if (prev > 1) return prev - 1;
//                     clearInterval(timerInterval.current);
//                     setIsRunning(false);
//                     setIsCompleted(true);
//                     playCompletionSound();
//                     return 0;
//                 });
//             }, 1000);
//         }
//         return () => clearInterval(timerInterval.current);
//         // eslint-disable-next-line
//     }, [isRunning]);

//     // Progress calculation
//     const progress = originalSeconds > 0 ? ((originalSeconds - currentSeconds) / originalSeconds) * 100 : 0;

//     // UI handlers
//     const adjustTimer = (direction) => {
//         if (isRunning || isCompleted) return;
//         let newIndex = currentTimeIndex + direction;
//         if (newIndex < 0 || newIndex > timeOptions.length - 1) return;
//         setCurrentTimeIndex(newIndex);
//         setTotalMinutes(timeOptions[newIndex]);
//         setCurrentSeconds(timeOptions[newIndex] * 60);
//         setOriginalSeconds(timeOptions[newIndex] * 60);
//     };

//     const toggleTimer = () => {
//         if (isRunning) {
//             setIsRunning(false);
//         } else {
//             if (currentSeconds <= 0) {
//                 setCurrentSeconds(totalMinutes * 60);
//                 setOriginalSeconds(totalMinutes * 60);
//                 setIsCompleted(false);
//             }
//             setIsRunning(true);
//         }
//     };

//     const resetTimer = () => {
//         setIsRunning(false);
//         clearInterval(timerInterval.current);
//         if (isCompleted) {
//             setCurrentTimeIndex(0);
//             setTotalMinutes(timeOptions[0]);
//             setIsCompleted(false);
//             setCurrentSeconds(timeOptions[0] * 60);
//             setOriginalSeconds(timeOptions[0] * 60);
//         } else {
//             setCurrentSeconds(totalMinutes * 60);
//             setOriginalSeconds(totalMinutes * 60);
//         }
//     };

//     // Hide card logic
//     const [hideCard, setHideCard] = useState(false);
//     const closeCard = () => {
//         setHideCard(true);
//     };

//     // Format timer
//     const minutes = Math.floor(currentSeconds / 60);
//     const seconds = currentSeconds % 60;

//     if (hideCard) return null;

//     return createPortal(

//             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//                 <div
//                     className="min-h-screen background-blur flex items-center justify-center p-4"
//                     style={{
//                         fontFamily: "'Inter', sans-serif",
//                         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                         backdropFilter: "blur(10px)",
//                     }}
//                 >
//                     <div
//                         className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 w-full max-w-sm card-shadow"
//                         style={{
//                             boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1)",
//                             transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
//                         }}
//                     >
//                         <button
//                             className="absolute -top-2 -right-2 w-10 h-10 rounded-full border-2 border-white/60 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl font-light close-button"
//                             style={{transition: "all 0.2s ease-in-out"}}
//                             onClick={onClose}
//                         >
//                             ×
//                         </button>
//                         {/* GIF Placeholder */}
//                         <div
//                             className="w-full h-32 rounded-2xl mb-6 flex items-center justify-center"
//                             style={{
//                                 background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)",
//                                 backgroundSize: "400% 400%",
//                                 animation: "gradientShift 3s ease infinite",
//                             }}
//                         >
//                             <div className="text-white font-medium text-sm opacity-80">Animated Content</div>
//                         </div>
//                         {/* Timer Display */}
//                         <div className="text-center mb-8">
//                             <div
//                                 className={`text-5xl font-light text-gray-800 mb-2 timer-transition ${
//                                     isCompleted ? "text-green-500" : "text-gray-800"
//                                 }`}
//                                 style={{transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)"}}
//                             >
//                                 {minutes}:{seconds.toString().padStart(2, "0")}
//                             </div>
//                             <div className="text-sm text-gray-500 font-medium">MINUTES REMAINING</div>
//                         </div>
//                         {/* Timer Controls */}
//                         <div className="flex items-center justify-center space-x-4 mb-6">
//                             <button
//                                 className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-light button-hover"
//                                 style={{
//                                     opacity: currentTimeIndex <= 0 ? "0.5" : "1",
//                                     transition: "all 0.2s ease-in-out",
//                                 }}
//                                 disabled={currentTimeIndex <= 0}
//                                 onClick={() => adjustTimer(-1)}
//                             >
//                                 −
//                             </button>
//                             {!isCompleted && (
//                                 <button
//                                     className={`px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium button-hover ${
//                                         isRunning ? "animate-pulse" : ""
//                                     }`}
//                                     onClick={toggleTimer}
//                                 >
//                                     {isRunning
//                                         ? "Pause"
//                                         : currentSeconds === 0
//                                         ? "Start"
//                                         : isCompleted
//                                         ? "Start"
//                                         : "Start"}
//                                 </button>
//                             )}
//                             <button
//                                 className={`px-4 py-3 ${
//                                     isCompleted ? "bg-red-500 hover:bg-red-600" : "bg-gray-500 hover:bg-gray-600"
//                                 } text-white rounded-full font-medium text-sm button-hover`}
//                                 onClick={resetTimer}
//                             >
//                                 {isCompleted ? "Stop" : "Reset"}
//                             </button>
//                             <button
//                                 className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-light button-hover"
//                                 style={{
//                                     opacity: currentTimeIndex >= timeOptions.length - 1 ? "0.5" : "1",
//                                     transition: "all 0.2s ease-in-out",
//                                 }}
//                                 disabled={currentTimeIndex >= timeOptions.length - 1}
//                                 onClick={() => adjustTimer(1)}
//                             >
//                                 +
//                             </button>
//                         </div>
//                         {/* Progress Bar */}
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                                 className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-linear"
//                                 style={{width: `${progress}%`}}
//                             ></div>
//                         </div>
//                         {/* Gradient Animation Keyframes */}
//                         <style>
//                             {`
//           @keyframes gradientShift {
//             0% { background-position: 0% 50%; }
//             50% { background-position: 100% 50%; }
//             100% { background-position: 0% 50%; }
//           }
//           `}
//                         </style>
//                     </div>
//                 </div>
//             </div>,
//         document.body
//     );
// };

// export default TimerCard;

import {useState, useRef, useEffect} from "react";
import {createPortal} from "react-dom";

const timeOptions = [1,3, 5, 10, 15, 20, 25, 30, 35, 40];

const TimerCard = ({onClose}) => {
    const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
    const [totalMinutes, setTotalMinutes] = useState(timeOptions[0]);
    const [currentSeconds, setCurrentSeconds] = useState(timeOptions[0] * 60);
    const [originalSeconds, setOriginalSeconds] = useState(timeOptions[0] * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const timerInterval = useRef(null);
    const audioRef = useRef(new Audio("alarm-sound/alarm.mp3"));

    // Completion sound
    const playCompletionSound = () => {
        audioRef.current.play().catch((err) => console.error("Audio play failed:", err));
    };

    // Timer logic
    useEffect(() => {
        if (isRunning && !isCompleted) {
            timerInterval.current = setInterval(() => {
                setCurrentSeconds((prev) => {
                    if (prev > 1) return prev - 1;
                    clearInterval(timerInterval.current);
                    setIsRunning(false);
                    setIsCompleted(true);
                    playCompletionSound();
                    return 0;
                });
            }, 1000);
        }
        return () => clearInterval(timerInterval.current);
    }, [isRunning, isCompleted]);

    const progress = originalSeconds > 0 ? ((originalSeconds - currentSeconds) / originalSeconds) * 100 : 0;

    const adjustTimer = (direction) => {
        if (isRunning || isCompleted) return;
        let newIndex = currentTimeIndex + direction;
        if (newIndex < 0 || newIndex > timeOptions.length - 1) return;
        setCurrentTimeIndex(newIndex);
        setTotalMinutes(timeOptions[newIndex]);
        setCurrentSeconds(timeOptions[newIndex] * 60);
        setOriginalSeconds(timeOptions[newIndex] * 60);
    };

    const toggleTimer = () => {
        if (isRunning) {
            setIsRunning(false);
        } else {
            if (currentSeconds <= 0) {
                setCurrentSeconds(totalMinutes * 60);
                setOriginalSeconds(totalMinutes * 60);
                setIsCompleted(false);
            }
            setIsRunning(true);
        }
    };

    const resetTimer = () => {
        setIsRunning(false);
        clearInterval(timerInterval.current);
        if (isCompleted) {
            setCurrentTimeIndex(0);
            setTotalMinutes(timeOptions[0]);
            setIsCompleted(false);
            setCurrentSeconds(timeOptions[0] * 60);
            setOriginalSeconds(timeOptions[0] * 60);
        } else {
            setCurrentSeconds(totalMinutes * 60);
            setOriginalSeconds(totalMinutes * 60);
        }
    };

    const [hideCard, setHideCard] = useState(false);
    const closeCard = () => setHideCard(true);

    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;

    if (hideCard) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
                className="relative bg-[#edeaff] backdrop-blur-sm rounded-3xl p-8 w-full max-w-sm card-shadow"
                style={{
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1)",
                    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
            >
                {/* Close Button */}
                <button
                    className="absolute -top-2 -right-2 w-12 h-10 rounded-xl border-2 border-white/60 bg-white/20 backdrop-blur-sm flex items-center justify-center text-[#6b7282] text-2xl font-bold hover:cursor-pointer"
                    style={{transition: "all 0.2s ease-in-out"}}
                    onClick={() => {
                        closeCard();
                        if (onClose) onClose();
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                    }}
                >
                    ×
                </button>

                {/* Animated GIF */}
                <div
                    className="w-full h-40 rounded-2xl mb-6 flex items-center justify-center"
                    style={{
                        background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)",
                        backgroundSize: "400% 400%",
                        animation: "gradientShift 3s ease infinite",
                    }}
                >
                    <img src="/png/sleeping.jpeg" alt="Sleep GIF" className="object-cover w-full h-full rounded-2xl" />
                </div>

                <div className="text-center mb-8">
                    <div
                        className={`text-5xl font-light text-gray-800 mb-2 timer-transition ${
                            isCompleted ? "text-green-500" : "text-gray-800"
                        }`}
                        style={{transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)"}}
                    >
                        {minutes}:{seconds.toString().padStart(2, "0")}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">MINUTES REMAINING</div>
                </div>

                <div className="flex items-center justify-center space-x-4 mb-6">
                    <button
                        className="w-12 h-12 rounded-full bg-white hover:bg-gray-200 flex items-center justify-center text-black text-xl font-bold button-hover"
                        style={{opacity: currentTimeIndex <= 0 ? "0.5" : "1", transition: "all 0.2s ease-in-out"}}
                        disabled={currentTimeIndex <= 0}
                        onClick={() => adjustTimer(-1)}
                    >
                        −
                    </button>

                    {!isCompleted && (
                        <button
                            className={`px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium button-hover ${
                                isRunning ? "animate-pulse" : ""
                            }`}
                            onClick={toggleTimer}
                        >
                            {isRunning ? "Pause" : "Start"}
                        </button>
                    )}

                    <button
                        className={`px-4 py-3 ${
                            isCompleted ? "bg-red-500 hover:bg-red-600" : "bg-gray-500 hover:bg-gray-600"
                        } text-white rounded-full font-medium text-sm button-hover`}
                        onClick= {() => {
                            resetTimer();
                            audioRef.current.pause();
                            audioRef.current.currentTime = 0;
                        }}
                    >
                        {isCompleted ? "Stop" : "Reset"}
                    </button>

                    <button
                        className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-bold button-hover"
                        style={{
                            opacity: currentTimeIndex >= timeOptions.length - 1 ? "0.5" : "1",
                            transition: "all 0.2s ease-in-out",
                        }}
                        disabled={currentTimeIndex >= timeOptions.length - 1}
                        onClick={() => adjustTimer(1)}
                    >
                        +
                    </button>
                </div>

                <div className="w-full bg-[#6b7282]/70 rounded-full h-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                        style={{width: `${progress}%`}}
                    ></div>
                </div>

                <style>
                    {`
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            `}
                </style>
            </div>
        </div>,
        document.body
    );
};

export default TimerCard;
