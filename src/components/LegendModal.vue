<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
      <div class="modal" role="dialog" aria-modal="true" aria-label="Chord Abbreviations">
        <div class="modal-header">
          <h2>Chord Abbreviations</h2>
          <button class="close-btn" @click="$emit('update:modelValue', false)" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.7 3.3a1 1 0 00-1.4 0L8 6.6 4.7 3.3a1 1 0 00-1.4 1.4L6.6 8l-3.3 3.3a1 1 0 001.4 1.4L8 9.4l3.3 3.3a1 1 0 001.4-1.4L9.4 8l3.3-3.3a1 1 0 000-1.4z"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="legend-section">
            <h3>Chord symbols</h3>
            <p class="section-hint">Suffixes appended to a root note (e.g. C, F#, Bb)</p>
            <dl class="legend-list">
              <div v-for="entry in CHORD_LEGEND" :key="entry.symbol" class="legend-item">
                <dt>
                  <span class="legend-symbol">{{ entry.symbol }}</span>
                  <span class="legend-example">{{ entry.example }}</span>
                </dt>
                <dd>
                  <span class="legend-name">{{ entry.name }}</span>
                  <span class="legend-desc">{{ entry.description }}</span>
                </dd>
              </div>
            </dl>
          </div>

          <div class="legend-section">
            <h3>Roman numerals</h3>
            <p class="section-hint">Scale degree labels shown above each chord in progressions</p>
            <dl class="legend-list legend-list-compact">
              <div v-for="entry in ROMAN_LEGEND" :key="entry.symbol" class="legend-item">
                <dt>
                  <span class="legend-symbol roman">{{ entry.symbol }}</span>
                </dt>
                <dd>
                  <span class="legend-desc">{{ entry.description }}</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-primary" @click="$emit('update:modelValue', false)">Close</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { CHORD_LEGEND, ROMAN_LEGEND } from '../musicTheory.ts'

defineProps({
  modelValue: Boolean,
})

defineEmits(['update:modelValue'])
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
  max-width: 520px;
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

.legend-section h3 {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.section-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 14px;
}

.legend-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 12px;
  padding: 10px 12px;
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.legend-item dt {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.legend-symbol {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
}

.legend-symbol.roman {
  font-size: 16px;
}

.legend-example {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
}

.legend-item dd {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.legend-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.legend-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.45;
}

.legend-list-compact .legend-item {
  grid-template-columns: 40px 1fr;
  align-items: center;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid var(--border-subtle);
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
