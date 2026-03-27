interface PawIconProps {
  color: string;
  opacity: number;
}

export function PawIcon({ color, opacity }: PawIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", opacity }}
    >
      {/* Toe pads */}
      <ellipse cx="24" cy="28" rx="11" ry="13" fill={color} />
      <ellipse cx="47" cy="18" rx="11" ry="13" fill={color} />
      <ellipse cx="70" cy="22" rx="11" ry="13" fill={color} />
      <ellipse cx="85" cy="44" rx="10" ry="12" fill={color} />
      {/* Main pad */}
      <ellipse cx="52" cy="68" rx="28" ry="24" fill={color} />
    </svg>
  );
}
