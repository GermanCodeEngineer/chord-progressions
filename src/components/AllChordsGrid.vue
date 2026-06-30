<template>
  <div class="allChords">
    <div class="sectionControls">
      <div class="filterRow">
        <span class="filterLabel">Chord type</span>
        <div class="typePills">
          <button
            v-for="(ct, key) in CHORD_TYPES"
            :key="key"
            class="pill"
            :class="{ active: activeType === key }"
            @click="activeType = key"
          >
            {{ ct.label || "maj" }}
          </button>
        </div>
      </div>
    </div>

    <div class="chordGrid">
      <div
        v-for="root in NOTES"
        :key="root"
        class="gridChord"
        :class="{ isPlaying: playingChordId === `${root}${activeType}` }"
        @click="handleClick(root)"
        role="button"
        tabindex="0"
        @keydown.enter="handleClick(root)"
        :title="`${root}${CHORD_TYPES[activeType].label}`"
      >
        <span class="gridChordName">{{ root }}{{ CHORD_TYPES[activeType].label }}</span>
        <span class="gridChordNotes">{{ getChordNotes(root) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { NOTES, CHORD_TYPES, getChordFreqs } from "../musicTheory.ts"
import { playChord, playingChordId } from "../useAudio.ts"

const activeType = ref<keyof typeof CHORD_TYPES>("major")

function getChordNotes(root: (typeof NOTES)[number]): string {
  const freqs = getChordFreqs(root, activeType.value)
  return freqs.map((f) => f.note).join(" · ")
}

function handleClick(root: (typeof NOTES)[number]): void {
  const freqs = getChordFreqs(root, activeType.value)
  playChord(freqs, `${root}${activeType.value}`)
}
</script>

<style scoped>
.allChords {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sectionControls {
  background: var(--surface);
  border: 1px solid var(--borderSubtle);
  border-radius: 10px;
  padding: 14px 16px;
}

.filterRow {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filterLabel {
  font-size: 11px;
  font-weight: 600;
  color: var(--textMuted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.typePills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pill {
  padding: 4px 10px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 20px;
  color: var(--textMuted);
  font-family: var(--fontMono);
  font-size: 11px;
  font-weight: 500;
  transition: all 0.15s;
}

.pill:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.pill.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #000;
  font-weight: 600;
}

/* Chord grid */
.chordGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 8px;
}

.gridChord {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: var(--surfaceRaised);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}

.gridChord:hover {
  border-color: var(--accent);
  background: var(--accentDim);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--accentGlow);
}

.gridChord:active {
  transform: scale(0.96);
}

.gridChord.isPlaying {
  border-color: var(--accent);
  background: var(--accentDim);
  box-shadow:
    0 0 0 1px var(--accent),
    0 4px 20px var(--accentGlow);
  animation: chordPulse 0.4s ease-out;
}

@keyframes chordPulse {
  0% {
    box-shadow: 0 0 0 0 var(--accentGlow);
  }
  50% {
    box-shadow: 0 0 0 8px transparent;
  }
  100% {
    box-shadow:
      0 0 0 1px var(--accent),
      0 4px 20px var(--accentGlow);
  }
}

.gridChordName {
  font-family: var(--fontMono);
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}

.gridChordNotes {
  font-family: var(--fontMono);
  font-size: 9px;
  color: var(--textMuted);
  letter-spacing: 0.02em;
}
</style>
