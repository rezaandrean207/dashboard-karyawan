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
              <th class="sticky-col">Nama Karyawan</th>
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
                :key="i"
                class="score-col"
              >
                <span
                  v-if="week.workload_score !== 0"
                  class="badge"
                  :class="badgeClass(week.workload_score)"
                >
                  {{ week.workload_score }}%
                </span>

                <span v-else class="empty-score">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Legend -->
      <div class="legend modern">
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
      </div>
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
.subtitle {
  color: #6b7280;
  margin-bottom: 16px;
}

.card {
  background: #fff;
  border-radius: 12px;
  /* padding: 20px; */
  margin-bottom: 24px;
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
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  padding: 14px 12px;
  border-bottom: 1px solid #e2e8f0;
  z-index: 2;
  text-align: justify;
}

/* Body cells */
.performance-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

/* Hover row */
.performance-table tbody tr:hover {
  background: #f8fafc;
}

/* Sticky name column */
.sticky-col {
  position: sticky;
  left: 0;
  background: #ffffff;
  z-index: 1;
}

.performance-table tbody tr:hover .sticky-col {
  background: #f8fafc;
}

/* Name */
.name-col {
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
  text-align: justify;
  min-width: 100px;
}

/* Badge modern (soft color) */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 13px;
}

/* Soft variants */
.badge.good {
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
  color: #cbd5f5;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 13px;
}
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

    onDateChange() {
      if (!this.date || this.isLoading) return;
      this.dataKaryawan();
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

    badgeClass(score) {
      if (score > 100) return "good";
      if (score >= 85 && score <= 100) return "normal";
      return "bad";
    },

    formatScore(score) {
      return `${Math.round(score)}%`;
    },
  },
};
</script>
