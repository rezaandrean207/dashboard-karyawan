<template>
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
  <div class="konten">
    <div class="navbar">
      <div class="menu">
        <i class="fa-solid fa-bars" @click="menu"></i>
      </div>
      <p>Dashboard</p>
    </div>

    <div class="background" v-show="sidebar" @click="close">
      <div class="sidebar_responsive" @click.stop>
        <div class="logo">
          <img src="/img/logo dna.png" alt="" />
          <div class="keterangan">
            <h5>Digital Nayaka Abhinaya</h5>
            <p>Kinerja Karyawan</p>
          </div>
        </div>

        <div class="sidebar-text">
          <NuxtLink
            to="/admin/listKaryawan"
            class="listKaryawan"
            :class="{ active: $route.path === '/admin/listKaryawan' }"
          >
            <i class="fa-solid fa-users"></i>
            <p>Daftar Karyawan</p>
          </NuxtLink>
          <NuxtLink
            to="/admin/bebanKerja"
            class="performance"
            :class="{ active: $route.path === '/admin/bebanKerja' }"
          >
            <i class="fa-regular fa-clock"></i>
            <p>Beban Kerja</p>
          </NuxtLink>
          <NuxtLink
            to="/admin/jadwalLibur"
            class="hari_libur"
            :class="{ active: $route.path === '/admin/jadwalLibur' }"
          >
            <i class="fa-regular fa-calendar"></i>
            <p>Jadwal Libur</p>
          </NuxtLink>
          <details class="setting">
            <summary>
              <span class="material-symbols-outlined"> settings </span>Setting
            </summary>
            <div class="submenu">
              <NuxtLink
                to="/admin/settingBug"
                class="submenu-item"
                :class="{ active: $route.path === '/admin/settingBug' }"
              >
                <!-- <i class="fa-solid fa-gear"></i> -->
                <!-- <span class="material-symbols-outlined"> settings </span> -->
                <!-- <i class="fa-solid fa-bug"></i> -->
                <p>Bug Setting</p>
              </NuxtLink>
              <NuxtLink
                to="/admin/changePassword"
                class="submenu-item"
                :class="{ active: $route.path === '/admin/changePassword' }"
              >
                <p>Ubah Password</p>
              </NuxtLink>
            </div>
          </details>
          <NuxtLink
            to="/admin/grouping"
            class="hari_libur"
            :class="{ active: $route.path === '/admin/grouping' }"
          >
            <i class="fa-regular fa-calendar"></i>
            <p>Grouping</p>
          </NuxtLink>
          <!-- <div class="setting">
          <i class="fa-solid fa-gear"></i>
          <a href="">Pengaturan</a>
        </div> -->
        </div>

        <div class="footer_sidebar">
          <div class="user">
            <p>Logged in sebagai</p>
            <h4>Admin</h4>
            <!-- <p>Admin</p> -->
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
              <i v-else class="fa-solid fa-rotate-right"></i>
              {{ loading ? "Menyinkronkan..." : "Sync" }}
            </button>
          </div>
          <button @click="logout" class="logout">Logout</button>
        </div>
      </div>
    </div>

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
        <NuxtLink
          to="/admin/listKaryawan"
          class="listKaryawan"
          :class="{ active: $route.path === '/admin/listKaryawan' }"
        >
          <i class="fa-solid fa-users"></i>
          <p>Daftar Karyawan</p>
        </NuxtLink>
        <NuxtLink
          to="/admin/bebanKerja"
          class="performance"
          :class="{ active: $route.path === '/admin/bebanKerja' }"
        >
          <i class="fa-regular fa-clock"></i>
          <p>Beban Kerja</p>
        </NuxtLink>
        <NuxtLink
          to="/admin/jadwalLibur"
          class="hari_libur"
          :class="{ active: $route.path === '/admin/jadwalLibur' }"
        >
          <i class="fa-regular fa-calendar"></i>
          <p>Jadwal Libur</p>
        </NuxtLink>
        <details class="setting">
          <summary>
            <span class="material-symbols-outlined"> settings </span>Setting
          </summary>
          <div class="submenu">
            <NuxtLink
              to="/admin/settingBug"
              class="submenu-item"
              :class="{ active: $route.path === '/admin/settingBug' }"
            >
              <p>Bug Setting</p>
            </NuxtLink>
            <NuxtLink
              to="/admin/changePassword"
              class="submenu-item"
              :class="{ active: $route.path === '/admin/changePassword' }"
            >
              <p>Ubah Password</p>
            </NuxtLink>
          </div>
        </details>
        <NuxtLink
          to="/admin/grouping"
          class="hari_libur"
          :class="{ active: $route.path === '/admin/grouping' }"
        >
          <span class="material-symbols-outlined"> group </span>
          <p>Grouping</p>
        </NuxtLink>
        <NuxtLink
          to="/admin/ganttChart"
          class="hari_libur"
          :class="{ active: $route.path === '/admin/ganttChart' }"
        >
          <span class="material-symbols-outlined"> group </span>
          <p>Gantt Chart</p>
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
          <h4>Admin</h4>
          <!-- <p>Admin</p> -->
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

            {{ loading ? "Menyinkronkan..." : "Sync" }}
            <!-- <i v-else class="fa-solid fa-circle-check"></i>     -->
          </button>
        </div>

        <button @click="logout" class="logout">Logout</button>
      </div>
    </div>
    <NuxtPage />
  </div>
</template>

<style scoped>
.active {
  background-color: rgb(16, 67, 185);
}

details {
  height: auto;
  cursor: pointer;
  /* margin-bottom: 10px auto; */
}

details summary {
  list-style: none;
  padding: 10px 10px 10px 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  /* width: 100%; */
}

details[open] summary {
  background-color: rgb(16, 67, 185);
}

details summary:hover {
  background-color: rgb(16, 67, 185);
}

details summary::-webkit-details-marker {
  display: none;
}

details[open] .submenu {
  margin-top: 10px;
  /* border: 1px solid rgb(0, 46, 154); */
}

details[open] {
  /* background-color: rgb(16, 67, 185); */
  border-radius: 10px;
}

.submenu {
  margin-top: 8px;
  margin-left: 25px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: fadeSlide 0.3s ease;
  border-left: 1px solid rgb(16, 67, 185);
}

@keyframes fadeSlide {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.submenu-item {
  padding: 8px 15px;
  border-radius: 6px;
  font-size: 14px;
  color: #cfd8ff;
  text-decoration: none;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
}

.submenu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>

<script>
export default {
  // layout: "dashboard",
  data() {
    return {
      sidebar: false,
      loading: false,
      sukses: false,
    };
  },
  methods: {
    menu() {
      this.sidebar = true;
    },
    close() {
      this.sidebar = false;
    },
    async syncData() {
      // Prevent Spam Klik
      if (this.loading) return;

      console.log("Sync data di proses");

      this.loading = true;
      this.sukses = false;

      try {
        const sync = await this.$api.post("/api/v1/sync/all");

        console.log("Berhasil: ", sync);

        this.loading = false;

        // Sukses
        this.sukses = true;

        // Hidden animasi
        setTimeout(() => {
          this.sukses = false;
        }, 15000);
      } catch (error) {
        console.error("Sync tidak berfungsi:", error);
        this.loading = false;
        setTimeout(() => {
          alert("Sync data gagal");
        }, 500);

        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
        console.log("MESSAGE:", error.message);
      } finally {
        this.sukses = true;
        this.loading = false;
      }
    },
    logout() {
      const token = useCookie("token");
      token.value = null;
      this.$router.push("/login");
    },
    closeSukses() {
      this.sukses = false;
    },
  },
};
</script>
