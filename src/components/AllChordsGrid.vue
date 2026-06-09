<template>
  <div class="all-chords">
    <div class="section-controls">
      <div class="filter-row">
        <span class="filter-label">Chord type</span>
        <div class="type-pills">
          <button
            v-for="(ct, key) in CHORD_TYPES"
            :key="key"
            class="pill"
            :class="{ active: activeType === key }"
            @click="activeType = key"
          >{{ ct.label || 'maj' }}</button>
        </div>
      </div>
    </div>

    <div class="chord-grid">
      <div
        v-for="root in NOTES"
        :key="root"
        class="grid-chord"
        :class="{ 'is-playing': playingChordId === `${root}${activeType}` }"
        @click="handleClick(root)"
        role="button"
        tabindex="0"
        @keydown.enter="handleClick(root)"
        :title="`${root}${CHORD_TYPES[activeType].label}`"
      >
        <span class="grid-chord-name">{{ root }}{{ CHORD_TYPES[activeType].label }}</span>
        <span class="grid-chord-notes">{{ getChordNotes(root) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { NOTES, CHORD_TYPES, getChordFreqs } from '../musicTheory.ts'
import { playChord, playingChordId } from '../useAudio.ts'

const activeType = ref('major')

function getChordNotes(root) {
  const freqs = getChordFreqs(root, activeType.value)
  return freqs.map(f => f.note).join(' · ')
}

function handleClick(root) {
  const freqs = getChordFreqs(root, activeType.value)
  playChord(freqs, `${root}${activeType.value}`)
}
</script>

<style scoped>
.all-chords {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-controls {
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 14px 16px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.type-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pill {
  padding: 4px 10px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 20px;
  color: var(--text-muted);
  font-family: var(--font-mono);
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
.chord-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 8px;
}

.grid-chord {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}

.grid-chord:hover {
  border-color: var(--accent);
  background: var(--accent-dim);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--accent-glow);
}

.grid-chord:active {
  transform: scale(0.96);
}

.grid-chord.is-playing {
  border-color: var(--accent);
  background: var(--accent-dim);
  box-shadow: 0 0 0 1px var(--accent), 0 4px 20px var(--accent-glow);
  animation: chord-pulse 0.4s ease-out;
}

@keyframes chord-pulse {
  0% { box-shadow: 0 0 0 0 var(--accent-glow); }
  50% { box-shadow: 0 0 0 8px transparent; }
  100% { box-shadow: 0 0 0 1px var(--accent), 0 4px 20px var(--accent-glow); }
}

.grid-chord-name {
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}

.grid-chord-notes {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}
</style>
