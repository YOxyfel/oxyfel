import type { CareDevice } from './care-copy'

export type CareTaskState = { step: number; camera: boolean; sound: boolean; feedback: string }
export const initialCareTask: CareTaskState = { step: 0, camera: false, sound: false, feedback: 'ready' }

export function advanceCareTask(device: CareDevice, state: CareTaskState, action: string): CareTaskState {
  if (action === 'restart') return { ...initialCareTask, feedback: 'retry' }
  if (state.step === 3) return state
  if (device === 'phone') {
    const actions = ['contacts', 'maria', 'video']
    if (action === actions[state.step]) return { ...state, step: state.step + 1, feedback: ['contacts', 'maria', 'connected'][state.step] }
  }
  if (device === 'computer') {
    if (action === 'invitation' && state.step === 0) return { ...state, step: 1, feedback: 'invitation' }
    if (state.step > 0 && (action === 'camera' || action === 'sound')) {
      const camera = action === 'camera' ? !state.camera : state.camera
      const sound = action === 'sound' ? !state.sound : state.sound
      return { step: camera && sound ? 2 : 1, camera, sound, feedback: camera && sound ? 'readyToJoin' : camera ? 'camera' : sound ? 'microphone' : 'needsBoth' }
    }
    if (action === 'join' && state.step > 0) return state.camera && state.sound ? { ...state, step: 3, feedback: 'connected' } : { ...state, feedback: 'needsBoth' }
  }
  if (device === 'television') {
    if (action === 'source' && state.step === 0) return { ...state, step: 1, feedback: 'source' }
    if (action === 'hdmi1' && state.step === 1) return { ...state, step: 2, feedback: 'hdmi' }
    if ((action === 'hdmi2' || action === 'tv') && state.step === 1) return { ...state, feedback: 'wrongSource' }
    if (action === 'confirm' && state.step === 2) return { ...state, step: 3, feedback: 'picture' }
  }
  return { ...state, feedback: 'wrongStep' }
}
