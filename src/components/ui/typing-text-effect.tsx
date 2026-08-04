import { useEffect, useState } from "react";

export default function TypingTextCycle({
  texts,
  className = "",
}: {
  texts: string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    // When full word is typed, pause for 2.3 seconds with white cursor blinking on-off
    if (subIndex === texts[index].length && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 2300);
      return () => clearTimeout(timeout);
    }

    // When word is fully deleted, pause briefly before typing next word
    if (subIndex === 0 && reverse) {
      const timeout = setTimeout(() => {
        setReverse(false);
        setIndex((prev) => (prev + 1) % texts.length);
      }, 400);
      return () => clearTimeout(timeout);
    }

    // Calm, deliberate typing (130ms per char) & smooth deletion (65ms per char)
    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (reverse ? -1 : 1));
      },
      reverse ? 65 : 130
    );

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  // Cursor blinks sharply (on/off) ONLY when paused at the end of a word or before typing next
  const isPaused = subIndex === texts[index].length || (subIndex === 0 && !reverse);

  return (
    <h2 className={`font-bold tracking-tight text-acc ${className}`}>
      <span>{texts[index].substring(0, subIndex)}</span>
      <span
        className={`ml-1.5 inline-block h-[0.82em] w-1.5 bg-white align-baseline ${
          isPaused ? "animate-cursor-blink" : ""
        }`}
      />
    </h2>
  );
}
