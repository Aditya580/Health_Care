import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./Component/Navbar";
import Hero from "./Component/Hero";
import Activities from "./Component/Activities.jsx";
import Tips from "./Component/Tips.jsx";
import Draw from "./Component/Draw.jsx";
import Tracker from "./Component/Tracker";
import Footer from "./Component/Footer.jsx";
import ScrollToTop from "./Component/ScrollToTop.jsx";
import { useIsVisible } from "./hooks/useIsVisible.jsx";
import { useRef } from "react";
import ChatBot from "./Component/ChatBot.jsx";

// Lazy imports for heavy routes
const StoriesPage = lazy(() => import("./pages/StoriesPage.jsx"));
const StoryDetailPage = lazy(() => import("./pages/StoryDetailPage.jsx"));
const MovieRecommender = lazy(() => import("./pages/MovieRecommender.jsx"));
const MovieGenreList = lazy(() => import("./pages/MovieGenreList.jsx"));
const Tetris = lazy(() => import("./games/Tetris/components/Tetris.jsx"));

function SectionWrapper({ children }) {
    const ref = useRef();
    const isVisible = useIsVisible(ref);

    return (
        <div className="w-full overflow-hidden flex flex-col justify-center items-center">
            <div
                ref={ref}
                style={{ minWidth: 0 }}
                className={`w-full flex flex-col justify-center transition-all ease-in duration-700 transform-gpu ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
                }`}
            >
                {children}
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    {/* Main site */}
                    <Route
                        path="/"
                        element={
                            <div className="flex flex-col items-center">
                                <Navbar />
                                <SectionWrapper><Hero /></SectionWrapper>
                                <SectionWrapper><Activities /></SectionWrapper>
                                <SectionWrapper><Tips /></SectionWrapper>
                                <SectionWrapper><Tracker /></SectionWrapper>
                                <Footer />
                                <ChatBot />
                            </div>
                        }
                    />

                    <Route path="/stories" element={<><Navbar /><StoriesPage /><Footer /></>} />
                    <Route path="/stories/:id" element={<><StoryDetailPage /><Footer /></>} />
                    <Route path="/movies" element={<><MovieRecommender /><Footer /></>} />
                    <Route path="/draw" element={<><Draw /><Footer /></>} />
                    <Route path="/movies/genre/:genreId" element={<><MovieGenreList /><Footer /></>} />

                    {/* Game: only loads when /tetris is visited */}
                    <Route path="/tetris" element={<Tetris />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
