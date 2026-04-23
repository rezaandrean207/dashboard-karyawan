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
          <img src="/img/logo-dna.png" alt="" />
          <div class="keterangan">
            <h5>Digital Nayaka Abhinaya</h5>
            <p>Kinerja Karyawan</p>
          </div>
        </div>

        <div class="sidebar-text">
          <div v-for="item in menus" :key="item.path">
            <NuxtLink
              v-if="!item.children"
              :to="item.path"
              class="menu-item"
              :class="{ active: $route.path === item.path }"
            >
              <!-- FontAwesome -->
              <i v-if="!item.type" :class="item.icon"></i>

              <!-- Material Icon -->
              <span
                v-else-if="item.type === 'material'"
                class="material-symbols-outlined"
              >
                {{ item.icon }}
              </span>

              <svg
                width="25"
                height="20"
                viewBox="0 0 15 15"
                xmlns="http://www.w3.org/2000/svg"
                style="margin: 0 12px 3px 1px; /* border: 1px solid #010101 */"
                v-else-if="item.type === 'svg'"
              >
                <path
                  d="M0,0H1V14H15V15H0V0ZM2,2H5V3H2V2ZM3,5H8V6H3V5ZM5,8H8V9H5V8ZM8,11H15V12H8V11Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                />
              </svg>

              <p>{{ item.name }}</p>
            </NuxtLink>

            <div class="setting" v-else>
              <div
                class="menu-item"
                @click="openMenu = !openMenu"
                :class="{ active: openMenu }"
              >
                <span class="material-symbols-outlined"> {{ item.icon }} </span
                >{{ item.name }}
              </div>
              <div class="submenu" v-if="openMenu">
                <NuxtLink
                  v-for="sub in item.children"
                  :key="sub.path"
                  :to="sub.path"
                  class="submenu-item"
                  :class="{ active: $route.path === sub.path }"
                  >{{ sub.name }}</NuxtLink
                >
              </div>
            </div>
          </div>
        </div>

        <div class="footer_sidebar">
          <div class="user">
            <p>Masuk sebagai</p>
            <h4>{{ name }}</h4>
            <p>Admin</p>
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
        <img src="/img/logo-dna.png" alt="" />
        <div class="keterangan">
          <h5>Digital Nayaka Abhinaya</h5>
          <p>Kinerja Karyawan</p>
        </div>
      </div>

      <div class="sidebar-text">
        <div v-for="item in menus" :key="item.path">
          <NuxtLink
            v-if="!item.children"
            :to="item.path"
            class="menu-item"
            :class="{ active: $route.path === item.path }"
          >
            <!-- FontAwesome -->
            <i v-if="!item.type" :class="item.icon"></i>

            <!-- Material Icon -->
            <span
              v-else-if="item.type === 'material'"
              class="material-symbols-outlined"
            >
              {{ item.icon }}
            </span>

            <svg
              width="25"
              height="20"
              viewBox="0 0 15 15"
              xmlns="http://www.w3.org/2000/svg"
              style="margin: 0 12px 3px 1px; /* border: 1px solid #010101 */"
              v-else-if="item.type === 'svg'"
            >
              <path
                d="M0,0H1V14H15V15H0V0ZM2,2H5V3H2V2ZM3,5H8V6H3V5ZM5,8H8V9H5V8ZM8,11H15V12H8V11Z"
                fill="currentColor"
                fill-rule="evenodd"
              />
            </svg>

            <p>{{ item.name }}</p>
          </NuxtLink>

          <div class="setting" v-else>
            <div
              class="menu-item"
              @click="openMenu = !openMenu"
              :class="{ active: openMenu }"
            >
              <span class="material-symbols-outlined"> {{ item.icon }} </span
              >{{ item.name }}
            </div>
            <div class="submenu" v-if="openMenu">
              <NuxtLink
                v-for="sub in item.children"
                :key="sub.path"
                :to="sub.path"
                class="submenu-item"
                :class="{ active: $route.path === sub.path }"
                >{{ sub.name }}</NuxtLink
              >
            </div>
          </div>
        </div>
      </div>

      <div class="footer_sidebar">
        <div class="user">
          <p>Masuk sebagai</p>
          <h4>{{ name }}</h4>
          <p style="text-transform: capitalize">
            {{ roleLabel }}
          </p>
          <!-- <p style="text-transform: capitalize" v-if="role === 'member'">
            Karyawan
          </p> -->
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
.konten .navbar {
  display: none;
}

.navbar .menu {
  background-color: rgb(16, 62, 170);
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 16px;
}

.navbar p {
  font-size: 16px;
}

.konten .background {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  z-index: 99999;
}

.konten .background .sidebar_responsive {
  background-color: rgb(16, 50, 130);
  text-align: center;
  color: #fff;
  position: fixed;
  left: 0;
  z-index: 999;
  animation: slide-right 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  overflow: hidden;
  height: 100vh; /* fallback */
  height: 100dvh; /* utama */
}

.slideOut {
  animation: slide-left 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes slide-left {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-100%);
  }
}

@keyframes slide-right {
  from {
    transform: translateX(-30%);
  }
  to {
    transform: translateX(0%);
  }
}

.sidebar .logo,
.sidebar_responsive .logo {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgb(85, 57, 223);
  padding: 20px 25px;
  /* flex: 1; */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.18);
}

.logo img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  background-color: white;
  border-radius: 50%;
}

.logo .keterangan {
  font-size: 13px;
  text-wrap: nowrap;
  text-align: justify;
}

.keterangan p {
  color: rgb(98, 205, 238);
}

.sidebar .sidebar-text,
.sidebar_responsive .sidebar-text {
  display: flex;
  flex-direction: column;
  /* margin-top: 15px; */
  text-align: justify;
  padding: 15px;
  width: 100%;
  max-height: 60%;
  height: auto;
  gap: 12px;
  flex: 1; /* INI KUNCINYA */
  overflow-y: auto;

  /* Smooth scroll */
  scroll-behavior: smooth;

  /* Firefox */
  scrollbar-width: none;

  /* Internet Explorer / Edge lama */
  -ms-overflow-style: none;
}

/* Chrome, Edge, Safari */
.sidebar-text::-webkit-scrollbar {
  display: none;
}

.menu-item {
  padding: 10px 10px 10px 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  opacity: 0.75;
  text-wrap: nowrap;
}

.menu-item:hover {
  background-color: rgb(16, 67, 185);
  opacity: 1;
}

.setting {
  height: auto;
  cursor: pointer;
  font-size: 16px;
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
  opacity: 0.75;
}

.submenu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

@media (hover: none) {
  /* .submenu-item:hover,
  .submenu-item:active {
    background-color: transparent;
    opacity: 0.75;
  } */

  /* .setting:hover,
  .setting:active {
    background-color: transparent;
    opacity: 0.75;
  } */
}

.sidebar-text i {
  font-size: 16px;
  margin-right: 10px;
}

.sidebar-text span.material-symbols-outlined {
  /* font-size: 20px; */
  margin-right: 10px;
}

.sidebar-text a{
  color: #fff;
  font-size: 15px;
  /* height: 6vh; */
  text-align: justify;
}

.sidebar .footer_sidebar {
  /* border: 1px solid #010101; */
  border-top: 1px solid rgb(85, 57, 223);
  padding: 18px;
  width: 100%;
  margin-top: auto;
  box-shadow: 0 -6px 12px rgba(0, 0, 0, 0.18);
  background-color: rgb(16, 50, 130);
  /* height: 25%; */
}
.sidebar_responsive .footer_sidebar {
  position: absolute;
  bottom: 0;
  border-top: 1px solid rgb(85, 57, 223);
  padding: 18px;
  width: 100%;
  /* margin-top: auto; */
  box-shadow: 0 -6px 12px rgba(0, 0, 0, 0.18);
  background-color: rgb(16, 50, 130);
}

.footer_sidebar .user {
  background-color: rgb(16, 67, 185);
  padding: 10px 14px;
  /* margin: 0 15px; */
  border-radius: 10px;
  text-align: justify;
}

.footer_sidebar .sync .btn {
  margin: 10px 0;
  background-color: rgb(13, 85, 254);
  font-size: 14px;
  padding: 8px 0;
  width: 100%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: #fff;
}

.sync .btn:hover {
  background-color: rgb(0, 69, 230);
}

.footer_sidebar .logout {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid rgb(16, 72, 203);
  font-size: 14px;
  gap: 8px;
  border-radius: 10px;
  padding: 8px 0;
  background-color: transparent;
  color: #ffffff;
  width: 100%;
  font-size: 14px;
}

.logout:hover {
  background-color: rgb(16, 67, 185);
}

.logout::before {
  font-family: "Font Awesome 7 Free";
  font-weight: 600; /* solid */
  content: "\f2f5"; /* arrow-right-from-bracket */
}

.user p {
  font-weight: 400;
  color: rgb(98, 205, 238);
  margin: 5px 0;
  font-size: 12px;
}

.user h4 {
  font-size: 15px;
  font-weight: 400;
}
.active {
  background-color: rgb(16, 67, 185);
  opacity: 1;
}

.download {
  position: absolute;
  top: 20px;
  right: 50px;
  z-index: 900;
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
</style>

<!-- Resposive -->
<style scoped>
@media (max-width: 1024px) {
  .konten .navbar {
    display: flex;
    background-color: rgb(16, 50, 130);
    color: white;
    width: 100%;
    position: fixed;
    top: 0;
    height: 10%;
    align-items: center;
    z-index: 99;
    padding-left: 35px;
    gap: 10px;
  }
}
</style>

<script>
// import { type } from "node:os";

const menuConfig = {
  admin: [
    {
      name: "Daftar Karyawan",
      icon: "fa-solid fa-users",
      path: "/admin/listKaryawan",
    },
    {
      name: "Grouping",
      icon: "group",
      type: "material",
      path: "/admin/grouping",
    },
    {
      name: "Beban Kerja",
      icon: "fa-regular fa-clock",
      path: "/admin/bebanKerja",
    },
    {
      name: "Performa",
      icon: "show_chart",
      type: "material",
      path: "/admin/weekPerform",
    },
    {
      name: "Gamifikasi",
      icon: "trophy",
      type: "material",
      path: "/admin/gamifications",
    },
    {
      name: "Gantt Chart",
      //   icon: "fa-regular fa-clock",
      type: "svg",
      path: "/admin/ganttChart",
    },
    {
      name: "Pengaturan",
      icon: "settings",
      type: "material",
      children: [
        { name: "Jadwal Libur", path: "/admin/jadwalLibur" },
        { name: "Cuti", path: "/admin/jadwalCuti" },
        { name: "Pengaturan Bug", path: "/admin/settingBug" },
        { name: "Performa", path: "/admin/performanceSetting" },
        { name: "Ubah Password", path: "/admin/changePassword" },
      ],
    },
  ],

  member: [
    {
      name: "Performa Saya",
      icon: "bar_chart",
      type: "material",
      path: "/karyawan/performaSaya",
    },
    {
      name: "Gamifikasi",
      icon: "trophy",
      type: "material",
      path: "/karyawan/gamificationsKaryawan",
    },
    {
      name: "Gantt Chart",
      //   icon: "timeline",
      type: "svg",
      path: "/karyawan/ganttChartKaryawan",
    },
    {
      name: "Pengaturan",
      icon: "settings",
      type: "material",
      children: [
        { name: "Ubah Password", path: "/karyawan/changePasswordKaryawan" },
      ],
    },
  ],
};

export default {
  // layout: "dashboard",
  data() {
    return {
      sidebar: false,
      loading: false,
      sukses: false,
      openMenu: false,
      appVersion: "1.2",
      name: useCookie("name").value,
      role: useCookie("role").value,
    };
  },
  computed: {
    menus() {
      return menuConfig[this.role] || [];
    },
    roleLabel() {
      const roles = {
        admin: "Admin",
        member: "Karyawan",
      };

      return roles[this.role] || this.role;
    },
    isAppView() {
      return this.$route.query.view === "app";
    },
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
};
</script>
