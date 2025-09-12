import React from "react";

function Card({ image, title, message, buttonText, action }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .floating-element { animation: float 3.5s ease-in-out infinite; }

          .glass-effect {
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.25);
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .glass-effect:hover {
            transform: translateY(-6px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.15);
          }
        `,
        }}
      />

      <div className="glass-effect rounded-3xl p-8 relative overflow-hidden group">
        {/* gradient glow orb top-right */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-sky-300/20 to-blue-500/40 rounded-full -translate-y-20 translate-x-20 blur-2xl z-0" />

        {/* content */}
        <div className="relative z-10">
          {/* floating image with glow ring */}
          <div className="floating-element mb-6 flex justify-start">
            <div className="relative">
              {/* glow ring */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-400/40 to-blue-700/40 blur-lg animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-tr from-sky-400 to-blue-700 rounded-2xl p-1">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full rounded-xl object-cover block"
                />
              </div>
            </div>
          </div>

          {/* title with accent underline */}
          <h3 className="text-2xl font-extrabold text-gray-900 mb-3 relative inline-block">
            {title}
            <span className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full"></span>
          </h3>

          {/* message */}
          <p className="text-gray-700 mb-8 leading-relaxed tracking-wide font-[Nunito]">
            {message}
          </p>

          {/* button */}
          <button
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl"
            onClick={action}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </>
  );
}

export default Card;
