import { useNavigate } from "react-router-dom";
import Card from "../templates/Card";
import {useState} from "react";
import Wheel from "./Wheel";
import BreathingExercise from "./BreathingExercise";
import Meditation from "./Meditation";
import DanceParty from "./DanceParty";
import MovieRecommender from "../pages/MovieRecommender";
import Nap from "./Nap";

export default function Dashboard() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [showWheel, setShowWheel] = useState(false);
    const [showBreathing, setShowBreathing] = useState(false);
    const [showMeditation, setShowMeditation] = useState(false);
    const [showNap, setShowNap] = useState(false);
    const [showDanceParty, setShowDanceParty] = useState(false);
    const navigate = useNavigate();
    

    const cards = [
        {
            image: "png/wheel.png",
            title: "Wheel",
            message: "Spin the wheel to do something fun.",
            buttonText: "Spin",
            category: "fun",
            action: () => setShowWheel(true),
        },
        {
            image: "png/meditation.png",
            title: "Meditation",
            message: "Find your inner peace with guided meditation.",
            buttonText: "Meditate",
            category: "relax",
            action : () => setShowMeditation(true),
        },
        {
            image: "png/lungs.png",
            title: "Breathe",
            message: "Breathe deeply and relax your mind.",
            buttonText: "Breathe",
            category: "relax",
            action: () => setShowBreathing(true),
        },
        {
            image: "png/nap.png",
            title: "Nap",
            message: "Take a short nap to recharge yourself.",
            buttonText: "Start Nap",
            category: "relax",
            action : () => setShowNap(true)
        },
        {
            image: "png/movie.png",
            title: "Movies",
            message: "Enjoy a selection of calming movies.",
            buttonText: "Watch",
            category: "media",
            action: () => navigate("/movies"),
        },
        {
            image: "png/stories.png",
            title: "Stories",
            message: "Read inspiring and motivational stories.",
            buttonText: "Read",
            category: "media",
            action: () => navigate("/stories"),
        },
        {
            image: "png/skeleton-dance.png",
            title: "Vibe Fest",
            message: "Vibe with the magical flow of music.",
            buttonText: "Vibe",
            category: "Entertainment",
            action : () => setShowDanceParty(true)
        },
        {
            image: "png/drawing.png",
            title: "Drawing",
            message: "Unleash your creativity with drawing.",
            buttonText: "Draw",
            category: "fun",
            action:()=> navigate("/draw"),
        },
        {
            image: "png/tetris.png",
            title: "Tetris",
            message: "Take a break and play Tetris to reset.",
            buttonText: "Play",
            category: "fun",
            action: () => window.open("/tetris", "_blank"),
        },
    ];

    const filteredCards = activeFilter === "all" ? cards : cards.filter((c) => c.category === activeFilter);

    return (
        <>
            <div className="flex flex-col gap-5">
                {/* Buttons Group */}
                <div className="button-group flex flex-wrap justify-center items-center gap-4 mt-18 ">
                    <button
                        onClick={() => setActiveFilter("all")}
                        className="rounded-full border border-gray-700 bg-transparent text-black py-2 px-4 font-[Nunito] hover:bg-gray-100 transition cursor-pointer"
                    >
                        Show All
                    </button>
                    <button
                        onClick={() => setActiveFilter("fun")}
                        className="rounded-full border border-gray-700 bg-transparent text-black py-2 px-4 font-[Nunito] hover:bg-gray-100 transition cursor-pointer"
                    >
                        🎡 Spin The Wheel
                    </button>
                    <button
                        onClick={() => setActiveFilter("relax")}
                        className="rounded-full border border-gray-700 bg-transparent text-black py-2 px-4 font-[Nunito] hover:bg-gray-100 transition cursor-pointer"
                    >
                        🧘‍♀️ Relaxation
                    </button>
                    <button
                        onClick={() => setActiveFilter("media")}
                        className="rounded-full border border-gray-700 bg-transparent text-black py-2 px-4 font-[Nunito] hover:bg-gray-100 transition cursor-pointer"
                    >
                        🎬 Movies and Stories
                    </button>
                    <button
                        onClick={() => setActiveFilter("nature")}
                        className="rounded-full border border-gray-700 bg-transparent text-black py-2 px-4 font-[Nunito] hover:bg-gray-100 transition cursor-pointer"
                    >
                        🌳 Nature & Mindfulness
                    </button>
                </div>

                {/* Cards */}
                <div className="px-10 cards-group p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
                    {filteredCards.map((card, idx) => (
                        <Card key={idx} {...card} />
                    ))}
                </div>
                {/* Show Wheel if triggered */}
                {showWheel && <Wheel onClose={() => setShowWheel(false)} />}
                {/* Show Meditation card if triggered */}
                {showMeditation && <Meditation onClose={() => setShowMeditation(false)} />}
                {/* Show Breathing Exercise card if triggered */}
                {showBreathing && <BreathingExercise onClose={() => setShowBreathing(false)} />}
                {/* Show Nap card if triggered */}
                {showNap && <Nap onClose={() => setShowNap(false)} />}
                {/* Show Dance Party card if triggered */}
                {showDanceParty && <DanceParty onClose={() => setShowDanceParty(false)} />}
            </div>
        </>
    );
}


