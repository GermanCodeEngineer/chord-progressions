<template>
  <div class="scale-row">
    <div class="scale-header">
      <div class="scale-title-group">
        <span class="scale-root">{{ rootNote }}</span>
        <span class="scale-type">{{ scaleLabel }}</span>
      </div>
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
    </div>
    <div class="chords-row">
      <ChordButton
        v-for="(chord, i) in chords"
        :key="chord.id"
        :chord="chord"
        :index="isThisPlaying ? i : -1"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import ChordButton from './ChordButton.vue'
import { playProgression, stopProgression, isPlaying, playingChordId } from '../useAudio.ts'
import { DEFAULT_BPM } from '../musicTheory.ts'

const props = defineProps({
  rootNote: { type: String, required: true },
  scaleType: { type: String, required: true },
  scaleLabel: { type: String, required: true },
  chords: { type: Array, required: true },
  bpm: { type: Number, default: DEFAULT_BPM },
})

const thisProgressionId = computed(() => `${props.rootNote}-${props.scaleType}`)
const activeProgressionId = ref(null)

// Track if THIS scale's progression is playing
const isThisPlaying = computed(() =>
  isPlaying.value && activeProgressionId.value === thisProgressionId.value
)

async function handlePlayProgression() {
  if (isThisPlaying.value) {
    stopProgression()
    activeProgressionId.value = null
    return
  }
  if (isPlaying.value) {
    stopProgression()
    await new Promise(r => setTimeout(r, 50))
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

.play-progression-btn {
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
}

.play-progression-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-dim);
}

.play-progression-btn.is-playing {
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
