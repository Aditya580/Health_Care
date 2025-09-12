
export default function StoryCard({id, title, author, content}) {
    return (
        <div className="bg-[#fffef9] rounded-xl shadow-md p-8 flex flex-col justify-between">
            <div className="flex flex-col gap-3">
                <h2 className="text-2xl text-[#2c2c2c] text-gray-800 font-[Old-Standard-TT] font-semibold">{title}</h2>
                <h3 className="text-sm text-gray-500 mb-2">
                    <i>by </i>
                    <i className="text-[#00008b] font-[Old-Standard-TT] font-semibold text-lg"> {author}</i>
                </h3>
                <p className="text-justify text-gray-700 mb-4 first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-2 first-letter:text-[#6b5b45]">
                    {content && content.length > 120
                        ? content.substring(0, 120) + "..."
                        : content || "No content available"}
                </p>
            </div>
            <a
                href={`/stories/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6b5b45] font-medium hover:underline mt-auto"
            >
                Read Story →
            </a>
        </div>
    );
}
