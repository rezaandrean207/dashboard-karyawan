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
    <div class="download">
      <button @click="downloadAPK()" class="download-btn">
        <span class="material-symbols-outlined"> download </span>Unduh aplikasi
      </button>
    </div>

    <div class="navbar" v-if="!isAppView">
      <div class="menu">
        <i class="fa-solid fa-bars" @click="menu"></i>
      </div>
      <p>Dashboard</p>
    </div>

    <div class="background" v-if="sidebar" @click="close">
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
            class="menu-item"
            :class="{ active: $route.path === '/admin/listKaryawan' }"
          >
            <i class="fa-solid fa-users"></i>
            <p>Daftar Karyawan</p>
          </NuxtLink>

          <NuxtLink
            to="/admin/grouping"
            class="menu-item"
            :class="{ active: $route.path === '/admin/grouping' }"
          >
            <span class="material-symbols-outlined"> group </span>
            <p>Grouping</p>
          </NuxtLink>

          <NuxtLink
            to="/admin/bebanKerja"
            class="menu-item"
            :class="{ active: $route.path === '/admin/bebanKerja' }"
          >
            <i class="fa-regular fa-clock"></i>
            <p>Beban Kerja</p>
          </NuxtLink>

          <NuxtLink
            to="/admin/weekPerform"
            class="menu-item"
            :class="{ active: $route.path === '/admin/weekPerform' }"
          >
            <span class="material-symbols-outlined"> show_chart </span>
            <p>Performa</p>
          </NuxtLink>

          <NuxtLink
            to="/admin/gamifications"
            class="menu-item"
            :class="{ active: $route.path === '/admin/gamifications' }"
          >
            <span class="material-symbols-outlined"> trophy </span>
            <p>Gamifikasi</p>
          </NuxtLink>

          <NuxtLink
            to="/admin/ganttChart"
            class="menu-item"
            :class="{ active: $route.path === '/admin/ganttChart' }"
          >
            <!-- <span class="material-symbols-outlined"> bar_chart_4_bars </span> -->
            <svg
              width="20"
              height="20"
              viewBox="0 0 15 15"
              xmlns="http://www.w3.org/2000/svg"
              style="margin: 0 12px 3px 1px; /* border: 1px solid #010101; */"
            >
              <path
                d="M0,0H1V14H15V15H0V0ZM2,2H5V3H2V2ZM3,5H8V6H3V5ZM5,8H8V9H5V8ZM8,11H15V12H8V11Z"
                fill="currentColor"
                fill-rule="evenodd"
              />
            </svg>

            <p>Gantt Chart</p>
          </NuxtLink>

          <div class="setting">
            <div
              class="menu-item"
              @click="openMenu = !openMenu"
              :class="{ active: openMenu }"
            >
              <span class="material-symbols-outlined"> settings </span
              >Pengaturan
            </div>
            <div class="submenu" v-if="openMenu">
              <NuxtLink
                to="/admin/jadwalLibur"
                class="submenu-item"
                :class="{ active: $route.path === '/admin/jadwalLibur' }"
              >
                <!-- <i class="fa-regular fa-calendar"></i> -->
                <p>Jadwal Libur</p>
              </NuxtLink>

              <NuxtLink
                to="/admin/settingBug"
                class="submenu-item"
                :class="{ active: $route.path === '/admin/settingBug' }"
              >
                <p>Pengaturan Bug</p>
              </NuxtLink>
              <NuxtLink
                to="/admin/performanceSetting"
                class="submenu-item"
                :class="{ active: $route.path === '/admin/performanceSetting' }"
              >
                <p>Performa</p>
              </NuxtLink>
              <NuxtLink
                to="/admin/changePassword"
                class="submenu-item"
                :class="{ active: $route.path === '/admin/changePassword' }"
              >
                <p>Ubah Password</p>
              </NuxtLink>
            </div>
          </div>
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

          <!-- VERSION -->
          <div class="app-version">Versi {{ appVersion }}</div>

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
          class="menu-item"
          :class="{ active: $route.path === '/admin/listKaryawan' }"
        >
          <i class="fa-solid fa-users"></i>
          <p>Daftar Karyawan</p>
        </NuxtLink>

        <NuxtLink
          to="/admin/grouping"
          class="menu-item"
          :class="{ active: $route.path === '/admin/grouping' }"
        >
          <span class="material-symbols-outlined"> group </span>
          <p>Grouping</p>
        </NuxtLink>

        <NuxtLink
          to="/admin/bebanKerja"
          class="menu-item"
          :class="{ active: $route.path === '/admin/bebanKerja' }"
        >
          <i class="fa-regular fa-clock"></i>
          <p>Beban Kerja</p>
        </NuxtLink>

        <NuxtLink
          to="/admin/weekPerform"
          class="menu-item"
          :class="{ active: $route.path === '/admin/weekPerform' }"
        >
          <span class="material-symbols-outlined"> show_chart </span>
          <p>Performa</p>
        </NuxtLink>

        <NuxtLink
          to="/admin/gamifications"
          class="menu-item"
          :class="{ active: $route.path === '/admin/gamifications' }"
        >
          <span class="material-symbols-outlined"> trophy </span>
          <p>Gamifikasi</p>
        </NuxtLink>

        <NuxtLink
          to="/admin/ganttChart"
          class="menu-item"
          :class="{ active: $route.path === '/admin/ganttChart' }"
        >
          <!-- <span class="material-symbols-outlined"> bar_chart_4_bars </span> -->
          <svg
            width="20"
            height="20"
            viewBox="0 0 15 15"
            xmlns="http://www.w3.org/2000/svg"
            style="margin: 0 12px 3px 1px; /* border: 1px solid #010101; */"
          >
            <path
              d="M0,0H1V14H15V15H0V0ZM2,2H5V3H2V2ZM3,5H8V6H3V5ZM5,8H8V9H5V8ZM8,11H15V12H8V11Z"
              fill="currentColor"
              fill-rule="evenodd"
            />
          </svg>

          <p>Gantt Chart</p>
        </NuxtLink>

        <div class="setting">
          <div
            class="menu-item"
            @click="openMenu = !openMenu"
            :class="{ active: openMenu }"
          >
            <span class="material-symbols-outlined"> settings </span>Pengaturan
          </div>
          <div class="submenu" v-if="openMenu">
            <NuxtLink
              to="/admin/jadwalLibur"
              class="submenu-item"
              :class="{ active: $route.path === '/admin/jadwalLibur' }"
            >
              <!-- <i class="fa-regular fa-calendar"></i> -->
              <p>Jadwal Libur</p>
            </NuxtLink>

            <NuxtLink
              to="/admin/settingBug"
              class="submenu-item"
              :class="{ active: $route.path === '/admin/settingBug' }"
            >
              <p>Pengaturan Bug</p>
            </NuxtLink>
            <NuxtLink
              to="/admin/performanceSetting"
              class="submenu-item"
              :class="{ active: $route.path === '/admin/performanceSetting' }"
            >
              <p>Performa</p>
            </NuxtLink>
            <NuxtLink
              to="/admin/changePassword"
              class="submenu-item"
              :class="{ active: $route.path === '/admin/changePassword' }"
            >
              <p>Ubah Password</p>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="footer_sidebar">
        <div class="user">
          <p>Masuk sebagai</p>
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

            {{ loading ? "Menyinkronkan..." : "Sinkronisasi" }}
            <!-- <i v-else class="fa-solid fa-circle-check"></i>     -->
          </button>
        </div>

        <button @click="logout" class="logout">Keluar</button>

        <!-- VERSION -->
        <div class="app-version">Versi {{ appVersion }}</div>
      </div>
    </div>
    <NuxtPage />
  </div>
</template>

<style scoped>
.active {
  background-color: rgb(16, 67, 185);
  opacity: 1;
}

.setting {
  height: auto;
  cursor: pointer;
  /* margin-top: 12px; */
  /* padding: 10px 0;
  border-radius: 10px; */
  /* margin-bottom: 10px auto; */
}

.submenu {
  margin-top: 8px;
  height: fit-content;
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

.download {
  position: absolute;
  top: 20px;
  right: 50px;
  z-index: 1000;
}

.download-btn {
  background-color: #2563eb;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;
}

.download-btn:hover {
  background-color: #1e40af;
}

.app-version {
  margin-top: 10px;
  font-size: 12px;
  opacity: 0.6;
  text-align: center;
  letter-spacing: 0.5px;
}

/* .app-version {
    color: #cfd8ff;
  } */
</style>

<script>
export default {
  // layout: "dashboard",
  data() {
    return {
      sidebar: false,
      loading: false,
      sukses: false,
      openMenu: false,
      appVersion: "1.1",
    };
  },
  methods: {
    downloadAPK() {
      const apkUrl = new URL("@/assets/DNA Monitoring.apk", import.meta.url)
        .href;

      const link = document.createElement("a");
      link.href = apkUrl;
      link.download = "DNA Monitoring.apk";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
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
  computed: {
    isAppView() {
      return this.$route.query.view === "app";
    },
  },
};
</script>
