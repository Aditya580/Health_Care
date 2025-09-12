import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";

export default function StoryDetailPage() {
    const {id} = useParams();
    const [story, setStory] = useState(null);

    useEffect(() => {
        if (story?.title) {
            document.title = story.title;
        } else {
            document.title = "Story";
        }
    }, [story]);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const {db} = await import("../firebase/firebase.js");
                const {doc, getDoc} = await import("firebase/firestore");

                const docRef = doc(db, "Stories", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setStory({id: docSnap.id, ...docSnap.data()});
                }
            } catch (err) {
                console.error("Error fetching story:", err);
            }
        };
        // console.log("Fetching story with ID:", id);
        fetchStory();
    }, [id]);

    if (!story) return <p className="text-center mt-10">Loading story...</p>;

    // format content into readable form
    function formatStory(content) {
        if (!content) return [];

        const sentences = content.split("."); // split into sentences
        const paragraphs = [];
        let buffer = [];
        let count = 0;
        let target = getRandom(3, 5); // 3–5 sentences per paragraph

        sentences.forEach((sentence, idx) => {
            if (sentence.trim() === "") return;

            buffer.push(sentence.trim() + ".");
            count++;

            if (count >= target || idx === sentences.length - 1) {
                paragraphs.push(buffer.join(" "));
                buffer = [];
                count = 0;
                target = getRandom(3, 5); // pick new random size for next para
            }
        });

        return paragraphs;
    }

    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return (
        <div className="w-auto h-auto flex items-center justify-center bg-white m-20 scroll-mt-[80px]">
            <div className="w-full h-full m-auto p-6 bg-[#fffef9] rounded-xl shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{story.title}</h1>
                <h2 className="text-sm text-gray-500 mb-4">
                    <i>by {story.author}</i>
                </h2>

                <div className="max-w-none text-gray-800 leading-relaxed space-y-4 text-justify">
                    {formatStory(story.content).map((para, idx) => (
                        <p key={idx}>{para}</p>
                    ))}
                </div>

                {/* <p className=" text-gray-700 text-justify leading-relaxed space-y-4 outline outline-red-500">
                    {story.content}
                </p> */}
            </div>
        </div>
    );
}
