import { useState } from 'react'
import { DownloadSimple, Printer } from '@phosphor-icons/react'
import { careCopy } from './care-copy'
import type { CareLocale, CareDevice } from './care-copy'
import { careStepImage, careGuideHtml, escapeCareText } from './care-guide-render'
import type { CareGuideDraft } from './care-guide-render'
import { media } from '../content'

export function CareGuide({ locale, device, draft, onDraft, onStatus }: { locale: CareLocale; device: CareDevice; draft: CareGuideDraft; onDraft: (draft: CareGuideDraft) => void; onStatus: (status: string) => void }) {
  const [busy, setBusy] = useState(false)
  const t = careCopy[locale]
  const example = t.devices[device]
  const title = draft.title || example.task

  async function embeddedImages(): Promise<string[]> {
    return Promise.all([0, 1, 2].map(async step => {
      const url = new URL(media(careStepImage(device, step, locale)), window.location.href)
      if (url.origin !== window.location.origin) throw new Error('Guide images must be local')
      const response = await fetch(url, { credentials: 'same-origin' })
      if (!response.ok || !response.headers.get('content-type')?.includes('image/')) throw new Error('Guide image could not load')
      const blob = await response.blob()
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    }))
  }

  async function download() {
    if (busy) return
    setBusy(true)
    onStatus('preparing')
    try {
      const images = await embeddedImages()
      const url = URL.createObjectURL(new Blob([careGuideHtml(locale, device, draft, images)], { type: 'text/html;charset=utf-8' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `care-guide-${device}-${locale}.html`
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 2000)
      onStatus('downloaded')
    } catch { onStatus('exportFailed') }
    finally { setBusy(false) }
  }

  async function printView() {
    if (busy) return
    const view = window.open('', '_blank')
    if (!view) { onStatus('printBlocked'); return }
    view.opener = null
    view.document.write(`<!doctype html><html lang="${locale}"><meta charset="utf-8"><title>Eldervice</title><body style="font:18px Arial;padding:32px;color:#304237;background:#f7f4ec"><p>${escapeCareText(t.status.preparing)}</p></body></html>`)
    view.document.close()
    setBusy(true)
    onStatus('preparing')
    try {
      const images = await embeddedImages()
      if (view.closed) return
      view.document.open()
      view.document.write(careGuideHtml(locale, device, draft, images))
      view.document.close()
      onStatus('printOpened')
    } catch {
      if (!view.closed) view.close()
      onStatus('exportFailed')
    } finally { setBusy(false) }
  }

  return <div className="c-guide-workbench" aria-label={t.guideLabel}>
    <div className="c-guide-controls">
      <p className="c-paper-label">{t.guideLabel}</p>
      <label htmlFor="care-guide-title">{t.guideTitleLabel}</label>
      <input id="care-guide-title" maxLength={72} value={draft.title} placeholder={example.task} onChange={event => onDraft({ ...draft, title: event.target.value })} />
      <fieldset><legend>{t.textSize}</legend><div className="c-guide-size-choices">{[18, 22].map(size => <button type="button" key={size} aria-pressed={draft.size === size} onClick={() => onDraft({ ...draft, size })}>{size === 18 ? t.large : t.extraLarge}</button>)}</div></fieldset>
      <label htmlFor="care-guide-note">{t.guideNoteLabel}</label>
      <textarea id="care-guide-note" maxLength={140} rows={3} placeholder={t.guideNotePlaceholder} value={draft.note} onChange={event => onDraft({ ...draft, note: event.target.value })} />
      <p className="c-guide-workbench-note">{t.guideProject}</p>
    </div>

    <div className={`c-visual-guide ${draft.size === 22 ? 'c-extra-large' : ''}`}>
      <div className="c-visual-guide-head"><span>Eldervice</span><p>{t.sampleGuide}</p><h4>{title}</h4></div>
      <ol>{example.steps.map((step, index) => <li key={step}><img src={media(careStepImage(device, index, locale))} alt={`${t.annotationAlt}, ${index + 1}: ${step}`} /><div><span className="c-guide-number" aria-hidden="true">{index + 1}</span><p>{step}</p></div></li>)}</ol>
      {draft.note.trim() && <div className="c-visual-note"><strong>{t.personalNote}</strong><p>{draft.note}</p></div>}
      <p className="c-visual-guide-tail">{t.guideEnd}</p>
    </div>

    <div className="c-guide-export" aria-busy={busy}><div><button className="c-export-primary" type="button" aria-disabled={busy} onClick={download}><DownloadSimple size={21} aria-hidden="true" />{t.download}</button><button type="button" aria-disabled={busy} onClick={printView}><Printer size={21} aria-hidden="true" />{t.print}</button></div><p>{t.downloadHint}</p></div>
  </div>
}
