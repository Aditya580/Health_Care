import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";

const MusicPlayer = forwardRef((props,ref) => {
    const [playlist, setPlaylist] = useState([
        {title: "Heaven - AShamaluevMusic", src: "/music/Heaven-Music.mp3", duration: 0},
        {title: "Zen - AShamaluevMusic", src: "/music/Zen - AShamaluevMusic.mp3", duration: 0},
        {title: "Calm Waves", src: "/music/track-1.mp3", duration: 0},
        {title: "Peaceful Mind", src: "/music/track-2.mp3", duration: 0},
        {title: "Tranquil Dreams", src: "/music/track-3.mp3", duration: 0},
    ]);

    const [currentTrack, setCurrentTrack] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(new Audio(playlist[0].src));

    // Imperative handle for parent components
    // this funnction is used to stop music when modal is closed
    useImperativeHandle(ref, () => ({
        stop() {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        },
    }));

    // Preload durations for ALL tracks once
    useEffect(() => {
        playlist.forEach((track, index) => {
            const tempAudio = new Audio(track.src);
            tempAudio.addEventListener("loadedmetadata", () => {
                setPlaylist((prev) => {
                    const updated = [...prev];
                    updated[index].duration = Math.floor(tempAudio.duration);
                    return updated;
                });
            });
        });
    }, []);

    // 🔹 Update audio source when track changes
    useEffect(() => {
        audioRef.current.src = playlist[currentTrack].src;
    }, [currentTrack, playlist]);

    // Sync audio element with play/pause state and track end
    useEffect(() => {
        const audio = audioRef.current;

        const updateProgress = () => {
            setProgress(audio.currentTime);
        };

        const handleEnded = () => {
            // when track ends, go to next but pause by default
            const nextIndex = (currentTrack + 1) % playlist.length;
            changeTrack(nextIndex, false); // false => don't auto-play
            setIsPlaying(false); // update button state
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [currentTrack]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Play / Pause toggle
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    // Next track (respects isPlaying)
    const handleNext = () => {
        const nextIndex = (currentTrack + 1) % playlist.length;
        changeTrack(nextIndex, isPlaying);
    };

    // Previous track (respects isPlaying)
    const handlePrev = () => {
        const prevIndex = (currentTrack - 1 + playlist.length) % playlist.length;
        changeTrack(prevIndex, isPlaying);
    };

    // 🔹 Updated changeTrack with control over play/pause
    const changeTrack = (index, shouldPlay) => {
        audioRef.current.pause();
        audioRef.current = new Audio(playlist[index].src);
        setCurrentTrack(index);
        setProgress(0);
        if (shouldPlay) {
            audioRef.current.play();
        }
    };

    // Format time (mm:ss)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <div className="w-full max-w-sm p-4 ">
            <div
                className="relative overflow-hidden rounded-lg 
        bg-white/10 backdrop-blur-md border border-white/20 
        p-6 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/20 "
            >
                {/* Decorative shadow layer */}
                <div className="absolute inset-0 z-0 h-full w-full rounded-lg shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)]" />

                {/* Main content */}
                <div className="relative z-10">
                    {/* Track info */}
                    <div className="flex items-start gap-2">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 -mt-1.5">
                            🎵
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-2xl" />
                        </div>
                        <div className="flex-1">
                            <div className="space-y-1.5">
                                <p className="font-semibold leading-none tracking-tight text-foreground dark:text-white">
                                    Now Playing
                                </p>
                                <p className="text-sm text-[#53718f]">{playlist[currentTrack].title}</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="pt-6 text-foreground dark:text-white">
                        <div className="space-y-2">
                            {/* Progress Bar */}
                            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-200/50 dark:bg-zinc-800/50">
                                <input
                                    type="range"
                                    min="0"
                                    max={playlist[currentTrack].duration}
                                    value={progress}
                                    onChange={(e) => {
                                        const newTime = Number(e.target.value);
                                        audioRef.current.currentTime = newTime;
                                        setProgress(newTime);
                                    }}
                                    className="absolute inset-0 w-full h-1.5 appearance-none bg-transparent cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, #000 0%, #000 ${
                                            (progress / playlist[currentTrack].duration) * 100
                                        }%, transparent ${
                                            (progress / playlist[currentTrack].duration) * 100
                                        }%, transparent 100%)`,
                                    }}
                                />
                            </div>

                            {/* Time Labels */}
                            <div className="flex justify-between text-xs font-medium">
                                <span className="tabular-nums text-[#53718f] ">{formatTime(progress)}</span>
                                <span className="tabular-nums text-[#53718f]">
                                    {formatTime(playlist[currentTrack].duration)}
                                </span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className=" flex items-center justify-center gap-6">
                            {/* Previous track button */}
                            <button
                                onClick={() => {
                                    const wasPlaying = isPlaying;
                                    handlePrev();

                                    if (audioRef.current) {
                                        // Stop any current attempt
                                        audioRef.current.pause();
                                        audioRef.current.currentTime = 0;

                                        // Wait until metadata is ready
                                        audioRef.current.onloadedmetadata = () => {
                                            if (wasPlaying) {
                                                audioRef.current.play().catch((err) => {
                                                    console.warn("Autoplay prevented:", err);
                                                });
                                                setIsPlaying(true);
                                            } else {
                                                setIsPlaying(false);
                                            }
                                        };
                                    }
                                }}
                                className="relative inline-flex items-center transition-colors justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 bg-transparent hover:scale-105 duration-300 transition text-primary h-9 w-9 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                aria-label="Previous track"
                            >
                                {/* Decorative layers and icon */}
                                <div className="absolute top-0 left-0 z-0 h-full w-full rounded-full shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] transition-all dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" />
                                <div className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-md " />
                                <div className="pointer-events-none z-10">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={20}
                                        height={20}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="size-5 text-[#262629]"
                                    >
                                        <path d="m15 18-6-6 6-6" />
                                    </svg>
                                </div>
                            </button>
                            <button
                                onClick={togglePlay}
                                className="relative inline-flex items-center transition-colors justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 bg-transparent hover:scale-105 duration-300 transition text-primary h-9 w-9 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                aria-label={isPlaying ? "Pause" : "Play"}
                            >
                                <div className="absolute top-0 left-0 z-0 h-full w-full rounded-full shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] transition-all dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" />
                                <div className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-md " />
                                <div className="pointer-events-none z-10">
                                    {isPlaying ? (
                                        // Pause Icon
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="size-5 text-[#262629]"
                                        >
                                            <rect width={4} height={16} x={6} y={4} />
                                            <rect width={4} height={16} x={14} y={4} />
                                        </svg>
                                    ) : (
                                        // Play Icon
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="size-5 text-[#262629]"
                                        >
                                            <polygon points="6 4 20 12 6 20 6 4" />
                                        </svg>
                                    )}
                                </div>
                            </button>

                            {/* Next track button */}
                            <button
                                onClick={() => {
                                    const wasPlaying = isPlaying;
                                    handleNext();

                                    if (audioRef.current) {
                                        // Stop any current attempt
                                        audioRef.current.pause();
                                        audioRef.current.currentTime = 0;

                                        // Wait until metadata is ready
                                        audioRef.current.onloadedmetadata = () => {
                                            if (wasPlaying) {
                                                audioRef.current.play().catch((err) => {
                                                    console.warn("Autoplay prevented:", err);
                                                });
                                                setIsPlaying(true);
                                            } else {
                                                setIsPlaying(false);
                                            }
                                        };
                                    }
                                }}
                                className="relative inline-flex items-center transition-colors justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 bg-transparent hover:scale-105 duration-300 transition text-primary h-9 w-9 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                aria-label="Next track"
                            >
                                <div className="absolute top-0 left-0 z-0 h-full w-full rounded-full shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] transition-all dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" />
                                <div className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-md " />
                                <div className="pointer-events-none z-10">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={20}
                                        height={20}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="size-5 text-[#262629]"
                                    >
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 z-20 rounded-lg bg-gradient-to-r from-transparent dark:via-white/5 via-black/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none" />
            </div>
        </div>
    );
});

export default MusicPlayer;
