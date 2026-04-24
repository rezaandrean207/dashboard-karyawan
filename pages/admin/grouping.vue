<template>
  <div v-if="isLoading" class="loading">
    <div class="loading_tanggal">
      <i class="fa-solid fa-spinner"></i>
      <p>Tunggu Sebentar</p>
    </div>
  </div>

  <!-- daftar karyawan -->
  <div class="isi">
    <h2>Grouping</h2>

    <p>Karyawan dengan performa rendah (< 85%) berdasarkan kategori</p>
    <div class="filter">
      <div class="title">
        <i class="fa-solid fa-filter"></i>
        <p>Filter & Pencarian</p>
      </div>
      <div class="filter-detail">
        <div class="filter-item">
          <label for="tanggal">Tanggal</label>
          <div class="dates">
            <ClientOnly>
              <VueDatePicker
                ref="startPicker"
                v-model="start"
                format="dd-MM-yyyy"
                model-type="yyyy-MM-dd"
                :time-config="{ enableTimePicker: false }"
                :max-date="end"
                @update:model-value="onStartDateSelected"
            /></ClientOnly>
            <span class="separator">
              <span class="material-symbols-outlined"> arrow_range </span>
            </span>
            <ClientOnly>
              <VueDatePicker
                ref="endPicker"
                v-model="end"
                format="dd-MM-yyyy"
                model-type="yyyy-MM-dd"
                :time-config="{ enableTimePicker: false }"
                :min-date="start"
            /></ClientOnly>
          </div>
        </div>
        <div class="filter-item">
          <label for="">Kurang/lebih dari</label>
          <ClientOnly>
            <n-select
              v-model:value="kurangLebih"
              :options="[
                { label: 'Kurang Dari', value: 'kurangDari' },
                { label: 'Lebih Dari', value: 'lebihDari' },
              ]"
            ></n-select>
          </ClientOnly>
        </div>
        <div class="filter-item">
          <label for="">Set default</label>
          <ClientOnly>
            <n-input
              v-model:value="searchInput"
              type="number"
              placeholder="Masukkan nilai default"
            ></n-input>
          </ClientOnly>
        </div>
      </div>
    </div>

    <div class="section-wraper">
      <div
        class="container-wraper"
        v-for="(kategori, index) in filteredKaryawan"
        :key="kategori.category"
      >
        <div class="header">
          <h4>{{ kategori.category }}</h4>
          <p>{{ kategori.data.length }} Karyawan</p>
        </div>
        <div class="container">
          <div
            class="container-card left"
            v-for="(k, index) in kategori.data"
            :key="k.clickup_id"
            @click="cekDetail(k.clickup_id)"
          >
            <div class="card-summary">
              <div class="card-item index">
                <p>{{ index + 1 }}</p>
              </div>
              <div class="card-item profil-karyawan">
                <div class="photo-wrapper" @click.stop>
                  <img
                    v-if="!k.imageError"
                    :src="getProfileImage(k.profile_picture_url)"
                    alt="Profile Picture"
                    @error="k.imageError = true"
                  />

                  <div
                    class="photo-option"
                    :style="{ backgroundColor: k.color }"
                    v-else
                  >
                    <p>{{ setInitial(k.name) }}</p>
                  </div>
                </div>
                <div class="name-role">
                  <h4>{{ k.name }}</h4>
                  <p>{{ k.role }}</p>
                </div>
              </div>
            </div>
            <div class="card-summary right">
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

<!-- Foto Profil -->
<style scoped>
.photo-wrapper {
  width: 40px;
  height: 40px;
}

.photo-option {
  font-size: 18px;
}
</style>

<style scoped>
* {
  -webkit-font-smoothing: antialiased;
}

.section-wraper {
  margin-top: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.container-wraper {
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h4 {
  font-size: 18px;
  font-weight: 600;
}

.header p {
  font-size: 14px;
  color: #6b7280;
}

.container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.container-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: #f9fafb;
  padding: 16px 18px;
  border-radius: 14px;
  border: none;
  transition: all 0.2s ease;
}

.container-card:hover {
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.container-card .card-summary {
  display: flex;
  align-items: center;
  gap: 12px;

  /* flex: 1; */
}

.container-card .left {
  flex: 1;
  min-width: 0; /* WAJIB di mobile */
}

.card-summary .index {
  background: linear-gradient(135deg, #6366f1, #4338ca);
  width: 25px;
  height: 25px;
  color: #fff;
  font-weight: 600;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.card-summary .card-item {
  display: flex;
  align-items: center;
  gap: 12px;
  text-transform: capitalize;
}

.card-item .name-role h4 {
  font-size: 15px;
  font-weight: 600;
}

.card-item .name-role p {
  font-size: 12px;
  color: #6b7280;
  /* text-wrap: nowrap; */
}

.container-card .right {
  flex-direction: column;
  /* border: 1px solid; */
  align-items: end;
  gap: 2px;

  margin-left: auto;
  text-align: right;
  flex-shrink: 0; /* biar ga gepeng */
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
  text-wrap: wrap;
  text-align: right;
}

/* Responsive tipis - tipis */
@media (max-width: 576px) {
  .right h4 {
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .name-role h4 {
    max-width: 80px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

<!-- Conditioning color -->
<style scoped>
.bad {
  color: red;
}

.normal {
  color: green;
}

.good {
  color: gold;
  filter: drop-shadow(2px 2px 4px rgb(255, 251, 228));
}

.late {
  background-color: rgb(255, 200, 200);
  border: 1px solid rgb(255, 100, 100);
  border-radius: 7px;
}

.late .penghargaan p {
  color: rgb(200, 0, 0);
}

.ontime {
  background-color: rgb(200, 255, 200);
  border: 1px solid rgb(100, 255, 100);
  border-radius: 7px;
  padding: 5px;
}

.ontime .penghargaan p {
  color: rgb(0, 100, 0);
}

.early {
  background-color: rgb(200, 255, 200);
  border: 1px solid rgb(100, 255, 100);
  border-radius: 7px;
  padding: 5px;
}

.early .penghargaan p {
  color: rgb(0, 100, 0);
}
</style>

<script>
import { formatTanggal, setDefaultTanggal } from "@/utils/helpers";

export default {
  data() {
    return {
      daftarKaryawan: [],
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
      assigneeColors: {},
    };
  },
  mounted() {
    const result = setDefaultTanggal();

    this.start = result.mulai;
    this.end = result.akhir;

    // this.ambilTask();
    // this.hariLibur();
  },
  methods: {
    getProfileImage(url) {
      const baseURL = "https://api.clickup.devlmu.com";

      if (!url) return "";

      return baseURL + url;
    },
    // handleImgError(event) {
    //   event.target.src = "/img/profil.png";
    // },
    getUserColor(name) {
      if (this.assigneeColors[name]) {
        return this.assigneeColors[name];
      }

      // --- FNV-1a hash implementation ---
      let hash = 2166136261;
      for (let i = 0; i < name.length; i++) {
        hash ^= name.charCodeAt(i);
        hash +=
          (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
      }

      // Convert hash to RGB
      const red = (hash >> 16) & 255;
      const green = (hash >> 8) & 255;
      const blue = hash & 255;

      const color = `#${this.toHex(red)}${this.toHex(green)}${this.toHex(blue)}`;

      this.assigneeColors[name] = color;
      return color;
    },

    toHex(value) {
      return value.toString(16).padStart(2, "0");
    },
    setInitial(data) {
      if (!data) return "";

      const parts = data.trim().split(" ");
      const [firstName] = parts[0];
      const lastName = parts.length > 1 ? parts[1][0] : "";

      console.log("Nama pertama adalah:", firstName);
      console.log("Nama terakhir adalah:", lastName);

      return firstName + lastName;
    },
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

      this.$router.replace({
        path: "/admin/grouping",
        query: {
          ...this.$route.query, // 🔥 PENTING
          start: formatTanggal(this.start),
          end: formatTanggal(this.end),
        },
      });

      this.ambilTask();
    },
    onStartDateSelected() {
      this.$nextTick(() => {
        this.$refs.endPicker.openMenu();
      });
    },

    async ambilTask() {
      this.isLoading = true;
      console.log("Ambil task dipanggil");
      try {
        const task = await this.$api.get(
          `/api/v1/workload/tasks-by-range?start_date=${formatTanggal(
            this.start,
          )}&end_date=${formatTanggal(this.end)}`,
        );

        this.daftarKaryawan = task.data.grouping || [];
        this.daftarKaryawan = task.data.grouping.map((k) => ({
          ...k,
          imageError: false,
        }));

        console.log("Berhasil ambil task:", task);
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
    cekDetail(clickupId) {
      if (!clickupId) {
        console.warn("clickup_id kosong");
        return;
      }

      this.$router.push({
        path: "/admin/bebanKerja",
        query: {
          id: clickupId,
          start: this.start,
          end: this.end,
          source: "grouping",
          from: this.$route.fullPath, // ⬅️ ini kunci
        },
      });
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
    kembali() {
      this.selectedKaryawan = null;
      this.progres = "";
      this.sortKetepatanDetail = "";
    },
    openTask() {
      this.openTaskList = !this.openTaskList;
    },
    statusLabel(status) {
      const map = {
        "done dev": "Done Dev",
        completed: "Completed",
        "in progress": "In Progress",
        "to do": "To Do",
        "in review": "In Review",
        cancelled: "Cancel",
        backlog: "Backlog",
      };
      return map[status] ?? "-";
    },
  },

  computed: {
    // detailKaryawanMap() {
    //   const map = {};
    //   this.detailKaryawan.forEach((a) => {
    //     map[a.clickup_id] = a;
    //   });
    //   return map;
    // },

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
    isAppView() {
      return this.$route.query.view === "app";
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
