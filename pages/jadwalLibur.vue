<template>
  <div class="konten">
    <div v-if="isLoading" class="loading">
      <div class="loading_tanggal">
        <i class="fa-solid fa-spinner"></i>
        <p>Tunggu Sebentar</p>
      </div>
    </div>
    <div class="background_tanggal" v-if="createTanggal">
      <div class="create_tanggal">
        <div class="header_tanggal">
          <h3>Tambah Hari Libur</h3>
          <i class="fa-solid fa-xmark" @click="closeSetTanggal"></i>
        </div>
        <p>
          Tambahkan hari libur untuk bulan {{ bulanDipilih }} {{ tahunAktif }}
        </p>

        <form action="" class="form_tanggal" @submit.prevent="saveTanggal">
          <div class="tanggal">
            <label for="tanggal">Tanggal</label>
            <input type="date" v-model="tanggal" />
          </div>
          <div class="hari">
            <label for="hari">Nama Hari Libur</label>
            <input
              type="text"
              placeholder="Contoh: Hari Raya Idul Fitri"
              v-model="hari"
            />
          </div>
          <div class="submit_tanggal">
            <div class="batal">
              <button @click="closeSetTanggal" type="button">Batal</button>
            </div>
            <div class="simpan">
              <button
                @click="saveTanggal"
                :disabled="isDisabled"
                type="button"
                :class="{ disabled_btn: isDisabled }"
              >
                Simpan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="navbar">
      <div class="menu">
        <i class="fa-solid fa-bars" @click="menu"></i>
      </div>
      <p>Dashboard</p>
    </div>

    <div class="background" v-show="sidebar" @click="close">
      <div
        class="sidebar_responsive"
        @click.stop
        :class="{ slideOut: isClose }"
      >
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
          <NuxtLink to="/jadwalLibur" class="hari_libur">
            <i class="fa-regular fa-calendar"></i>
            <p>Jadwal Libur</p>
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
              <!-- <i v-else class="fa-solid fa-rotate-right"></i> -->
              <i v-else class="fa-solid fa-rotate-right"></i>

              {{ loading ? "Menyinkronkan..." : "Sync" }}
              <!-- <i v-else class="fa-solid fa-circle-check"></i>     -->
            </button>
          </div>
          <button @click="logout" class="logout">Logout</button>
        </div>
      </div>
    </div>

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
        <NuxtLink to="/jadwalLibur" class="hari_libur">
          <i class="fa-regular fa-calendar"></i>
          <p>Jadwal Libur</p>
        </NuxtLink>
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
          <!-- <NuxtLink to="/historySync" class="btn">
            <i class="fa-solid fa-clock-rotate-left"></i>
            <p>History Sync</p>
          </NuxtLink> -->
        </div>
        <button @click="logout" class="logout">Logout</button>
      </div>
    </div>

    <div class="isi" :class="{ hidden: createTanggal }">
      <h2>Jadwal Libur</h2>

      <div class="years">
        <button type="button" @click="kurang()"><</button>
        <p>{{ tahunAktif }}</p>

        <button type="button" @click="tambah()">></button>
      </div>

      <div class="bulan">
        <div class="month" v-for="k in daftarHari.data">
          <p class="month_name">{{ k.nama }}</p>
          <div class="holiday">
            <div class="list_hari" v-for="h in k.hari_libur">
              <div class="keterangan_libur">
                <h4>{{ h.tanggal.split("-")[0] }} {{ h.nama_hari }}</h4>
                <p>{{ h.keterangan }}</p>
              </div>
              <i
                class="fa-solid fa-xmark"
                @click="deleteTanggal(h.tanggal)"
              ></i>
            </div>
          </div>
          <div class="set_tanggal" @click="setTanggal(k)">
            <i class="fa-solid fa-plus"></i>
          </div>
        </div>
      </div>

      <!-- <div class="button_save">
        <button type="submit">Simpan Semua Perubahan</button>
      </div> -->

      <div class="kosong">
        <p>pp</p>
      </div>
    </div>
  </div>
</template>

<!-- Style Background tanggal -->
<style scoped>
.background_tanggal {
  position: fixed;
  z-index: 9999;
  background-color: rgb(0, 0, 0, 0.2);
  width: 100vw;
  height: 101vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.background_tanggal .create_tanggal {
  background-color: #fff;
  padding: 25px;
  border-radius: 8px;
  width: 33%;
}

.create_tanggal .header_tanggal {
  display: flex;
  justify-content: space-between;
}

.header_tanggal h3 {
  font-weight: 600;
  margin-bottom: 5px;
}

.create_tanggal p {
  font-size: 13px;
  font-weight: 300;
}

.create_tanggal .form_tanggal {
  margin-top: 20px;
}

.form_tanggal .tanggal,
.form_tanggal .hari {
  display: flex;
  flex-direction: column;
  margin: 15px 0;
}

.form_tanggal .tanggal label,
.form_tanggal .hari label {
  font-size: 13px;
  font-weight: 600;
  padding: 0 0 3px 3px;
}

.form_tanggal .tanggal input,
.form_tanggal .hari input {
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  border: 4px solid #f1f1f1;
}

.form_tanggal .tanggal input:focus,
.form_tanggal .hari input:focus {
  border: 4px solid #cfcfcf;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}

.submit_tanggal {
  display: flex;
  justify-content: end;
  gap: 8px;
  margin-top: 30px;
}

.submit_tanggal .batal button {
  padding: 8px 10px;
  border-radius: 6px;
  background-color: #fff;
  border: 1px solid #dedede;
}

.submit_tanggal .batal button:hover {
  background-color: #f7f7f7;
}

.submit_tanggal .simpan button {
  padding: 8px 10px;
  border-radius: 6px;
  background-color: rgb(13, 85, 254);
  color: #fff;
}

.submit_tanggal .simpan button:hover {
  background-color: rgb(0, 63, 210);
}
</style>

<style scoped>
:global(:root) {
  --border_color: rgb(193, 222, 232);
  --font-color: rgb(16, 50, 130);
  --tema: rgb(0, 69, 230);
}

.disabled_btn {
  cursor: not-allowed;
  opacity: 0.5;
}

.hidden {
  overflow: hidden;
}

.kosong {
  /* display: none; */
  color: #f8fcff;
}

.hari_libur {
  background-color: rgb(16, 67, 185);
}

.years {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 40px;
}

.years button {
  padding: 8px 13px;
  border-radius: 6px;
  background-color: #fff;
  border: 1px solid var(--border_color);
  cursor: pointer;
  font-size: medium;
}

.years p {
  font-size: 30px;
  color: var(--font-color);
}

.bulan {
  display: flex;
  flex-wrap: wrap;
  /* justify-content: center; */
  gap: 20px;
  margin-top: 20px;
}

.month {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  border: 2px solid var(--border_color);
  background-color: #fff;
  padding: 35px 0;
  /* margin: 20px 20px 0 0; */
  border-radius: 10px;
}

.month .set_tanggal {
  background-color: var(--tema);
  color: #fff;
  padding: 7px 12px;
  text-align: center;
  border-radius: 12px;
  font-size: 20px;
}

.set_tanggal:hover {
  background-color: rgb(0, 65, 216);
  transition: transform 0.3s ease-in-out;
  transform: scale(1.1);
}

.month .month_name {
  font-size: 20px;
  font-weight: 500;
  color: var(--font-color);
}

.button_save {
  text-align: center;
  margin: 20px;
}

.button_save button {
  /* width: 20%; */
  background-color: var(--tema);
  color: #fff;
  padding: 10px 20px;
  font-size: 18px;
  font-weight: 500;
  border-radius: 6px;
}

.button_save button:hover {
  background-color: rgb(0, 65, 216);
}

.holiday {
  display: flex;
  /* border: 1px solid #010101; */
  width: 90%;
  /* justify-content: flex-start; */
  gap: 14px;
  flex-wrap: wrap;
}

.list_hari {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #c7c7c7;
  padding: 10px;
  border-radius: 10px;
  background-color: #f4f4f4;
  /* gap: 8px; */
  width: 24%;
  /* width: 260px; */
}

.list_hari i {
  font-weight: 600;
  font-size: 13px;
}
</style>

<script>
export default {
  data() {
    return {
      daftarHari: [],
      // createTanggal: null,
      createTanggal: false,
      tanggal: "",
      hari: "",
      tahunAktif: 2026,
      isLoading: false,
      bulanDipilih: "",
    };
  },
  mounted() {
    this.hariLibur();
  },
  methods: {
    async hariLibur() {
      console.log("Hari Libur sedang di proses");

      try {
        const holiday = await this.$api(
          `/api/v1/hari-libur/lihat?tahun=${this.tahunAktif}`
        );
        this.daftarHari = holiday.data;
        console.log("Berhasil");
      } catch (error) {
        console.error("Gagal ambil task:", error);
        this.daftarHari = [];
      }
    },
    async saveTanggal() {
      console.log("berfungsi", this.tanggal);
      this.isLoading = true;
      this.createTanggal = false;
      try {
        const [tahun, bulan, tanggal] = this.tanggal.split("-");
        const keterangan = this.hari;
        const res = await this.$api.post("/api/v1/hari-libur/tambah", {
          tanggal: Number(tanggal),
          bulan: Number(bulan),
          tahun: Number(tahun),
          keterangan: keterangan,
        });

        await this.hariLibur();
      } catch (err) {
        console.log("Gagal menyimpan data", err);
      } finally {
        this.isLoading = false;
        // this.setTanggal();
        this.hari = "";
      }
    },
    async deleteTanggal(data) {
      console.log("Delete diklik");
      this.isLoading = true;
      try {
        const [tanggal, bulan, tahun] = data.split("-");
        const res = await this.$api.delete("/api/v1/hari-libur/hapus", {
          data: {
            tanggal: Number(tanggal),
            bulan: Number(bulan),
            tahun: Number(tahun),
          },
        });
        await this.hariLibur();
      } catch (err) {
        console.log("Gagal menyimpan data", err);
      } finally {
        this.isLoading = false;
      }
    },
    tambah() {
      this.tahunAktif++;
    },
    kurang() {
      this.tahunAktif--;
    },
    setTanggal(bulan) {
      this.createTanggal = true;

      // Mapping Bulan
      const bulanMap = {
        Januari: "01",
        Februari: "02",
        Maret: "03",
        April: "04",
        Mei: "05",
        Juni: "06",
        Juli: "07",
        Agustus: "08",
        September: "09",
        Oktober: "10",
        November: "11",
        Desember: "12",
      };
      const bulanAngka = bulanMap[bulan.nama];
      const tahunAngka = this.tahunAktif;

      this.tanggal = `${tahunAngka}-${bulanAngka}-01`;
      this.bulanDipilih = bulan.nama;
    },
    closeSetTanggal() {
      this.createTanggal = false;
    },
  },
  computed: {
    isDisabled() {
      return !this.tanggal || !this.hari;
    },
  },
  watch: {
    tahunAktif() {
      this.hariLibur();
    },
  },
};
</script>
