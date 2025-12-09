<template>
  <details class="accordion">
    <summary>FAQ - Apa itu Nuxt?</summary>
    <p>Nuxt adalah framework untuk Vue yang lebih powerful dan modular.</p>
  </details>
</template>

<style scoped>
.accordion {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 10px;
}

summary {
  cursor: pointer;
  font-weight: 600;
  list-style: none;
}

summary::after {
  content: "➕";
  float: right;
}

details[open] summary::after {
  content: "➖";
}
</style>
