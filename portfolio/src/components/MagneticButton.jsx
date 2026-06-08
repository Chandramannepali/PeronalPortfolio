import { useRef } from "react";

export default function MagneticButton({ children, className, href, onClick, ...props }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const btn = ref.current;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    const inner = btn.querySelector(".mag-inner");
    if (inner) inner.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleLeave = () => {
    const btn = ref.current;
    btn.style.transform = "translate(0,0)";
    const inner = btn.querySelector(".mag-inner");
    if (inner) inner.style.transform = "translate(0,0)";
  };

  const Tag = href ? "a" : "button";
  return (
    <Tag
      ref={ref}
      className={className}
      href={href}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transition: "transform 0.3s cubic-bezier(0.23,1,0.32,1)", display: "inline-block" }}
      {...props}
    >
      <span className="mag-inner" style={{ transition: "transform 0.3s cubic-bezier(0.23,1,0.32,1)", display: "inline-block" }}>
        {children}
      </span>
    </Tag>
  );
}
