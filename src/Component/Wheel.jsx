import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./wheelStyle.css";

export default function Wheel({ onClose }) {
  const wheelRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [result, setResult] = useState("");
  const [wheelSize, setWheelSize] = useState(350);
  const [visible, setVisible] = useState(true);

  const sections = [
    "Do a quick stretch 🧘",
    "Take a nap 😴",
    "Go for a walk 🚶",
    "Listen music 🎵",
    "Tidy up your space 🧼",
    "See old pictures 📷",
  ];

  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;
    const update = () => setWheelSize(el.offsetWidth || 350);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    document.body.style.overflow = "hidden";
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const spins = Math.floor(Math.random() * 5) + 5;
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = rotation + spins * 360 + randomAngle;

    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
    }
    setRotation(totalRotation);

    const normalizedAngle = (360 - (totalRotation % 360)) % 360;
    const sectionAngle = 360 / sections.length;
    const sectionIndex = Math.floor(normalizedAngle / sectionAngle);
    const selected = sections[sectionIndex];

    setTimeout(() => {
      setResult(selected);
      setShowPopup(true);
      setIsSpinning(false);
    }, 3000);
  };

  const handleClose = () => {
    if (onClose) onClose();
    else setVisible(false);
  };

  if (!visible) return null;

  const center = wheelSize / 2;
  const radius = wheelSize * 0.325;

  return createPortal(
    <div className="parent-container">
      <div className="card">
        <button className="card-close" onClick={handleClose}>✕</button>
        <h1>🎯 Spin the Wheel</h1>

        <div className="wheel-container">
          <div className="pointer"></div>
          <div className="wheel" ref={wheelRef}>
            <svg viewBox="0 0 200 200">
              <path d="M 100 100 L 100 0 A 100 100 0 0 1 186.6 50 Z" fill="url(#grad1)" />
              <path d="M 100 100 L 186.6 50 A 100 100 0 0 1 186.6 150 Z" fill="url(#grad2)" />
              <path d="M 100 100 L 186.6 150 A 100 100 0 0 1 100 200 Z" fill="url(#grad3)" />
              <path d="M 100 100 L 100 200 A 100 100 0 0 1 13.4 150 Z" fill="url(#grad4)" />
              <path d="M 100 100 L 13.4 150 A 100 100 0 0 1 13.4 50 Z" fill="url(#grad5)" />
              <path d="M 100 100 L 13.4 50 A 100 100 0 0 1 100 0 Z" fill="url(#grad6)" />
              <defs>
                <linearGradient id="grad1"><stop offset="0%" stopColor="#ff6b6b"/><stop offset="100%" stopColor="#ee5a52"/></linearGradient>
                <linearGradient id="grad2"><stop offset="0%" stopColor="#4ecdc4"/><stop offset="100%" stopColor="#44a08d"/></linearGradient>
                <linearGradient id="grad3"><stop offset="0%" stopColor="#45b7d1"/><stop offset="100%" stopColor="#3498db"/></linearGradient>
                <linearGradient id="grad4"><stop offset="0%" stopColor="#f9ca24"/><stop offset="100%" stopColor="#f0932b"/></linearGradient>
                <linearGradient id="grad5"><stop offset="0%" stopColor="#6c5ce7"/><stop offset="100%" stopColor="#a29bfe"/></linearGradient>
                <linearGradient id="grad6"><stop offset="0%" stopColor="#fd79a8"/><stop offset="100%" stopColor="#e84393"/></linearGradient>
              </defs>
            </svg>
            {sections.map((label, i) => {
              const angleDeg = i * (360 / sections.length) + 360 / sections.length / 2;
              const angleRad = (angleDeg * Math.PI) / 180;
              const x = center + radius * Math.cos(angleRad - Math.PI / 2);
              const y = center + radius * Math.sin(angleRad - Math.PI / 2);
              return (
                <div
                  key={i}
                  className="section-text"
                  style={{
                    position: "absolute",
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
                    width: `${wheelSize * 0.25}px`,
                    textAlign: "center",
                    pointerEvents: "none",
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
          <button className="spin-button" onClick={handleSpin} disabled={isSpinning}>SPIN</button>
        </div>
      </div>

      {showPopup && (
        <div className="result-popup show flex flex-col justify-center items-center">
          <div>
            <div className="result-text">⚒️ Task Assigned : <strong>{result}</strong>!</div>
          </div>
          <button className="close-button" onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}
    </div>,
    document.body
  );
}
