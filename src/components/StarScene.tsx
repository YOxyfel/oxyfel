import { useEffect, useRef } from 'react'
import type { Tone } from './LightField'

// The Oxyfel star in real-time 3D: a faceted gold four-point star inside two orbit rings,
// ray-marched in a fragment shader. It turns toward the cursor, sways when idle, spins
// when clicked, and reflects the light of the division in focus. Without WebGL it stays
// hidden and the vector star underneath remains; with reduced motion it draws one still pose.
const tint: Record<Tone, [number, number, number]> = { gold: [1.0, 0.72, 0.28], ice: [0.36, 0.78, 1.0], jade: [0.32, 0.9, 0.62] }

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`
const fragment = `precision highp float;
uniform vec2 uRes;uniform float uTime;uniform vec2 uRot;uniform vec3 uTint;uniform float uPulse;uniform float uSS;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float sdBi(vec3 p,vec3 s){p=abs(p)/s;return (p.x+p.y+p.z-1.)*.57735*min(s.x,min(s.y,s.z));}
float sdTorus(vec3 p,float R,float r){vec2 q=vec2(length(p.xz)-R,p.y);return length(q)-r;}
vec3 ring(vec3 p,float a){p.xy=rot(a)*p.xy;p.yz=rot(.43)*p.yz;return p;}
float map(vec3 p,out float id){
  p.xz=rot(uRot.x)*p.xz;p.yz=rot(uRot.y)*p.yz;
  float star=min(sdBi(p,vec3(.19,1.,.19)),sdBi(p,vec3(.76,.19,.19)));
  float spin=uTime*.25;
  float r1=sdTorus(ring(p,.56+spin*0.),1.13,.052);
  float r2=sdTorus(ring(p,-.56),1.13,.052);
  float rings=min(r1,r2);
  id=star<rings?0.:1.;
  return min(star,rings);
}
vec3 nrm(vec3 p){float id;vec2 e=vec2(.0012,-.0012);return normalize(e.xyy*map(p+e.xyy,id)+e.yyx*map(p+e.yyx,id)+e.yxy*map(p+e.yxy,id)+e.xxx*map(p+e.xxx,id));}
vec3 env(vec3 r){
  vec3 c=mix(vec3(.035,.022,.012),vec3(.42,.28,.11),smoothstep(-.35,.95,r.y));
  c+=vec3(1.,.86,.58)*pow(max(dot(r,normalize(vec3(-.45,.62,.65))),0.),16.)*1.9;
  c+=vec3(1.,.92,.74)*pow(max(dot(r,normalize(vec3(.72,.25,.6))),0.),34.)*1.5;
  c+=vec3(.95,.75,.45)*exp(-abs(r.y+.05)*10.)*.4;
  c+=uTint*pow(max(dot(r,normalize(vec3(.1,-.55,.83))),0.),5.)*1.25;
  c+=uTint*pow(max(dot(r,normalize(vec3(-.8,-.1,.2))),0.),8.)*.6;
  return c;
}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
vec4 shade(vec2 frag){
  vec2 uv=(frag-.5*uRes)/min(uRes.x,uRes.y);
  vec3 ro=vec3(0.,0.,4.3),rd=normalize(vec3(uv*1.02,-1.62));
  float b=dot(ro,rd),c=dot(ro,ro)-1.42*1.42,h=b*b-c;
  if(h<0.)return vec4(0.);
  float t=max(0.,-b-sqrt(h)),tmax=-b+sqrt(h),md=9.,id=0.;
  for(int i=0;i<90;i++){vec3 p=ro+rd*t;float d=map(p,id);md=min(md,d);if(d<.0008||t>tmax)break;t+=d*.9;}
  if(t>tmax){float g=exp(-md*16.)*.55;return vec4(uTint*g*.9+vec3(1.,.82,.5)*g*.25,g*.7);}
  vec3 p=ro+rd*t,n=nrm(p),r=reflect(rd,n);
  float f=pow(1.-max(dot(n,-rd),0.),5.);
  vec3 gold=id<.5?vec3(1.,.74,.32):vec3(1.,.8,.42);
  vec3 col=env(r)*mix(gold,vec3(1.),f*.55);
  vec3 L=normalize(vec3(.5,.8,.6));
  col+=vec3(1.,.94,.82)*pow(max(dot(r,L),0.),70.)*2.2;
  col+=uTint*pow(1.-max(dot(n,-rd),0.),3.)*.35;
  col*=1.+uPulse*1.6;
  col=aces(col*1.15);
  return vec4(pow(col,vec3(.4545)),1.);
}
void main(){
  vec4 acc=vec4(0.);
  if(uSS>.5){
    for(int j=0;j<2;j++)for(int i=0;i<2;i++){vec4 s=shade(gl_FragCoord.xy+(vec2(float(i),float(j))-.5)*.5);acc+=vec4(s.rgb*s.a,s.a);}
    acc*=.25;
  }else{vec4 s=shade(gl_FragCoord.xy);acc=vec4(s.rgb*s.a,s.a);}
  gl_FragColor=acc;
}`

export function StarScene({ tone = 'gold', className = '' }: { tone?: Tone; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const toneRef = useRef(tone)
  const redraw = useRef<(() => void) | null>(null)
  useEffect(() => { toneRef.current = tone; redraw.current?.() }, [tone])
  useEffect(() => {
    const element = canvas.current
    if (!element) return
    const gl = element.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' })
    if (!gl) return
    const compile = (type: number, source: string) => { const shader = gl.createShader(type)!; gl.shaderSource(shader, source); gl.compileShader(shader); return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null }
    const vs = compile(gl.VERTEX_SHADER, vertex), fs = compile(gl.FRAGMENT_SHADER, fragment)
    if (!vs || !fs) return
    const program = gl.createProgram()!
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'p')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const u = (name: string) => gl.getUniformLocation(program, name)
    const uRes = u('uRes'), uTime = u('uTime'), uRot = u('uRot'), uTint = u('uTint'), uPulse = u('uPulse'), uSS = u('uSS')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    gl.uniform1f(uSS, dpr < 1.5 ? 1 : 0)
    const color = [...tint[toneRef.current]]
    const look = [0, 0], lookTarget = [0, 0]
    let frame = 0, visible = true, pulse = 0, spin = 0
    const start = performance.now()
    const size = () => {
      const width = Math.max(1, Math.round(element.clientWidth * dpr)), height = Math.max(1, Math.round(element.clientHeight * dpr))
      if (element.width !== width || element.height !== height) { element.width = width; element.height = height; gl.viewport(0, 0, width, height) }
      gl.uniform2f(uRes, width, height)
    }
    const draw = (now: number) => {
      const t = still ? 6.2 : (now - start) / 1000
      const goal = tint[toneRef.current]
      for (let i = 0; i < 3; i++) color[i] += (goal[i] - color[i]) * (still ? 1 : 0.07)
      look[0] += (lookTarget[0] - look[0]) * 0.06; look[1] += (lookTarget[1] - look[1]) * 0.06
      pulse *= 0.93; spin += pulse * 0.32
      gl.uniform3f(uTint, color[0], color[1], color[2])
      gl.uniform2f(uRot, Math.sin(t * 0.35) * 0.5 + look[0] * 0.75 + spin, 0.1 + Math.sin(t * 0.27) * 0.1 + look[1] * 0.45)
      gl.uniform1f(uTime, t)
      gl.uniform1f(uPulse, pulse)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    const loop = (now: number) => { frame = 0; if (!visible || document.hidden) return; draw(now); frame = requestAnimationFrame(loop) }
    const run = () => { if (!still && !frame && visible && !document.hidden) frame = requestAnimationFrame(loop) }
    redraw.current = () => { if (still) draw(performance.now()); else run() }
    size(); draw(performance.now()); element.classList.add('is-lit')
    const resize = new ResizeObserver(() => { size(); draw(performance.now()) })
    resize.observe(element)
    const seen = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) run() })
    seen.observe(element)
    const pointer = (event: PointerEvent) => { lookTarget[0] = (event.clientX / window.innerWidth - 0.5) * 2; lookTarget[1] = (event.clientY / window.innerHeight - 0.5) * 2 }
    const press = () => { pulse = 1; run() }
    const visibility = () => { if (!document.hidden) run() }
    if (!still) { window.addEventListener('pointermove', pointer, { passive: true }); element.addEventListener('pointerdown', press) }
    document.addEventListener('visibilitychange', visibility)
    element.addEventListener('webglcontextlost', () => { cancelAnimationFrame(frame); frame = 0; element.classList.remove('is-lit') })
    run()
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); seen.disconnect(); redraw.current = null
      window.removeEventListener('pointermove', pointer); element.removeEventListener('pointerdown', press); document.removeEventListener('visibilitychange', visibility)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])
  return <canvas ref={canvas} className={`ox-star3d ${className}`} aria-hidden="true" />
}
