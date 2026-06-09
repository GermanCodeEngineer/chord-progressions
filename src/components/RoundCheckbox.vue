<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// Schaltet den Zustand bei jedem Klick um
const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div 
    class="circle-checkbox" 
    :class="{ 'is-checked': modelValue }"
    @click="toggle"
  >
    <span v-if="modelValue" class="checkmark">✓</span>
  </div>
</template>

<style scoped>
.circle-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid #ccc;
  border-radius: 50%; /* Perfectly round */
  background-color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.circle-checkbox:hover {
  border-color: #42b883;
}

.circle-checkbox.is-checked {
  background-color: #42b883;
  border-color: #42b883;
}

.checkmark {
  color: white;
  font-size: 14px;
  font-weight: bold;
}
</style>
