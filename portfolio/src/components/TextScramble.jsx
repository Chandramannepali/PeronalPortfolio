import { useState, useEffect } from "react";

export default function TextScramble({ text, className, as: Tag = "span" }) {
  const [display, setDisplay] = useState("");
  const chars = "!<>-_\\/[]{}—=+*^?#_アイウエオカキクケコ";

  useEffect(() => {
    let frame = 0;
    const length = text.length;
    const totalFrames = length * 3;
    const interval = setInterval(() => {
      let result = "";
      for (let i = 0; i < length; i++) {
        if (frame / 3 > i) {
          result += text[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplay(result);
      frame++;
      if (frame > totalFrames) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <Tag className={className}>{display}</Tag>;
}
