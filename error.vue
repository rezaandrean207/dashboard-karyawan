<script setup>
const props = defineProps({
  error: Object,
});

const handleClearError = () => {
  clearError({ redirect: "/login" });
};
</script>

<template>
  <div class="error-container">
    <h1>{{ error?.statusCode }}</h1>
    <p>{{ error?.message }}</p>

    <button @click="handleClearError">Kembali ke Home</button>
  </div>
</template>

<style scoped>
.error-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  box-shadow: var(--shadow-soft);
}

button:hover {
  background-color: var(--primary-hover);
}
</style>
