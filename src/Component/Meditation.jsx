import MusicPlayer from "./MusicPlayer";
import {createPortal} from "react-dom";
import {useRef, useEffect} from "react";


export default function Meditation({onClose}) {
    const playerRef = useRef();
    // lock scroll on mount, restore on unmount
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    // Handle close
    const handleClose = () => {
        if (playerRef.current) {
            playerRef.current.stop(); // stop music directly
        }
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <style
                dangerouslySetInnerHTML={{
                    __html: `
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            .floating-element { animation: float 3s ease-in-out infinite; }
            .glass-effect {
              background: #edeaff;
              backdrop-filter: blur(10px);
              -webkit-backdrop-filter: blur(10px);
              border: 1px solid rgba(255,255,255,0.15);
            }
          `,
                }}
            />
            <div className="relative border-2 border-zinc-900 rounded-2xl w-full max-w-sm h-[550px] fade-in overflow-hidden">
                {/* Background */}
                <img
                    src="/png/meditation-bg.jpg"
                    alt="player-background"
                    className="w-full h-full object-cover rounded-2xl blur-[3px]"
                />
                {/* Close Button */}
                <button
                    className="absolute w-10 top-4 right-4 p-2 bg-white/20 rounded-xl shadow-md font-bold font-[Open Sans] hover:cursor-pointer"
                    onClick={handleClose}
                >
                    X
                </button>
                {/* Floating Icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-60">
                    <div className="floating-element mb-6 flex justify-start">
                        <div className="w-32 h-44 rounded-2xl p-1 ">
                            <img
                                src="/png/meditation-icon.png"
                                alt="Meditation Icon"
                                className="w-full h-full rounded-xl object-fit block"
                            />
                        </div>
                    </div>
                </div>
                {/* Instructions */}
                <div
                    className="absolute top-1/2 left-1/2 
                              -translate-x-1/2 -translate-y-15
                              text-center text-md font-medium font-Helvetica 
                              text-[#004526] drop-shadow-lg leading-relaxed bg-white/30 w-full p-3"
                >
                    Sit comfortably. Don't try to stop your thoughts;
                    <br /> just observe them as they come and go.
                </div>

                {/* Music Player */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-12 w-full ">
                    {/* Stop music when modal is closed */}
                    <MusicPlayer ref={playerRef} />
                </div>
            </div>
        </div>,
        document.body
    );
}
