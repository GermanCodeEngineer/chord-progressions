import { ref, type Ref } from 'vue'
import { noteToFreq } from './musicTheory.ts'

let audioCtx: AudioContext | null = null

function getCtx() {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * Play a single note with an envelope
 */
function playNote(freq: number, startTime: number, duration: number = 1.2, volume: number = 0.18) {
  const ctx = getCtx()

  const osc = ctx.createOscillator()
  const gainNode = ctx.createGain()

  // Slight detuning for warmth
  osc.type = 'triangle'
  osc.frequency.value = freq

  // Harmonic overtone for richness
  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()
  osc2.type = 'sine'
  osc2.frequency.value = freq * 2
  gain2.gain.value = volume * 0.3

  // Envelope: fast attack, slow release
  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02)
  gainNode.gain.exponentialRampToValueAtTime(volume * 0.6, startTime + 0.3)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  osc.connect(gainNode)
  osc2.connect(gain2)

  // Reverb-like effect using delay
  const delay = ctx.createDelay(1.0)
  delay.delayTime.value = 0.08
  const delayGain = ctx.createGain()
  delayGain.gain.value = 0.15
  gainNode.connect(delay)
  delay.connect(delayGain)
  delayGain.connect(ctx.destination)

  gainNode.connect(ctx.destination)
  gain2.connect(ctx.destination)

  osc.start(startTime)
  osc.stop(startTime + duration + 0.1)
  osc2.start(startTime)
  osc2.stop(startTime + duration + 0.1)
}

export const isPlaying: Ref<boolean> = ref(false)
export const playingChordId: Ref<string | null> = ref(null)
export const playingProgressionStep: Ref<number | null> = ref(null)

let stopRequested = false
let scheduledOscillators: number[] = []

/**
 * Play a chord (array of { note, octave })
 */
export function playChord(noteFreqs: { note: string, octave: number }[], chordId: string | null = null): void {
  const ctx = getCtx()
  const now = ctx.currentTime

  playingChordId.value = chordId

  noteFreqs.forEach((nf, i) => {
    const freq = noteToFreq(nf.note, nf.octave)
    // Slight strum: each note 20ms apart
    playNote(freq, now + i * 0.02, 1.5)
  })

  // Clear playing state after chord fades
  setTimeout(() => {
    if (playingChordId.value === chordId) {
      playingChordId.value = null
    }
  }, 1800)
}

/**
 * Play a full chord progression
 */
export async function playProgression(chords: ({ id: string, noteFreqs: { note: string, octave: number }[] })[], bpm: number = 72): Promise<void> {
  if (isPlaying.value) {
    stopProgression()
    return
  }

  isPlaying.value = true
  stopRequested = false
  const ctx = getCtx()
  const beatDuration = 60 / bpm
  const chordDuration = beatDuration * 4 // 4 beats per chord

  for (const [i, chord] of chords.entries()) {
    if (stopRequested) break

    playingProgressionStep.value = i
    playingChordId.value = chord.id

    const now = ctx.currentTime
    chord.noteFreqs.forEach((nf, ni) => {
      const freq = noteToFreq(nf.note, nf.octave)
      playNote(freq, now + ni * 0.025, chordDuration * 0.9)
    })

    // Wait for the chord duration
    await new Promise(resolve => {
      const timeout = setTimeout(resolve, chordDuration * 1000)
      scheduledOscillators.push(timeout)
    })
  }

  isPlaying.value = false
  playingProgressionStep.value = null
  playingChordId.value = null
  stopRequested = false
}

export function stopProgression() {
  stopRequested = true
  scheduledOscillators.forEach(t => clearTimeout(t))
  scheduledOscillators = []
  isPlaying.value = false
  playingProgressionStep.value = null
  playingChordId.value = null
}
