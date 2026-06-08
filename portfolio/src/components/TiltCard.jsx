import { useRef } from "react";

export default function TiltCard({ children, className, style }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const card = ref.current;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale3d(1.03,1.03,1.03)`;
    card.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
    card.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
  };

  const handleLeave = () => {
    ref.current.style.transform = "perspective(800px) rotateY(0) rotateX(0) scale3d(1,1,1)";
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: "transform 0.5s cubic-bezier(0.23,1,0.32,1)",
        transformStyle: "preserve-3d",
        ...style,
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none",
        background: "radial-gradient(circle at var(--glow-x,50%) var(--glow-y,50%), rgba(200,241,53,0.08) 0%, transparent 60%)",
      }} />
    </div>
  );
}
