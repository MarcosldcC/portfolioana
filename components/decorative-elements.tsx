export function HalftonePattern({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {Array.from({ length: 10 }).map((_, row) =>
        Array.from({ length: 10 }).map((_, col) => {
          const distance = Math.sqrt(Math.pow(row - 5, 2) + Math.pow(col - 5, 2));
          const radius = Math.max(0.5, 3 - distance * 0.4);
          return (
            <circle
              key={`${row}-${col}`}
              cx={col * 12 + 6}
              cy={row * 12 + 6}
              r={radius}
              fill="currentColor"
              opacity={Math.max(0.15, 1 - distance * 0.15)}
            />
          );
        })
      )}
    </svg>
  );
}

export function ArcDecoration({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      width="100"
      height="80"
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 70 Q10 10 50 10 Q90 10 90 70"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M20 70 Q20 20 50 20 Q80 20 80 70"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M30 70 Q30 30 50 30 Q70 30 70 70"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}

export function StarburstDecoration({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x2 = (40 + Math.cos(angle) * 35).toFixed(2);
        const y2 = (40 + Math.sin(angle) * 35).toFixed(2);
        return (
          <line
            key={i}
            x1="40"
            y1="40"
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          />
        );
      })}
    </svg>
  );
}

