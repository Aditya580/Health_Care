import {createPortal} from "react-dom";
import {useEffect, useState, useRef} from "react";

function DanceParty({onClose}) {
    // lock scroll on mount
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    
    const videoRef = useRef(null);
    const audioRef = useRef(null);

    const tracks = [
        "/beats/Aaron Smith - Dancin.mp3",
        "/beats/bensound-bymyside.mp3",
        "/beats/bensound-clapandyell.mp3",
        "/beats/bensound-jazzyfrenchy.mp3",
    ];

    function getRandomTrack() {
        const idx = Math.floor(Math.random() * tracks.length);
        return tracks[idx];
    }

    const [isPlaying, setIsPlaying] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const togglePlay = () => {
        if (isPlaying) {
            videoRef.current.pause();
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            if (!hasStarted) {
                // play first track only once
                audioRef.current.src = tracks[0];
                setHasStarted(true);
            }
            videoRef.current.play();
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    function shuffleTrack() {
        let newTrack = getRandomTrack();
        // make sure it’s not same as current
        while (audioRef.current.src.includes(newTrack)) {
            newTrack = getRandomTrack();
        }
        audioRef.current.src = newTrack;
        audioRef.current.play();
        videoRef.current.play();
        setHasStarted(true); // now toggle is just pause/resume
        setIsPlaying(true);
    }

    return createPortal(
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            {/* main card */}
            <div className="bg-white border-2 border-white/80 rounded-lg shadow-lg w-[300px] h-[500px] max-w-md relative overflow-hidden">
                {/* Video background */}
                <video
                    ref={videoRef}
                    src="/png/party_bg.mp4"
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                ></video>

                {/* Hidden audio element */}
                <audio ref={audioRef} />

                {/* Content overlay */}
                <div className="relative z-10 p-6 h-full flex flex-col">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 border-2 border-white  rounded-sm bg-black/50
            text-xl text-gray-200 px-1 hover:cursor-pointer  hover:bg-white/20"
                    >
                        &times;
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10">
                            <img src="/png/disco.gif" alt="Disco Ball" className="w-full h-full object-cover" />
                        </div>
                        <h2 className="text-2xl font-bold my-5  text-center text-white">Vibe With Beats </h2>
                    </div>

                    {/* buttons */}
                    <div
                        className="w-full absolute bottom-4 left-1/2 -translate-x-1/2 
    flex flex-col items-center justify-center space-y-2 px-5 "
                    >
                        {/* Play / Pause Button */}
                        <button
                            onClick={togglePlay}
                            className="w-full mt-auto flex items-center justify-center gap-2 
            border-2 border-white rounded-md text-white px-5 py-2 font-medium bg-black/50
            hover:bg-white/20 cursor-pointer"
                        >
                            <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
                            {isPlaying ? "Pause" : "Play"}
                        </button>
                        {/* Change Track */}
                        <button
                            onClick={shuffleTrack}
                            className="w-full mt-auto flex items-center justify-center gap-2 
            border-2 border-white rounded-md text-white px-5 py-2 font-medium bg-black/50
            hover:bg-white/20 cursor-pointer"
                        >
                            <i class="fa-solid fa-shuffle"></i>
                            Change Track
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default DanceParty;
