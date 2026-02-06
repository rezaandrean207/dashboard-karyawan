<template>
  <div v-if="isLoading" class="loading">
    <div class="loading_tanggal">
      <i class="fa-solid fa-spinner"></i>
      <p>Tunggu Sebentar</p>
    </div>
  </div>

  <!-- daftar karyawan -->
  <div
    class="isi"
    :class="{ viewApp: isAppView }"
    v-if="selectedKaryawan === null"
  >
    <h2>Grouping</h2>
    <!-- <p>
      Karyawan dengan performa rendah (< {{ searchInput }}%) berdasarkan
      kategori
    </p> -->
    <p>Karyawan dengan performa rendah (< 85%) berdasarkan kategori</p>
    <div class="filter">
      <div class="title">
        <i class="fa-solid fa-filter"></i>
        <p>Filter & Pencarian</p>
      </div>
      <div class="search-tanggal">
        <div class="dates">
          <label for="tanggal">Tanggal</label>
          <div class="tanggal">
            <!-- <input type="date" name="start" v-model="start" /> -->
            <ClientOnly>
              <VueDatePicker
                format="dd-MM-yyyy"
                v-model="start"
                model-type="yyyy-MM-dd"
                :time-config="{ enableTimePicker: false }"
            /></ClientOnly>
            <span class="separator">➡️</span>
            <!-- <input type="date" name="end" v-model="end" /> -->
            <ClientOnly>
              <VueDatePicker
                format="dd-MM-yyyy"
                v-model="end"
                model-type="yyyy-MM-dd"
                :time-config="{ enableTimePicker: false }"
            /></ClientOnly>
            <!-- <VueDatePicker v-model="date">
              <template
                #preset-date-range-button="{ label, value, presetDate }"
              >
                <span role="button" :tabindex="0" @click="presetDate(value)">
                  {{ label }}
                </span>
              </template>
            </VueDatePicker> -->
          </div>
        </div>
        <div class="kurang-lebih-dari">
          <label for="">Kurang/lebih dari</label>
          <div class="kurang-lebih">
            <select name="" id="" v-model="kurangLebih">
              <option value="kurangDari">Kurang Dari</option>
              <option value="lebihDari">Lebih Dari</option>
            </select>
          </div>
        </div>
        <div class="search-input">
          <label for="">Set default</label>
          <div class="search">
            <input type="number" v-model="searchInput" />
          </div>
        </div>
      </div>
    </div>

    <div class="container-kategory">
      <div
        class="kategory"
        v-for="(kategori, index) in filteredKaryawan"
        :key="kategori.category"
      >
        <div class="header-kategory">
          <h4>{{ kategori.category }}</h4>
          <p>{{ kategori.data.length }} Karyawan</p>
        </div>
        <div class="container-karyawan">
          <div
            class="group-karyawan"
            v-for="(k, index) in kategori.data"
            :key="k.clickup_id"
            @click="cekDetail(k.clickup_id)"
          >
            <div class="left">
              <div class="index">
                <p>{{ index + 1 }}</p>
              </div>
              <div class="profil-karyawan">
                <img src="/img/profil.png" alt="" />
                <div class="name-role">
                  <h4>{{ k.name }}</h4>
                  <p>{{ k.role }}</p>
                </div>
              </div>
            </div>
            <div class="right">
              <h4 :class="teksColorClass(k.value)" v-if="k.missing_hours">
                {{ k.value }}% <span>({{ k.missing_hours }} Jam)</span>
              </h4>
              <h4 :class="teksColorClass(k.value)" v-else>{{ k.value }}%</h4>
              <p>{{ kategori.category }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  -webkit-font-smoothing: antialiased;
}

.container-kategory {
  margin-top: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.kategory {
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}

.header-kategory {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-kategory h4 {
  font-size: 18px;
  font-weight: 600;
}

.header-kategory p {
  font-size: 14px;
  color: #6b7280;
}

.container-karyawan {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-karyawan {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  padding: 16px 18px;
  border-radius: 14px;
  border: none;
  transition: all 0.2s ease;
}

.group-karyawan:hover {
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.group-karyawan .left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.left .index {
  background: linear-gradient(135deg, #6366f1, #4338ca);
  width: 36px;
  height: 36px;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.left .profil-karyawan {
  display: flex;
  align-items: center;
  gap: 12px;
  text-transform: capitalize;
}

.profil-karyawan img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.name-role h4 {
  font-size: 15px;
  font-weight: 600;
}

.name-role p {
  font-size: 13px;
  color: #6b7280;
}

.group-karyawan .right {
  text-align: right;
}

.right h4 {
  font-size: 16px;
  font-weight: 700;
}

.right span {
  font-size: 13px;
  font-weight: 400;
  color: #6b7280;
}

.right p {
  font-size: 13px;
  color: #9ca3af;
}

.search-tanggal {
  display: flex;
  margin-top: 20px;
  gap: 20px;
  /* border: 1px solid #010101; */
  flex-wrap: wrap;
}

.dates {
  /* width: 35%; */
  flex: 1;
  min-width: 300px;
}

.kurang-lebih-dari,
.search-input {
  /* width: 25%; */
  flex: 1;
  min-width: 250px;
}

.search-input label,
.kurang-lebih-dari label {
  font-size: 14px;
  font-weight: 600;
}

.search,
.kurang-lebih {
  /* background-color: #ddd; */
  border: 1px solid #ddd;
  /* padding: 10px; */
  border-radius: 10px;
  /* width: 30%; */
}

.search input,
.kurang-lebih select {
  border: 1px solid #ddd;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  padding: 10px;
}
</style>

<script>
import { VueDatePicker } from "@vuepic/vue-datepicker";

definePageMeta({
  layout: "dashboard",
});

export default {
  data() {
    return {
      daftarKaryawan: [],
      detailKaryawan: [],
      selectedKaryawan: null,
      sidebar: false,
      loading: false,
      sukses: false,
      start: "",
      end: "",
      isLoading: false,
      isClose: false,
      default: 85,
      searchInput: 85,
      kurangLebih: "kurangDari",
    };
  },
  components: {
    VueDatePicker,
  },
  mounted() {
    this.setDefaultTanggal();
    // this.ambilTask();
    // this.hariLibur();
  },
  methods: {
    teksColorClass(warna) {
      return {
        good: warna > 100,
        normal: warna == 100,
        bad: warna < 100,
      };
    },
    onDateChange() {
      if (!this.start || !this.end) return;
      if (this.isLoading) return;

      const startDate = new Date(this.start);
      const endDate = new Date(this.end);

      if (startDate > endDate) {
        this.start = this.end;
        return;
      }
      const format = (date) => date.toISOString().split("T")[0];

      // this.$router.replace({
      //   query: {
      //     startDate: format(startDate),
      //     endDate: format(endDate),
      //   },
      // });

      this.ambilTask();
    },

    logout() {
      const token = useCookie("token");
      token.value = null;
      this.$router.push("/login");
    },
    formatTanggal(tgl) {
      const [year, month, day] = tgl.split("-");
      return `${day}-${month}-${year}`;
    },

    setDefaultTanggal() {
      if (this.start && this.end) return;
      const today = new Date();
      const firstDay = new Date();
      // sevenDaysAgo.setDate(today.getDate() - 30);
      firstDay.setDate(1);

      // Format ke YYYY-MM-DD (format input type="date")
      const format = (date) => date.toISOString().split("T")[0];
      this.start = format(firstDay);
      this.end = format(today);

      // console.log("tes", this.$route.query);

      // if (this.$route.query.startDate) {
      //   this.start = this.$route.startDate;
      // } else {
      //   this.start = format(firstDay);
      // }

      // if (this.$route.query.endDate) {
      //   this.end = this.$route.endDate;
      // } else {
      //   this.end = format(today);
      // }

      // this.$router.replace({
      //   query: {
      //     startDate: this.start,
      //     endDate: this.end,
      //   },
      // });
    },
    closeSukses() {
      this.sukses = false;
    },

    async ambilTask() {
      this.isLoading = true;
      console.log("Ambil task dipanggil");
      try {
        const task = await this.$api.get(
          `/api/v1/workload/tasks-by-range?start_date=${this.formatTanggal(
            this.start,
          )}&end_date=${this.formatTanggal(this.end)}`,
        );
        this.daftarKaryawan = task.data.grouping || [];
        this.detailKaryawan = task.data.assignees || [];
        // this.daftarHari = task.data.jadwal_libur || [];
        // this.daftarHari = task.data.jadwal_libur
        console.log("Berhasil ambil task:", task);
        console.log("Data detail", this.detailKaryawan);
      } catch (error) {
        console.error("Gagal ambil task:", error);
        this.daftarKaryawan = [];
      } finally {
        this.isLoading = false;
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
    cekDetail(data) {
      const detail = this.detailKaryawanMap[data];

      if (!detail) {
        console.warn("Data karyawan tidak ditemukan:", data);
        return;
      }

      this.selectedKaryawan = detail;
      console.log("Berhasil mendapat data karyawan", this.selectedKaryawan);
    },
    menu() {
      this.sidebar = true;
    },
    close() {
      this.isClose = true;

      setTimeout(() => {
        this.sidebar = false;
        this.isClose = false;
      }, 200);
    },
  },

  computed: {
    detailKaryawanMap() {
      const map = {};
      this.detailKaryawan.forEach((a) => {
        map[a.clickup_id] = a;
      });
      return map;
    },
    filteredKaryawan() {
      const limit = Number(this.searchInput);

      if (isNaN(limit)) {
        return this.daftarKaryawan || [];
      }

      if (this.kurangLebih === "kurangDari") {
        return (this.daftarKaryawan || [])
          .map((group) => ({
            ...group,
            data: group.data.filter((k) => Number(k.value) < limit),
          }))
          .filter((group) => group.data.length > 0);
      }
      if (this.kurangLebih === "lebihDari") {
        return (this.daftarKaryawan || [])
          .map((group) => ({
            ...group,
            data: group.data.filter((k) => Number(k.value) > limit),
          }))
          .filter((group) => group.data.length > 0);
      }
    },
  },

  watch: {
    start: "onDateChange",
    end: "onDateChange",

    // query berubah → fetch data
    // "$route.query": {
    //   handler() {
    //     if (!this.$route.query.start || !this.$route.query.end) return;
    //     this.ambilTask();
    //   },
    //   immediate: true,
    // },
  },
};
</script>
