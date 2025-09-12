// Hero.jsx
function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#48cddf] via-[#B4F0E8] to-[#E3FDFD]">
      {/* Gradient Waves */}
      <Waves />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          
          {/* Left: Meditation GIF with SVGs behind it */}
          <div className="relative flex justify-center md:justify-start">
            {/* GIF */}
            <img
              src="/relax_2.png"
              alt="Meditation Animation"
              className="relative z-10 w-[85%] md:w-[85%] lg:w-[95%] animate-float"
            />
            

            {/* SVGs Behind the GIF */}
            <div className="absolute inset-0">
              {/* Gear Icon */}
              <svg
                className="absolute top-4 left-8 w-12 h-12 text-[#0F5F67]/70 animate-float-slow"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.4 13.5c.04-.3.06-.6.06-.9s-.02-.6-.06-.9l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.62-.22l-2.49 1a7.027 7.027 0 0 0-1.56-.9l-.38-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.57.24-1.1.55-1.56.9l-2.49-1a.495.495 0 0 0-.62.22l-2 3.46c-.12.22-.07.49.12.64L4.6 11.7c-.04.3-.06.6-.06.9s.02.6.06.9l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.62.22l2.49-1c.46.35.99.66 1.56.9l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.57-.24 1.1-.55 1.56-.9l2.49 1c.23.09.5 0 .62-.22l2-3.46c.12-.22.07-.49-.12-.64L19.4 13.5zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 8.5 12 8.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
              </svg>

              {/* Heart */}
              <svg
                className="absolute top-24 right-0 w-10 h-10 text-pink-400 animate-float-rev"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21s-8.5-6.5-8.5-11.5S7.5 2 12 7.5 20.5 2 20.5 9.5 12 21 12 21z" />
              </svg>

              {/* Flower */}
              {/* <svg
                className="absolute bottom-8 left-4 w-12 h-12 text-yellow-400 animate-float"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C10.9 2 10 2.9 10 4v2a2 2 0 0 0 4 0V4c0-1.1-.9-2-2-2zm6.36 3.64c-.78-.78-2.05-.78-2.83 0l-1.42 1.42a2 2 0 0 0 2.83 2.83l1.42-1.42c.78-.78.78-2.05 0-2.83zM20 10h-2a2 2 0 0 0 0 4h2c1.1 0 2-.9 2-2s-.9-2-2-2zm-3.64 6.36c-.78.78-.78 2.05 0 2.83s2.05.78 2.83 0 .78-2.05 0-2.83l-1.42-1.42a2 2 0 0 0-2.83 2.83l1.42 1.42zM12 20c1.1 0 2-.9 2-2v-2a2 2 0 0 0-4 0v2c0 1.1.9 2 2 2zm-6.36-3.64c.78.78 2.05.78 2.83 0l1.42-1.42a2 2 0 0 0-2.83-2.83L5.64 13.5a2 2 0 0 0 0 2.83zM4 10H2c-1.1 0-2 .9-2 2s.9 2 2 2h2a2 2 0 0 0 0-4z" />
              </svg> */}

              {/* Puzzle Piece */}
              <svg
                className="absolute bottom-16 right-8 w-10 h-10 text-blue-600/70 animate-float-slow"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 13c-1.1 0-2 .9-2 2 0 .55.22 1.05.59 1.41-.93.49-2.06.59-3.05.24-.79-.28-1.54-.95-1.54-1.83V12c0-1.1-.9-2-2-2H9.17c.11-.31.17-.65.17-1 0-1.66-1.34-3-3-3-.35 0-.69.06-1 .17V4c0-1.1.9-2 2-2h2c.88 0 1.55.75 1.83 1.54.35.99.25 2.12-.24 3.05.36.37.86.59 1.41.59 1.1 0 2-.9 2-2V4c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v2c0 .55-.22 1.05-.59 1.41.49.93.59 2.06.24 3.05-.28.79-.95 1.54-1.83 1.54z" />
              </svg>
            </div>
          </div>

          {/* Right: Quote + Heading + Subheading */}
          <div className="max-w-xl md:justify-self-start text-center md:text-left">
            {/* Quote card */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 animate-fadeIn">
              <p className="text-2xl md:text-3xl font-semibold text-gray-800 leading-relaxed">
                All the problems are stuck between{" "}
                <span className="text-[#0F5F67] font-bold underline decoration-wavy decoration-[#2AB4C0]">
                  Mind
                </span>{" "}
                and{" "}
                <span className="text-[#014D53] font-bold underline decoration-wavy decoration-[#0F5F67]">
                  Matter
                </span>
                .
              </p>
              <p className="mt-3 text-lg text-gray-600 italic">
                If you don’t <span className="text-[#0F5F67] font-bold">Mind</span>, it doesn’t{" "}
                <span className="text-[#014D53] font-bold">Matter</span>.
              </p>
              <p className="mt-2 text-sm text-gray-500">~ Unknown</p>
            </div>

            {/* Heading + Subheading */}
            <h1 className="mt-8 font-[Comfortaa] text-4xl md:text-5xl font-extrabold tracking-tight text-[#014D53]">
              🍁 Journey towards a calmer mind
            </h1>
            <p className="mt-4 font-[Nunito] text-lg md:text-xl text-slate-700 leading-relaxed">
              Discover mindful practices, uplifting activities, and tools to help you recharge,
              refocus, and reconnect with yourself.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Gradient Waves */
function Waves() {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
      <svg
        className="relative block w-full h-40 md:h-48 lg:h-56"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1200 120"
      >
        <path
          d="M985 83.6c-53.3-6.3-104.1-22.3-158.1-26.6-70.7-5.5-142 7.7-212.9 14.1-71.9 6.5-144.2 4.2-216.3-1.9-65.6-5.6-130.5-16.8-196.4-20.2C122.6 45.7 61 50.3 0 60v60h1200V95.8c-70-5.7-139.7-1.8-215-12.2z"
          fill="#B4F0E8"
          fillOpacity="0.7"
        />
        <path
          d="M985 83.6c-53.3-6.3-104.1-22.3-158.1-26.6-70.7-5.5-142 7.7-212.9 14.1-71.9 6.5-144.2 4.2-216.3-1.9-65.6-5.6-130.5-16.8-196.4-20.2C122.6 45.7 61 50.3 0 60v60h1200V95.8c-70-5.7-139.7-1.8-215-12.2z"
          fill="#E3FDFD"
          fillOpacity="0.6"
        />
      </svg>
    </div>
  );
}

export default Hero;
