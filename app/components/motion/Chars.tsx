export default function Chars({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {Array.from(text).map((char, index) => (
        <span key={`${char}-${index}`} className="inline-block overflow-hidden align-bottom">
          <span className="hero-char inline-block" style={{ transformOrigin: "50% 100%" }}>
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </span>
  );
}
