<script setup lang="ts">
import { computed, ref } from "vue"
import ScaleRow from "./components/ScaleRow.vue"
import AllChordsGrid from "./components/AllChordsGrid.vue"
import SettingsModal from "./components/SettingsModal.vue"
import LegendModal from "./components/LegendModal.vue"
import {
  NOTES,
  SCALE_INTERVALS,
  DEFAULT_VISIBLE_SCALES,
  DEFAULT_BPM,
  buildScaleChords,
  type Chord, type CustomChord, type CustomProgression, 
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

const progressions = ref<CustomProgression[]>([])
const activeProgressionId = ref<string | null>(null)

const activeProgression = computed(() =>
  progressions.value.find(p => p.id === activeProgressionId.value)
)

function createProgression(): void {
  const newProg = {
    id: crypto.randomUUID(),
    name: `Progression ${progressions.value.length + 1}`,
    chords: []
  }

  progressions.value.push(newProg)
  activeProgressionId.value = newProg.id
}

function deleteProgression(id: string): void {
  progressions.value = progressions.value.filter(p => p.id !== id)

  if (activeProgressionId.value === id) {
    activeProgressionId.value = progressions.value[0]?.id || null
  }
}

function addChordToActive(baseChord: Chord) {
  if (!activeProgression.value) return

  activeProgression.value.chords.push({
    ...baseChord,
    id: crypto.randomUUID(),
    inversion: 0,
    transpose: 0
  })
}

function createProgressionFromSelection(chords: Chord[]) {
  const newProg = {
    id: crypto.randomUUID(),
    name: `Progression ${progressions.value.length + 1}`,
    chords: chords.map(c => ({
      ...c,
      id: crypto.randomUUID(),
      inversion: 0,
      transpose: 0
    }))
  }

  progressions.value.push(newProg)
  activeProgressionId.value = newProg.id
}

</script>

<template>
  <div class="app">
    <header class="site-header">
      <div class="header-inner">
        <div class="brand">
          <h1>Chord Progressions</h1>
          <p class="tagline">Explore diatonic chords and play progressions in any key</p>
        </div>
        <div class="header-actions">
          <button
            class="header-btn"
            @click="showLegend = true"
            aria-label="Open abbreviation guide"
          >
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
          <button class="header-btn" @click="showSettings = true" aria-label="Open settings">
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

    <main class="main-content">
      <section class="section">
        <div class="section-header">
          <h2>Scale Progressions</h2>
          <p class="section-desc">
            Diatonic chords in <strong>{{ selectedRoot }}</strong
            >. Click a chord to hear it, or play the full progression.
          </p>
        </div>

        <div class="progressions-list">
          <ScaleRow
            v-for="row in scaleRows"
            :key="row.scaleType"
            :root-note="selectedRoot"
            :scale-type="row.scaleType"
            :scale-label="row.scaleLabel"
            :chords="row.chords"
            :bpm="bpm"
            @confirm-progression="createProgressionFromSelection"
          />
        </div>
      </section>

      <div class="progression-tabs">
        <button
          v-for="p in progressions"
          :key="p.id"
          @click="activeProgressionId = p.id"
        >
          {{ p.name }}
        </button>

        <button @click="createProgression">+ New</button>
      </div>

      <section class="section">
        <div class="section-header">
          <h2>All Chords</h2>
          <p class="section-desc">Browse every root note for a chosen chord type.</p>
        </div>

        <AllChordsGrid />
      </section>

      <section id="custom-progressions">
        <!-- TODO: move to own component? -->
        <!-- TODO: use improved chord buttons for this -->
        <!-- TODO: properly style -->
        <div v-if="activeProgression">
          <h3>{{ activeProgression.name }}</h3>

          <div class="progression">
            <div
              v-for="(chord, index) in activeProgression.chords"
              :key="chord.id"
              class="chord-card"
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
      v-model:visible-scales="visibleScales"
      v-model:selected-root="selectedRoot"
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

.site-header {
  border-bottom: 1px solid var(--border-subtle);
  background: var(--surface);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
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
  color: var(--text-muted);
  margin-top: 4px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
}

.header-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-dim);
}

.main-content {
  flex: 1;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px 64px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.section-header {
  margin-bottom: 8px;
}

.section-header h2 {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.section-desc {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.5;
}

.section-desc strong {
  color: var(--accent);
  font-family: var(--font-mono);
  font-weight: 600;
}

.progressions-list {
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 0 20px;
  margin-top: 16px;
}

@media (max-width: 600px) {
  .header-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-btn span {
    display: none;
  }
}
</style>
