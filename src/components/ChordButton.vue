<template>
  <button
    class="chord-btn"
    :class="{
      'is-playing': isActive,
      'is-progression-active': isProgressionActive,
      [`quality-${chord.quality}`]: true
    }"
    :title="`${chord.label}, click to play`"
    @click="handleClick"
  >
    <span class="chord-roman">{{ chord.roman }}</span>
    <span class="chord-name">{{ chord.label }}</span>
    <span class="chord-quality-badge">{{ qualityLabel }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { playChord, playingChordId, playingProgressionStep } from '../useAudio.ts'

const props = defineProps({
  chord: { type: Object, required: true },
  index: { type: Number, default: -1 },
})

const isActive = computed(() => playingChordId.value === props.chord.id)
const isProgressionActive = computed(() =>
  playingProgressionStep.value === props.index && props.index !== -1
)

const QUALITY_LABELS = {
  major: 'maj', minor: 'min', dim: 'dim', aug: 'aug',
  maj7: 'Δ7', min7: 'm7', dom7: '7', dim7: '°7',
  halfdim7: 'ø7', sus2: 'sus2', sus4: 'sus4', add9: 'add9',
}
const qualityLabel = computed(() => QUALITY_LABELS[props.chord.quality] || '')

function handleClick() {
  playChord(props.chord.noteFreqs, props.chord.id)
}
</script>

<style scoped>
.chord-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 14px;
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.1s, box-shadow 0.2s;
  min-width: 64px;
  position: relative;
  overflow: hidden;
}

.chord-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--accent);
  opacity: 0;
  transition: opacity 0.2s;
}

.chord-btn:hover {
  border-color: var(--accent);
  background: var(--accent-dim);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px var(--accent-glow);
}

.chord-btn:active {
  transform: translateY(0px) scale(0.97);
}

.chord-btn.is-playing,
.chord-btn.is-progression-active {
  border-color: var(--accent);
  background: var(--accent-dim);
  box-shadow: 0 0 0 1px var(--accent), 0 4px 20px var(--accent-glow);
  animation: chord-pulse 0.4s ease-out;
}

@keyframes chord-pulse {
  0% { box-shadow: 0 0 0 0 var(--accent-glow), 0 0 0 1px var(--accent); }
  50% { box-shadow: 0 0 0 6px transparent, 0 0 0 1px var(--accent); }
  100% { box-shadow: 0 0 0 1px var(--accent), 0 4px 20px var(--accent-glow); }
}

.chord-roman {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  transition: color 0.15s;
}

.chord-btn.is-playing .chord-roman,
.chord-btn:hover .chord-roman {
  color: var(--accent);
}

.chord-name {
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
}

.chord-quality-badge {
  font-size: 9px;
  font-family: var(--font-mono);
  color: var(--text-muted);
  background: var(--border-subtle);
  padding: 1px 5px;
  border-radius: 3px;
  letter-spacing: 0.03em;
}

/* Quality-based accent colors */
.quality-minor .chord-roman { color: #7A9EC5; }
.quality-minor:hover .chord-roman,
.quality-minor.is-playing .chord-roman { color: #7AB8F5; }
.quality-dim .chord-roman { color: #C57A7A; }
.quality-dim:hover .chord-roman,
.quality-dim.is-playing .chord-roman { color: #F57A7A; }
.quality-aug .chord-roman { color: #9E7AC5; }
</style>
