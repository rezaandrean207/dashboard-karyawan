<template>
  <!-- <div class="dropdown">
    <div class="dropdown-btn" @click="open = !open">
      Pilih item
    </div>

    <div v-if="open" class="dropdown-content">
      <input type="text" v-model="search" placeholder="Cari..." />
      <p v-for="item in filtered" :key="item">{{ item }}</p>
    </div>
  </div> -->
  <div class="select_task">Semua Progres</div>

  <div class="opsi">
    <label for=""> <input type="checkbox" name="" /> Complete </label>
    <label for=""> <input type="checkbox" name="" /> In Progress </label>
    <label for=""> <input type="checkbox" name="" /> To Do </label>
    <label for=""> <input type="checkbox" name="" /> In Review </label>
  </div>
</template>

<!-- <script>
export default {
  data() {
    return {
      open: false,
      search: "",
      items: ["Satu", "Dua", "Tiga"]
    };
  },
  computed: {
    filtered() {
      return this.items.filter(i =>
        i.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  }
};
</script> -->

<style scoped>


.select_task {
  background: #fff
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")
    no-repeat right 10px center;
  /* ganti posisi arrow di sini ↑ */
  background-size: 16px;
  border: 1px solid #010101;
  padding: 4px 8px;
  font-size: 14px;
  border-radius: 6px;
  width: 200px;
}

.opsi {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 200px;
  /* align-items: center; */
  justify-content: center;
  border: 1px solid var(--border_color);
  /* padding: 10px; */
  background-color: #fff;
  position: absolute;
  margin-top: 10px;
  border-radius: 6px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
}

.opsi label {
  border: 1px solid #f5f3f3;
  padding: 10px;
}
</style>