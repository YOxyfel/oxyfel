import { useId } from 'react'

// The Oxyfel star: a faceted four-point star inside two crossing orbit rings,
// redrawn as a vector from the gold logo used in the game intro and on the game site.
// Each facet pair alternates light and dark so the star reads as bevelled metal at any size.
// Its colours come from the light it sits in (--light, --light-hot, --light-deep): gold for
// Oxyfel and Games, ice for Studio, jade for Care.
const C = 60, M = 52
const tip = { top: [C, 4], right: [96, M], bottom: [C, 100], left: [24, M] } as const
const waist = 5.5
const inner = {
  topLeft: [C - waist, M - waist], topRight: [C + waist, M - waist],
  bottomRight: [C + waist, M + waist], bottomLeft: [C - waist, M + waist],
} as const
const points = (...list: readonly (readonly number[])[]) => list.map(point => point.join(',')).join(' ')
const center = [C, M] as const

export const starFacets = {
  light: [
    points(tip.top, inner.topLeft, center),
    points(tip.right, inner.topRight, center),
    points(tip.bottom, inner.bottomRight, center),
    points(tip.left, inner.bottomLeft, center),
  ],
  dark: [
    points(tip.top, inner.topRight, center),
    points(tip.right, inner.bottomRight, center),
    points(tip.bottom, inner.bottomLeft, center),
    points(tip.left, inner.topLeft, center),
  ],
}

export function OxyfelStar({ className, title, spin = false }: { className?: string; title?: string; spin?: boolean }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return <svg className={`${className ?? ''}${spin ? ' ox-star--spin' : ''}`} viewBox="0 0 120 104" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title} focusable="false">
    <defs>
      <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" style={{ stopColor: 'color-mix(in srgb, var(--light-hot) 82%, #fff)' }} /><stop offset=".45" style={{ stopColor: 'color-mix(in srgb, var(--light) 84%, var(--light-deep))' }} /><stop offset="1" style={{ stopColor: 'color-mix(in srgb, var(--light-deep) 88%, #000)' }} />
      </linearGradient>
      <linearGradient id={`${id}-light`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" style={{ stopColor: 'color-mix(in srgb, var(--light-hot) 48%, #fff)' }} /><stop offset="1" style={{ stopColor: 'color-mix(in srgb, var(--light) 92%, var(--light-deep))' }} />
      </linearGradient>
      <linearGradient id={`${id}-dark`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" style={{ stopColor: 'color-mix(in srgb, var(--light) 58%, var(--light-deep))' }} /><stop offset="1" style={{ stopColor: 'color-mix(in srgb, var(--light-deep) 74%, #000)' }} />
      </linearGradient>
      {spin && <radialGradient id={`${id}-glint`}><stop offset="0" stopColor="#ffffff" /><stop offset=".35" stopOpacity=".85" style={{ stopColor: 'var(--light-hot)' }} /><stop offset="1" stopOpacity="0" style={{ stopColor: 'var(--light-hot)' }} /></radialGradient>}
    </defs>
    <g className="ox-star-rings" fill="none" stroke={`url(#${id}-ring)`} strokeWidth="3.4">
      <g className="ox-orbit ox-orbit--a"><ellipse cx={C} cy={M} rx="54" ry="22" transform={`rotate(32 ${C} ${M})`} /></g>
      <g className="ox-orbit ox-orbit--b"><ellipse cx={C} cy={M} rx="54" ry="22" transform={`rotate(-32 ${C} ${M})`} /></g>
    </g>
    <g className="ox-star-body">
      {starFacets.light.map(facet => <polygon key={facet} points={facet} fill={`url(#${id}-light)`} />)}
      {starFacets.dark.map(facet => <polygon key={facet} points={facet} fill={`url(#${id}-dark)`} />)}
    </g>
    {spin && <circle className="ox-star-glint" cx={C} cy="9" r="9" fill={`url(#${id}-glint)`} />}
  </svg>
}
