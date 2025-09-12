import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
const { db } = await import("../firebase/firebase.js");
import StoryCard from "../templates/StoryCard.jsx";

export default function StoriesPage() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Stories"));
        const storiesData = querySnapshot.docs.map(doc => ({
          id: doc.id,       // 👈 important! Firestore doc id
          ...doc.data()
        }));
        setStories(storiesData);
      } catch (error) {
        console.error("Error fetching stories: ", error);
      }
    };

    fetchStories();
  }, []);

  return (
    <div className="w-full h-full p-6 grid grid-cols-1 mt-20 scroll-mt-[80px] sm:grid-cols-2 md:grid-cols-3 gap-6">
      {stories.length > 0 ? (
        stories.map(story => <StoryCard key={story.id} {...story} />)
      ) : (
        <p className="text-gray-500">No stories available</p>
      )}
    </div>
  );
}
