<script setup lang="ts">
import { computed, ref } from "vue"
import ScaleProgressionRow from "./components/ScaleProgressionRow.vue"
import CustomProgressionRow from "./components/CustomProgressionRow.vue"
import AllChordsGrid from "./components/AllChordsGrid.vue"
import SettingsModal from "./components/SettingsModal.vue"
import LegendModal from "./components/LegendModal.vue"
import {
  NOTES,
  SCALE_INTERVALS,
  DEFAULT_VISIBLE_SCALES,
  DEFAULT_BPM,
  buildScaleChords,
  type Chord,
  type CustomProgression,
} from "./musicTheory.ts"

const showSettings = ref(false)
const showLegend = ref(false)
const selectedRoot = ref<(typeof NOTES)[number]>("C")
const bpm = ref(DEFAULT_BPM)
const visibleScales = ref([...DEFAULT_VISIBLE_SCALES])

const scaleRows = computed(() =>
  visibleScales.value
    .filter((key) => key in SCALE_INTERVALS)
    .map((scaleType) => ({
      scaleType,
      scaleLabel: SCALE_INTERVALS[scaleType].label,
      chords: buildScaleChords(selectedRoot.value, scaleType),
    })),
)

const customProgressions = ref<CustomProgression[]>([])
const activeProgressionId = ref<string | null>(null)

const activeProgression = computed(() =>
  customProgressions.value.find((p) => p.id === activeProgressionId.value),
)

function createProgression(): void {
  const newProg = <CustomProgression>{
    id: crypto.randomUUID(),
    name: `Progression ${customProgressions.value.length + 1}`,
    chords: [],
  }

  customProgressions.value.push(newProg)
  activeProgressionId.value = newProg.id
}

function deleteProgression(id: string): void {
  // TODO: use
  customProgressions.value = customProgressions.value.filter((p) => p.id !== id)

  if (activeProgressionId.value === id) {
    activeProgressionId.value = customProgressions.value[0]?.id || null
  }
}

function addChordToActive(baseChord: Chord) {
  // TODO: use
  if (!activeProgression.value) return

  activeProgression.value.chords.push({
    ...baseChord,
    id: crypto.randomUUID(),
    inversion: 0,
    transpose: 0,
  })
}

function createProgressionFromSelection(chords: Chord[]) {
  const newProg = {
    id: crypto.randomUUID(),
    name: `Progression ${customProgressions.value.length + 1}`,
    chords: chords.map((c) => ({
      ...c,
      id: crypto.randomUUID(),
      inversion: 0,
      transpose: 0,
    })),
  }

  customProgressions.value.push(newProg)
  activeProgressionId.value = newProg.id
}
</script>

<template>
  <div class="app">
    <header class="siteHeader">
      <div class="headerInner">
        <div class="brand">
          <h1>Chord Progressions</h1>
          <p class="tagline">Explore diatonic chords and play progressions in any key</p>
        </div>
        <div class="headerActions">
          <button class="headerBtn" @click="showLegend = true" aria-label="Open abbreviation guide">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9a2.5 2.5 0 115 0c0 2-2.5 1.75-2.5 3.5" />
              <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none" />
            </svg>
            <span>Legend</span>
          </button>
          <button class="headerBtn" @click="showSettings = true" aria-label="Open settings">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path
                d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              />
            </svg>
            <span>Settings</span>
          </button>
        </div>
      </div>
    </header>

    <main class="mainContent">
      <section class="section">
        <div class="sectionHeader">
          <h2>Scale Progressions</h2>
          <p class="sectionDesc">
            Diatonic chords in <strong>{{ selectedRoot }}</strong
            >. Click a chord to hear it, or play the full progression.
          </p>
        </div>

        <div class="progressionsList">
          <ScaleProgressionRow
            v-for="row in scaleRows"
            :key="row.scaleType"
            :rootNote="selectedRoot"
            :scaleType="row.scaleType"
            :scaleLabel="row.scaleLabel"
            :chords="row.chords"
            :bpm="bpm"
            @confirmProgression="createProgressionFromSelection"
          />
        </div>
      </section>

      <div class="progressionTabs">
        <!-- TODO: remove when deprecated-->
        <button v-for="p in customProgressions" :key="p.id" @click="activeProgressionId = p.id">
          {{ p.name }}
        </button>

        <button @click="createProgression">+ New</button>
      </div>

      <section class="section">
        <div class="sectionHeader">
          <h2>Custom Progressions</h2>
          <p class="sectionDesc">
            Custom Combinations of chords. Derive a progression from a scale. Add, switch or delete
            chords.
          </p>
        </div>

        <div class="progressionsList">
          <CustomProgressionRow
            v-for="row in scaleRows"
            :key="row.scaleType"
            :rootNote="selectedRoot"
            :scaleType="row.scaleType"
            :scaleLabel="row.scaleLabel"
            :chords="row.chords"
            :bpm="bpm"
            @confirmProgression="createProgressionFromSelection"
          />
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2>All Chords</h2>
          <p class="sectionDesc">Browse every root note for a chosen chord type.</p>
        </div>

        <AllChordsGrid />
      </section>

      <section id="customProgressions">
        <!-- TODO: move to own component? -->
        <!-- TODO: use improved chord buttons for this -->
        <!-- TODO: properly style -->
        <div v-if="activeProgression">
          <h3>{{ activeProgression.name }}</h3>

          <div class="progression">
            <div
              v-for="(chord, index) in activeProgression.chords"
              :key="chord.id"
              class="chordCard"
            >
              {{ chord.label }}

              <button @click="chord.inversion++">Invert</button>
              <button @click="chord.transpose++">↑</button>
              <button @click="chord.transpose--">↓</button>
              <button @click="activeProgression.chords.splice(index, 1)">✕</button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <SettingsModal
      v-model="showSettings"
      v-model:visibleScales="visibleScales"
      v-model:selectedRoot="selectedRoot"
      v-model:bpm="bpm"
    />

    <LegendModal v-model="showLegend" />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.siteHeader {
  border-bottom: 1px solid var(--borderSubtle);
  background: var(--surface);
  position: sticky;
  top: 0;
  z-index: 100;
}

.headerInner {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand h1 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.02em;
}

.tagline {
  font-size: 13px;
  color: var(--textMuted);
  margin-top: 4px;
}

.headerActions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.headerBtn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--surfaceRaised);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--textMuted);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
}

.headerBtn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accentDim);
}

.mainContent {
  flex: 1;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px 64px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.sectionHeader {
  margin-bottom: 8px;
}

.sectionHeader h2 {
  font-size: 13px;
  font-weight: 600;
  color: var(--textMuted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.sectionDesc {
  font-size: 14px;
  color: var(--textMuted);
  line-height: 1.5;
}

.sectionDesc strong {
  color: var(--accent);
  font-family: var(--fontMono);
  font-weight: 600;
}

.progressionsList {
  background: var(--surface);
  border: 1px solid var(--borderSubtle);
  border-radius: 12px;
  padding: 0 20px;
  margin-top: 16px;
}

@media (maxwidth: 600px) {
  .headerInner {
    flex-direction: column;
    align-items: flex-start;
  }

  .headerBtn span {
    display: none;
  }
}
</style>
