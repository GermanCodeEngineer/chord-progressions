<!-- TODO: adapt to custom progression -->
<template>
  <BaseProgressionRow
    :root-note="props.rootNote"
    :scale-type="props.scaleType"
    :scale-label="props.scaleLabel"
    :chords="props.chords"
    :bpm="props.bpm"
    @confirm-progression="($event) => emit('confirm-progression', $event)"
  />
</template>

<script setup lang="ts">
import BaseProgressionRow from "./BaseProgressionRow.vue";
import { NOTES, SCALE_INTERVALS, type Chord } from "../musicTheory.ts"

const props = defineProps<{
  rootNote: (typeof NOTES)[number],
  scaleType: keyof typeof SCALE_INTERVALS,
  scaleLabel: string,
  chords: Chord[],
  bpm: number | undefined,
}>()

const emit = defineEmits<{
  (e: "confirm-progression", chords: Chord[]): void
}>()

</script>
