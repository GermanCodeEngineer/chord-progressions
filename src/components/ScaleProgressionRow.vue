<template>
  <BaseProgressionRow
    :rootNote="props.rootNote"
    :scaleType="props.scaleType"
    :scaleLabel="props.scaleLabel"
    :chords="props.chords"
    :bpm="props.bpm"
    @confirmProgression="($event) => emit('confirmProgression', $event)"
  />
</template>

<script setup lang="ts">
import BaseProgressionRow from "./BaseProgressionRow.vue"
import { NOTES, SCALE_INTERVALS, type Chord } from "../musicTheory.ts"

const props = defineProps<{
  rootNote: (typeof NOTES)[number]
  scaleType: keyof typeof SCALE_INTERVALS
  scaleLabel: string
  chords: Chord[]
  bpm: number | undefined
}>()

const emit = defineEmits<{
  (e: "confirmProgression", chords: Chord[]): void
}>()
</script>
