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
          <!-- <NuxtLink
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
          class="menu-item"
          :class="{ active: $route.path === '/admin/jadwalLibur' }"
        >
          <i class="fa-regular fa-calendar"></i>
          <p>Jadwal Libur</p>
        </NuxtLink> -->
          <NuxtLink
            to="/karyawan/performaSaya"
            class="menu-item"
            :class="{ active: $route.path === '/karyawan/performaSaya' }"
          >
            <span class="material-symbols-outlined"> bar_chart </span>
            <p>Performa Saya</p>
          </NuxtLink>

          <NuxtLink
            to="/karyawan/gamificationsKaryawan"
            class="menu-item"
            :class="{
              active: $route.path === '/karyawan/gamificationsKaryawan',
            }"
          >
            <span class="material-symbols-outlined"> trophy </span>
            <p>Gamifikasi</p>
          </NuxtLink>

          <NuxtLink
            to="/karyawan/ganttChartKaryawan"
            class="menu-item"
            :class="{ active: $route.path === '/karyawan/ganttChartKaryawan' }"
          >
            <span class="material-symbols-outlined"> timeline </span>
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
                to="/karyawan/changePasswordKaryawan"
                class="submenu-item"
                :class="{
                  active: $route.path === '/karyawan/changePasswordKaryawan',
                }"
              >
                <!-- <span class="material-symbols-outlined"> password_2 </span> -->
                <p>Ubah Password</p>
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="footer_sidebar">
          <div class="user">
            <p>Masuk sebagai</p>
            <h4>{{ name }}</h4>
            <p>Karyawan</p>
            <!-- <h4>Reza Andrean</h4> -->
            <!-- <p>Karyawan</p> -->
          </div>
          <!-- <div class="sync">
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
          </div> -->
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
        <!-- <NuxtLink
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
          class="menu-item"
          :class="{ active: $route.path === '/admin/jadwalLibur' }"
        >
          <i class="fa-regular fa-calendar"></i>
          <p>Jadwal Libur</p>
        </NuxtLink> -->
        <NuxtLink
          to="/karyawan/performaSaya"
          class="menu-item"
          :class="{ active: $route.path === '/karyawan/performaSaya' }"
        >
          <span class="material-symbols-outlined"> bar_chart </span>
          <p>Performa Saya</p>
        </NuxtLink>

        <NuxtLink
          to="/karyawan/gamificationsKaryawan"
          class="menu-item"
          :class="{ active: $route.path === '/karyawan/gamificationsKaryawan' }"
        >
          <span class="material-symbols-outlined"> trophy </span>
          <p>Gamifikasi</p>
        </NuxtLink>

        <NuxtLink
          to="/karyawan/ganttChartKaryawan"
          class="menu-item"
          :class="{ active: $route.path === '/karyawan/ganttChartKaryawan' }"
        >
          <span class="material-symbols-outlined"> timeline </span>
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
              to="/karyawan/changePasswordKaryawan"
              class="submenu-item"
              :class="{
                active: $route.path === '/karyawan/changePasswordKaryawan',
              }"
            >
              <!-- <span class="material-symbols-outlined"> password_2 </span> -->
              <p>Ubah Password</p>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="footer_sidebar">
        <div class="user">
          <p>Masuk sebagai</p>
          <h4>{{ name }}</h4>
          <p>Karyawan</p>
          <!-- <h4>Reza Andrean</h4> -->
          <!-- <p>Karyawan</p> -->
        </div>
        <!-- <div class="sync">
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
        </div> -->

        <button @click="logout" class="logout">Keluar</button>

        <!-- VERSION -->
        <div class="app-version">Versi {{ appVersion }}</div>
      </div>
    </div>
    <NuxtPage />
  </div>
</template>

<!-- Background Notifikasi  -->
<!-- <style scoped>
.background-notif {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

.sidebar_notif {
  width: 350px;
  height: 100%;
  background-color: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.header_notif {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.header_notif .judul-notif {
  color: rgb(16, 50, 130);
}

.close_notif {
  cursor: pointer;
}

.container-notif {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.isi_notif {
  background-color: #ddd;
  padding: 10px;
  border-radius: 8px;
}
</style> -->

<style scoped>
.active {
  background-color: rgb(16, 67, 185);
  opacity: 1;
}

.user {
  margin-bottom: 15px;
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
  padding: 6px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 12px;
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
      notif: false,
      openMenu: false,
      daftar: [],
      userId: null,
      appVersion: "1.1",
      name: useCookie("name").value,
      // userId: useCookie("userId"),
    };
  },
  mounted() {
    // this.dataKaryawan();
    this.nameKaryawan();
  },
  methods: {
    nameKaryawan() {
      const name = useCookie("name").value;

      console.log("Nama karyawan: ", name);

      return name;
    },
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
    // async dataKaryawan() {
    //   try {
    //     const response = await this.$api.get("/api/v1/clickup/members");

    //     this.daftar = response.data.users;

    //     const user = Number(useCookie("clickup_id").value);
    //     console.log("Data Karyawan:", response.data);

    //     this.userId = this.daftar.find((k) => k.clickup_id === user);

    //     console.log("nama karyawan: ", this.userId.name);
    //   } catch (error) {
    //     console.error("Gagal mengambil data karyawan:", error);
    //   }
    // },
    pilihData(data) {},
    logout() {
      const token = useCookie("token");
      token.value = null;
      this.$router.push("/login");
    },
    closeSukses() {
      this.sukses = false;
    },
    openNotif() {
      this.notif = true;
    },
  },
  computed: {
    isAppView() {
      return this.$route.query.view === "app";
    },
  },
};
</script>
