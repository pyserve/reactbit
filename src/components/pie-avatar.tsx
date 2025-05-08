import React from "react";

type PieAvatarProps = {
  participants: { display_name: string }[];
  size?: number;
};

const colors = [
  "#93C5FD", // blue-300
  "#F9A8D4", // pink-300
  "#86EFAC", // green-300
  "#FCD34D", // yellow-300
  "#D8B4FE", // purple-300
  "#FDE68A", // amber-300
  "#67E8F9", // cyan-300
  "#F0ABFC", // fuchsia-300
  "#A5B4FC", // indigo-300
  "#7DD3FC", // sky-300
];

const PieAvatar: React.FC<PieAvatarProps> = ({ participants, size = 40 }) => {
  const radius = size / 2;
  const num = participants.length;
  const letters = participants.map(
    (p) => p.display_name?.trim()?.[0]?.toUpperCase() ?? "?"
  );

  const pieSlices = letters.map((letter, index) => {
    const startAngle = (index / num) * 360;
    const endAngle = ((index + 1) / num) * 360;
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    const startX = radius + radius * Math.cos((Math.PI * startAngle) / 180);
    const startY = radius + radius * Math.sin((Math.PI * startAngle) / 180);
    const endX = radius + radius * Math.cos((Math.PI * endAngle) / 180);
    const endY = radius + radius * Math.sin((Math.PI * endAngle) / 180);

    const pathData = `
      M ${radius} ${radius}
      L ${startX} ${startY}
      A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}
      Z
    `;

    const textAngle = (startAngle + endAngle) / 2;
    const textX = radius + radius * 0.6 * Math.cos((Math.PI * textAngle) / 180);
    const textY = radius + radius * 0.6 * Math.sin((Math.PI * textAngle) / 180);

    return (
      <g key={index}>
        <path d={pathData} fill={colors[index % colors.length]} />
        <text
          x={textX}
          y={textY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.3}
          fill="white"
        >
          {letter}
        </text>
      </g>
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {pieSlices}
    </svg>
  );
};

export default PieAvatar;
