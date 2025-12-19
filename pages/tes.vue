<template>
  <!-- <div class="container_progres">
    <div class="container_selesai">
      <span>Task Selesai</span>
      <span>2 Task</span>
      <p>24 Jam</p>
    </div>
    <div class="container_onProgres">
      <span>Sedang Dikerjakan</span>
      <span>3 Task</span>
      <p>12 Jam</p>
    </div>
    <div class="container_todo">
      <span>Akan Datang</span>
      <span>5 Task</span>
      <p>48 Jam</p>
    </div> -->

  <!-- <div class="loading">
    <div class="loading_tanggal">
      <i class="fa-solid fa-spinner"></i>
      <i class="fa-solid fa-circle-notch"></i>
      <i class="fa-solid fa-arrows-spin"></i>
      <i class="fa-solid fa-circle-notch fa-spin"></i>
      <p>Tunggu Sebentar</p>
    </div>
  </div> -->

  <select name="" id="" class="filter_sortir">
    <option value="">Semua</option>
    <option value="highest">Tertinggi</option>
    <option value="lowest">Terendah</option>
  </select>
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
.filter_sortir {
  border: 1px solid #010101;
  padding: 4px;
  font-size: 14px;
  border-radius: 6px;
  width: 180px;
}
</style>

<style scoped>
.loading .loading_tanggal i {
  /* border: 1px solid #010101; */
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading_tanggal .spin {
  font-size: 28px;
  color: rgb(16, 50, 130);
  animation: spin 0.8s linear infinite;
}

.loading_tanggal i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 28px; /* GENAP */
  color: rgb(16, 50, 130);
  animation: spin 1s linear infinite;
  transform-origin: 50% 50%;
}
</style>

<style scoped>
.container_progres {
  display: flex;
  justify-content: space-between;
  /* margin: 20px; */
  padding: 20px;
  /* background-color: #f5f5f5; */
  border-radius: 10px;
  gap: 20px;
}

.container_selesai,
.container_onProgres,
.container_todo {
  flex: 1;
  background-color: #ffffff;
  padding: 20px 20px 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  flex-direction: column;
  display: flex;
  gap: 8px;
}

.container_selesai p,
.container_onProgres p,
.container_todo p {
  position: relative;
  bottom: 7px;
}

.container_selesai {
  background-color: rgb(233, 243, 255);
  border: 1px solid rgb(136, 190, 255);
}
.container_selesai span {
  color: rgb(16, 50, 130);
  font-size: 15px;
}

.container_onProgres {
  background-color: rgb(255, 244, 230);
  border: 1px solid rgb(255, 200, 150);
}
.container_onProgres span {
  color: rgb(218, 58, 0);
  font-size: 15px;
}

.container_todo {
  background-color: #f3e8ff;
  border: 1px solid #d8b4fe;
}
.container_todo span {
  color: purple;
  font-size: 15px;
}
</style>

<script>
export default {
  mounted() {
    this.tesEnv();
  },
  methods: {
    async tesEnv() {
      const { $api } = useNuxtApp();
      console.log($api.defaults.baseURL);
    },
  },
};
</script>
