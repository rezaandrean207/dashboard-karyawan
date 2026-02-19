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
            to="/listKaryawan"
            class="listKaryawan"
            :class="{ active: $route.path === '/listKaryawan' }"
          >
            <i class="fa-solid fa-users"></i>
            <p>Daftar Karyawan</p>
          </NuxtLink>
          <NuxtLink
            to="/bebanKerja"
            class="performance"
            :class="{ active: $route.path === '/bebanKerja' }"
          >
            <i class="fa-regular fa-clock"></i>
            <p>Beban Kerja</p>
          </NuxtLink>
          <NuxtLink
            to="/jadwalLibur"
            class="menu-item"
            :class="{ active: $route.path === '/jadwalLibur' }"
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
            to="/karyawan/changePasswordKaryawan"
            class="menu-item"
            :class="{
              active: $route.path === '/karyawan/changePasswordKaryawan',
            }"
          >
            <span class="material-symbols-outlined"> password_2 </span>
            <p>Ganti Password</p>
          </NuxtLink>
        </div>

        <div class="footer_sidebar">
          <div class="user">
            <p>Logged in sebagai</p>
            <h4>Karyawan</h4>
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
          <p>Gamifications</p>
        </NuxtLink>

        <NuxtLink
          to="/karyawan/changePasswordKaryawan"
          class="menu-item"
          :class="{
            active: $route.path === '/karyawan/changePasswordKaryawan',
          }"
        >
          <span class="material-symbols-outlined"> password_2 </span>
          <p>Ganti Password</p>
        </NuxtLink>
      </div>

      <div class="footer_sidebar">
        <div class="user">
          <p>Logged in sebagai</p>
          <h4>Karyawan</h4>
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
    openNotif() {
      this.notif = true;
    },
  },
};
</script>
