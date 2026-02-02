<template>
  <div v-if="isLoading" class="loading">
    <div class="loading_tanggal">
      <i class="fa-solid fa-spinner"></i>
      <p>Tunggu Sebentar</p>
    </div>
  </div>
  <div class="background_delete" v-if="hapus">
    <div class="delete_tanggal">
      <!-- <div class="header_delete">
        <h3>Hapus Hari Libur</h3>
        <i class="fa-solid fa-xmark" @click="closeSetTanggal"></i>
      </div> -->
      <p>Apakah anda yakin <br />ingin menghapus hari libur ini?</p>
      <div class="submit_delete">
        <div class="batal">
          <button @click="closeSetTanggal" type="button">Batal</button>
        </div>
        <div class="simpan">
          <button
            @click="deleteTanggal(selectedData?.tanggal)"
            :disabled="isLoading"
            type="button"
            :class="{ disabled_btn: isLoading }"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
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
          <div
            class="list_hari"
            v-for="h in k.hari_libur"
            v-if="k.hari_libur && k.hari_libur.length"
          >
            <div class="keterangan_libur">
              <h4>{{ h.tanggal.split("-")[0] }} {{ h.nama_hari }}</h4>
              <p>{{ h.keterangan }}</p>
            </div>
            <!-- <i class="fa-solid fa-xmark" @click="deleteTanggal(h.tanggal)"></i> -->
            <i class="fa-solid fa-xmark" @click="openDelete(h)"></i>
          </div>
          <div class="belum_tersedia" v-else>
            <h4>Hari Libur belum tersedia</h4>
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
</template>

<!-- Style Background Delete -->
<style scoped>
/* .background_delete {
  position: fixed;
  z-index: 9999;
  background-color: rgb(0, 0, 0, 0.1);
  width: 100vw;
  height: 101vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
} */

.background_delete,
.background_tanggal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.delete_tanggal p {
  text-align: center;
}

.delete_tanggal .header_delete {
  text-align: right;
}

.delete_tanggal .submit_delete {
  display: flex;
  justify-content: center;
  gap: 10px;
  /* margin-top: 30px; */
}

.submit_delete .batal button {
  padding: 8px 10px;
  border-radius: 6px;
  background-color: #fff;
  border: 1px solid #dedede;
}

.submit_delete .batal button:hover {
  background-color: #f7f7f7;
}

.submit_delete .simpan button {
  padding: 8px 10px;
  border-radius: 6px;
  background-color: blue;
  color: #fff;
}

.submit_delete .simpan button:hover {
  background-color: rgb(0, 0, 180);
}

.delete_tanggal {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.delete_tanggal,
.create_tanggal {
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  width: 420px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  animation: modalFade 0.25s ease;
}

@keyframes modalFade {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>

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
  justify-content: space-between;
  gap: 20px;
  width: 49%;
  /* height: 50vh; */
  max-height: 50vh;
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
  max-height: 280px;
  overflow-y: auto;
  padding-right: 6px;
  border-radius: 10px;
}

.belum_tersedia {
  font-size: 16px;
  font-weight: 500;
  color: #888888;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
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
  width: 48%;
  /* width: 260px; */
}

.list_hari i {
  font-weight: 600;
  font-size: 13px;
}
</style>

<!-- Responsive -->
<style scoped>
@media (max-width: 1024px) {
  .create_tanggal {
    width: 80%;
  }

  .bulan .month {
    width: 100%;
    height: auto;
  }

  .list_hari {
    width: 100%;
  }

  .holiday {
    width: 90%;
    padding: 5px 0;
  }
}
</style>

<!-- <script setup>
definePageMeta({
  layout: "dashboard",
});
</script> -->

<script>
definePageMeta({
  layout: "dashboard",
});
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
      hapus: false,
      selectedData: null,
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
          `/api/v1/hari-libur/lihat?tahun=${this.tahunAktif}`,
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
      this.hapus = false;
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
    openDelete(hari) {
      this.hapus = true;
      this.selectedData = hari;
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
      this.hapus = false;
      this.tanggal = "";
      this.hari = "";
    },
  },
  computed: {
    isDisabled() {
      return !this.tanggal || !this.hari;
    },
    // selectedData() {
    //   let selected = this.daftarHari.data.flatMap((bulan) => bulan.hari_libur);
    //   // .filter((h) => h.tanggal === this.tanggal);

    //   return selected;
    // },
  },
  watch: {
    tahunAktif() {
      this.hariLibur();
    },
  },
};
</script>
