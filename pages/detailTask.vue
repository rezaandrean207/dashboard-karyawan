<template>
  <div class="konten">
    <div class="navbar">
      <div class="menu">
        <i class="fa-solid fa-bars" @click="menu"></i>
      </div>
      <p>Dashboard</p>
    </div>
    <!-- Sidebar Responsive -->
    <div class="background" v-show="sidebar" @click="close">
      <div class="sidebar_responsive" v-show="sidebar">
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

          <NuxtLink to="/laporanKinerja" class="report">
            <i class="fa-solid fa-chart-simple"></i>
            <p>Laporan Kinerja</p>
          </NuxtLink>
          <!-- <div class="setting">
          <i class="fa-solid fa-gear"></i>
          <a href="">Pengaturan</a>
        </div> -->
        </div>

        <div class="footer_sidebar">
          <div class="user">
            <p>Logged in sebagai</p>
            <h4>Budi Santoso</h4>
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
              <i v-else class="fa-solid fa-rotate-right"></i>
              {{ loading ? "Menyinkronkan..." : "Sync ClickUp" }}
            </button>

            <!-- Animasi sukses -->
            <div v-if="sukses" class="success-animation">
              ✔ Sinkronisasi Berhasil!
            </div>
          </div>
          <NuxtLink to="/" class="logout">Logout</NuxtLink>
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
          <h4>Budi Santoso</h4>
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

        <NuxtLink to="/" class="logout">Logout</NuxtLink>
      </div>
    </div>

    <!-- Konten -->
    <div class="isi">
      <div class="header_task">
        <NuxtLink to="bebanKerja" class="back_button">
          <i class="fa-solid fa-arrow-left"></i>
          <p>Kembali</p>
        </NuxtLink>
        <div class="detailTask_karyawan">
          <p class="name_karyawan">Detail Task - Reza Andrean</p>
          <div class="periode">
            <p>Periode: 5/12/2025 - 5/12/2026</p>
          </div>
        </div>
      </div>

      <div class="card_karyawan">
        <div class="card_profile">
          <img src="/img/profil.png" alt="" />
          <div class="card_name">
            <h3>Reza Andrean</h3>
            <p>Frontend Developer</p>
            <p>Pelajar</p>
          </div>
        </div>
        <div class="card_task">
          <p>Total Task</p>
          <p>1 Task</p>
        </div>
      </div>

      <div class="container">
        <h1>Dummy</h1>
      </div>

      <div class="task">
        <h4>Task Selesai (1)</h4>
        <div class="container_task">
          <div class="header_container">
            <div class="name_task">
              <p>Develop Landing Page</p>
            </div>
            <div class="status_task">
              <div class="progres_task">
                <p>Selesai</p>
              </div>
              <div class="task_priority">
                <p>High</p>
              </div>
              <div class="task_penghargaan">
                <i class="fa-solid fa-award"></i>
                <p>Achievement</p>
              </div>
            </div>
          </div>
          <div class="description">
            <p>Create responsive landing page for new product</p>
          </div>
          <div class="achievement">
            <div class="achievement_logo">
              <i class="fa-solid fa-award"></i>
            </div>
            <div class="penghargaan">
              <p>
                🎉 <strong>Penghargaan!</strong> Selesai 2 hari lebih cepat dari
                deadline
              </p>
              <p>Lebih cepat: 48 jam</p>
            </div>
          </div>
          <div class="keterangan_waktu">
            <div class="jam">
              <i class="fa-regular fa-clock"></i>
              <p>16 jam</p>
            </div>
            <div class="start_date">
              <i class="fa-regular fa-calendar"></i>
              <p>Tanggal: 02/12/2024</p>
            </div>
            <div class="deadline">
              <i class="fa-regular fa-calendar"></i>
              <p>Deadline: 05/12/2024</p>
            </div>
            <div class="done_date">
              <i class="fa-regular fa-calendar"></i>
              <p>Selesai: 03/12/2024</p>
            </div>
          </div>

          <div class="jenis_data">
            <div class="form">
              <p>ClickUp</p>
            </div>
            <div class="jenis">
              <p>Frontend</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.performance {
  background-color: rgb(16, 67, 185);
}

:global(:root) {
  --border_color: rgb(193, 222, 232);
  --font-color: rgb(16, 50, 130);
}

.isi .header_task {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.header_task .back_button {
  display: flex;
  border: 1px solid rgb(165, 192, 255);
  align-items: center;
  gap: 15px;
  font-size: 13px;
  padding: 5px 10px;
  border-radius: 8px;
  background-color: #fff;
}

.back_button:hover {
  background-color: rgb(235, 241, 255);
}

.header_task .detailTask_karyawan {
}

.detailTask_karyawan .name_karyawan {
  font-size: 23px;
  font-weight: 500;
  color: rgb(16, 50, 130);
  margin: 10px 0;
}

.detailTask_karyawan .periode {
  font-size: 16px;
  font-weight: 300;
}

.card_karyawan {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgb(198, 215, 253);
  border-radius: 10px;
  padding: 25px;
  /* position: relative;
  top: 20px; */
  margin: 20px 0;
  background-color: #fff;
}

.card_karyawan .card_profile {
  display: flex;
  align-items: center;
  gap: 15px;
}

.card_karyawan .card_profile img {
  width: 20%;
  /* border: 1px solid #010101; */
  border-radius: 50%;
  border: 5px solid rgb(193, 222, 232);
}

.card_profile .card_name h3 {
  color: rgb(16, 50, 130);
}

.card_name p {
  font-weight: 400;
}

.card_karyawan .card_task {
  text-align: end;
  font-weight: 400;
}

.isi .container {
  /* position: relative;
  top: 20px; */
  border: 1px solid var(--border_color);
  /* background-color: var(--border_color); */
  padding: 20px;
}

.task h4 {
  margin: 25px 0 10px 0;
  font-weight: 500;
  color: var(--font-color);
}

.task .container_task {
  border: 1px solid var(--border_color);
  padding: 15px;
  border-radius: 10px;
}

.header_container {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  align-items: center;
}

.header_container .name_task {
  color: var(--font-color);
  font-weight: 500;
}

.status_task {
  display: flex;
  gap: 10px;
  font-size: 11px;
  font-weight: 500;
}

.status_task .task_penghargaan {
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: rgb(222, 255, 222);
  border: 1px solid rgb(115, 255, 115);
  border-radius: 7px;
  padding: 2px 5px;
  padding-top: 4px;
  color: green;
  /* color: #fff; */
}

.status_task .progres_task {
  background-color: rgb(216, 216, 255);
  border: 1px solid rgb(176, 176, 255);
  border-radius: 7px;
  padding: 2px 5px;
  color: rgb(0, 0, 255);
  display: flex;
  align-items: center;
}

.task_priority {
  background-color: rgb(255, 47, 47);
  padding: 2px 5px;
  border-radius: 7px;
  /* border: 1px solid rgb(255, 0, 0); */
  color: #fff;
  display: flex;
  align-items: center;
}

.description {
  margin: 10px 0;
  font-weight: 300;
}

.achievement {
  display: flex;
  gap: 10px;
  background-color: rgb(222, 255, 222);
  border: 1px solid rgb(115, 255, 115);
  border-radius: 10px;
  padding: 12px;
}

.achievement .achievement_logo i {
  color: green;
  font-weight: 600;
}

.keterangan_waktu {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  font-weight: 400;
  margin: 10px 0;
}

.keterangan_waktu .jam,
.start_date,
.deadline,
.done_date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.jenis_data {
  display: flex;
  gap: 15px;
  font-size: 12px;
}

.jenis_data .form,
.jenis {
  padding: 2px 5px;
  border: 1px solid var(--border_color);
  border-radius: 7px;
  color: var(--font-color);
}
</style>

<script>
export default {
  data() {
    return {
      sidebar: false,
      loading: false,
      sukses: false,
      task: [],
    };
  },
  mounted() {
    this.ambilTask();
  },
  methods: {
    menu() {
      this.sidebar = true;
    },
    close() {
      this.detailKaryawan = false;
      this.sidebar = false;
    },
    async ambilTask() {
      const { $api } = useNuxtApp();

      // const task = await $api_task.get("/api/v1/workload/tasks-by-range?start=2025-08-01&end=2025-12-30");
      // const task = await $api.get("/api/v1/clickup/tasks");
      const task = await $api.get(
        "/api/v1/workload/tasks-by-range?start_date=2025-07-01&end_date=2025-12-31 "
      );
      this.daftarKaryawan = task.data.assignees;

      console.log(task);
    },
  },
};
</script>
