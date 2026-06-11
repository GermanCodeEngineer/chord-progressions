// All 12 chromatic notes
export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

// Intervals in semitones for each scale type
export const SCALE_INTERVALS = {
  major: { label: "Major", intervals: [0, 2, 4, 5, 7, 9, 11] },
  naturalMinor: { label: "Natural Minor", intervals: [0, 2, 3, 5, 7, 8, 10] },
  harmonicMinor: { label: "Harmonic Minor", intervals: [0, 2, 3, 5, 7, 8, 11] },
  melodicMinor: { label: "Melodic Minor", intervals: [0, 2, 3, 5, 7, 9, 11] },
  dorianMode: { label: "Dorian", intervals: [0, 2, 3, 5, 7, 9, 10] },
  phrygianMode: { label: "Phrygian", intervals: [0, 1, 3, 5, 7, 8, 10] },
  lydianMode: { label: "Lydian", intervals: [0, 2, 4, 6, 7, 9, 11] },
  mixolydianMode: { label: "Mixolydian", intervals: [0, 2, 4, 5, 7, 9, 10] },
  locrianMode: { label: "Locrian", intervals: [0, 1, 3, 5, 6, 8, 10] },
  pentatonicMajor: { label: "Pentatonic Major", intervals: [0, 2, 4, 7, 9] },
  pentatonicMinor: { label: "Pentatonic Minor", intervals: [0, 3, 5, 7, 10] },
  blues: { label: "Blues", intervals: [0, 3, 5, 6, 7, 10] },
  wholeTone: { label: "Whole Tone", intervals: [0, 2, 4, 6, 8, 10] },
  diminished: { label: "Diminished", intervals: [0, 2, 3, 5, 6, 8, 9, 11] },
}

// Default visible scales
export const DEFAULT_VISIBLE_SCALES: (keyof typeof SCALE_INTERVALS)[] = ["major", "naturalMinor"]

export const MIN_BPM = 40
export const DEFAULT_BPM = 120
export const MAX_BPM = 280

// Chord types with their intervals from root
export const CHORD_TYPES = {
  major: { label: "", suffix: "", intervals: [0, 4, 7] },
  minor: { label: "m", suffix: "m", intervals: [0, 3, 7] },
  dim: { label: "°", suffix: "dim", intervals: [0, 3, 6] },
  aug: { label: "+", suffix: "aug", intervals: [0, 4, 8] },
  maj7: { label: "maj7", suffix: "maj7", intervals: [0, 4, 7, 11] },
  min7: { label: "m7", suffix: "m7", intervals: [0, 3, 7, 10] },
  dom7: { label: "7", suffix: "7", intervals: [0, 4, 7, 10] },
  dim7: { label: "°7", suffix: "dim7", intervals: [0, 3, 6, 9] },
  halfdim7: { label: "ø7", suffix: "ø7", intervals: [0, 3, 6, 10] },
  sus2: { label: "sus2", suffix: "sus2", intervals: [0, 2, 7] },
  sus4: { label: "sus4", suffix: "sus4", intervals: [0, 5, 7] },
  add9: { label: "add9", suffix: "add9", intervals: [0, 4, 7, 14] },
}

export const CHORD_LEGEND = [
  {
    symbol: "(none)",
    example: "C",
    name: "Major",
    description: "Major triad: root, major 3rd, perfect 5th",
  },
  {
    symbol: "m",
    example: "Cm",
    name: "Minor",
    description: "Minor triad: root, minor 3rd, perfect 5th",
  },
  {
    symbol: "°",
    example: "C°",
    name: "Diminished",
    description: "Diminished triad: root, minor 3rd, diminished 5th",
  },
  {
    symbol: "+",
    example: "C+",
    name: "Augmented",
    description: "Augmented triad: root, major 3rd, augmented 5th",
  },
  {
    symbol: "maj7",
    example: "Cmaj7",
    name: "Major 7th",
    description: "Major triad plus major 7th",
  },
  { symbol: "m7", example: "Cm7", name: "Minor 7th", description: "Minor triad plus minor 7th" },
  {
    symbol: "7",
    example: "C7",
    name: "Dominant 7th",
    description: "Major triad plus minor 7th, the dominant sound",
  },
  {
    symbol: "°7",
    example: "C°7",
    name: "Diminished 7th",
    description: "Diminished triad plus diminished 7th",
  },
  {
    symbol: "ø7",
    example: "Cø7",
    name: "Half-diminished 7th",
    description: "Diminished triad plus minor 7th, also written m7♭5",
  },
  {
    symbol: "sus2",
    example: "Csus2",
    name: "Suspended 2nd",
    description: "Root, major 2nd, and 5th, no 3rd",
  },
  {
    symbol: "sus4",
    example: "Csus4",
    name: "Suspended 4th",
    description: "Root, perfect 4th, and 5th, no 3rd",
  },
  {
    symbol: "add9",
    example: "Cadd9",
    name: "Add 9",
    description: "Major triad plus a 9th above the root",
  },
]

export const ROMAN_LEGEND = [
  { symbol: "I", description: "Tonic, the home chord of the scale" },
  { symbol: "II", description: "Supertonic, two steps above the tonic" },
  { symbol: "III", description: "Mediant, midway between tonic and dominant" },
  { symbol: "IV", description: "Subdominant, often leads toward the dominant" },
  { symbol: "V", description: "Dominant, strong pull back to the tonic" },
  { symbol: "VI", description: "Submediant, relative minor or major counterpart" },
  { symbol: "VII", description: "Leading tone chord, often unstable, resolves to I" },
]

// Roman numerals for scale degrees
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"]

// Diatonic chord qualities per scale type (index = degree 0-6)
const DIATONIC_QUALITIES = {
  major: ["major", "minor", "minor", "major", "major", "minor", "dim"],
  naturalMinor: ["minor", "dim", "major", "minor", "minor", "major", "major"],
  harmonicMinor: ["minor", "dim", "aug", "minor", "major", "major", "dim7"],
  melodicMinor: ["minor", "minor", "aug", "major", "major", "dim", "dim"],
  dorianMode: ["minor", "minor", "major", "major", "minor", "dim", "major"],
  phrygianMode: ["minor", "major", "major", "minor", "dim", "major", "minor"],
  lydianMode: ["major", "major", "minor", "dim", "major", "minor", "minor"],
  mixolydianMode: ["major", "minor", "dim", "major", "minor", "minor", "major"],
  locrianMode: ["dim", "major", "minor", "minor", "major", "major", "minor"],
  pentatonicMajor: ["major", "minor", "minor", "major", "minor"],
  pentatonicMinor: ["minor", "major", "minor", "minor", "major"],
  blues: ["dom7", "minor", "dim", "dom7", "dom7", "minor"],
  wholeTone: ["aug", "aug", "aug", "aug", "aug", "aug"],
  diminished: ["dim", "dim", "dim", "dim", "dim", "dim", "dim", "dim"],
}

export interface NoteFreq {
  note: (typeof NOTES)[number]
  octave: number
}

export interface Chord {
  id: string
  root: (typeof NOTES)[number]
  quality: keyof typeof CHORD_TYPES
  label: string
  roman: (typeof ROMAN)[number] | "I⁸"
  noteFreqs: NoteFreq[]
  isOctavatedBase: boolean
}

/**
 * Build chords for a given root note + scale type
 * TODO: Make class for result?
 */
export function buildScaleChords(
  rootNote: (typeof NOTES)[number],
  scaleType: keyof typeof SCALE_INTERVALS,
): Chord[] {
  const scale = SCALE_INTERVALS[scaleType]
  if (!scale) return []

  const rootIdx = NOTES.indexOf(rootNote)
  const qualities = (DIATONIC_QUALITIES[scaleType] || []) as (keyof typeof CHORD_TYPES)[]

  const scaleChords = scale.intervals.map((interval, degree) => {
    const noteIdx = (rootIdx + interval) % 12
    const note = NOTES[noteIdx]!
    const quality = qualities[degree] || "major"
    const chordType = CHORD_TYPES[quality]
    const roman = ROMAN[degree] || (degree + 1).toString()

    // Get actual note frequencies for all chord tones
    const noteFreqs = chordType.intervals.map((chordInterval) => {
      const idx = (noteIdx + (chordInterval % 12)) % 12
      // Octave shifts for intervals > 11
      const octaveShift = Math.floor(chordInterval / 12)
      return { note: NOTES[idx]!, octave: 4 + octaveShift }
    })

    return {
      id: `${note}${quality}`,
      root: note,
      quality,
      label: `${note}${chordType.label}`,
      roman,
      noteFreqs,
      isOctavatedBase: false,
    }
  })

  // Duplicate the base chord an octave higher
  const baseChord = scaleChords[0]
  if (baseChord) {
    scaleChords.push({
      ...baseChord,
      roman: `${baseChord.roman}⁸`,
      noteFreqs: baseChord.noteFreqs.map((nf) => ({ ...nf, octave: nf.octave + 1 })),
      isOctavatedBase: true,
    })
  }
  return scaleChords
}

/**
 * Get frequency for a note + octave
 */
export function noteToFreq(note: (typeof NOTES)[number], octave: number = 4): number {
  const idx = NOTES.indexOf(note)
  // A4 = 440 Hz, A is index 9
  const semitones = (octave - 4) * 12 + (idx - 9)
  return 440 * Math.pow(2, semitones / 12)
}

/**
 * All scale roots for "all chords" grid view
 */
export const ALL_ROOTS = NOTES

/**
 * Get a chord's note frequencies by root + type
 */
export function getChordFreqs(
  root: (typeof NOTES)[number],
  chordTypeName: keyof typeof CHORD_TYPES,
): NoteFreq[] {
  const rootIdx = NOTES.indexOf(root)
  const chordType = CHORD_TYPES[chordTypeName]
  if (!chordType || rootIdx === -1) return []
  return chordType.intervals.map((ci) => {
    const noteIdx = (rootIdx + (ci % 12)) % 12
    const octaveShift = Math.floor(ci / 12)
    return { note: NOTES[noteIdx]!, octave: 4 + octaveShift }
  })
}
