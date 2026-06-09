<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
      <div class="modal" role="dialog" aria-modal="true" aria-label="Scale Settings">
        <div class="modal-header">
          <h2>Scale Settings</h2>
          <button class="close-btn" @click="$emit('update:modelValue', false)" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.7 3.3a1 1 0 00-1.4 0L8 6.6 4.7 3.3a1 1 0 00-1.4 1.4L6.6 8l-3.3 3.3a1 1 0 001.4 1.4L8 9.4l3.3 3.3a1 1 0 001.4-1.4L9.4 8l3.3-3.3a1 1 0 000-1.4z"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="settings-section">
            <h3>Root Note</h3>
            <div class="note-grid">
              <button
                v-for="note in ALL_NOTES"
                :key="note"
                class="note-btn"
                :class="{ active: selectedRoot === note }"
                @click="$emit('update:selectedRoot', note)"
              >{{ note }}</button>
            </div>
          </div>

          <div class="settings-section">
            <h3>Visible Scales</h3>
            <p class="section-hint">Select which scales appear in the Progressions section</p>
            <div class="scales-list">
              <label
                v-for="(scale, key) in SCALE_INTERVALS"
                :key="key"
                class="scale-check"
                :class="{ checked: visibleScales.includes(key) }"
              >
                <input
                  type="checkbox"
                  :checked="visibleScales.includes(key)"
                  @change="toggleScale(key)"
                />
                <span class="checkmark"></span>
                <span class="scale-check-label">{{ scale.label }}</span>
              </label>
            </div>
          </div>

          <div class="settings-section">
            <h3>BPM</h3>
            <div class="bpm-control">
              <input
                type="range"
                min="40"
                max="160"
                step="4"
                :value="bpm"
                @input="$emit('update:bpm', +$event.target.value)"
                class="bpm-slider"
              />
              <span class="bpm-value">{{ bpm }} BPM</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" @click="resetDefaults">Reset defaults</button>
          <button class="btn-primary" @click="$emit('update:modelValue', false)">Done</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { SCALE_INTERVALS, NOTES, DEFAULT_VISIBLE_SCALES } from '../musicTheory.js'

const ALL_NOTES = NOTES

const props = defineProps({
  modelValue: Boolean,
  visibleScales: { type: Array, required: true },
  selectedRoot: { type: String, default: 'C' },
  bpm: { type: Number, default: 72 },
})

const emit = defineEmits(['update:modelValue', 'update:visibleScales', 'update:selectedRoot', 'update:bpm'])

function toggleScale(key) {
  const current = [...props.visibleScales]
  const idx = current.indexOf(key)
  if (idx === -1) {
    current.push(key)
  } else if (current.length > 1) {
    current.splice(idx, 1)
  }
  emit('update:visibleScales', current)
}

function resetDefaults() {
  emit('update:visibleScales', [...DEFAULT_VISIBLE_SCALES])
  emit('update:selectedRoot', 'C')
  emit('update:bpm', 72)
}
</script>

<style scoped>
.modal-backdrop {
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

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-subtle);
}

.modal-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--text-muted);
  transition: all 0.15s;
}

.close-btn:hover {
  background: var(--surface-raised);
  border-color: var(--border);
  color: var(--text);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.settings-section h3 {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.section-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

/* Note grid */
.note-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.note-btn {
  min-width: 44px;
  padding: 8px 10px;
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
}

.note-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.note-btn.active {
  border-color: var(--accent);
  background: var(--accent-dim);
  color: var(--accent);
  box-shadow: 0 0 8px var(--accent-glow);
}

/* Scales checklist */
.scales-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.scale-check {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.scale-check:hover {
  border-color: var(--accent);
}

.scale-check.checked {
  border-color: var(--accent);
  background: var(--accent-dim);
}

.scale-check input[type="checkbox"] {
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

.scale-check.checked .checkmark {
  background: var(--accent);
  border-color: var(--accent);
}

.scale-check.checked .checkmark::after {
  content: '';
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

.scale-check-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text);
}

/* BPM slider */
.bpm-control {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bpm-slider {
  flex: 1;
  -webkit-appearance: none;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  outline: none;
}

.bpm-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  box-shadow: 0 0 8px var(--accent-glow);
}

.bpm-value {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  min-width: 70px;
  text-align: right;
}

/* Footer buttons */
.modal-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid var(--border-subtle);
}

.btn-secondary {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
}

.btn-secondary:hover {
  border-color: var(--text-muted);
  color: var(--text);
}

.btn-primary {
  padding: 8px 20px;
  background: var(--accent);
  border: none;
  border-radius: 6px;
  color: #000;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
}

.btn-primary:hover {
  background: #f8b94a;
  box-shadow: 0 4px 16px var(--accent-glow);
}
</style>
