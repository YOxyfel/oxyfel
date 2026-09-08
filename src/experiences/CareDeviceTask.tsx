import { useEffect, useRef } from 'react'
import { Camera, CheckCircle, DeviceMobile, Image, Microphone, Monitor, ChatCircle, Television, Users, VideoCamera } from '@phosphor-icons/react'
import { careCopy } from './care-copy'
import type { CareLocale, CareDevice } from './care-copy'
import type { CareTaskState } from './care-task-logic'

export function CareDeviceTask({ locale, device, state, onAction }: { locale: CareLocale; device: CareDevice; state: CareTaskState; onAction: (action: string) => void }) {
  const t = careCopy[locale]
  const example = t.devices[device]
  const task = useRef<HTMLDivElement>(null)
  useEffect(() => {
    task.current?.querySelector<HTMLElement>('[data-task-next]')?.focus({ preventScroll: true })
  }, [state.step, device])

  return <div className={`c-device-task c-task-${device}`} ref={task}>
    <p className="c-simulation-label">{t.simulation}</p>
    <div className="c-task-instruction"><span>{Math.min(state.step + 1, 3)}</span><p>{state.step < 3 ? example.steps[state.step] : t.successTitle}</p></div>
    {state.step === 3 ? <div className="c-task-success">
      <CheckCircle size={52} weight="light" aria-hidden="true" />
      <h4 tabIndex={-1} data-task-next>{device === 'television' ? t.picture : t.connected}</h4>
      <p>{t.successBody}</p>
    </div> : device === 'phone' ? <div className="c-sample-phone">
      <span className="c-phone-speaker" aria-hidden="true" />
      <p className="c-device-heading">{state.step === 0 ? t.phone : state.step === 1 ? t.contacts : t.maria}</p>
      {state.step === 0 ? <div className="c-phone-apps">
        <button data-task-next className="c-device-control c-highlight-control" type="button" onClick={() => onAction('contacts')}><Users size={31} aria-hidden="true" />{t.contacts}</button>
        <button className="c-device-control c-secondary-control" type="button" onClick={() => onAction('photos')}><Image size={31} aria-hidden="true" />{t.photos}</button>
      </div> : state.step === 1 ? <div className="c-contact-list">
        <button data-task-next className="c-device-control c-highlight-control" type="button" onClick={() => onAction('maria')}><span className="c-avatar" aria-hidden="true">M</span>{t.maria}</button>
        <button className="c-device-control c-secondary-control" type="button" onClick={() => onAction('alex')}><span className="c-avatar" aria-hidden="true">A</span>{locale === 'bg' ? 'Алекс' : 'Alex'}</button>
      </div> : <div className="c-contact-actions">
        <span className="c-large-avatar" aria-hidden="true">M</span>
        <button data-task-next className="c-device-control c-highlight-control" type="button" onClick={() => onAction('video')}><VideoCamera size={28} aria-hidden="true" />{t.video}</button>
        <button className="c-device-control c-secondary-control" type="button" onClick={() => onAction('message')}><ChatCircle size={21} aria-hidden="true" />{t.messages}</button>
      </div>}
      <span className="c-phone-home" aria-hidden="true" />
    </div> : device === 'computer' ? <div className="c-sample-computer">
      <div className="c-computer-bar" aria-hidden="true"><i /><i /><i /></div>
      <Monitor size={37} weight="light" aria-hidden="true" /><p className="c-device-heading">{t.invitation}</p>
      {state.step === 0 ? <div className="c-invitation-actions">
        <button data-task-next className="c-device-control c-highlight-control" type="button" onClick={() => onAction('invitation')}>{t.openInvitation}</button>
        <button className="c-device-control c-secondary-control" type="button" onClick={() => onAction('close')}>{t.close}</button>
      </div> : <>
        <div className="c-call-toggles">
          <button data-task-next={state.step === 1 && !state.camera ? true : undefined} className="c-device-control" type="button" aria-pressed={state.camera} onClick={() => onAction('camera')}><Camera size={25} aria-hidden="true" /><span>{t.camera}<small>{state.camera ? t.on : t.off}</small></span></button>
          <button data-task-next={state.step === 1 && state.camera && !state.sound ? true : undefined} className="c-device-control" type="button" aria-pressed={state.sound} onClick={() => onAction('sound')}><Microphone size={25} aria-hidden="true" /><span>{t.microphone}<small>{state.sound ? t.on : t.off}</small></span></button>
        </div>
        <button data-task-next={state.step === 2 ? true : undefined} className={`c-device-control c-join-call ${state.step === 2 ? 'c-highlight-control' : ''}`} type="button" onClick={() => onAction('join')}><VideoCamera size={22} aria-hidden="true" />{t.join}</button>
      </>}
    </div> : <div className="c-sample-television">
      <div className="c-television-screen">
        <Television size={32} weight="light" aria-hidden="true" />
        <p className="c-device-heading">{state.step === 0 ? t.noSignal : state.step === 1 ? t.chooseSource : 'HDMI 1'}</p>
        {state.step > 0 && <div className="c-input-choices">
          <button className="c-device-control" type="button" onClick={() => onAction('tv')}>{t.television}</button>
          <button data-task-next={state.step === 1 ? true : undefined} className={`c-device-control ${state.step > 0 ? 'c-highlight-control' : ''}`} type="button" aria-pressed={state.step === 2} onClick={() => onAction('hdmi1')}>HDMI 1</button>
          <button className="c-device-control" type="button" onClick={() => onAction('hdmi2')}>HDMI 2</button>
        </div>}
      </div>
      <div className="c-sample-remote">
        <DeviceMobile size={24} weight="light" aria-hidden="true" />
        <button data-task-next={state.step === 0 ? true : undefined} className={`c-device-control ${state.step === 0 ? 'c-highlight-control' : ''}`} type="button" onClick={() => onAction('source')}>{t.source}</button>
        <button data-task-next={state.step === 2 ? true : undefined} className={`c-device-control ${state.step === 2 ? 'c-highlight-control' : ''}`} type="button" onClick={() => onAction('confirm')}>{t.confirm}</button>
      </div>
    </div>}
    <div className="c-task-progress"><p>{t.progress}: <strong>{state.step}/3</strong> {t.completed}</p><div className="c-task-track" aria-hidden="true">{[1, 2, 3].map(index => <span key={index} className={state.step >= index ? 'is-done' : ''} />)}</div><button type="button" onClick={() => onAction('restart')}>{t.restart}</button></div>
  </div>
}
