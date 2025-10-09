interface ProgressRingProps {
  size?: number
  stroke?: number
  value: number
  max: number
  colorFrom: string
  colorTo: string
  label: string
  sub?: string
}

const ProgressRing = ({
  size = 120,
  stroke = 10,
  value,
  max,
  colorFrom,
  colorTo,
  label,
  sub,
}: ProgressRingProps) => {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const safeValue = Math.max(0, Math.min(1, max > 0 ? value / max : 0))
  const dash = safeValue * circumference

  return (
    <div className="flex flex-col items-center space-y-2">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#gradient-${label.replace(/\s+/g, "-")})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          fill="transparent"
        />
        <defs>
          <linearGradient id={`gradient-${label.replace(/\s+/g, "-")}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorFrom} />
            <stop offset="100%" stopColor={colorTo} />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center">
        <div className="text-sm font-semibold text-gray-800">{label}</div>
        <div className="text-sm text-gray-500">
          {value.toLocaleString()} / {max.toLocaleString()} {sub ?? ""}
        </div>
      </div>
    </div>
  )
}

export default ProgressRing
