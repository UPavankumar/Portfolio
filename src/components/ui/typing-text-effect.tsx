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
    if (subIndex === texts[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 2200);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (reverse ? -1 : 1));
      },
      reverse ? 35 : 75
    );

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  return (
    <h2 className={`font-bold tracking-tight text-acc ${className}`}>
      <span>{texts[index].substring(0, subIndex)}</span>
      <span className="ml-1 inline-block h-[0.85em] w-1.5 animate-pulse bg-acc align-baseline" />
    </h2>
  );
}
