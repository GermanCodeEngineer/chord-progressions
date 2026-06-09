<template>
  <div class="scale-row">
    <div class="scale-header">
      <div class="scale-title-group">
        <span class="scale-root">{{ rootNote }}</span>
        <span class="scale-type">{{ scaleLabel }}</span>
      </div>
      
      <div class="scale-actions">
        <!-- Play Progression Button -->
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

        <!-- Derive Progression Button (Toggles Selection Mode) -->
        <button
          class="derive-progression-btn"
          :class="{ 'is-active': inSelectionMode }"
          @click="updateDeriveState(true)"
          title='Select chords to derive a progression'
        >
          <!-- List/Check icon for selection mode -->
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="1" y="2" width="2" height="2" rx="0.5"/>
            <rect x="4" y="2.5" width="7" height="1"/>
            <rect x="1" y="5" width="2" height="2" rx="0.5"/>
            <rect x="4" y="5.5" width="7" height="1"/>
            <rect x="1" y="8" width="2" height="2" rx="0.5"/>
            <rect x="4" y="8.5" width="7" height="1"/>
          </svg>
          <span>{{ "Derive Progression" }}</span>
        </button>

        <!-- Confirm Derive Progression Button -->
        <button
          class="confirm-selection-btn"
          @click="updateDeriveState(false)"
          title="Exit selection mode"
        >
          <!-- List/Check icon for selection mode -->
          <!-- TODO: Change symbol, make btn green -->
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="1" y="2" width="2" height="2" rx="0.5"/>
            <rect x="4" y="2.5" width="7" height="1"/>
            <rect x="1" y="5" width="2" height="2" rx="0.5"/>
            <rect x="4" y="5.5" width="7" height="1"/>
            <rect x="1" y="8" width="2" height="2" rx="0.5"/>
            <rect x="4" y="8.5" width="7" height="1"/>
          </svg>
          <span>{{ "Confirm Selection" }}</span>
        </button>

        <!-- Cancel Derive Progression Button -->
        <button
          class="cancel-selection-btn"
          @click="updateDeriveState(false)"
          title="Exit selection mode"
        >
          <!-- List/Check icon for selection mode -->
          <!-- TODO: Change symbol, make btn red -->
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="1" y="2" width="2" height="2" rx="0.5"/>
            <rect x="4" y="2.5" width="7" height="1"/>
            <rect x="1" y="5" width="2" height="2" rx="0.5"/>
            <rect x="4" y="5.5" width="7" height="1"/>
            <rect x="1" y="8" width="2" height="2" rx="0.5"/>
            <rect x="4" y="8.5" width="7" height="1"/>
          </svg>
          <span>{{ "Cancel Selection" }}</span>
        </button>
      </div>
    </div>
    
    <div class="chords-row">
      <ChordButton
        v-for="(chord, i) in chords"
        :key="chord.id"
        :chord="chord"
        :showSelectBox="inSelectionMode"
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
import { DEFAULT_BPM, type Chord } from '../musicTheory.ts'

// TypeScript typed Props with defaults
const props = withDefaults(
  defineProps<{
    rootNote: string
    scaleType: string
    scaleLabel: string
    chords: Chord[]
    bpm?: number
  }>(),
  {
    bpm: DEFAULT_BPM
  }
)

const thisProgressionId = computed<string>(() => `${props.rootNote}-${props.scaleType}`)
const activeProgressionId = ref<string | null>(null)
const inSelectionMode = ref<boolean>(false)

// Track if THIS scale's progression is playing
const isThisPlaying = computed<boolean>(() =>
  isPlaying.value && activeProgressionId.value === thisProgressionId.value
)

function updateDeriveState(positive: boolean): void {
  if (positive) {
    if (!inSelectionMode.value) {
      inSelectionMode.value = true
    } else {
      // Confirm
    }
  } else {
    inSelectionMode.value = false
  }
}

function toggleSelectionMode(): void {
  inSelectionMode.value = !inSelectionMode.value
}

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
</script>

<style scoped>
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

/* Button action container layout */
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
  transition: all 0.15s;
  white-space: nowrap;
  cursor: pointer;
}

.play-progression-btn:hover,
.derive-progression-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-dim);
}

.play-progression-btn.is-playing,
.derive-progression-btn.is-active {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-dim);
  box-shadow: 0 0 12px var(--accent-glow);
}

.chords-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
}
</style>
