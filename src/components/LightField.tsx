import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

// The Oxyfel light: a live WebGL scene of liquid light around the star, tinted per division.
// Gold for Oxyfel and Oxyfel Games, ice for Oxyfel Studio, jade for Oxyfel Care.
// It renders at a reduced resolution (the look is soft by design), pauses off screen and in
// background tabs, draws a single still frame for reduced motion, and leaves the CSS
// gradient underneath visible wherever WebGL is unavailable.
export type Tone = 'gold' | 'ice' | 'jade'
const tones: Record<Tone, [number[], number[], number[]]> = {
  gold: [[0.965, 0.769, 0.325], [1.0, 0.906, 0.69], [0.42, 0.227, 0.047]],
  ice: [[0.361, 0.812, 1.0], [0.831, 0.953, 1.0], [0.051, 0.239, 0.4]],
  jade: [[0.31, 0.878, 0.627], [0.824, 0.984, 0.902], [0.043, 0.29, 0.2]],
}

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`
const fragment = `precision highp float;
uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform vec3 uA;uniform vec3 uB;uniform vec3 uC;uniform float uCalm;uniform vec2 uFocus;
float h1(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 h2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h1(i),h1(i+vec2(1,0)),f.x),mix(h1(i+vec2(0,1)),h1(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
float dust(vec2 uv,float scale,float t,float seed){
  vec2 p=uv*scale+vec2(t*.018*seed,-t*.045);
  vec2 id=floor(p),f=fract(p)-.5;
  vec2 o=(h2(id+seed)-.5)*.7;
  float d=length(f-o);
  float on=step(.78,h1(id+seed*3.1));
  float tw=.55+.45*sin(t*(1.2+h1(id)*2.)+h1(id+1.7)*6.28);
  float size=.035+.05*h1(id+5.3);
  return smoothstep(size,0.,d)*on*tw;
}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec2 m=(uMouse-.5)*vec2(uRes.x/uRes.y,1.);
  float t=uTime*mix(1.,.55,uCalm);
  vec2 c=uv-(uFocus+m*.05);
  float d=length(c),a=atan(c.y,c.x);
  // soft fog that drifts, tinted by the deep tone
  float fog=fbm(uv*1.1+vec2(t*.015,-t*.01));
  vec3 col=uC*(.08+.34*fog)*(.35+.65*exp(-d*.9));
  // volumetric shafts from the star
  float s1=pow(noise(vec2(a*3.2,t*.05))*.9+.1,5.);
  float s2=pow(noise(vec2(a*7.3+11.,-t*.04)),7.)*.7;
  float shafts=(s1+s2)*exp(-d*1.45)*smoothstep(.02,.22,d);
  col+=mix(uA,uB,.35)*shafts*.55;
  // halo, core and the four-point flare
  float halo=exp(-d*2.4),core=.0055/(d*d+.0055);
  float flare=pow(max(0.,1.-abs(c.x)*13.),8.)*exp(-abs(c.y)*1.05)+pow(max(0.,1.-abs(c.y)*13.),8.)*exp(-abs(c.x)*.8)*.8;
  col+=uA*halo*.22+uB*(core*.85+flare*.42*(.45+.55*halo));
  // drifting dust, three depths with a little mouse parallax
  float motes=dust(uv+m*.02,16.,t,1.)+dust(uv+m*.04,28.,t,2.)*.8+dust(uv+m*.07,46.,t,3.)*.6;
  col+=mix(uB,vec3(1.),.3)*motes*(.25+.75*exp(-d*.8))*.9;
  // cinematic vignette, dither
  col*=1.-smoothstep(.5,1.35,length(uv*vec2(.72,1.)));
  col+=(h1(gl_FragCoord.xy+t)-.5)*.018;
  gl_FragColor=vec4(max(col,0.),1.);
}`

export function LightField({ tone = 'gold', calm = false, focus = [0, 0.08], anchor, className = '' }: { tone?: Tone; calm?: boolean; focus?: [number, number]; anchor?: RefObject<HTMLElement | null>; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const target = useRef(tone)
  const redraw = useRef<(() => void) | null>(null)
  useEffect(() => { target.current = tone; redraw.current?.() }, [tone])
  useEffect(() => {
    const element = canvas.current
    if (!element) return
    const gl = element.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power', premultipliedAlpha: false })
    if (!gl) return
    const compile = (type: number, source: string) => { const shader = gl.createShader(type)!; gl.shaderSource(shader, source); gl.compileShader(shader); return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null }
    const vs = compile(gl.VERTEX_SHADER, vertex), fs = compile(gl.FRAGMENT_SHADER, fragment)
    if (!vs || !fs) return
    const program = gl.createProgram()!
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'p')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const u = (name: string) => gl.getUniformLocation(program, name)
    const uRes = u('uRes'), uTime = u('uTime'), uMouse = u('uMouse'), uA = u('uA'), uB = u('uB'), uC = u('uC'), uCalm = u('uCalm'), uFocus = u('uFocus')
    gl.uniform1f(uCalm, calm ? 1 : 0)
    gl.uniform2f(uFocus, focus[0], focus[1])
    const current = tones[target.current].map(color => [...color])
    const mouse = [0.5, 0.5], mouseTarget = [0.5, 0.5]
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0, visible = true, start = performance.now(), last = 0
    const size = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * (calm ? 0.45 : 0.55)
      let width = Math.max(1, Math.round(element.clientWidth * scale)), height = Math.max(1, Math.round(element.clientHeight * scale))
      if (width > 1400) { height = Math.max(1, Math.round(height * 1400 / width)); width = 1400 }
      if (element.width !== width || element.height !== height) { element.width = width; element.height = height; gl.viewport(0, 0, width, height) }
      gl.uniform2f(uRes, width, height)
      // Centre the light on the anchor element (the star) when there is one.
      const target = anchor?.current
      if (target) {
        const box = element.getBoundingClientRect(), mark = target.getBoundingClientRect()
        const x = mark.left + mark.width / 2 - box.left, y = mark.top + mark.height / 2 - box.top
        if (box.height > 0) gl.uniform2f(uFocus, (x - box.width / 2) / box.height, (box.height / 2 - y) / box.height)
      }
    }
    const draw = (now: number) => {
      const goal = tones[target.current]
      const rate = still ? 1 : 0.06
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) current[i][j] += (goal[i][j] - current[i][j]) * rate
      mouse[0] += (mouseTarget[0] - mouse[0]) * 0.04; mouse[1] += (mouseTarget[1] - mouse[1]) * 0.04
      gl.uniform3fv(uA, current[0]); gl.uniform3fv(uB, current[1]); gl.uniform3fv(uC, current[2])
      gl.uniform2f(uMouse, mouse[0], mouse[1])
      gl.uniform1f(uTime, still ? 14 : (now - start) / 1000 + 14)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    const loop = (now: number) => {
      frame = 0
      if (!visible || document.hidden) return
      if (now - last > 1000 / 45) { last = now; draw(now) }
      frame = requestAnimationFrame(loop)
    }
    const run = () => { if (!still && !frame && visible && !document.hidden) frame = requestAnimationFrame(loop) }
    redraw.current = () => { if (still) draw(performance.now()); else run() }
    size(); draw(performance.now()); element.classList.add('is-lit')
    const resize = new ResizeObserver(() => { size(); if (still) draw(performance.now()) })
    const settle = window.setTimeout(() => { size(); if (still) draw(performance.now()) }, 1700)
    resize.observe(element)
    const seen = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) run() })
    seen.observe(element)
    const pointer = (event: PointerEvent) => { const rect = element.getBoundingClientRect(); mouseTarget[0] = (event.clientX - rect.left) / rect.width; mouseTarget[1] = 1 - (event.clientY - rect.top) / rect.height }
    const visibility = () => { if (!document.hidden) run() }
    if (!still) window.addEventListener('pointermove', pointer, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    element.addEventListener('webglcontextlost', () => { cancelAnimationFrame(frame); frame = 0; element.classList.remove('is-lit') })
    run()
    return () => {
      cancelAnimationFrame(frame); window.clearTimeout(settle); resize.disconnect(); seen.disconnect(); redraw.current = null
      window.removeEventListener('pointermove', pointer); document.removeEventListener('visibilitychange', visibility)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [calm, focus[0], focus[1]])
  return <canvas ref={canvas} className={`ox-light ${className}`} aria-hidden="true" />
}
