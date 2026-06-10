<template>
  <div class="scale-row">
    <div class="scale-header">
      <div class="scale-title-group">
        <span class="scale-root">{{ rootNote }}</span>
        <span class="scale-type">{{ scaleLabel }}</span>
      </div>

      <div class="scale-actions">
        <button
          class="play-progression-btn"
          :class="{ 'is-playing': isThisPlaying }"
          @click="handlePlayProgression"
          :title="isThisPlaying ? 'Stop progression' : 'Play all chords in sequence'"
        >
          <svg v-if="!isThisPlaying" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <polygon points="2,1 11,6 2,11"/>
          </svg>
          <svg v-else width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="2" y="1" width="3" height="10"/>
            <rect x="7" y="1" width="3" height="10"/>
          </svg>
          <span>{{ isThisPlaying ? 'Stop' : 'Play' }}</span>
        </button>

        <button
          v-if="!inSelectionMode"
          class="derive-progression-btn"
          @click="openSelectionMenu()"
          title='Select chords to derive a progression'
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="1" y="2" width="2" height="2" rx="0.5"/>
            <rect x="4" y="2.5" width="7" height="1"/>
            <rect x="1" y="5" width="2" height="2" rx="0.5"/>
            <rect x="4" y="5.5" width="7" height="1"/>
            <rect x="1" y="8" width="2" height="2" rx="0.5"/>
            <rect x="4" y="8.5" width="7" height="1"/>
          </svg>
          <span>Derive Progression</span>
        </button>

        <button
          v-if="inSelectionMode"
          class="confirm-selection-btn"
          @click="confirmSelection()"
          title="Confirm your selected progression"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="2 6 5 9 10 3"/>
          </svg>
          <span>Confirm Selection</span>
        </button>

        <button
          v-if="inSelectionMode"
          class="cancel-selection-btn"
          @click="cancelSelection()"
          title="Exit selection mode"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="2" y1="2" x2="10" y2="10"/>
            <line x1="10" y1="2" x2="2" y2="10"/>
          </svg>
          <span>Cancel</span>
        </button>
      </div>
    </div>

    <div class="chords-row">
      <ChordButton
        v-for="(chord, i) in chords"
        :key="chord.id"
        :chord="chord"
        :showSelectBox="inSelectionMode"
        v-model:isSelected="buttonsSelectedState[i]!"
        :index="isThisPlaying ? i : -1"
        v-show="chord.isOctavatedBase ? finishWithBase : true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ChordButton from './ChordButton.vue'
import { playProgression, stopProgression, isPlaying, finishWithBase } from '../useAudio.ts'
import { NOTES, SCALE_INTERVALS, DEFAULT_BPM, type Chord } from '../musicTheory.ts'

const props = withDefaults(
  defineProps<{
    rootNote: typeof NOTES[number]
    scaleType: keyof typeof SCALE_INTERVALS
    scaleLabel: string
    chords: Chord[]
    bpm?: number
  }>(),
  {
    bpm: DEFAULT_BPM
  }
)

const buttonsSelectedState = ref<boolean[]>(Array(props.chords.length).fill(true))

const thisProgressionId = computed<string>(() => `${props.rootNote}-${props.scaleType}`)
const activeProgressionId = ref<string | null>(null)
const inSelectionMode = ref<boolean>(false)

const isThisPlaying = computed<boolean>(() =>
  isPlaying.value && activeProgressionId.value === thisProgressionId.value
)

async function handlePlayProgression(): Promise<void> {
  if (isThisPlaying.value) {
    stopProgression()
    activeProgressionId.value = null
    return
  }
  if (isPlaying.value) {
    stopProgression()
    await new Promise((r) => setTimeout(r, 50))
  }
  activeProgressionId.value = thisProgressionId.value
  await playProgression(props.chords, props.bpm)
  activeProgressionId.value = null
}

function openSelectionMenu(): void {
  inSelectionMode.value = true
  
  console.log("Current selectedState for chords:", buttonsSelectedState.value)
}

function confirmSelection(): void {
  if (!inSelectionMode.value) return
  
  console.log("Current selectedState for chords:", buttonsSelectedState.value)

  buttonsSelectedState.value = Array(props.chords.length).fill(true)
  inSelectionMode.value = false
}

function cancelSelection(): void {
  inSelectionMode.value = false
  // Additional logic to reset any temporary selection state if necessary
  
  console.log("Current selectedState for chords:", buttonsSelectedState.value)

  buttonsSelectedState.value = Array(props.chords.length).fill(true)
  inSelectionMode.value = false
}

</script>

<style scoped>
/* Fallback contextual variables if not declared globally */
:root {
  --success: #2e7d32;
  --danger: #d32f2f;
  --danger-dim: rgba(211, 47, 47, 0.1);
}

.scale-row {
  padding: 20px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.scale-row:last-child {
  border-bottom: none;
}

.scale-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 12px;
}

.scale-title-group {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.scale-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.scale-root {
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
}

.scale-type {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* Base button properties shared across all state controls */
.play-progression-btn,
.derive-progression-btn,
.confirm-selection-btn,
.cancel-selection-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 20px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 500;
  transition: all 0.15s ease;
  white-space: nowrap;
  cursor: pointer;
}

/* Individualized Hover States (Fixed Orange Hover Leakage) */
.play-progression-btn:hover,
.derive-progression-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-dim);
}

.play-progression-btn.is-playing {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-dim);
}

/* Dedicated Green styling for Confirmation */
.confirm-selection-btn {
  border-color: var(--success, #2e7d32);
  color: #fff;
  background: var(--success, #2e7d32);
}

.confirm-selection-btn:hover {
  background: color-mix(in srgb, var(--success, #2e7d32), #000 15%);
  border-color: color-mix(in srgb, var(--success, #2e7d32), #000 15%);
  color: #fff;
}

/* Dedicated Red styling for Cancellation */
.cancel-selection-btn {
  border-color: var(--danger, #d32f2f);
  color: var(--danger, #d32f2f);
  background: transparent;
}

.cancel-selection-btn:hover {
  background: var(--danger-dim, rgba(211, 47, 47, 0.1));
  color: var(--danger, #d32f2f);
}

.chords-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
}
</style>
