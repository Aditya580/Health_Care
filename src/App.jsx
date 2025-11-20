import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Suspense, lazy, useState} from "react";
import Navbar from "./Component/Navbar";
import Hero from "./Component/Hero";
import Tips from "./Component/Tips.jsx";
import Draw from "./Component/Draw.jsx";
import Tracker from "./Component/Tracker";
import Activities from "./Component/Activities.jsx";
import Footer from "./Component/Footer.jsx";
import Community from "./Component/Community.jsx";
import ScrollToTop from "./Component/ScrollToTop.jsx";
import {useIsVisible} from "./hooks/useIsVisible.jsx";
import {useRef} from "react";
import ChatBot from "./Component/ChatBot.jsx";
import Contact from "./Component/Contact.jsx";
import SignIn from "./authentication/AuthModel.jsx";

// Lazy imports for heavy routes
const StoriesPage = lazy(() => import("./pages/StoriesPage.jsx"));
const StoryDetailPage = lazy(() => import("./pages/StoryDetailPage.jsx"));
const MovieRecommender = lazy(() => import("./pages/MovieRecommender.jsx"));
const MovieGenreList = lazy(() => import("./pages/MovieGenreList.jsx"));
const Tetris = lazy(() => import("./games/Tetris/components/Tetris.jsx"));

function SectionWrapper({children}) {
    const ref = useRef();
    const isVisible = useIsVisible(ref);

    return (
        <div className="w-full overflow-hidden flex flex-col justify-center items-center">
            <div
                ref={ref}
                style={{minWidth: 0}}
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
    const [showLogin, setShowLogin] = useState(false);
    return (
        
            <Router>
                <ScrollToTop />
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        {/* Home */}
                        <Route
                            path="/"
                            element={
                                <>
                                    {showLogin && <SignIn onClose={() => setShowLogin(false)} />}
                                    <div className="flex flex-col items-center">
                                        <Navbar onLoginClick={() => setShowLogin(true)} />
                                        <SectionWrapper>
                                            <Hero />
                                        </SectionWrapper>
                                        <SectionWrapper>
                                            <Activities />
                                        </SectionWrapper>
                                        <SectionWrapper>
                                            <Tips />
                                        </SectionWrapper>
                                        <SectionWrapper>
                                            <Tracker />
                                        </SectionWrapper>
                                        <Footer />
                                        <ChatBot />
                                    </div>
                                </>
                            }
                        />

                        <Route
                            path="/stories"
                            element={
                                <>
                                    <Navbar />
                                    <StoriesPage />
                                    <Footer />
                                </>
                            }
                        />
                        <Route
                            path="/stories/:id"
                            element={
                                <>
                                    <StoryDetailPage />
                                    <Footer />
                                </>
                            }
                        />
                        <Route
                            path="/movies"
                            element={
                                <>
                                    <MovieRecommender />
                                    <Footer />
                                </>
                            }
                        />
                        <Route
                            path="/draw"
                            element={
                                <>
                                    <Draw />
                                    <Footer />
                                </>
                            }
                        />
                        <Route
                            path="/community"
                            element={
                                <>
                                    <Community />
                                    <Footer />
                                </>
                            }
                        />

                        <Route
                            path="/activity"
                            element={
                                <>
                                    <Activities />
                                    <Footer />
                                </>
                            }
                        />

                        <Route
                            path="/movies/genre/:genreId"
                            element={
                                <>
                                    <MovieGenreList />
                                    <Footer />
                                </>
                            }
                        />

                        <Route
                            path="/draw"
                            element={
                                <>
                                    <Draw />
                                    <Footer />
                                </>
                            }
                        />
                        <Route
                            path="/community"
                            element={
                                <>
                                    <Community />
                                    <Footer />
                                </>
                            }
                        />
                        <Route
                            path="/contact"
                            element={
                                <>
                                    <Contact />
                                    <Footer />
                                </>
                            }
                        />

                        <Route
                            path="/activity"
                            element={
                                <>
                                    <Activities />
                                    <Footer />
                                </>
                            }
                        />

                        <Route path="/tetris" element={<Tetris />} />
                    </Routes>
                </Suspense>
            </Router>
    );
}

export default App;
