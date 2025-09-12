import React from "react";

function Tips() {
  return (
    <div className="flex flex-col items-center gap-12 bg-gradient-to-b from-[#F8FBFF] to-[#EEF6FF] mt-10 px-6 pt-20 pb-16">
      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-extrabold font-['Poppins'] text-center bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent tracking-wide">
        🌸 Quick Tips for Mental Wellness
      </h1>

      {/* Help Others */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-10 px-6">
        {/* SVG Illustration */}
        <div className="md:w-1/2 flex justify-center relative">
          <div className="absolute -top-6 -left-6 w-20 h-20 text-pink-300 opacity-40">
            {/* Decorative Flower SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2a5 5 0 0 0-5 5c0 1.76 1.02 3.29 2.5 4.03A5.97 5.97 0 0 0 6 16a6 6 0 0 0 12 0c0-2.21-1.2-4.15-3-5.19A5 5 0 0 0 12 2z" />
            </svg>
          </div>
          <img
            src="/png/helpingg.png"
            alt="Help Others"
            className="w-3/4 rounded-2xl shadow-lg"
          />
        </div>

        {/* Text */}
        <div className="md:w-1/2 flex flex-col gap-4 text-center md:text-left">
          <h2 className="text-3xl font-['Comfortaa'] font-bold text-pink-600 flex items-center gap-2">
            🤝 Help Others
          </h2>
          <p className="text-gray-700 leading-relaxed font-['Quicksand'] text-xl">
            Acts of kindness, whether big or small, create a sense of{" "}
            <span className="text-purple-600 font-semibold">
              fulfillment
            </span>{" "}
            and{" "}
            <span className="text-blue-600 font-semibold">connection</span>.
            They reduce stress, shift focus away from personal worries, and
            build empathy. Supporting others strengthens{" "}
            <span className="italic">emotional resilience</span> and inner
            peace.
          </p>
        </div>
      </div>

      {/* Do Something */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-10 px-6">
        {/* Text */}
        <div className="md:w-1/2 flex flex-col gap-4 text-center md:text-left">
          <h2 className="text-3xl font-['Comfortaa'] font-bold text-blue-600 flex items-center gap-2">
            🌱 Do Something
          </h2>
          <p className="text-gray-700 leading-relaxed font-['Quicksand'] text-xl">
            When feeling low or unmotivated,{" "}
            <span className="text-pink-500 font-semibold">
              doing something
            </span>
            —no matter how small—can help. Simple actions like{" "}
            <span className="underline decoration-dotted decoration-blue-400">
              cleaning your desk
            </span>
            , going for a walk, or starting a hobby provide momentum and
            boost{" "}
            <span className="text-purple-600 font-semibold">self-worth</span>.
          </p>
        </div>

        {/* SVG + Image */}
        <div className="md:w-1/2 flex justify-center relative">
          <div className="absolute -bottom-6 -right-6 w-20 h-20 text-blue-300 opacity-40">
            {/* Sparkle SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.9 7.82 20 9 12.91l-5-3.64 5.91-1.01z" />
            </svg>
          </div>
          <img
            src="/png/dosome.jpg"
            alt="Do Something"
            className="w-3/4 rounded-2xl shadow-lg"
          />
        </div>
      </div>

     {/* Mental Declutter Ritual */}
<div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-10 px-6 mt-12">
  {/* SVG + Image */}
  <div className="md:w-1/2 flex justify-center relative">
    <div className="absolute -bottom-6 -left-6 w-20 h-20 text-green-300 opacity-40">
      {/* Moon + Stars SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
      </svg>
    </div>
    <img
      src="/png/sleepy.gif"
      alt="Mental Declutter Ritual"
      className="w-3/4 rounded-2xl shadow-lg"
    />
  </div>

  {/* Text */}
  <div className="md:w-1/2 flex flex-col gap-4 text-center md:text-left">
    <h2 className="text-3xl font-['Comfortaa'] font-bold text-green-600 flex items-center gap-2">
      🧘 Mental Declutter Ritual
    </h2>
    <p className="text-gray-700 leading-relaxed font-['Quicksand'] text-xl">
      Before bed, take a few minutes to{" "}
      <span className="text-pink-500 font-semibold">
        write down everything
      </span>{" "}
      crowding your mind — random thoughts or feelings, just let it{" "}
      <span className="underline decoration-dotted decoration-purple-400">
        all spill out
      </span>
      . Then close the diary. This simple practice{" "}
      <span className="text-blue-600 font-semibold">reduces overthinking</span>, 
      quiets the mind, and helps you{" "}
      <span className="text-purple-600 font-semibold">
        fall asleep peacefully
      </span>
      .  
    </p>
  </div>
</div>


{/* Reading */}
<div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-10 px-6">
  {/* Text */}
  <div className="md:w-1/2 flex flex-col gap-4 text-center md:text-left">
    <h2 className="text-3xl font-['Comfortaa'] font-bold text-purple-600 flex items-center gap-2">
      📖 Read Something Good
    </h2>
    <p className="text-gray-700 leading-relaxed font-['Quicksand'] text-xl">
      Start your day with{" "}
      <span className="text-blue-600 font-semibold">
        uplifting content
      </span>
      —whether it’s a motivational book, article, or show. Positive
      words inspire{" "}
      <span className="italic text-pink-500">hope</span>, boost{" "}
      <span className="text-purple-600 font-semibold">creativity</span>,
      and help you see things from a{" "}
      <span className="underline decoration-wavy decoration-purple-400">
        fresh perspective
      </span>
      .
    </p>
  </div>

  {/* Image */}
  <div className="md:w-1/2 flex justify-center relative">
    <div className="absolute top-0 right-0 w-16 h-16 text-purple-300 opacity-40">
      {/* Book SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20V4a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />
      </svg>
    </div>
    <img
      src="/png/readbook.png"
      alt="Read Something"
      className="w-3/4 rounded-2xl shadow-lg"
    />
  </div>
</div>

    </div>
  );
}

export default Tips;
