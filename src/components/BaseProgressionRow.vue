<template>
  <div :class="styles['progression-row']">
    <div :class="styles['progression-header']">
      <slot name="progression-title"/>

      <div :class="styles['progression-actions']">
        <!-- TODO: Animation for derive progression and confirm/cancel -->
        <button
          :class="[
            styles['play-progression-btn'],
            isThisPlaying ? styles['is-playing'] : ''
          ]"
          @click="handlePlayProgression"
          :title="isThisPlaying ? 'Stop progression' : 'Play all chords in sequence'"
        >
          <svg v-if="!isThisPlaying" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <polygon points="2,1 11,6 2,11" />
          </svg>
          <svg v-else width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="2" y="1" width="3" height="10" />
            <rect x="7" y="1" width="3" height="10" />
          </svg>
          <span>{{ isThisPlaying ? "Stop" : "Play" }}</span>
        </button>

        <button
          v-if="!inSelectionMode"
          :class="styles['derive-progression-btn']"
          @click="openSelectionMenu()"
          title="Select chords to derive a progression"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="1" y="2" width="2" height="2" rx="0.5" />
            <rect x="4" y="2.5" width="7" height="1" />
            <rect x="1" y="5" width="2" height="2" rx="0.5" />
            <rect x="4" y="5.5" width="7" height="1" />
            <rect x="1" y="8" width="2" height="2" rx="0.5" />
            <rect x="4" y="8.5" width="7" height="1" />
          </svg>
          <span>Derive Progression</span>
        </button>

        <button
          v-if="inSelectionMode"
          :class="styles['confirm-selection-btn']"
          @click="confirmSelection()"
          title="Confirm your selected progression"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="2 6 5 9 10 3" />
          </svg>
          <span>Confirm Selection</span>
        </button>

        <button
          v-if="inSelectionMode"
          :class="styles['cancel-selection-btn']"
          @click="cancelSelection()"
          title="Exit selection mode"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <line x1="2" y1="2" x2="10" y2="10" />
            <line x1="10" y1="2" x2="2" y2="10" />
          </svg>
          <span>Cancel</span>
        </button>
      </div>
    </div>

    <div :class="styles['chords-row']">
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
import { computed, ref } from "vue"
import ChordButton from "./ChordButton.vue"
import { playProgression, stopProgression, isPlaying, finishWithBase } from "../useAudio.ts"
import { NOTES, SCALE_INTERVALS, DEFAULT_BPM, type Chord } from "../musicTheory.ts"
import styles from "./progressions.module.css"

const props = withDefaults(
  defineProps<{
    rootNote: (typeof NOTES)[number]
    scaleType: keyof typeof SCALE_INTERVALS
    scaleLabel: string
    chords: Chord[]
    bpm?: number
  }>(),
  {
    bpm: DEFAULT_BPM,
  },
)
const emit = defineEmits<{
  confirmProgression: [chords: Chord[]]
}>()

const buttonsSelectedState = ref<boolean[]>(Array(props.chords.length).fill(true))

const thisProgressionId = computed<string>(() => `${props.rootNote}-${props.scaleType}`)
const activeProgressionId = ref<string | null>(null)
const inSelectionMode = ref<boolean>(false)

const isThisPlaying = computed<boolean>(
  () => isPlaying.value && activeProgressionId.value === thisProgressionId.value,
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
}

function confirmSelection(): void {
  if (!inSelectionMode.value) return

  const selectedChords = props.chords.filter((_, i) => buttonsSelectedState.value[i])

  emit("confirmProgression", selectedChords)

  buttonsSelectedState.value = Array(props.chords.length).fill(true)
  inSelectionMode.value = false
}

function cancelSelection(): void {
  buttonsSelectedState.value = Array(props.chords.length).fill(true)
  inSelectionMode.value = false
}
</script>
