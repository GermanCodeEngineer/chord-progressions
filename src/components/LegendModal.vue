<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modalBackdrop" @click.self="emit('update:modelValue', false)">
      <div class="modal" role="dialog" aria-modal="true" aria-label="Chord Abbreviations">
        <div class="modalHeader">
          <h2>Chord Abbreviations</h2>
          <button class="closeBtn" @click="emit('update:modelValue', false)" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path
                d="M12.7 3.3a1 1 0 00-1.4 0L8 6.6 4.7 3.3a1 1 0 00-1.4 1.4L6.6 8l-3.3 3.3a1 1 0 001.4 1.4L8 9.4l3.3 3.3a1 1 0 001.4-1.4L9.4 8l3.3-3.3a1 1 0 000-1.4z"
              />
            </svg>
          </button>
        </div>

        <div class="modalBody">
          <div class="legendSection">
            <h3>Chord symbols</h3>
            <p class="sectionHint">Suffixes appended to a root note (e.g. C, F#, Bb)</p>
            <dl class="legendList">
              <div v-for="entry in CHORD_LEGEND" :key="entry.symbol" class="legendItem">
                <dt>
                  <span class="legendSymbol">{{ entry.symbol }}</span>
                  <span class="legendExample">{{ entry.example }}</span>
                </dt>
                <dd>
                  <span class="legendName">{{ entry.name }}</span>
                  <span class="legendDesc">{{ entry.description }}</span>
                </dd>
              </div>
            </dl>
          </div>

          <div class="legendSection">
            <h3>Roman numerals</h3>
            <p class="sectionHint">Scale degree labels shown above each chord in progressions</p>
            <dl class="legendList legendListCompact">
              <div v-for="entry in ROMAN_LEGEND" :key="entry.symbol" class="legendItem">
                <dt>
                  <span class="legendSymbol roman">{{ entry.symbol }}</span>
                </dt>
                <dd>
                  <span class="legendDesc">{{ entry.description }}</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="modalFooter">
          <button class="btnPrimary" @click="emit('update:modelValue', false)">Close</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CHORD_LEGEND, ROMAN_LEGEND } from "../musicTheory.ts"

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(["update:modelValue"])
</script>

<style scoped>
.modalBackdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  width: 100%;
  max-width: 520px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
}

.modalHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--borderSubtle);
}

.modalHeader h2 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}

.closeBtn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--textMuted);
  transition: all 0.15s;
}

.closeBtn:hover {
  background: var(--surfaceRaised);
  border-color: var(--border);
  color: var(--text);
}

.modalBody {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.legendSection h3 {
  font-size: 11px;
  font-weight: 600;
  color: var(--textMuted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.sectionHint {
  font-size: 12px;
  color: var(--textMuted);
  margin-bottom: 14px;
}

.legendList {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legendItem {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 12px;
  padding: 10px 12px;
  background: var(--surfaceRaised);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.legendItem dt {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.legendSymbol {
  font-family: var(--fontMono);
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
}

.legendSymbol.roman {
  font-size: 16px;
}

.legendExample {
  font-family: var(--fontMono);
  font-size: 11px;
  color: var(--textMuted);
}

.legendItem dd {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.legendName {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.legendDesc {
  font-size: 12px;
  color: var(--textMuted);
  line-height: 1.45;
}

.legendListCompact .legendItem {
  grid-template-columns: 40px 1fr;
  align-items: center;
}

.modalFooter {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid var(--borderSubtle);
}

.btnPrimary {
  padding: 8px 20px;
  background: var(--accent);
  border: none;
  border-radius: 6px;
  color: #000;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
}

.btnPrimary:hover {
  background: #f8b94a;
  box-shadow: 0 4px 16px var(--accentGlow);
}
</style>
