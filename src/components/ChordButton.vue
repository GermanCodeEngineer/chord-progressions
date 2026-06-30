<template>
  <div
    class="chordCard"
    :class="{
      'isPlaying': isActive, // TODO: investigate what isActive and isProgressionActive are
      'isProgressionActive': isProgressionActive,
      [`quality-${chord.quality}`]: true,
    }"
    :title="`${chord.label}, click to play`"
    @click="handleCardClick"
  >
    <!-- Isolated wrapper prevents the checkbox click from triggering the card audio -->
    <div class="checkboxWrapper" v-show="showSelectBox" @click.stop>
      <RoundCheckbox v-model="isSelected" />
    </div>

    <span class="chordRoman">{{ chord.roman }}</span>
    <span class="chordName">{{ chord.label }}</span>
    <span class="chordQualityBadge">{{ qualityLabel }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { type Chord } from "../musicTheory.ts"
import { playChord, playingChordId, playingProgressionStep } from "../useAudio.ts"
import RoundCheckbox from "./RoundCheckbox.vue"

const isSelected = defineModel("isSelected", { type: Boolean, default: false })

const props = withDefaults(
  defineProps<{
    chord: Chord
    showSelectBox: boolean
    index?: number
  }>(),
  {
    index: -1,
  },
)

const isActive = computed<boolean>(() => playingChordId.value === props.chord.id)

const isProgressionActive = computed<boolean>(
  () => playingProgressionStep.value === props.index && props.index !== -1,
)

const QUALITY_LABELS: Record<string, string> = {
  major: "maj",
  minor: "min",
  dim: "dim",
  aug: "aug",
  maj7: "Δ7",
  min7: "m7",
  dom7: "7",
  dim7: "°7",
  halfdim7: "ø7",
  sus2: "sus2",
  sus4: "sus4",
  add9: "add9",
}

const qualityLabel = computed<string>(() => QUALITY_LABELS[props.chord.quality] || "")

function handleCardClick(): void {
  playChord(props.chord.noteFreqs, props.chord.id)
}
</script>

<style scoped>
.chordCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 14px;
  background: var(--surfaceRaised);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    transform 0.1s,
    box-shadow 0.2s,
    padding 0.2s;
  min-width: 64px;
  position: relative;
  overflow: hidden;
  user-select: none;
}

/* Checkbox container layout */
.checkboxWrapper {
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  cursor: default;
}

.chordCard::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--accent);
  opacity: 0;
  transition: opacity 0.2s;
}

.chordCard:hover {
  border-color: var(--accent);
  background: var(--accentDim);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px var(--accentGlow);
}

.chordCard:active {
  transform: translateY(0px) scale(0.97);
}

.chordCard.isPlaying,
.chordCard.isProgressionActive {
  border-color: var(--accent);
  background: var(--accentDim);
  box-shadow:
    0 0 0 1px var(--accent),
    0 4px 20px var(--accentGlow);
  animation: chord-pulse 0.4s ease-out;
}

@keyframes chordPulse {
  0% {
    box-shadow:
      0 0 0 0 var(--accentGlow),
      0 0 0 1px var(--accent);
  }
  50% {
    box-shadow:
      0 0 0 6px transparent,
      0 0 0 1px var(--accent);
  }
  100% {
    box-shadow:
      0 0 0 1px var(--accent),
      0 4px 20px var(--accentGlow);
  }
}

.chordRoman {
  font-family: var(--fontMono);
  font-size: 10px;
  font-weight: 500;
  color: var(--textMuted);
  letter-spacing: 0.05em;
  transition: color 0.15s;
}

.chordCard.isPlaying .chordRoman,
.chordCard:hover .chordRoman {
  color: var(--accent);
}

.chordName {
  font-family: var(--fontMono);
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
}

.chordQualityBadge {
  font-size: 9px;
  font-family: var(--fontMono);
  color: var(--textMuted);
  background: var(--borderSubtle);
  padding: 1px 5px;
  border-radius: 3px;
  letter-spacing: 0.03em;
}

/* Quality-based accent colors */
.qualityMinor .chordRoman {
  color: #7a9ec5;
}
.qualityMinor:hover .chordRoman,
.qualityMinor.isPlaying .chordRoman {
  color: #7ab8f5;
}
.qualityDim .chordRoman {
  color: #c57a7a;
}
.qualityDim:hover .chordRoman,
.qualityDim.isPlaying .chordRoman {
  color: #f57a7a;
}
.qualityAug .chordRoman {
  color: #9e7ac5;
}
</style>
