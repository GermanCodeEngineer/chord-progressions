import { ref, type Ref } from 'vue'
import { noteToFreq, DEFAULT_BPM, type NoteFreq, type Chord } from './musicTheory'

let audioCtx: AudioContext | null = null
let masterGain: GainNode | null = null

function getCtx() {
  if (!audioCtx) {
    audioCtx = new AudioContext()
    masterGain = audioCtx.createGain()
    masterGain.gain.value = 0.55
    masterGain.connect(audioCtx.destination)
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

function getMaster() {
  getCtx()
  return masterGain!
}

/**
 * Soft electric-piano tone: filtered sine partials with a gentle ADSR envelope.
 */
function playNote(freq: number, startTime: number, duration: number = 1.2, volume: number = 0.11) {
  const ctx = getCtx()
  const output = getMaster()
  const endTime = startTime + duration + 0.15

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.Q.value = 0.7
  filter.frequency.setValueAtTime(Math.min(freq * 6, 4200), startTime)
  filter.frequency.exponentialRampToValueAtTime(900, startTime + Math.min(duration * 0.65, 1.2))

  const gainNode = ctx.createGain()
  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.04)
  gainNode.gain.exponentialRampToValueAtTime(volume * 0.35, startTime + 0.18)
  gainNode.gain.setValueAtTime(volume * 0.35, startTime + Math.max(duration - 0.25, 0.2))
  gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime)

  const partials = [
    { ratio: 1, level: 1 },
    { ratio: 2, level: 0.12 },
    { ratio: 3, level: 0.04 },
  ]

  for (const partial of partials) {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq * partial.ratio

    const partialGain = ctx.createGain()
    partialGain.gain.value = partial.level

    osc.connect(partialGain)
    partialGain.connect(filter)
    osc.start(startTime)
    osc.stop(endTime)
  }

  filter.connect(gainNode)
  gainNode.connect(output)
}

export const isPlaying: Ref<boolean> = ref(false)
export const playingChordId: Ref<string | null> = ref(null)
export const playingProgressionStep: Ref<number | null> = ref(null)
export const bassNotesOnly: Ref<boolean> = ref(false)
export const finishWithBase: Ref<boolean> = ref(true)

let stopRequested = false
let scheduledOscillators: number[] = []

function notesToPlay(noteFreqs: NoteFreq[]): NoteFreq[] {
  let notes = noteFreqs
  if (bassNotesOnly.value && noteFreqs.length > 0) {
    const root = noteFreqs[0]
    notes = root ? [root] : noteFreqs
  }
  return notes
}

/**
 * Play a chord (array of { note, octave })
 */
export function playChord(noteFreqs: NoteFreq[], chordId: string | null = null): void {
  const ctx = getCtx()
  const now = ctx.currentTime

  playingChordId.value = chordId

  notesToPlay(noteFreqs).forEach((nf, i) => {
    const freq = noteToFreq(nf.note, nf.octave)
    playNote(freq, now + i * 0.035, 1.4)
  })

  setTimeout(() => {
    if (playingChordId.value === chordId) {
      playingChordId.value = null
    }
  }, 1600)
}

/**
 * Play a full chord progression
 */
export async function playProgression(chords: Chord[], bpm: number = DEFAULT_BPM): Promise<void> {
  if (isPlaying.value) {
    stopProgression()
    return
  }

  isPlaying.value = true
  stopRequested = false
  const ctx = getCtx()
  const beatDuration = 60 / bpm
  const chordDuration = beatDuration * 4

  for (const [i, chord] of chords.entries()) {
    if (stopRequested) break

    playingProgressionStep.value = i
    playingChordId.value = chord.id

    const now = ctx.currentTime
    notesToPlay(chord.noteFreqs).forEach((nf, ni) => {
      const freq = noteToFreq(nf.note, nf.octave)
      playNote(freq, now + ni * 0.04, chordDuration * 0.92, 0.09)
    })

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
