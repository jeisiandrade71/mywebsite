export default function Logo({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const textColor = dark ? "text-white" : "text-zinc-900";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <circle cx="18" cy="18" r="17" stroke="#0d9488" strokeWidth="2" />
        <path
          d="M11 19.5L16 24.5L25 13"
          stroke="#0d9488"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="leading-none">
        <div className={`text-lg font-bold tracking-tight ${textColor}`}>
          J&amp;A
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-teal-600">
          Cleaning Group
        </div>
      </div>
    </div>
  );
}
