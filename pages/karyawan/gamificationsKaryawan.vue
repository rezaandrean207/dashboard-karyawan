<template>
  <div v-if="isLoading" class="loading">
    <div class="loading_tanggal">
      <i class="fa-solid fa-spinner"></i>
      <p>Tunggu Sebentar</p>
    </div>
  </div>

  <div class="isi">
    <!-- Header -->
    <!-- <h2>Performa Mingguan - {{ displayPeriod }}</h2> -->
    <h2>Gamifikasi Karyawan</h2>
    <p class="subtitle">{{ periode }}</p>

    <!-- Filter -->
    <div class="card filter-card">
      <div class="filter-header">
        <h4>Filter Periode</h4>
      </div>

      <div class="filter-row">
        <!-- <div class="filter-item">
          <label>Tahun</label>
          <ClientOnly>
            <VueDatePicker
              v-model="dateYear"
              year-picker
              :formats="{ year: 'yo' }"
              :disabled="dataType === 'month'"
              :class="{ disabled_date: dataType === 'month' }"
              @update:model-value="onDateChange"
              class="month-picker"
            />
          </ClientOnly>
        </div> -->

        <div class="filter-item">
          <label>Bulan</label>
          <ClientOnly>
            <VueDatePicker
              v-model="dateMonth"
              month-picker
              :formats="{ month: 'LLLL' }"
              :disabled="dataType === 'year'"
              :class="{ disabled_date: dataType === 'year' }"
              @update:model-value="onDateChange"
              class="month-picker"
            />
          </ClientOnly>
        </div>

        <div class="filter-item">
          <label>Tahun </label>
          <ClientOnly>
            <VueDatePicker
              v-model="dateYear"
              year-picker
              :formats="{ year: 'yo' }"
              :disabled="dataType === 'month'"
              :class="{ disabled_date: dataType === 'month' }"
              @update:model-value="onDateChange"
              class="month-picker"
            />
          </ClientOnly>
        </div>

        <!-- <div class="filter-item">
          <label>Minggu </label>
          <select name="" id="" v-model="selectedWeeks" class="data-picker">
            <option
              :value="index + 1"
              v-for="(opt, index) in daftarMinggu"
              :key="opt"
            >
              {{ opt.label }}
            </option>
          </select>
        </div> -->
        <div class="filter-item">
          <label>Filter Data Tahunan/Bulanan</label>
          <select name="" id="" v-model="dataType" class="data-picker">
            <option value="month">Bulanan</option>
            <option value="year">Tahunan</option>
          </select>
        </div>

        <div class="filter-item">
          <label>Filter Data </label>
          <select name="" id="" v-model="selectedFilter" class="data-picker">
            <option value="Performa">Performa</option>
            <option value="Total Beban Kerja">Beban Kerja</option>
            <option value="Tepat Waktu Kerja">Tepat Waktu Kerja</option>
            <option value="Performa Bug">Performa Bug</option>
          </select>
        </div>
      </div>
    </div>

    <div class="card performance-card" v-if="daftarKaryawan.length">
      <div class="table-wrapper">
        <table class="table performance-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th
                style="
                  width: 700px;
                  /* border: 1px solid #010101; */
                  /* border-width: 0 1px; */
                "
              >
                Nama Karyawan
              </th>
              <!-- <th>Role</th> -->
              <!-- <th>Task Selesai</th> -->
              <th>Skor</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="emp in daftarKaryawan"
              :key="emp.rank"
              :class="{ isUser: emp.name === name }"
            >
              <td class="rank-col">
                <span class="rank-badge" :class="highlightRank(emp.rank)">
                  <span v-if="emp.rank === 1">🥇</span>
                  <span v-else-if="emp.rank === 2">🥈</span>
                  <span v-else-if="emp.rank === 3">🥉</span>
                  <span v-else>{{ emp.rank }}</span>
                </span>
              </td>

              <td class="emp-name">
                <strong>{{ emp.name }}</strong>
                <span class="role-badge">
                  {{ emp.role }}
                </span>
              </td>

              <!-- <td>
                <span class="role-badge">
                  {{ emp.role }}
                </span>
              </td> -->

              <!-- <td>{{ emp.tasks_completed }}</td> -->

              <td>
                <span
                  class="badge main-badge"
                  :class="badgeClass(emp.category)"
                >
                  {{ Math.round(emp.score) }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="not-list warning" v-if="isNotUser">
      <p>
        Kamu tidak termasuk dalam daftar karyawan yang memiliki performa
        terbaik.
      </p>
    </div>

    <div class="not-list success" v-else>
      <p>
        Selamat, kamu termasuk dalam daftar 5 karyawan terbaik, pertahankan!
      </p>
    </div>
  </div>
</template>

<!-- Highlight top 3 ranks -->
<style scoped>
/* .rank-gold {
  background: linear-gradient(to right, rgba(255, 215, 0, 0.08), transparent);
}

.rank-silver {
  background: rgba(148, 163, 184, 0.08);
}

.rank-bronze {
  background: rgba(205, 127, 50, 0.08);
} */

.rank-badge {
  /* background: #f1f5f9; */
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 600;
}

.emp-name {
  text-align: justify;
  /* width: 280px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  /* border: 1px solid #e2e8f0; */
}

.role-badge {
  background: #e2e8f0;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  text-transform: capitalize;
  width: fit-content;
}

.isUser {
  background: rgba(59, 121, 255, 0.1);
  border: 4px solid rgba(0, 71, 223, 0.3);
  border-radius: 12px;
  /* animation: bgPulse 3s ease-in-out infinite; */
  animation: borderPulse 3s ease-in-out infinite;
}

@keyframes borderPulse {
  0% {
    border-color: rgba(0, 71, 223, 0.3);
  }
  50% {
    border-color: rgba(0, 71, 223, 0.6);
  }
  100% {
    border-color: rgba(0, 71, 223, 0.3);
  }
}

@keyframes bgPulse {
  0% {
    background-color: rgba(37, 99, 235, 0.08);
  }
  50% {
    background-color: rgba(37, 99, 235, 0.18);
  }
  100% {
    background-color: rgba(37, 99, 235, 0.08);
  }
}
</style>

<!-- Filter -->
<style scoped>
/* Card filter */
.filter-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 20px 24px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

/* Header */
.filter-header {
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 10px;
}

.filter-header h4 {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 16px;
}

/* Row */
.filter-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

/* Item */
.filter-item {
  flex: 1 225px;
}

/* Label */
.filter-item label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 6px;
}

/* Date picker wrapper */
.month-picker,
.data-picker {
  --dp-border-radius: 10px;
  --dp-font-family: inherit;
  --dp-font-size: 14px;

  --dp-background-color: #f8fafc;
  --dp-text-color: #0f172a;
  --dp-border-color: #e2e8f0;
  --dp-border-color-hover: #94a3b8;
  --dp-primary-color: #2563eb;

  width: 100%;
}

.month-picker,
.data-picker {
  transition: all 0.2s ease;
}

/* Focus state */
.month-picker:focus-within,
.data-picker:focus-within {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  border-radius: 10px;
}

.month-picker .dp__input_wrap::before,
.data-picker .dp__input_wrap::before {
  content: "📅";
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  opacity: 0.6;
}

.month-picker input,
.data-picker input {
  padding-left: 36px !important;
}

.data-picker {
  border: 1px solid var(--dp-border-color);
  padding: 7px 12px;
  border-radius: 10px;
  background-color: var(--dp-background-color);
  color: var(--dp-text-color);
  font-size: var(--dp-font-size);
  font-family: var(--dp-font-family);
}

.disabled_date {
  pointer-events: none;
  cursor: not-allowed;
  opacity: 0.6;
}

.disabled_date .dp__input {
  background-color: #e2e8f0 !important;
  color: #94a3b8 !important;
}

.disabled_date .dp__input_wrap {
  background-color: #e2e8f0 !important;
}

.disabled_date input {
  cursor: not-allowed !important;
}
</style>

<!-- Header & table -->
<style scoped>
h2 {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 20px;
}

.card {
  background: #fff;
  border-radius: 12px;
  /* padding: 20px; */
  margin-bottom: 24px;

  background: #ffffff;
  border-radius: 16px;
  /* padding: 20px 24px; */
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.card:hover {
  /* transform: translateY(-2px); */
  box-shadow: 0 14px 36px rgba(15, 23, 42, 0.08);
}

/* Card */
.performance-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
  /* padding: 16px 20px 20px; */
}

.table-wrapper {
  overflow-x: auto;
}

/* Table */
.performance-table {
  /* width: 100%; */
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--border-soft);
  /* margin-top: 16px; */
}

/* Header */
.performance-table thead th {
  position: sticky;
  top: 0;
  /* background: #f8fafc; */
  color: #475569;
  font-weight: 600;
  padding: 14px 12px;
  border-bottom: 1px solid #e2e8f0;
  /* z-index: 2; */
  text-align: center;

  background: linear-gradient(180deg, #f8fafc, #f1f5f9);
  box-shadow: inset 0 -1px 0 #e2e8f0;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.04em;
}

/* Body cells */
.performance-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  text-align: center;
}

/* Sticky name column */
.sticky-col {
  position: sticky;
  left: 0;
  background: #ffffff;
  z-index: 1;
}

/* Sticky hanya nama karyawan */
.name-karyawan,
.name-col {
  position: sticky;
  left: 0;
  background: #fff;
  z-index: 3;
  box-shadow: 2px 0 6px rgba(15, 23, 42, 0.06);
  min-width: 220px;
  text-align: justify;
}

.role {
  font-size: 12px;
  color: #94a3b8;
  text-transform: capitalize;
}

/* Week & score */
.week-col,
.score-col {
  position: static;
  /* text-align: justify; */
  text-align: center;
}

.week-col {
  min-width: 300px;
}

.week-cell {
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 320px;
}

.week-cell .submenu-cell {
  display: flex;
}

/* Badge modern (soft color) */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 13px;
  width: 80px;
  cursor: default;

  position: relative;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.submenu-badge {
  /* margin-top: 6px; */
  padding: 2px 10px;
  width: 60px;
  font-size: 9px;
}

.badge:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.18);
  filter: brightness(1.05);
}

.good {
  position: relative;
  background: #fff;
  z-index: 0;
  border: 5px solid #c0b838;
}

.good::before {
  content: "";
  position: absolute;
  inset: -2px; /* ketebalan border */
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    #ffd700,
    #ffb700,
    #fff2a8,
    #ffb700,
    #ffd700
  );
  background-size: 300% 300%;
  animation: gold-run 8s linear infinite;
  z-index: -1;
}

.badge.normal {
  background: #dcfce7;
  color: #15803d;
}

.badge.bad {
  background: #fee2e2;
  color: #991b1b;
}

/* Empty */
.empty-score {
  background-color: #f5f5f5;
  color: #cbd5f5;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 13px;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.submenu-empty {
  width: 60px;
  padding: 2px 10px;
  font-size: 9px;
}

.not-list {
  text-align: center;
  padding: 40px 20px;
  background: #f8fafc;
  border-radius: 12px;
  color: #64748b;
  font-size: 14px;
}

.not-list {
  text-align: center;
  padding: 28px 20px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 500;
  /* max-width: 500px; */
  /* margin: 20px auto; */
  transition: all 0.3s ease;

  /* efek modern */
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

/* SUCCESS (HIJAU) */
.not-list.success {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  color: #065f46;
  border: 1px solid #a7f3d0;
}

/* WARNING (MERAH HALUS) */
/* .not-list.warning {
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  color: #7f1d1d;
  border: 1px solid #fecaca;
} */

/* OPTIONAL HOVER (biar ada feel interaktif) */
.not-list:hover {
  transform: translateY(-2px);
}

/* .empty-score:hover {
  cursor: default;
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.18);
  /* filter: brightness(1.05); */
</style>

<script>
import { VueDatePicker } from "@vuepic/vue-datepicker";

export default {
  components: { VueDatePicker },

  data() {
    return {
      userId: null,
      name: useCookie("name").value,
      dateMonth: null,
      dateYear: null,
      daftarKaryawan: [],
      daftarMinggu: [],
      // daftarKaryawanYear: [],
      displayPeriod: "",
      isLoading: false,
      dataType: "month",
      selectedFilter: "Performa",
      selectedWeeks: 1,
      periode: "",
    };
  },

  mounted() {
    this.setDefaultMonth();
    this.setDefaultYear();
    this.onDateChange(); // auto load pertama
  },

  computed: {
    selectedMonth() {
      return this.dateMonth?.month + 1;
    },
    selectedYear() {
      return this.dataType === "year" ? this.dateYear : this.dateMonth?.year;
    },
    totalWeeks() {
      return this.daftarKaryawan[0]?.weekly_performance.length || 0;
    },
    nameBulan() {
      let bulan = this.daftarKaryawanYear[0]?.monthly_performance.length || 0;
      console.log("Bulan: ", bulan);

      return bulan;
    },
    isNotUser() {
      return !this.daftarKaryawan.some((emp) => emp.name === this.name);
    },
    // filteredData() {
    //   // return [...this.daftarKaryawan]
    //   //   .sort((a, b) => b[this.selectedFilter] - a[this.selectedFilter])
    //   //   .map((item, index) => ({
    //   //     ...item,
    //   //     rank: index + 1,
    //   //   }));

    //   let data = this.daftarKaryawan;

    //   data = data.sort((a, b) => {
    //     return b[this.selectedFilter] - a[this.selectedFilter];
    //   });

    //   return data.map((item, index) => ({
    //     ...item,
    //     rank: index + 1,
    //   }));
    // },
  },
  methods: {
    highlightRank(rank) {
      if (rank === 1) return "rank-gold";
      if (rank === 2) return "rank-silver";
      if (rank === 3) return "rank-bronze";
    },
    setDefaultMonth() {
      const now = new Date();
      this.dateMonth = {
        month: now.getMonth(),
        year: now.getFullYear(),
      };
    },
    setDefaultYear() {
      const now = new Date();
      this.dateYear = now.getFullYear();
    },
    formatBulan(bulan) {
      const bulanNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];
      return bulanNames[bulan - 1] || "-";
    },

    onDateChange() {
      if (this.isLoading) return;

      if (this.dataType === "year") {
        if (!this.dateYear) return;
        this.displayPeriod = `Tahun ${this.dateYear}`;
        this.updateRoute({ tahun: this.dateYear });
      } else {
        if (!this.dateMonth) return;
        this.displayPeriod = `${this.formatBulan(this.selectedMonth)} ${this.selectedYear}`;
        this.updateRoute({
          bulan: this.formatBulan(this.selectedMonth),
          tahun: this.selectedYear,
        });
      }

      this.dataKaryawan();
    },
    updateRoute(query) {
      this.$router.replace({
        path: "/karyawan/gamificationsKaryawan",
        query,
      });
    },

    async dataKaryawan() {
      this.isLoading = true;

      try {
        if (this.dataType === "year") {
          const res = await this.$api.get(
            `/api/v1/workload/leaderboard?year=${this.dateYear}&by=${this.selectedFilter}`,
          );
          this.daftarKaryawan = res.data.leaderboard || [];
          this.periode = res.data.periode_ui;
        } else if (this.dataType === "month") {
          const res = await this.$api.get(
            `/api/v1/workload/leaderboard?month=${this.selectedMonth}&year=${this.selectedYear}&by=${this.selectedFilter}`,
          );
          this.daftarKaryawan = res.data.leaderboard || [];
          this.periode = res.data.periode_ui;
        }

        // this.daftarMinggu = res.data.weeks || [];
        // this.daftarKaryawanYear = [];
        // this.displayPeriod = res.data.display_period;

        console.log("data per minggu: ", this.daftarKaryawan);
      } catch (err) {
        console.error(err);
        this.daftarKaryawan = [];
        // this.daftarKaryawanYear = [];
      } finally {
        this.isLoading = false;
      }
    },

    // cekDetail(emp, week) {
    //   if (!emp.clickup_id) {
    //     console.warn("clickup_id kosong");
    //     return;
    //   }

    //   const { start_date, end_date } = week;

    //   console.log("ID:", emp.clickup_id);
    //   console.log("Start:", this.formatTanggal(start_date));
    //   console.log("End:", this.formatTanggal(end_date));

    //   this.$router.push({
    //     path: "/admin/bebanKerja",
    //     query: {
    //       id: emp.clickup_id,
    //       start: this.formatTanggal(start_date),
    //       end: this.formatTanggal(end_date),
    //       source: "Performa Mingguan",
    //     },
    //   });
    // },

    badgeClass(score) {
      // if (score > 100) return "good";
      // if (score >= 85 && score <= 100) return "normal";
      // return "bad";

      if (score === "++") return "good";
      if (score === "+") return "normal";
      if (score === "-") return "bad";
    },

    formatScore(score) {
      return `${Math.round(score)}%`;
    },
    formatTanggal(tgl) {
      if (!tgl) return "-";
      const [year, month, day] = tgl.split("-");
      return `${day}-${month}-${year}`;
      // if (!tgl) return "-";
      // const [day, month, year] = tgl.split("-");
      // return `${year}-${month}-${day}`;
    },
  },
  watch: {
    dataType(newVal) {
      if (newVal === "year") {
        // this.dateMonth = null;
        this.setDefaultYear();
      } else {
        this.setDefaultMonth();
      }

      this.onDateChange();
    },
    selectedFilter() {
      this.dataKaryawan();
    },
  },
};
</script>
