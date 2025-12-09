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
        <NuxtLink to="/login" class="listKaryawan">
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
          <p>Sync Clickup</p>
        </div>
        <div class="logout">
          <p>Logout</p>
        </div>
      </div>
    </div>

    <!-- Konten -->
    <div class="isi">
      <h2>Laporan Kinerja</h2>
      <p>Ringkasan performa tim dan karyawan</p>

      <div class="container_flex">
        <div class="container1">
          <div class="judul">
            <i class="fa-solid fa-users"></i>
            <p>Total Karyawan</p>
          </div>
          <p>8</p>
        </div>
        <div class="container2">
          <div class="judul">
            <i class="fa-solid fa-chart-line"></i>
            <p>Rata-rata Perfoma</p>
          </div>
          <p>91%</p>
        </div>
        <div class="container3">
          <div class="judul">
            <i class="fa-solid fa-chart-simple"></i>
            <p>Total Proyek Aktif</p>
          </div>
          <p>27</p>
        </div>
        <div class="container4">
          <div class="judul">
            <i class="fa-solid fa-award"></i>
            <p>Top Performer</p>
          </div>
          <p>95%</p>
        </div>
      </div>

      <div class="top_karyawan">
        <div class="judul">
          <i class="fa-solid fa-award"></i>
          <p>Top 5 Karyawan</p>
        </div>
        <div class="container_block"></div>
      </div>
      <!-- <div class="ringkasan_task">
        <p class="jud">Jenis Task:</p>
        <details class="task_detail" v-for="task in k.tasks">
          <summary class="jenis_task">
            <div class="jenis_1">
              <p class="kategori">{{ task.name }}</p>
              <p>2 task - 56 jam</p>
            </div>
          </summary>
          <div class="content">
            <div class="name_task">
              <p>{{ task.description }}</p>
              <div class="progres-level">
                <div class="kemajuan">
                  <p>Selesai</p>
                </div>
                <div class="kesulitan">
                  <p>High</p>
                </div>
              </div>
            </div>
            <p class="ket">{{ k.text_content }}</p>
            <div class="time">
              <div class="jam">
                <i class="fa-regular fa-clock"></i>
                <p>32 jam</p>
              </div>
              <div class="tanggal">
                <i class="fa-regular fa-calendar"></i>
                <p>15/9/2025</p>
              </div>
              <div class="project">
                <p>Clickup</p>
              </div>
            </div>
          </div>
        </details>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.container_flex {
  display: flex;
  width: 96%;
  justify-content: space-between;
  /* border: 1px solid #010101; */
  gap: 15px;
  margin-top: 20px;
}

.container_flex .container1,
.container2,
.container3,
.container4 {
  border: 1px solid rgb(219, 214, 246);
  width: 25%;
  text-align: justify;
  padding: 25px;
  border-radius: 10px;
  font-size: 28px;
  font-weight: 5x00;
  background-color: #f8f8f8;
}

.container1 i {
  color: blue;
}

.container2 i {
  color: rgb(0, 179, 0);
}

.container3 i {
  color: rgb(225, 2, 225);
}

.container4 i {
  color: rgb(255, 145, 0);
}

.container_flex .judul {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 30px;
}
</style>
