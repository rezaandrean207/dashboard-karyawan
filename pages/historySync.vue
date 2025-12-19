<template>
  <div class="konten">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="logo">
        <img src="/img/logo dna.png" alt="" />
        <div class="keterangan">
          <h5>Digital Nayaka Abhinaya</h5>
          <p>Kinerja Karyawan</p>
        </div>
      </div>

      <div class="sidebar-text">
        <NuxtLink to="/listKaryawan" class="listKaryawan">
          <i class="fa-solid fa-users"></i>
          <p>Daftar Karyawan</p>
        </NuxtLink>
        <NuxtLink to="/bebanKerja" class="performance">
          <i class="fa-regular fa-clock"></i>
          <p>Beban Kerja</p>
        </NuxtLink>

        <!-- <NuxtLink to="/laporanKinerja" class="report">
          <i class="fa-solid fa-chart-simple"></i>
          <p>Laporan Kinerja</p>
        </NuxtLink> -->
        <!-- <div class="setting">
          <i class="fa-solid fa-gear"></i>
          <a href="">Pengaturan</a>
        </div> -->
      </div>

      <div class="footer_sidebar">
        <div class="user">
          <p>Logged in sebagai</p>
          <h4>Reza Andrean</h4>
          <p>Karyawan</p>
        </div>
        <div class="sync">
          <button
            class="btn"
            @click="syncData"
            :disabled="loading"
            :style="{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }"
          >
            <span v-if="loading" class="spinner"></span>
            <!-- <i v-else class="fa-solid fa-rotate-right"></i> -->
            <i v-else class="fa-solid fa-rotate-right"></i>

            {{ loading ? "Menyinkronkan..." : "Sync ClickUp" }}
            <!-- <i v-else class="fa-solid fa-circle-check"></i>     -->
          </button>
        </div>

        <button  @click="logout" class="logout">Logout</button>
      </div>
    </div>

    <!-- Isi -->
    <div class="isi">
      <!-- Animasi sukses -->
      <div v-if="sukses" class="success-animation">
        <div class="sukses">
          <div class="berhasil">
            <div class="ceklis">
              <i class="fa-solid fa-check"></i>
            </div>
            <p>Sinkronisasi Berhasil!</p>
          </div>
          <div class="silang" @click="closeSukses">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      </div>

      <div class="header_history">
        <div class="judul_history">
          <h2>History Sync</h2>
          <p>Riwayat sync data 10 hari terakhir</p>
        </div>
        <div class="total_history">
          <p>Total Sync: {{ dataHistory.length }}</p>
        </div>
      </div>

      <div class="history" v-for="h in dataHistory" :key="h.id">
        <div class="tanggal">
          <p>{{ h.sync_time }}</p>
        </div>
        <div class="status_sukses" v-if="h.status === 'success'">
          <i class="fa-solid fa-check"></i>
          <p>{{ h.status }}</p>
        </div>
        <div class="status_proses" v-if="h.status === 'running'">
          <i class="fa-solid fa-circle-notch fa-spin"></i>
          <p>{{ h.status }}</p>
        </div>
        <div class="status_gagal" v-if="error">
          <i class="fa-solid fa-xmark"></i>
          <p>Gagal</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header_history {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header_history .total_history {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  position: relative;
  top: 15px;
  right: 20px;
}

.history {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 20px;
  background-color: #f9f9f9;
}

.history .tanggal p {
  font-size: 16px;
  font-weight: 500;
}

.history .status_sukses {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 500;
}

.history .status_sukses i {
  color: green;
}

.history .status.gagal i {
  color: red;
}
</style>

<script>
export default {
  data() {
    return {
      loading: false,
      sukses: false,
      error: false,
      dataHistory: [],
    };
  },
  mounted() {
    this.historySync();
  },
  methods: {
    logout(){
      const token = useCookie("token");
      token.value = null;
      this.$router.push('/login');
    },
    async syncData() {
      const { $api } = useNuxtApp();
      this.loading = true;
      this.sukses = false;
      this.error = false;

      try {
        const sync = await $api.post("/api/v1/sync/all");
        console.log("Berhasil: ", sync);
        this.sukses = true;
      } catch (error) {
        console.error("Gagal:", error);
        this.error = true;
      } finally {
        this.loading = false;
      }
    },
    async historySync() {
      const { $api } = useNuxtApp();
      try {
        const history = await $api.get("/api/v1/sync/history");
        console.log("History Sync: ", history);
        this.dataHistory = history.data.slice(0, 10);
      } catch (error) {
        console.error("Gagal mengambil history sync:", error);
      }
    },
    closeSukses() {
      this.sukses = false;
    },
  },
};
</script>
