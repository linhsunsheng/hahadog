export default function DogDoodle({ className = '' }: { className?: string }) {
  // Simple doodle with wagging tail
  return (
    <svg className={className} viewBox="0 0 200 120" role="img" aria-label="Happy dog doodle">
      <defs>
        <style>{`.stroke{stroke:#3A2213;stroke-width:4;fill:none;stroke-linecap:round;stroke-linejoin:round}`}</style>
      </defs>
      <g>
        <path className="stroke" d="M30 80 Q 60 40 110 55"/>
        <circle className="stroke" cx="125" cy="60" r="18"/>
        <path className="stroke" d="M110 75 q 10 10 30 8"/>
        <circle cx="132" cy="56" r="3" fill="#3A2213"/>
        <path className="stroke" d="M120 45 q -8 -14 -14 -7"/>
        <g className="wag" style={{ transformOrigin: '20px 70px' }}>
          <path className="stroke" d="M18 70 q -14 -8 -10 -22"/>
          <path className="stroke" d="M18 70 q -12 2 -18 -8"/>
        </g>
        <path className="stroke" d="M145 68 q 4 6 12 6"/>
      </g>
    </svg>
  )
}

