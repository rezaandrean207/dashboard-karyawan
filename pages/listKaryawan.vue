<template>
  <!-- <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div> -->
  <div class="konten">
    <div class="navbar">
      <div class="menu">
        <i class="fa-solid fa-bars" @click="menu"></i>
      </div>
      <p>Dashboard</p>
    </div>

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
              <i v-else class="fa-solid fa-rotate-right"></i>
              {{ loading ? "Menyinkronkan..." : "Sync" }}
            </button>
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

            {{ loading ? "Menyinkronkan..." : "Sync" }}
            <!-- <i v-else class="fa-solid fa-circle-check"></i>     -->
          </button>
        </div>

        <NuxtLink to="/" class="logout">Logout</NuxtLink>
      </div>
    </div>

    <!-- Isi Konten -->
    <div class="isi">
      <!-- Animasi sukses -->
      <!-- <div class="success-animation">
      </div> -->

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

      <h2>Daftar Karyawan</h2>
      <p>Kelola dan pantau kinerja karyawan</p>

      <!-- Filter -->
      <div class="filter">
        <div class="title">
          <i class="fa-solid fa-filter"></i>
          <p>Filter & Pencarian</p>
        </div>
        <div class="filter_detail">
          <form action="">
            <input
              type="search"
              placeholder="Cari nama karyawan"
              v-model="searchInput"
              @submit.prevent
            />
            <select v-model="posisi">
              <option value="" selected>Semua Posisi</option>
              <option value="pm">Project Manager</option>
              <option value="analis">Data Analys</option>
              <option value="backend">Backend</option>
              <option value="backend-web">Backend-Web Developer</option>
              <option value="web">Web Developer</option>
              <option value="mobile apps">Mobile Apps</option>
              <option value="UI-UX">UI-UX</option>
              <!-- <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Project Manager">Project Manager</option> -->
            </select>
          </form>
          <div class="total_karyawan">
            <i class="fa-solid fa-users"></i>
            <div class="jumlah_karyawan">
              <p>Total Karyawan</p>
              <p class="jumlah">
                <strong>{{ daftarKaryawan.length }} Karyawan</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Daftar Karyawan -->
      <div class="daftarKaryawan">
        <div
          class="karyawan"
          @click="openDetail(k)"
          v-for="(k, index) in filteredKaryawan"
          :key="index"
        >
          <div class="identitas">
            <!-- <img :src="k.user.profilPicture" alt="" /> -->
            <img src="/img/profil.png" alt="" />
            <h4>{{ k.name }}</h4>
            <div class="peran">
              <i class="fa-solid fa-briefcase"></i>
              <p>{{ k.role }}</p>
            </div>
            <!-- <div
              class="bebanKerja"
              :class="{
                kuning: kategoriBeban(k.beban) === 'Sedang',
                merah: kategoriBeban(k.beban) === 'Berat',
                hijau: kategoriBeban(k.beban) === 'Mudah',
                putih: kategoriBeban(k.beban) === '',
              }"
            >
              <i class="fa-solid fa-clock"></i>
              <p>
                {{ kategoriBeban(k.beban) }}
              </p>
            </div> -->
          </div>
          <div class="kinerja">
            <div class="proyekAktif">
              <p>Status:</p>
              <p>{{ k.status }}</p>
            </div>
            <!-- <div class="performa">
              <p>Performa:</p>
              <p>{{ k.performa }}</p>
            </div> -->
          </div>
        </div>

        <!-- Duplikat Karyawan -->
        <!-- <div class="karyawan">
          <div class="identitas">
            <img src="../img/karyawan.jpg" alt="" />
            <h4>Budi Santoso</h4>
            <div class="peran">
              <i class="fa-solid fa-briefcase"></i>
              <p>Frontend Developer</p>
            </div>
            <div class="bebanKerja">
              <i class="fa-solid fa-clock"></i>
              <p>Sedang</p>
            </div>
          </div>
          <div class="kinerja">
            <div class="proyekAktif">
              <p>Proyek Aktif:</p>
              <p>3</p>
            </div>
            <div class="performa">
              <p>Performa:</p>
              <p>92%</p>
            </div>
          </div>
        </div>

        
        <div class="karyawan">
          <div class="identitas">
            <img src="../img/karyawan.jpg" alt="" />
            <h4>Budi Santoso</h4>
            <div class="peran">
              <i class="fa-solid fa-briefcase"></i>
              <p>Frontend Developer</p>
            </div>
            <div class="bebanKerja">
              <i class="fa-solid fa-clock"></i>
              <p>Sedang</p>
            </div>
          </div>
          <div class="kinerja">
            <div class="proyekAktif">
              <p>Proyek Aktif:</p>
              <p>3</p>
            </div>
            <div class="performa">
              <p>Performa:</p>
              <p>92%</p>
            </div>
          </div>
        </div>

        <div class="karyawan">
          <div class="identitas">
            <img src="../img/karyawan.jpg" alt="" />
            <h4>Budi Santoso</h4>
            <div class="peran">
              <i class="fa-solid fa-briefcase"></i>
              <p>Frontend Developer</p>
            </div>
            <div class="bebanKerja">
              <i class="fa-solid fa-clock"></i>
              <p>Sedang</p>
            </div>
          </div>
          <div class="kinerja">
            <div class="proyekAktif">
              <p>Proyek Aktif:</p>
              <p>3</p>
            </div>
            <div class="performa">
              <p>Performa:</p>
              <p>92%</p>
            </div>
          </div>
        </div>

        <div class="karyawan">
          <div class="identitas">
            <img src="../img/karyawan.jpg" alt="" />
            <h4>Budi Santoso</h4>
            <div class="peran">
              <i class="fa-solid fa-briefcase"></i>
              <p>Frontend Developer</p>
            </div>
            <div class="bebanKerja">
              <i class="fa-solid fa-clock"></i>
              <p>Sedang</p>
            </div>
          </div>
          <div class="kinerja">
            <div class="proyekAktif">
              <p>Proyek Aktif:</p>
              <p>3</p>
            </div>
            <div class="performa">
              <p>Performa:</p>
              <p>92%</p>
            </div>
          </div>
        </div>

        <div class="karyawan">
          <div class="identitas">
            <img src="../img/karyawan.jpg" alt="" />
            <h4>Budi Santoso</h4>
            <div class="peran">
              <i class="fa-solid fa-briefcase"></i>
              <p>Frontend Developer</p>
            </div>
            <div class="bebanKerja">
              <i class="fa-solid fa-clock"></i>
              <p>Sedang</p>
            </div>
          </div>
          <div class="kinerja">
            <div class="proyekAktif">
              <p>Proyek Aktif:</p>
              <p>3</p>
            </div>
            <div class="performa">
              <p>Performa:</p>
              <p>92%</p>
            </div>
          </div>
        </div>

        <div class="karyawan">
          <div class="identitas">
            <img src="../img/karyawan.jpg" alt="" />
            <h4>Budi Santoso</h4>
            <div class="peran">
              <i class="fa-solid fa-briefcase"></i>
              <p>Frontend Developer</p>
            </div>
            <div class="bebanKerja">
              <i class="fa-solid fa-clock"></i>
              <p>Sedang</p>
            </div>
          </div>
          <div class="kinerja">
            <div class="proyekAktif">
              <p>Proyek Aktif:</p>
              <p>3</p>
            </div>
            <div class="performa">
              <p>Performa:</p>
              <p>92%</p>
            </div>
          </div>
        </div> -->
      </div>
    </div>

    <!-- Detail Karyawan -->
    <div v-if="detailKaryawan" class="background">
      <div class="detailKaryawan" v-if="detailKaryawan">
        <div class="header">
          <h3>Detail Karyawan</h3>
          <i class="fa-solid fa-xmark" @click="close"></i>
        </div>

        <div class="profilImage">
          <img src="/img/profil.png" alt="" />
          <p>{{ selected.name }}</p>
          <div class="peran">
            <i class="fa-solid fa-briefcase"></i>
            <p>{{ selected.role }}</p>
          </div>
          <div
            class="bebanKerja"
            :class="{
              kuning: kategoriBeban(selected.beban) === 'Sedang',
              merah: kategoriBeban(selected.beban) === 'Berat',
              hijau: kategoriBeban(selected.beban) === 'Mudah',
              putih: kategoriBeban(selected.beban) === '',
            }"
          >
            <i class="fa-solid fa-clock"></i>
            <p>Beban Kerja: {{ kategoriBeban(selected.beban) }}</p>
          </div>
        </div>

        <div class="infoKontak">
          <p class="judul">Informasi Kontak</p>
          <div class="emailTelepon">
            <div class="email">
              <i class="fa-solid fa-envelope"></i>
              <div class="isiEmail">
                <p class="keterangan">Email</p>
                <p>{{ selected.email }}</p>
              </div>
            </div>
            <!-- <div class="telepon">
              <i class="fa-solid fa-phone"></i>
              <div class="isiTelepon">
                <p class="keterangan">Telepon</p>
                <p>{{ selected.gaji }}</p>
              </div>
            </div> -->
          </div>
          <!--
            <div class="alamat">
              <i class="fa-solid fa-location-dot"></i>
              <div class="detailAlamat">
                <p class="keterangan">Alamat</p>
                <p>Jl Indonesia, Bekasi, JawaBarat</p>
              </div>
            </div>
            -->
        </div>

        <!-- <div class="infoKerja">
          <p class="judul">Informasi Pekerjaan</p>
          <div class="kerja">
            <div class="join">
              <i class="fa-solid fa-calendar"></i>
              <div class="detail">
                <p class="keterangan">Tanggal Bergabung</p>
                <p>{{ selected.created_at }}</p>
              </div>
            </div>
            <div class="status">
              <i class="fa-solid fa-briefcase"></i>
              <div class="detail">
                <p class="keterangan">Update at</p>
                <p>{{ selected.updated_at }}</p>
              </div>
            </div>
          </div>
        </div> -->

        <div class="statistikKinerja">
          <p class="judul">Kinerja & Statistik</p>
          <div class="statistik">
            <div class="proyek">
              <div class="judul">
                <p>Proyek</p>
                <h2>{{ selected.proyek }} 3</h2>
              </div>
              <div class="logo">
                <i class="fa-solid fa-check"></i>
              </div>
            </div>

            <div class="completed">
              <div class="judul">
                <p>Completed</p>
                <!-- <p>Selesai</p> -->
                <h2>{{ selected.performa }} 90%</h2>
              </div>
              <div class="logo">
                <i class="fa-solid fa-check"></i>
              </div>
            </div>

            <div class="on_progress">
              <div class="judul">
                <p>On Progress</p>
                <!-- <p>Dikerjakan</p> -->
                <h2>{{ selected.tugas }} 4</h2>
              </div>
              <div class="logo">
                <i class="fa-solid fa-chart-simple"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="keahlian">
          <p class="judul">Keahlian</p>
          <div class="daftarSkil">
            <div class="skil">
              <p>{{ selected.keahlian }}Frontend</p>
            </div> -->
        <!-- <div class="skil"><p>Backend</p></div> -->
        <!-- </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.listKaryawan {
  background-color: rgb(16, 67, 185);
}

.filter .filter_detail {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.filter_detail form {
  width: 70%;
  /* border: 1px solid #010101; */
  margin-top: 25px;
  display: flex;
  height: 5vh;
  gap: 10px;
}

.filter_detail .total_karyawan {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  /* text-align: justify; */
  border: 1px solid rgb(164, 199, 255);
  border-radius: 10px;
  width: 30%;
  height: 12vh;
  background-color: rgb(234, 241, 252);
}

.total_karyawan i {
  font-size: 16px;
  background-color: darkblue;
  padding: 11.5px 20px;
  text-align: center;
  display: flex;
  border-radius: 50%;
  justify-content: center;
  color: #fff;
}

.total_karyawan p {
  font-size: 14px;
  text-align: justify;
  font-weight: 300;
}

.total_karyawan .jumlah {
  color: darkblue;
}

form input,
form select {
  background-color: #ddd;
  width: 50%;
  border-radius: 10px;
  padding: 0 15px;
  margin: 0 10px;
  /* border: var(--borderCard); */
  border: 1px solid rgb(164, 199, 255);
}

form select {
  background: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20448%20512'%3E%3Cpath%20d='M224%20248a120%20120%200%201%201%200-240%20120%20120%200%201%201%200%20240zm-30.5%2056l61%200c9.7%200%2017.5%207.8%2017.5%2017.5%200%204.2-1.5%208.2-4.2%2011.4l-27.4%2032%2031%20115.1%20.6%200%2034.6-138.5c2.2-8.7%2011.1-14%2019.5-10.8%2061.9%2023.6%20105.9%2083.6%20105.9%20153.8%200%2015.1-12.3%2027.4-27.4%2027.4L43.4%20512c-15.1%200-27.4-12.3-27.4-27.4%200-70.2%2044-130.2%20105.9-153.8%208.4-3.2%2017.3%202.1%2019.5%2010.8l34.6%20138.5%20.6%200%2031-115.1-27.4-32c-2.7-3.2-4.2-7.2-4.2-11.4%200-9.7%207.8-17.5%2017.5-17.5z'/%3E%3C/svg%3E")
    no-repeat 10px center;
  background-size: 14px;
  padding-left: 35px;
}

form input {
  /* font-family: "Font Awesome 7 Free";
  font-weight: 900;
  content: "\f002"; */
  background: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'%3E%3Cpath%20d='M416%20208c0%2045.9-14.9%2088.3-40%20122.7L502.6%20457.4c12.5%2012.5%2012.5%2032.8%200%2045.3s-32.8%2012.5-45.3%200L330.7%20376C296.3%20401.1%20253.9%20416%20208%20416%2093.1%20416%200%20322.9%200%20208S93.1%200%20208%200%20416%2093.1%20416%20208zM208%20352a144%20144%200%201%200%200-288%20144%20144%200%201%200%200%20288z'/%3E%3C/svg%3E")
    no-repeat 10px center;
  background-size: 14px;
  padding-left: 35px;
}

/* ============================== */
/*   RESPONSIVE LAYOUT CSS        */
/* ============================== */

/* Tablet */
@media (max-width: 768px) {
  /* .filter .filter_detail {
    flex-direction: column;
    gap: 20px;
  } */

  .filter_detail form {
    width: 100%;
    height: auto;
    flex-direction: column;
  }

  form input,
  form select {
    width: 100%;
    margin: 0;
    height: 5.5vh;
  }

  .filter_detail .total_karyawan {
    width: 100%;
    height: auto;
    padding: 12px 0;
    font-size: 14px;
  }

  /* .karyawan {
    width: 30%;
    font-size: 14px;
  } */

  .karyawan .identitas img {
    width: 60px;
    height: 60px;
    object-fit: cover;
  }

  .karyawan h4 {
    font-size: 12px;
  }

  .identitas .peran {
    font-size: 12px;
  }

  .karyawan .identitas .bebanKerja {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    margin: 10px 65px;
    padding: 3px 0;
    font-size: 12px;
    border-radius: 15px;
  }

  .kinerja .proyekAktif {
    font-size: 12px;
  }

  .detailKaryawan {
    width: 60%;
  }
}

/* Handphone */
@media (max-width: 576px) {
  .konten {
    overflow-x: hidden;
  }

  .konten .background .sidebar_responsive {
    width: 59%;
  }

  .konten .isi {
    width: 100%;
    position: relative;
    left: 0;
  }

  .filter .filter_detail {
    flex-direction: column;
    width: 100%;
    display: flex;
    gap: 15px;
  }

  .filter_detail form {
    flex-direction: column;
    width: 100%;
    height: auto;
    gap: 12px;
  }

  form input,
  form select {
    width: 100%;
    margin: 0;
    height: 45px;
    padding-left: 38px;
  }

  form select {
    background-size: 14px;
    padding-left: 32px;
  }

  form input {
    background-size: 14px;
    padding-left: 35px;
  }

  .filter_detail .total_karyawan {
    width: 100%;
    padding: 15px;
    justify-content: flex-start;
  }

  .total_karyawan i {
    padding: 10px 18px;
    font-size: 16px;
  }

  .total_karyawan p {
    font-size: 13px;
  }

  /* .karyawan { */
  /* height: 70vh; */
  /* padding: 60px 0; */
  /* } */

  .daftarKaryawan {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .karyawan {
    margin-top: 20px;
    border: var(--borderCard);
    width: 95%;
    /* height: 50vh; */
    text-align: center;
    border-radius: 15px;
    transition: transform 0.3s ease;
    /* padding: 10px 0; */
    font-size: 12px;
  }

  .karyawan:hover {
    border: 1px solid rgb(68, 41, 203);
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    transform: scale(1.05);
  }

  .karyawan .identitas img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    border: 5px solid rgb(193, 222, 232);
    /* margin-top: 20px; */
  }

  .karyawan h4 {
    color: rgb(16, 50, 130);
    margin-top: 10px;
    font-size: 16px;
  }

  .karyawan .peran {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    font-size: 16px;
  }

  .karyawan .identitas .bebanKerja {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    margin: 10px 180px;
    padding: 5px 0;
    font-size: 13px;
    border-radius: 15px;
  }

  .karyawan .kinerja {
    margin: 0 30px;
    margin-top: 20px;
    border-top: 2px solid rgb(222, 221, 226);
  }

  .kinerja .proyekAktif {
    margin-top: 10px;
  }

  .kinerja .proyekAktif,
  .performa {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
  }

  .detailKaryawan {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    font-size: 15px;
  }

  .detailKaryawan .profilImage {
    margin: 0 70px;
  }
}

/* Handphone Kecil / Compact Layout */
@media (max-width: 430px) {
  .konten .background .sidebar_responsive {
    width: 60%;
  }

  .filter_detail {
    gap: 10px;
  }

  .filter_detail form {
    gap: 10px;
  }

  form input,
  form select {
    height: 42px;
    font-size: 13px;
  }

  .total_karyawan {
    flex-direction: column;
    text-align: center;
    padding: 15px 10px;
  }

  .total_karyawan p {
    text-align: center;
  }
}
</style>

<script setup>
definePageMeta({
  middleware: "auth",
});
</script>

<script>
export default {
  data() {
    return {
      detailKaryawan: false,
      dataKaryawan: true,
      sidebar: false,
      name: "",
      posisi: "",
      kerja: "",
      selected: {},
      daftarKaryawan: [],
      searchInput: "",
      loading: false,
      sukses: false,
    };
  },
  mounted() {
    this.ambilData();
  },
  methods: {
    menu() {
      this.sidebar = true;
    },
    kategoriBeban(beban) {
      if (beban < 40) {
        return "Mudah";
      } else if (beban >= 40 && beban <= 60) {
        return "Sedang";
      } else if (beban > 60) {
        return "Berat";
      } else {
        return "";
      }
    },
    openDetail(k) {
      this.selected = k;
      this.detailKaryawan = true;
    },
    close() {
      this.detailKaryawan = false;
      this.sidebar = false;
    },
    plus() {
      this.daftarKaryawan.push({
        nama: this.name,
        peran: this.posisi,
        beban: this.kerja,
      });
    },
    closeSukses() {
      this.sukses = false;
    },

    async ambilData() {
      // const { $api } = useNuxtApp();
      // http://192.168.0.100:8001/api/v1/clickup/members
      // const isiData = await $api.get("api/v1/clickup/members");
      // console.log($api.defaults.baseURL);
      // console.log("api adalah: ", isiData.data);

      // console.log($api);
      // console.log("BaseURL:", $api.defaults.baseURL);

      try {
        // http://192.168.0.100:8001/api/v1/clickup/sync/team
        // const isiData = await $api.get("/v1/clickup/sync/team");
        // this.daftarKaryawan = isiData.data.teams.teams.flatMap(t => t.members);
        // const isiData = await axios.get("/karyawan.json");
        // this.daftarKaryawan = isiData.data.karyawan;
        // http://192.168.0.100:8001/api/v1/clickup/members

        const member = await this.$api.get("/api/v1/clickup/members");
        this.daftarKaryawan = member.data.users;
        // const task = await $api.get("/api/v1/clickup/tasks");
        // this.daftarKaryawan = task.data;

        // const team = await $api.get("/api/v1/clickup/teams");
        // this.daftarKaryawan = team.data;

        // const member = await.$api.

        console.log("Struktur API:", member.data);
      } catch (error) {
        console.error("API Error:", error);
      }
    },

    async syncData() {
      // const { $api } = useNuxtApp();
      // console.log("SYNC DATA DIPANGGIL !");

      // Prevent Spam Klik
      if (this.loading) return;

      console.log("Sync data di proses");

      this.loading = true;
      this.sukses = false;

      try {
        const sync = await this.$api.post("/api/v1/sync/all");
        // this.daftarKaryawan = sync.data;
        console.log("Berhasil: ", sync);
        // alert("Berhasil");
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
  },
  computed: {
    // search() {
    //   // this.daftarKaryawan.name = this.searchInput
    // },
    filteredKaryawan() {
      let hasil = this.daftarKaryawan;

      // filter nama
      if (this.searchInput) {
        hasil = hasil.filter((k) =>
          k.name.toLowerCase().includes(this.searchInput.toLowerCase())
        );
      }

      // filter posisi (role)
      if (this.posisi) {
        hasil = hasil.filter(
          (k) => k.role.toLowerCase() === this.posisi.toLowerCase()
        );
      }

      return hasil;
    },
    totalKaryawan() {
      return this.filteredKaryawan.length || 0;
    },
  },
};

// const detailKaryawan = ref(false);

// function karyawan() {
//   detailKaryawan.value = true;
// }

// function close() {
//   detailKaryawan.value = false;
// }
</script>

<!-- <script type="module" src="">
import {
  createApp,
  ref,
} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

createApp({
  data() {
    return {
      detailKaryawan: false,
    };
  },
  methods: {
    karyawan() {
      this.detailKaryawan = true;
    },
    close() {
      this.detailKaryawan = false;
    },
  },
}).mount("#app");
</script> -->
