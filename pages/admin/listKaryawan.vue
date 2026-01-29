<template>
  <!-- Isi Konten -->
  <div class="isi">
    <!-- Animasi sukses -->
    <!-- <div class="success-animation">
      </div> -->

    <div v-if="isLoading" class="loading">
      <div class="loading_tanggal">
        <i class="fa-solid fa-spinner"></i>
        <p>Tunggu Sebentar</p>
      </div>
    </div>

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
            <!-- <option value="backend-web">Backend-Web Developer</option> -->
            <option value="web">Web Developer</option>
            <option value="mobile apps">Mobile Apps</option>
            <option value="UI-UX">UI-UX</option>
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
        :key="k.clickup_id"
      >
        <div class="header-card">
          <div class="menu-wrapper" @click.stop>
            <button class="menu-btn" @click.stop="toggleMenu(k.clickup_id)">
              ⋮
            </button>

            <Transition name="dropdown">
              <div
                v-if="menuOpen === k.clickup_id"
                class="menu-dropdown"
                @click.stop
              >
                <button
                  v-if="k.status === 'nonaktif'"
                  @click.stop="ubahStatus(k, 'aktif')"
                >
                  Aktifkan
                </button>

                <button
                  v-else
                  class="danger"
                  @click.stop="ubahStatus(k, 'nonaktif')"
                >
                  Nonaktifkan
                </button>
              </div>
            </Transition>
          </div>
        </div>
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
          <div class="status-member">
            <p>Status:</p>
            <p>{{ k.status }}</p>
          </div>
          <!-- <div class="performa">
              <p>Performa:</p>
              <p>{{ k.performa }}</p>
            </div> -->
        </div>
      </div>
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
        <div class="bebanKerja" :class="bebanClass(beban)">
          <i class="fa-solid fa-clock"></i>
          <p>Beban Kerja: {{ kategoriBeban(beban) }}</p>
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
              <h3>{{ selected.project_count }}</h3>
            </div>
            <div class="logo">
              <i class="fa-solid fa-check"></i>
            </div>
          </div>

          <div class="completed">
            <div class="judul">
              <p>Completed</p>
              <!-- <p>Selesai</p> -->
              <h3>{{ selected.completed_tasks }} Task</h3>
            </div>
            <div class="logo">
              <i class="fa-solid fa-check"></i>
            </div>
          </div>

          <div class="on_progress">
            <div class="judul">
              <p>On Progress</p>
              <!-- <p>Dikerjakan</p> -->
              <h3>{{ selected.in_progress_tasks }} Task</h3>
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
  <!-- </div> -->
</template>

<!-- Conditioning colour -->
<style scoped>
/* SEDANG */
.kuning {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
  box-shadow: 0 2px 6px rgba(250, 204, 21, 0.35);
}

/* BERAT */
.merah {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #991b1b;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.35);
}

/* MUDAH */
.hijau {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #166534;
  box-shadow: 0 2px 6px rgba(34, 197, 94, 0.35);
}

/* DEFAULT / EMPTY */
.putih {
  background: #f8fafc;
  color: #334155;
  border: 1px dashed #cbd5e1;
}
</style>

<!-- Dropdown -->
<style scoped>
.header-card {
  text-align: right;
}

.menu-wrapper {
  position: relative;
  left: 6px;
}

.menu-btn {
  background: transparent;
  border: none;
  padding: 6px 8px;
  font-size: 18px;
  cursor: pointer;
}

.menu-btn:hover {
  background: #f1f5f9;
  border-radius: 6px;
}

.menu-dropdown {
  position: absolute;
  top: 28px;
  right: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  min-width: 140px;
  padding: 4px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
  z-index: 20;
  /* animation: fadeIn 0.2s ease; */
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

/* saat aktif animasi */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 160ms ease;
}

/* posisi akhir */
.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.menu-dropdown button {
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
}

.menu-dropdown button:hover {
  background: #f1f5f9;
}

.menu-dropdown .danger {
  color: #b91c1c;
}
</style>

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
  layout: "dashboard",
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
      menuOpen: null,
      isLoading: false,
      beban: 50,
    };
  },
  mounted() {
    this.ambilData();
  },
  methods: {
    toggleMenu(id) {
      this.menuOpen = this.menuOpen === id ? null : id;
    },

    async ubahStatus(user, status) {
      const oldStatus = user.status;

      user.status = status;
      this.isLoading = true;
      this.menuOpen = null;

      // nanti kalau mau:
      // call API update status di sini
      try {
        const change = await this.$api.put("/api/v1/clickup/members/status", {
          clickup_id: user.clickup_id,
          status: status,
        });
      } catch (err) {
        user.status = prevStatus;
        alert("Gagal mengubah", err);
        console.log("Gagal mengubah status", err);
      } finally {
        this.isLoading = false;
      }
    },
    logout() {
      const token = useCookie("token");
      token.value = null;
      this.$router.push("/login");
    },
    menu() {
      this.sidebar = true;
    },
    kategoriBeban(beban) {
      if (beban < 40) return "Mudah";
      if (beban <= 60) return "Sedang";
      if (beban > 60) return "Berat";
      return "";
    },
    bebanClass(beban) {
      const kategori = this.kategoriBeban(beban);

      return {
        kuning: kategori === "Sedang",
        merah: kategori === "Berat",
        hijau: kategori === "Mudah",
        putih: kategori === "",
      };
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
      try {
        const member = await this.$api.get("/api/v1/clickup/members");
        this.daftarKaryawan = member.data.users;
        console.log("Struktur API:", member.data);
      } catch (error) {
        console.error("API Error:", error);
      }
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
  },
  computed: {
    filteredKaryawan() {
      let hasil = this.daftarKaryawan;

      // filter nama
      if (this.searchInput) {
        hasil = hasil.filter((k) =>
          k.name.toLowerCase().includes(this.searchInput.toLowerCase()),
        );
      }

      // filter posisi (role)
      if (this.posisi) {
        hasil = hasil.filter(
          (k) => k.role.toLowerCase() === this.posisi.toLowerCase(),
        );
      }

      return hasil;
    },
    totalKaryawan() {
      return this.filteredKaryawan.length || 0;
    },
  },
};
</script>
