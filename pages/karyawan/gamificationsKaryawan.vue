<template>
  <div v-if="isLoading" class="loading">
    <div class="loading_tanggal">
      <i class="fa-solid fa-spinner"></i>
      <p>Tunggu Sebentar</p>
    </div>
  </div>

  <div class="isi">
    <!-- Header -->
    <h2>Performa Mingguan -</h2>
    <p class="subtitle">Jumlah minggu: minggu</p>

    <!-- Filter -->
    <div class="card filter-card">
      <div class="filter-header">
        <h4>Filter Periode</h4>
      </div>

      <div class="filter-row">
        <div class="filter-item">
          <label>Bulan</label>
          <div class="dates-wrapper">
            <ClientOnly>
              <VueDatePicker
                format="dd-MM-yyyy"
                v-model="start"
                model-type="yyyy-MM-dd"
                :time-config="{ enableTimePicker: false }"
                class="data-picker"
            /></ClientOnly>
            <span class="separator">➡️</span>
            <ClientOnly>
              <VueDatePicker
                format="dd-MM-yyyy"
                v-model="end"
                model-type="yyyy-MM-dd"
                :time-config="{ enableTimePicker: false }"
                class="data-picker"
            /></ClientOnly>
          </div>
        </div>
      </div>
    </div>

    <div class="card performance-card" v-if="daftarKaryawan.length">
      <div class="table-wrapper">
        <table class="table performance-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Nama Karyawan</th>
              <th>Role</th>
              <th>Task Selesai</th>
              <th>Skor</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="emp in daftarKaryawan"
              :key="emp.rank"
              :class="{ isUser: emp.clickup_id === userId }"
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
              </td>

              <td>
                <span class="role-badge">
                  {{ emp.role }}
                </span>
              </td>

              <td>{{ emp.tasks_completed }}</td>

              <td>
                <span
                  class="badge main-badge"
                  :class="badgeClass(emp.category)"
                >
                  {{ Math.round(emp.performance_score) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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

.isUser {
  background: rgba(37, 99, 235, 0.08);
  border-left: 2px solid #2563eb;
}

.rank-badge {
  /* background: #f1f5f9; */
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 600;
}

.role-badge {
  background: #e2e8f0;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  text-transform: capitalize;
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
}

/* Item */
.filter-item {
  max-width: 360px;
  width: 100%;
}

.dates-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
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

.emp-name {
  text-align: justify;
  width: 280px;
}

/* .empty-score:hover {
  cursor: default;
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.18);
  /* filter: brightness(1.05); */
</style>

<script>
import { VueDatePicker } from "@vuepic/vue-datepicker";

definePageMeta({
  layout: "dashboard-karyawan",
});

export default {
  components: { VueDatePicker },

  data() {
    return {
      start: "",
      end: "",
      daftarKaryawan: [],
      isLoading: false,
      userId: null,
    };
  },

  mounted() {
    this.setDefaultDate();
    this.dataKaryawan();

    // function aksesCookie() {
    //   const id = useCookie("clickup_id").value;

    //   console.log("clickup_id:", id);
    // }
    // aksesCookie();
  },

  computed: {},
  methods: {
    setDefaultDate() {
      if (this.start && this.end) return;
      const today = new Date();
      const firstDay = new Date();
      // sevenDaysAgo.setDate(today.getDate() - 30);
      firstDay.setDate(1);

      // Format ke YYYY-MM-DD (format input type="date")
      const format = (date) => date.toISOString().split("T")[0];

      this.start = format(firstDay);
      this.end = format(today);

      this.onDateChange();
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

    highlightRank(rank) {
      if (rank === 1) return "rank-gold";
      if (rank === 2) return "rank-silver";
      if (rank === 3) return "rank-bronze";
    },
    onDateChange() {
      if (!this.start || !this.end) return;
      if (this.isLoading) return;

      // this.$router.replace({
      //   path: "/admin/gamifications",
      //   query: {
      //     ...this.$route.query,
      //     start: this.start,
      //     end: this.end,
      //   },
      // });

      this.dataKaryawan();
    },

    async dataKaryawan() {
      this.isLoading = true;

      try {
        const res = await this.$api.get(
          `/api/v1/workload/leaderboard?start_date=${this.formatTanggal(this.start)}&end_date=${this.formatTanggal(this.end)}`,
        );

        this.daftarKaryawan = res.data.leaderboard || [];
        this.userId = useCookie("clickup_id").value;

        console.log("Clickup Id kamu: ", this.userId);

        console.log("Data karyawan berhasil diambil:", this.daftarKaryawan);
      } catch (err) {
        console.error(err);
        this.daftarKaryawan = [];
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
    // start() {
    //   this.onDateChange();
    // },
    // end() {
    //   this.onDateChange();
    // },
    start: "onDateChange",
    end: "onDateChange",
  },
};
</script>
