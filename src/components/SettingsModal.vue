<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modalBackdrop" @click.self="emit('update:modelValue', false)">
      <div class="modal" role="dialog" aria-modal="true" aria-label="Scale Settings">
        <div class="modalHeader">
          <h2>Scale Settings</h2>
          <button class="closeBtn" @click="emit('update:modelValue', false)" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path
                d="M12.7 3.3a1 1 0 00-1.4 0L8 6.6 4.7 3.3a1 1 0 00-1.4 1.4L6.6 8l-3.3 3.3a1 1 0 001.4 1.4L8 9.4l3.3 3.3a1 1 0 001.4-1.4L9.4 8l3.3-3.3a1 1 0 000-1.4z"
              />
            </svg>
          </button>
        </div>

        <div class="modalBody">
          <div class="settingsSection">
            <h3>Root Note</h3>
            <div class="noteGrid">
              <button
                v-for="note in ALL_NOTES"
                :key="note"
                class="noteBtn"
                :class="{ active: selectedRoot === note }"
                @click="emit('update:selectedRoot', note)"
              >
                {{ note }}
              </button>
            </div>
          </div>

          <div class="settingsSection">
            <h3>Visible Scales</h3>
            <p class="sectionHint">Select which scales appear in the Progressions section</p>
            <div class="scalesList">
              <label
                v-for="(scale, key) in SCALE_INTERVALS"
                :key="key"
                class="scaleCheck"
                :class="{ checked: visibleScales.includes(key) }"
              >
                <input
                  type="checkbox"
                  :checked="visibleScales.includes(key)"
                  @change="toggleScale(key)"
                />
                <span class="checkmark"></span>
                <span class="scaleCheckLabel">{{ scale.label }}</span>
              </label>
            </div>
          </div>

          <div class="settingsSection">
            <h3>Playback</h3>
            <div class="toggleList">
              <label class="toggleRow">
                <span class="toggleCopy">
                  <span class="toggleLabel">Finish with base chord</span>
                  <span class="sectionHint inline"
                    >Play the octavated base chord of the scale at the end</span
                  >
                </span>
                <input type="checkbox" class="toggleInput" v-model="finishWithBase" />
                <span class="toggleSwitch" aria-hidden="true"></span>
              </label>
              <label class="toggleRow">
                <span class="toggleCopy">
                  <span class="toggleLabel">Bass notes only</span>
                  <span class="sectionHint inline"
                    >Play only the root note of each chord instead of the full chord</span
                  >
                </span>
                <input type="checkbox" class="toggle-input" v-model="bassNotesOnly" />
                <span class="toggle-switch" ariaHidden="true"></span>
              </label>
            </div>
          </div>

          <div class="settings-section">
            <h3>BPM</h3>
            <div class="bpm-control">
              <input
                type="range"
                :min="MIN_BPM"
                :max="MAX_BPM"
                step="4"
                :value="bpm"
                @input="emit('update:bpm', +($event.target! as HTMLInputElement).value)"
                class="bpm-slider"
              />
              <span class="bpm-value">{{ bpm }} BPM</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" @click="resetDefaults">Reset defaults</button>
          <button class="btn-primary" @click="emit('update:modelValue', false)">Done</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {
  SCALE_INTERVALS,
  NOTES,
  DEFAULT_VISIBLE_SCALES,
  MIN_BPM,
  DEFAULT_BPM,
  MAX_BPM,
} from "../musicTheory.ts"
import { bassNotesOnly, finishWithBase } from "../useAudio.ts"

const ALL_NOTES = NOTES

const props = defineProps({
  modelValue: Boolean,
  visibleScales: { type: Array, required: true },
  selectedRoot: { type: String, default: "C" },
  bpm: { type: Number, default: DEFAULT_BPM },
})

const emit = defineEmits([
  "update:modelValue",
  "update:visibleScales",
  "update:selectedRoot",
  "update:bpm",
])

function toggleScale(key: keyof typeof SCALE_INTERVALS): void {
  const current = [...props.visibleScales]
  const idx = current.indexOf(key)
  if (idx === -1) {
    current.push(key)
  } else if (current.length > 1) {
    current.splice(idx, 1)
  }
  emit("update:visibleScales", current)
}

function resetDefaults() {
  emit("update:visibleScales", [...DEFAULT_VISIBLE_SCALES])
  emit("update:selectedRoot", "C")
  emit("update:bpm", DEFAULT_BPM)
  bassNotesOnly.value = false
  finishWithBase.value = true
}
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
  max-width: 480px;
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

.settingsSection h3 {
  font-size: 11px;
  font-weight: 600;
  color: var(--textMuted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.sectionHint {
  font-size: 12px;
  color: var(--textMuted);
  margin-bottom: 12px;
}

.sectionHint.inline {
  display: block;
  margin-bottom: 0;
  margin-top: 4px;
}

.toggleList {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toggleRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 14px;
  background: var(--surfaceRaised);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
}

.toggleCopy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toggleLabel {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
}

.toggleInput {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggleSwitch {
  position: relative;
  width: 42px;
  height: 24px;
  background: var(--border);
  border-radius: 12px;
  flex-shrink: 0;
  transition: background 0.15s;
}

.toggleSwitch::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  background: var(--text);
  border-radius: 50%;
  transition: transform 0.15s;
}

.toggleInput:checked + .toggleSwitch {
  background: var(--accent);
}

.toggleInput:checked + .toggleSwitch::after {
  transform: translateX(18px);
  background: #000;
}

.toggleInput:focusvisible + .toggleSwitch {
  box-shadow: 0 0 0 2px var(--accentGlow);
}

/* Note grid */
.noteGrid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.noteBtn {
  min-width: 44px;
  padding: 8px 10px;
  background: var(--surfaceRaised);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--textMuted);
  font-family: var(--fontMono);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
}

.noteBtn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.noteBtn.active {
  border-color: var(--accent);
  background: var(--accentDim);
  color: var(--accent);
  box-shadow: 0 0 8px var(--accentGlow);
}

/* Scales checklist */
.scalesList {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.scaleCheck {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--surfaceRaised);
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.scaleCheck:hover {
  border-color: var(--accent);
}

.scaleCheck.checked {
  border-color: var(--accent);
  background: var(--accentDim);
}

.scaleCheck input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1.5px solid var(--border);
  flex-shrink: 0;
  position: relative;
  transition: all 0.15s;
}

.scaleCheck.checked .checkmark {
  background: var(--accent);
  border-color: var(--accent);
}

.scaleCheck.checked .checkmark::after {
  content: "";
  position: absolute;
  left: 3px;
  top: 1px;
  width: 5px;
  height: 8px;
  border: 2px solid #000;
  border-top: none;
  border-left: none;
  transform: rotate(45deg);
}

.scaleCheckLabel {
  font-size: 12px;
  font-weight: 500;
  color: var(--text);
}

/* BPM slider */
.bpmControl {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bpmSlider {
  flex: 1;
  appearance: none;
  -webkit-appearance: none;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  outline: none;
}

.bpmSlider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  box-shadow: 0 0 8px var(--accentGlow);
}

.bpmValue {
  font-family: var(--fontMono);
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  min-width: 70px;
  text-align: right;
}

/* Footer buttons */
.modalFooter {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid var(--borderSubtle);
}

.btnSecondary {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--textMuted);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
}

.btnSecondary:hover {
  border-color: var(--textMuted);
  color: var(--text);
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
