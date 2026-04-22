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
    <div class="filter">
      <div class="title">
        <i class="fa-solid fa-filter"></i>
        <p>Filter Periode</p>
      </div>

      <div class="filter-detail">
        <div class="filter-item">
          <label>Tahun</label>
          <ClientOnly>
            <VueDatePicker
              v-model="dateYear"
              year-picker
              :formats="{ year: 'yo' }"
              :disabled="dataType === 'month'"
              :class="{ disabled_date: dataType === 'month' }"
              @update:model-value="onDateChange"
            />
          </ClientOnly>
        </div>

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
            />
          </ClientOnly>
        </div>
        <div class="filter-item">
          <label>Filter Data</label>
          <ClientOnly>
            <n-select
              v-model:value="dataType"
              :options="[
                { label: 'Mingguan', value: 'month' },
                { label: 'Bulanan', value: 'year' },
              ]"
            ></n-select>
          </ClientOnly>
          <!-- <select name="" id="" v-model="dataType" class="data-picker">
            <option value="month">Mingguan</option>
            <option value="year">Bulanan</option>
          </select> -->
        </div>
      </div>
    </div>

    <!-- Performa per bulan-->
    <div
      class="card performance-card"
      v-if="daftarKaryawan.length && dataType === 'month'"
    >
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

              <td v-for="(week, i) in emp.weekly_performance" :key="i">
                <div class="week-cell">
                  <div class="main-cell">
                    <small class="label-title">Performa</small>
                    <!-- Performa -->
                    <span
                      v-if="week.score.value !== 0 && week.score.value !== null"
                      class="badge main-badge"
                      @click="cekDetail(emp, week)"
                      :class="badgeClass(week.score.category)"
                    >
                      {{ week.score.value }}%
                    </span>

                    <span v-else class="empty-score main-empty">—</span>
                  </div>

                  <div class="submenu-cell">
                    <div class="submenu-item">
                      <small class="label-sub">Tepat Waktu</small>
                      <!-- Tepat Waktu Kerja -->
                      <span
                        v-if="
                          week.tepat_waktu_kerja.value !== 0 &&
                          week.tepat_waktu_kerja.value !== null
                        "
                        class="badge submenu-badge"
                        @click="cekDetail(emp, week)"
                        :class="badgeClass(week.tepat_waktu_kerja.category)"
                      >
                        {{ week.tepat_waktu_kerja.value }}%
                      </span>

                      <span v-else class="empty-score submenu-empty">—</span>
                    </div>

                    <div class="submenu-item">
                      <small class="label-sub">Beban Kerja</small>
                      <!-- Total Beban Kerja -->
                      <span
                        v-if="
                          week.total_beban_kerja.value !== 0 &&
                          week.total_beban_kerja.value !== null
                        "
                        class="badge submenu-badge"
                        @click="cekDetail(emp, week)"
                        :class="badgeClass(week.total_beban_kerja.category)"
                      >
                        {{ week.total_beban_kerja.value }}%
                      </span>

                      <span v-else class="empty-score submenu-empty">—</span>
                    </div>

                    <div class="submenu-item">
                      <small class="label-sub">Performa Bug</small>
                      <!-- Performa Bug -->
                      <span
                        v-if="
                          week.performa_bug?.value !== 0 &&
                          week.performa_bug?.value !== null
                        "
                        class="badge submenu-badge"
                        @click="cekDetail(emp, week)"
                        :class="badgeClass(week.performa_bug?.category)"
                      >
                        {{ week.performa_bug?.value }}%
                      </span>
                      <span v-else class="empty-score submenu-empty">—</span>
                    </div>
                  </div>
                </div>
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

    <!-- Performa per tahun-->
    <div
      class="card performance-card"
      v-if="daftarKaryawanYear.length && dataType === 'year'"
    >
      <div class="table-wrapper">
        <table class="table performance-table">
          <thead>
            <tr>
              <th class="sticky-col name-karyawan">Nama Karyawan</th>
              <th v-for="n in nameBulan" :key="n" class="week-col">
                {{ formatBulan(n) }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="emp in daftarKaryawanYear" :key="emp.clickup_id">
              <td class="name-col sticky-col">
                <strong>{{ emp.name }}</strong>
                <div class="role">{{ emp.role }}</div>
              </td>

              <td v-for="(week, i) in emp.monthly_performance" :key="i">
                <div class="week-cell">
                  <div class="main-cell">
                    <small class="label-title">Performa</small>
                    <!-- Performa -->
                    <span
                      v-if="week.score.value !== 0 && week.score.value !== null"
                      class="badge main-badge"
                      @click="cekDetail(emp, week)"
                      :class="badgeClass(week.score.category)"
                    >
                      {{ week.score.value }}%
                    </span>

                    <span v-else class="empty-score main-empty">—</span>
                  </div>

                  <div class="submenu-cell">
                    <div class="submenu-item">
                      <small class="label-sub">Tepat Waktu</small>
                      <!-- Tepat Waktu Kerja -->
                      <span
                        v-if="
                          week.tepat_waktu_kerja.value !== 0 &&
                          week.tepat_waktu_kerja.value !== null
                        "
                        class="badge submenu-badge"
                        @click="cekDetail(emp, week)"
                        :class="badgeClass(week.tepat_waktu_kerja.category)"
                      >
                        {{ week.tepat_waktu_kerja.value }}%
                      </span>

                      <span v-else class="empty-score submenu-empty">—</span>
                    </div>

                    <div class="submenu-item">
                      <small class="label-sub">Beban Kerja</small>
                      <!-- Total Beban Kerja -->
                      <span
                        v-if="
                          week.total_beban_kerja.value !== 0 &&
                          week.total_beban_kerja.value !== null
                        "
                        class="badge submenu-badge"
                        @click="cekDetail(emp, week)"
                        :class="badgeClass(week.total_beban_kerja.category)"
                      >
                        {{ week.total_beban_kerja.value }}%
                      </span>

                      <span v-else class="empty-score submenu-empty">—</span>
                    </div>

                    <div class="submenu-item">
                      <small class="label-sub">Performa Bug</small>
                      <!-- Performa Bug -->
                      <span
                        v-if="
                          week.performa_bug?.value !== 0 &&
                          week.performa_bug?.value !== null
                        "
                        class="badge submenu-badge"
                        @click="cekDetail(emp, week)"
                        :class="badgeClass(week.performa_bug?.category)"
                      >
                        {{ week.performa_bug?.value }}%
                      </span>
                      <span v-else class="empty-score submenu-empty">—</span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

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
  max-height: 55vh;
}

/* Table */
.performance-table {
  /* width: 100%; */
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
}

.table {
  /* width: 100%; */
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
  /* text-align: justify; */

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

/* Sticky name column */
.sticky-col {
  position: sticky;
  left: 0;
  background: #ffffff;
  z-index: 1;
}

.name-karyawan {
  z-index: 4;
}

/* Sticky hanya nama karyawan */
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
  z-index: 2;
}

.week-cell {
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 320px;
}

.week-cell .submenu-cell {
  display: flex;
  gap: 6px;
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
  height: 25px;
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
  /* width: 60px; */
  padding: 2px 10px;
  font-size: 9px;
  width: 60px;
  height: 25px;
}

/* .empty-score:hover {
  cursor: default;
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.18);
  /* filter: brightness(1.05); */

.label-title {
  font-size: 11px;
  color: #000000;
  display: block;
  padding-left: 3px;
  /* margin-bottom: 4px; */
}

.label-sub {
  font-size: 8px;
  color: #000000;
  display: block;
  margin-bottom: 2px;
}

.submenu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
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
import { formatTanggal } from "@/utils/helpers";
export default {
  data() {
    return {
      dateMonth: null,
      dateYear: null,
      daftarKaryawan: [],
      daftarKaryawanYear: [],
      displayPeriod: "",
      isLoading: false,
      dataType: "month",
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
  },

  methods: {
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
        // this.dateMonth = null;

        this.$router.replace({
          path: "/admin/weekPerform",
          query: {
            ...this.$route.query,
            tahun: this.dateYear,
          },
        });
      } else {
        if (!this.dateMonth) return;

        this.displayPeriod = `${this.formatBulan(this.selectedMonth)} ${this.selectedYear}`;

        this.$router.replace({
          path: "/admin/weekPerform",
          query: {
            ...this.$route.query,
            bulan: this.formatBulan(this.selectedMonth),
            tahun: this.selectedYear,
          },
        });
      }

      this.dataKaryawan();
    },

    async dataKaryawan() {
      this.isLoading = true;

      try {
        if (this.dataType === "year") {
          const res = await this.$api.get(
            `/api/v1/workload/weekly?year=${this.dateYear}`,
          );

          this.daftarKaryawanYear = res.data.data || [];

          console.log("data per bulan: ", res);

          this.daftarKaryawan = [];
        } else {
          const res = await this.$api.get(
            `/api/v1/workload/weekly?month=${this.selectedMonth}&year=${this.selectedYear}`,
          );

          this.daftarKaryawan = res.data.data || [];
          this.daftarKaryawanYear = [];
          this.displayPeriod = res.data.display_period;

          console.log("data per minggu: ", res);
        }
      } catch (err) {
        console.error(err);
        this.daftarKaryawan = [];
        this.daftarKaryawanYear = [];
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
      console.log("Start:", formatTanggal(start_date));
      console.log("End:", formatTanggal(end_date));
      this.$router.push({
        path: "/admin/bebanKerja",
        query: {
          id: emp.clickup_id,
          start: formatTanggal(start_date),
          end: formatTanggal(end_date),
          source: "Performa Mingguan",
        },
      });
    },

    badgeClass(score) {
      if (score === "++") return "good";
      if (score === "+") return "normal";
      if (score === "-") return "bad";
    },

    formatScore(score) {
      return `${Math.round(score)}%`;
    },
  },
  watch: {
    dataType(newVal) {
      if (newVal === "year") {
        this.dateMonth = null;
      } else {
        this.setDefaultMonth();
      }

      this.onDateChange();
    },
  },
};
</script>
