import { colors } from "@/lib/data";
import { useSessionStore } from "@/lib/sessionStore";
import { PieAvatarProps } from "@/schemas";
import React from "react";

const PieAvatar: React.FC<PieAvatarProps> = ({
  participants,
  size = 40,
  username,
}) => {
  const session = useSessionStore((state) => state.session);

  const radius = size / 2;

  const otherParticipants = participants.filter((p) =>
    username ? p.username !== username : p.id !== session?.user?.id
  );

  // Case: Two participants → show the other user's avatar
  if (otherParticipants.length === 1) {
    const other = otherParticipants[0];

    if (other.image) {
      return (
        <img
          src={other.image}
          alt={other.display_name || "User"}
          width={size}
          height={size}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: colors[0],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.5,
            color: "white",
            fontWeight: "bold",
          }}
        />
      );
    }

    const letter =
      other.display_name?.trim()?.[0]?.toUpperCase() ??
      other.first_name?.[0]?.toUpperCase() ??
      "?";

    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: colors[0],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.5,
          color: "white",
          fontWeight: "bold",
        }}
      >
        {letter}
      </div>
    );
  }

  // Case: Group chat → draw pie-style avatar
  const letters = participants.map(
    (p) => p.display_name?.trim()?.[0]?.toUpperCase() ?? "?"
  );

  const pieSlices = letters.map((letter, index) => {
    const startAngle = (index / participants.length) * 360;
    const endAngle = ((index + 1) / participants.length) * 360;
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    const startX = radius + radius * Math.cos((Math.PI * startAngle) / 180);
    const startY = radius + radius * Math.sin((Math.PI * startAngle) / 180);
    const endX = radius + radius * Math.cos((Math.PI * endAngle) / 180);
    const endY = radius + radius * Math.sin((Math.PI * endAngle) / 180);

    const textAngle = (startAngle + endAngle) / 2;
    const textX = radius + radius * 0.6 * Math.cos((Math.PI * textAngle) / 180);
    const textY = radius + radius * 0.6 * Math.sin((Math.PI * textAngle) / 180);

    const pathData = `
      M ${radius} ${radius}
      L ${startX} ${startY}
      A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}
      Z
    `;

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
