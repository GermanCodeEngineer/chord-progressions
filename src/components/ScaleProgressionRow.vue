<template>
  <BaseProgressionRow
    :rootNote="props.rootNote"
    :scaleType="props.scaleType"
    :scaleLabel="props.scaleLabel"
    :chords="props.chords"
    :bpm="props.bpm"
    @confirmProgression="($event) => emit('confirmProgression', $event)"
  >
    <template #progression-title>
      <div :class="styles['progression-title-group']">
        <span :class="styles['scale-root-note']">{{ rootNote }}</span>
        <span :class="styles['scale-type']">{{ scaleLabel }}</span>
      </div>
    </template>
  </BaseProgressionRow>
</template>

<script setup lang="ts">
import BaseProgressionRow from "./BaseProgressionRow.vue"
import { NOTES, SCALE_INTERVALS, type Chord } from "../musicTheory.ts"
import styles from "./progressions.module.css"

const props = defineProps<{
  rootNote: (typeof NOTES)[number]
  scaleType: keyof typeof SCALE_INTERVALS
  scaleLabel: string
  chords: Chord[]
  bpm: number | undefined
}>()

const emit = defineEmits<{
  confirmProgression: [chords: Chord[]]
}>()
</script>
