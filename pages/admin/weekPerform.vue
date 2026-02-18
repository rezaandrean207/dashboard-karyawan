<template>
  <div v-if="isLoading" class="loading">
    <div class="loading_tanggal">
      <i class="fa-solid fa-spinner"></i>
      <p>Tunggu Sebentar</p>
    </div>
  </div>

  <div class="isi">
    <!-- Header -->
    <h2>Performa Mingguan - {{ displayPeriod }}</h2>
    <p class="subtitle">Jumlah minggu: {{ totalWeeks }} minggu</p>

    <!-- Filter -->
    <div class="card filter-card">
      <div class="filter-header">
        <h4>Filter Periode</h4>
      </div>

      <div class="filter-row">
        <div class="filter-item">
          <label>Bulan</label>
          <ClientOnly>
            <VueDatePicker
              v-model="date"
              month-picker
              :formats="{ month: 'LLLL' }"
              @update:model-value="onDateChange"
              class="month-picker"
            />
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Performa -->
    <div class="card performance-card" v-if="daftarKaryawan.length">
      <div class="table-wrapper">
        <table class="table performance-table">
          <thead>
            <tr>
              <th class="sticky-col name-karyawan">Nama Karyawan</th>
              <th v-for="n in totalWeeks" :key="n" class="week-col">
                Minggu {{ n }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="emp in daftarKaryawan" :key="emp.clickup_id">
              <td class="name-col sticky-col">
                <strong>{{ emp.name }}</strong>
                <div class="role">{{ emp.role }}</div>
              </td>

              <td
                v-for="(week, i) in emp.weekly_performance"
                @click="cekDetail(emp, week)"
                :key="i"
                class="score-col"
              >
                <span
                  v-if="week.score !== 0 && week.score !== null"
                  class="badge"
                  :class="badgeClass(week.category)"
                >
                  {{ week.score }}%
                </span>

                <span v-else class="empty-score">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Legend -->
      <!-- <div class="legend modern">
        <div class="legend-item good">
          <span class="dot"></span>
          ≥ 85% <small>Baik</small>
        </div>
        <div class="legend-item medium">
          <span class="dot"></span>
          70–84% <small>Cukup</small>
        </div>
        <div class="legend-item bad">
          <span class="dot"></span>
          &lt; 70% <small>Kurang</small>
        </div>
      </div> -->
    </div>
  </div>
</template>

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

/* Label */
.filter-item label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 6px;
}

/* Date picker wrapper */
.month-picker {
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

.month-picker {
  transition: all 0.2s ease;
}

/* Focus state */
.month-picker:focus-within {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  border-radius: 10px;
}

.month-picker .dp__input_wrap::before {
  content: "📅";
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  opacity: 0.6;
}

.month-picker input {
  padding-left: 36px !important;
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
  width: 100%;
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
  text-align: justify;

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
}

/* Hover row */
/* .performance-table tbody tr:hover {
  background: #f8fafc;
} */

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
  text-align: justify;
  min-width: 100px;
}

/* Badge modern (soft color) */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
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

/* .empty-score:hover {
  cursor: default;
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.18);
  /* filter: brightness(1.05); */

</style>

<!-- Legend -->
<style scoped>
.legend {
  display: flex;
  gap: 16px;
  margin-top: 20px;
  flex-wrap: wrap;
}

/* Item */
/* Legend modern */
.legend.modern {
  display: flex;
  gap: 14px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed #e2e8f0;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #f8fafc;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: #334155;
}

.legend-item small {
  color: #64748b;
  font-weight: 400;
}

.legend-item .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-item.good .dot {
  background: #22c55e;
}

.legend-item.medium .dot {
  background: #facc15;
}

.legend-item.bad .dot {
  background: #ef4444;
}
</style>

<script>
import { VueDatePicker } from "@vuepic/vue-datepicker";

definePageMeta({
  layout: "dashboard",
});

export default {
  components: { VueDatePicker },

  data() {
    return {
      date: null,
      daftarKaryawan: [],
      displayPeriod: "",
      isLoading: false,
    };
  },

  mounted() {
    this.setDefaultMonth();
    this.onDateChange(); // auto load pertama
  },

  computed: {
    selectedMonth() {
      return this.date?.month + 1;
    },
    selectedYear() {
      return this.date?.year;
    },
    totalWeeks() {
      return this.daftarKaryawan[0]?.weekly_performance.length || 0;
    },
  },

  methods: {
    setDefaultMonth() {
      const now = new Date();
      this.date = {
        month: now.getMonth(),
        year: now.getFullYear(),
      };
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
      if (!this.date || this.isLoading) return;
      this.dataKaryawan();

      this.$router.replace({
        path: "/admin/weekPerform",
        query: {
          ...this.$route.query, // 🔥 PENTING
          bulan: this.formatBulan(this.selectedMonth),
          tahun: this.selectedYear,
        },
      });
    },

    async dataKaryawan() {
      this.isLoading = true;
      try {
        const res = await this.$api.get(
          `/api/v1/workload/weekly?month=${this.selectedMonth}&year=${this.selectedYear}`,
        );

        this.daftarKaryawan = res.data.data;
        this.displayPeriod = res.data.display_period;
      } catch (err) {
        console.error(err);
        this.daftarKaryawan = [];
      } finally {
        this.isLoading = false;
      }
    },
    cekDetail(emp, week) {
      if (!emp.clickup_id) {
        console.warn("clickup_id kosong");
        return;
      }

      const { start_date, end_date } = week;

      console.log("ID:", emp.clickup_id);
      console.log("Start:", this.formatTanggal(start_date));
      console.log("End:", this.formatTanggal(end_date));

      this.$router.push({
        path: "/admin/bebanKerja",
        query: {
          id: emp.clickup_id,
          start: this.formatTanggal(start_date),
          end: this.formatTanggal(end_date),
          source: "Performa Mingguan",
        },
      });
    },

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
      // if (!tgl) return "-";
      // const [year, month, day] = tgl.split("-");
      // return `${day}-${month}-${year}`;
      if (!tgl) return "-";
      const [day, month, year] = tgl.split("-");
      return `${year}-${month}-${day}`;
    },
  },
};
</script>
