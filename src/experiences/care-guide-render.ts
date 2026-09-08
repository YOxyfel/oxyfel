import { careCopy } from './care-copy'
import type { CareDevice, CareLocale } from './care-copy'

export type CareGuideDraft = { title: string; note: string; size: number }
export const emptyCareGuide: CareGuideDraft = { title: '', note: '', size: 18 }

export function escapeCareText(value: string) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!)
}

// File names point to real captures of the working simulated controls.
export const careStepImage = (device: CareDevice, step: number, locale: CareLocale) => `care-step-${device}-${step}-${locale}.webp`

export function careGuideHtml(locale: CareLocale, device: CareDevice, draft: CareGuideDraft, embeddedImages?: string[]): string {
  const t = careCopy[locale]
  const example = t.devices[device]
  const title = draft.title.trim() || example.task
  const rows = example.steps.map((step, index) => `<li><div class="picture"><img src="${escapeCareText(embeddedImages?.[index] || careStepImage(device, index, locale))}" alt="${escapeCareText(t.annotationAlt + ", " + (index + 1) + ": " + step)}"></div><div class="instruction"><span class="number">${index + 1}</span><p>${escapeCareText(step)}</p></div></li>`).join('')
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeCareText(title)} · Eldervice</title><style>
  *{box-sizing:border-box}body{margin:0;padding:28px;background:#e8ede2;color:#304237;font-family:Arial,sans-serif}.toolbar{max-width:800px;margin:0 auto 20px;display:flex;gap:20px;align-items:center;font-size:14px}.toolbar button{padding:14px 20px;border:0;border-radius:24px;background:#304237;color:white;font:inherit;cursor:pointer}.guide{max-width:800px;margin:auto;padding:38px;background:#fffef8;box-shadow:0 8px 30px #30423722}header{border-bottom:1px solid #cbd4c0;padding-bottom:18px}.brand{font-family:Georgia,serif;font-size:27px;margin:0 0 18px}.sample{font-size:12px;letter-spacing:.04em}h1{font-family:Georgia,serif;font-weight:400;font-size:34px;line-height:1.1;overflow-wrap:anywhere;margin:16px 0 0}ol{list-style:none;margin:24px 0;padding:0;display:grid;gap:20px}li{display:grid;grid-template-columns:1fr 1.05fr;align-items:center;gap:20px;break-inside:avoid}.picture img{width:100%;height:auto;max-height:230px;object-fit:contain;display:block}.instruction{display:flex;align-items:flex-start;gap:13px}.number{display:grid;place-items:center;flex:0 0 30px;width:30px;height:30px;border-radius:50%;background:#e4ebdb;font-size:16px}.instruction p{font-size:${draft.size === 22 ? 22 : 18}px;line-height:1.45;margin:0}.note{border-top:1px solid #cbd4c0;padding-top:20px;font-size:${draft.size === 22 ? 22 : 18}px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.note strong{font-size:14px}footer{margin-top:25px;padding-top:16px;border-top:1px solid #cbd4c0;font-size:12px;line-height:1.6}@media(max-width:550px){body{padding:12px}.guide{padding:22px}li{grid-template-columns:1fr;gap:12px}.toolbar{flex-wrap:wrap}h1{font-size:29px}}@page{size:A4;margin:12mm}@media print{body{background:white;padding:0}.toolbar{display:none}.guide{box-shadow:none;max-width:none;padding:0}h1{font-size:27px}li{grid-template-columns:1fr 1.05fr;gap:18px}ol{gap:12px}.picture img{max-height:130px}footer{font-size:10px}.sample{font-size:10px}}
  </style></head><body><div class="toolbar"><button type="button" onclick="window.print()">${escapeCareText(t.printAction)}</button><span>${escapeCareText(t.sampleGuide)}</span></div><main class="guide"><header><p class="brand">Eldervice</p><p class="sample">${escapeCareText(t.sampleGuide)}</p><h1>${escapeCareText(title)}</h1></header><ol>${rows}</ol>${draft.note.trim() ? `<div class="note"><strong>${escapeCareText(t.personalNote)}</strong><br>${escapeCareText(draft.note.trim())}</div>` : ''}<footer>${escapeCareText(t.guideEnd)}<br>${escapeCareText(t.exampleNote)}</footer></main></body></html>`
}
