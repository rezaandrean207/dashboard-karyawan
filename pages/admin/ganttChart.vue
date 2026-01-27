<template>
  <div v-if="isLoading" class="loading">
    <div class="loading_tanggal">
      <i class="fa-solid fa-spinner"></i>
      <p>Tunggu Sebentar</p>
    </div>
  </div>
  <div class="isi" :class="{ viewApp: isAppView }">
    <!-- <h2>Gantt Chart</h2>
    <p>Daftar task karyawan menggunakan chart</p> -->

    <!-- Filter -->

    <!-- Filter Tanggal Gantt dan Assignee -->
    <div class="filter-gant">
      <div class="search-tanggal">
        <div class="dates-gant">
          <!-- <label for="tanggal">Tanggal</label> -->
          <div class="tanggal">
            <VueDatePicker
              format="dd-MM-yyyy"
              v-model="startDate"
              model-type="yyyy-MM-dd"
              :time-config="{ enableTimePicker: false }"
            />
            <span class="separator">➡️</span>
            <VueDatePicker
              format="dd-MM-yyyy"
              v-model="endDate"
              model-type="yyyy-MM-dd"
              :time-config="{ enableTimePicker: false }"
            />
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
      </div>

      <!-- Assignee to -->
      <div class="multi-select">
        <div class="select-box" @click="openAssignee = !openAssignee">
          <span class="selected-text" v-if="selected.length">
            {{ selected.join(", ") }}
          </span>
          <span v-else class="placeholder">Pilih assignee</span>
          <span
            class="material-symbols-outlined arrow"
            :class="{ open: openAssignee }"
          >
            keyboard_arrow_down
          </span>
        </div>

        <div class="dropdown" v-if="openAssignee" @click.stop>
          <label
            v-for="assignee in assigneeOptions"
            :key="assignee"
            class="option"
          >
            <input type="checkbox" :value="assignee" v-model="selected" />
            {{ assignee }}
          </label>
        </div>
      </div>

      <!-- Status Task -->
      <div class="multi-select">
        <div class="select-box" @click="openStatus = !openStatus">
          <span class="selected-text" v-if="selectedStatus.length">
            {{ selectedStatus.join(", ") }}
          </span>
          <span v-else class="placeholder">Pilih assignee</span>
          <span
            class="material-symbols-outlined arrow"
            :class="{ open: openStatus }"
          >
            keyboard_arrow_down
          </span>
        </div>

        <div class="dropdown" v-if="openStatus" @click.stop>
          <label
            v-for="status in statusOptions"
            :key="status.value"
            class="option"
          >
            <input
              type="checkbox"
              :value="status.value"
              v-model="selectedStatus"
            />
            {{ status.label }}
          </label>
        </div>
      </div>
    </div>

    <div class="kalender">
      <div class="gantt-wrapper">
        <div class="header-container" :style="{ minWidth: totalWidth + 'px' }">
          <!-- <div class="header-name">
            <p>Name</p>
          </div> -->
          <div class="header-gant">
            <div class="dates-range">
              <p>{{ startDate }} - {{ endDate }}</p>
            </div>
            <div
              class="daftar-tanggal"
              :style="{ minWidth: totalWidth + 'px' }"
            >
              <div
                class="hari-tanggal"
                :class="{ weekend: isWeekend(item), holiday: isHoliday(item) }"
                v-for="(item, index) in flatDates"
                :key="index"
              >
                <p>
                  {{ item.day
                  }}<span v-if="item.day === 1">/{{ item.month }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="container-task" :style="{ minWidth: totalWidth + 'px' }">
          <div class="no-task" v-if="filteredTask.length === 0">
            <span class="icon">📭</span>
            <p>Task belum tersedia</p>
          </div>
          <div
            class="task-row"
            v-else
            v-for="(task, index) in filteredTask"
            :key="`${task.assignee_to}-${task.id}`"
            style="min-height: 44px"
          >
            <div class="task-timeline" :style="{ minWidth: totalWidth + 'px' }">
              <div
                class="task-assignee"
                :style="{
                  marginLeft:
                    Math.max(0, dayDiff(startDate, task.start_date)) * 100 +
                    'px',

                  width:
                    (Math.min(
                      dayDiff(startDate, task.due_date),
                      dayDiff(startDate, endDate),
                    ) -
                      Math.max(0, dayDiff(startDate, task.start_date)) +
                      1) *
                      100 +
                    'px',

                  // top: '8px',
                }"
              >
                {{ task.assignee_to }}
              </div>
              <div
                class="task-bar"
                :class="taskBarClass(task.role)"
                :style="{
                  marginLeft: taskOffset(task) * 100 + 'px',
                  width: taskWidth(task) + 'px',

                  // top: '8px',
                }"
              >
                <p>{{ task.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Conditioning Colour -->
<style scoped>
.task_selesai {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border: none;
}

.task_inProgress {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border: none;
  color: #78350f;
}

.task_todo {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
  border: none;
}

.task_inReview {
  background: linear-gradient(135deg, #14b8a6, #0d9488);
  border: none;
}

.task_cancelled {
  background: linear-gradient(135deg, #f87171, #ef4444);
  border: none;
}

.infra {
  background: linear-gradient(135deg, #4b6cb7, #182848);
  border: none;
  color: #ffffff;
}

.backend {
  background: linear-gradient(135deg, #2e8b8b, #0f766e);
  border: none;
  color: #ffffff;
}

.web {
  background: linear-gradient(135deg, #4fc3f7, #0284c7);
  border: none;
  color: #ffffff;
}

.mobile {
  background: linear-gradient(135deg, #6366f1, #4338ca);
  border: none;
  color: #ffffff;
}

.analis {
  background: linear-gradient(135deg, #fbbf24, #d97706);
  border: none;
  color: #78350f;
}

.ui-ux {
  background: linear-gradient(135deg, #a855f7, #7e22ce);
  border: none;
  color: #ffffff;
}

.pm {
  background: linear-gradient(135deg, #2e7d32, #166534);
  border: none;
  color: #ffffff;
}
</style>

<!-- Style multi select -->
<style scoped>
/* Gaya Utama (Desktop) */
.multi-select {
  width: 25%;
  position: relative;
  font-size: 14px;
  z-index: 98;
}

.select-box {
  min-height: 38px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.select-box:hover {
  border-color: #3b82f6;
}

.select-box:focus-within {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

/* TEXT */
.selected-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ARROW */
.arrow {
  font-size: 20px;
  color: #6b7280;
  transition: transform 0.2s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

.placeholder {
  color: #9ca3af;
}

/* DROPDOWN */
.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  padding: 6px;
  max-height: 220px;
  overflow-y: auto;
  animation: dropdownIn 0.15s ease;
  z-index: 99;
}

@keyframes dropdownIn {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* OPTION */
.option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.option:hover {
  background: #f1f5f9;
}

.option input {
  accent-color: #2563eb;
}

/* MOBILE */
@media (max-width: 768px) {
  .multi-select {
    width: 100%;
  }
}
</style>

<!-- Style Filter -->
<style scoped>
.filter-gant {
  flex-wrap: wrap;
  display: flex;
  align-items: center;
  /* border: 1px solid #010101; */
  margin-top: 20px;
  gap: 10px;
  /* width: 100%; */
}

.search-tanggal {
  display: flex;
  /* margin-top: 20px; */
  gap: 20px;
  /* width: 35%; */
}

.dates-gant {
  /* border: 1px solid #eee; */
  width: 100%;
}

.dates-gant .tanggal {
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: var(--borderCard); */
  border-radius: 5px;
  /* padding: 10px 15px; */
  gap: 5px;
  /* background-color: #fff; */
}
</style>

<style scoped>
/* SCROLL VIEWPORT */
.kalender {
  max-height: 80vh;
  overflow: auto;
  margin: 20px 0;
  padding-bottom: 10px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.header-container {
  display: flex;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 90;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.header-name {
  padding: 26px 0;
  flex-shrink: 0;
  width: 200px;
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  position: sticky;
  /* top: 0; */
  left: 0;
  z-index: 90;
  background: #ffffff;
  color: #111827;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.header-gant {
}

/* CANVAS PANJANG */
.gantt-wrapper {
  min-height: 100%;
  /* background: #f7f7f7; */
}

/* HEADER RANGE */
.dates-range {
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 20%;
  background: #f9fafb;
  color: #374151;
  border-right: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 9;
}

/* HEADER TANGGAL */
.daftar-tanggal {
  display: flex;
  height: 40px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.hari-tanggal {
  width: 100px;
  text-align: center;
  line-height: 40px;
  border-right: 1px solid #aeb0b3;
  color: #6b7280;
  font-size: 13px;
  flex-shrink: 0;
}

.weekend {
  /* background: #fef2f2;
  color: #b91c1c; */
  /* background: #f5f5f5; */
  background: #f3f4f6;
  color: grey;
  border-left: 1px solid #e5e7eb;
}

.holiday {
  background: linear-gradient(135deg, #fdecea, #fbd5d5);
}

.task-row {
  /* height: 40px; */
  display: flex;
  position: relative;
  min-height: 40px;
  background: #ffffff;
}

.task-name {
  flex-shrink: 0;
  width: 200px;
  background: #ffffff;
  color: #1f2937;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  padding-left: 10px;
  position: sticky;
  /* top: 0; */
  left: 0;
  z-index: 89;
}

.task-assignee {
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  /* margin-bottom: 4px; */
  padding-left: 4px;
}

.task-timeline {
  position: relative;
  background: repeating-linear-gradient(
    to right,
    #ffffff 0px,
    #fbfbfb 99px,
    #dbdee1 100px
  );
  /* border-bottom: 1px solid #e5e7eb; */
}

.task-bar {
  position: relative;
  text-align: center;
  text-wrap: wrap;
  min-height: 28px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 12px;
  color: #ffffff;
  white-space: normal; /* IZINKAN TURUN BARIS */
  word-break: break-word; /* potong kata panjang */
  line-height: 1.4;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transition:
    /* transform 0.2s ease, */
    box-shadow 0.2s ease,
    transform 0.15s ease,
    filter 0.15s ease;
  cursor: pointer;

  /* transition:
    transform 0.15s ease,
    filter 0.15s ease; */
}

.task-bar:hover {
  transform: translateY(-1px);
  filter: brightness(1.08);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
  z-index: 20;
}

.no-task {
  height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 12px;

  background: #f9fafb;
  border-left: 3px solid #e5e7eb;
  color: #6b7280;

  font-size: 13px;
  font-style: italic;
}
</style>

<script>
definePageMeta({
  layout: "dashboard",
});

import { VueDatePicker } from "@vuepic/vue-datepicker";

export default {
  data() {
    return {
      startDate: "",
      endDate: "",
      tanggalPerBulan: {},
      daftarTask: [],
      openAssignee: false,
      openStatus: false,
      isLoading: false,
      selected: [], // assignee
      selectedStatus: [], // status_name
    };
  },
  components: {
    VueDatePicker,
  },
  mounted() {
    this.setDefaultTanggal();
    this.tanggalPerBulan = this.generateDateRange(this.startDate, this.endDate);
    // this.ambilTask();
  },
  methods: {
    taskBarClass(role) {
      return {
        infra: role === "infra",
        backend: role === "backend",
        web: role === "web",
        mobile: role === "mobile apps",
        analis: role === "analis",
        "ui-ux": role === "UI-UX",
        pm: role === "pm",
      };
    },

    // filterAssignee() {
    //   if (this.selected.length === 0) {
    //     this.filteredTask = this.daftarTask;
    //     return;
    //   }

    //   this.filteredTask = this.daftarTask.filter((task) =>
    //     this.selected.includes(task.assignee),
    //   );
    // },

    onDateChange() {
      if (!this.startDate || !this.endDate) return;
      if (this.isLoading) return;

      const tanggalMulai = new Date(this.startDate);
      const tanggalAkhir = new Date(this.endDate);

      // normalisasi range
      if (tanggalMulai > tanggalAkhir) {
        this.endDate = this.startDate;
        return;
      }
      // const format = (date) => date.toISOString().split("T")[0];

      // regenerate kalender
      this.tanggalPerBulan = this.generateDateRange(
        this.startDate,
        this.endDate,
      );

      this.ambilTask();
    },
    formatTanggal(tgl) {
      const [year, month, day] = tgl.split("-");
      return `${day}-${month}-${year}`;
    },

    setDefaultTanggal() {
      if (this.startDate && this.endDate) return;
      const today = new Date();
      const firstDay = new Date();
      // sevenDaysAgo.setDate(today.getDate() - 30);
      firstDay.setDate(1);

      // Format ke YYYY-MM-DD (format input type="date")
      const format = (date) => date.toISOString().split("T")[0];

      this.startDate = format(firstDay);
      this.endDate = format(today);

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
    async ambilTask() {
      console.log("Task sedang di proses");
      this.isLoading = true;

      try {
        const task = await this.$api.get(
          `/api/v1/gantt/tasks?start_date=${this.formatTanggal(this.startDate)}&end_date=${this.formatTanggal(this.endDate)}`,
        );

        this.daftarTask = task.data;
        // this.filteredTask = this.daftarTask;

        console.log("daftar task", this.daftarTask);
      } catch (err) {
        console.log("Gagal mengambil task", err);
      } finally {
        this.isLoading = false;
      }
    },

    toDate(dateStr) {
      if (!dateStr) return null;

      // YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return new Date(dateStr + "T00:00:00");
      }

      // DD-MM-YYYY HH:mm:ss
      const [date] = dateStr.split(" ");
      const [d, m, y] = date.split("-");
      return new Date(y, m - 1, d);
    },

    generateDateRange(start, end) {
      const result = {};
      let current = new Date(start);
      const endDate = new Date(end);

      while (current <= endDate) {
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, "0");
        const day = current.getDate();

        const key = `${year}-${month}`;

        if (!result[key]) {
          result[key] = [];
        }

        result[key].push(day);

        current.setDate(current.getDate() + 1);
      }

      return result;
    },
    isWeekend(item) {
      const [year, month] = item.month.split("-");
      const date = new Date(year, month - 1, item.day);

      return date.getDay() === 0 || date.getDay() === 6;
    },
    isHoliday(item) {
      const holidays = this.daftarTask.holidays || [];

      const [year, month] = item.month.split("-");
      const dateStr = `${item.day.toString().padStart(2, "0")}-${month}-${year}`;

      return holidays.some((h) => h.tanggal === dateStr);
    },

    taskOffset(task) {
      return Math.max(0, this.dayDiff(this.startDate, task.start_date));
    },
    taskWidth(task) {
      const start = this.taskOffset(task);
      const end = Math.min(
        this.dayDiff(this.startDate, task.due_date),
        this.dayDiff(this.startDate, this.endDate),
      );

      if (end < start) return 0;

      return (end - start + 1) * 100;
    },

    dayDiff(start, end) {
      const normalize = (d) => {
        if (!d) return null;
        if (d.includes(" ")) {
          const [date] = d.split(" ");
          const [day, month, year] = date.split("-");
          return `${year}-${month}-${day}`;
        }
        return d; // sudah yyyy-mm-dd
      };

      const s = new Date(normalize(start));
      const e = new Date(normalize(end));
      return Math.floor((e - s) / (1000 * 60 * 60 * 24));
    },
  },
  computed: {
    assigneeOptions() {
      return [
        ...new Set(
          this.daftarTask.tasks
            .filter((t) => t.assignee_to && t.assignee_to !== "Unassigned")
            .map((t) => t.assignee_to),
        ),
      ];
    },

    statusOptions() {
      return [
        { label: "Completed", value: "completed" },
        { label: "Done Dev", value: "done dev" },
        { label: "In Review", value: "in review" },
        { label: "In Progress", value: "in progress" },
        { label: "Cancelled", value: "cancelled" },
      ];
    },
    flatDates() {
      const result = [];

      Object.entries(this.tanggalPerBulan).forEach(([month, days]) => {
        days.forEach((day) => {
          result.push({
            month,
            day,
          });
        });
      });

      return result;
    },
    totalWidth() {
      return this.flatDates.length * 100;
    },

    filteredTask() {
      const start = this.toDate(this.startDate);
      const end = this.toDate(this.endDate);

      const hasil = this.daftarTask?.tasks || [];

      return (
        hasil
          // 1️⃣ filter assignee
          .filter(
            (task) =>
              !this.selected.length || this.selected.includes(task.assignee_to),
          )

          // 2️⃣ filter status
          .filter(
            (task) =>
              !this.selectedStatus.length ||
              this.selectedStatus.includes(task.status_name),
          )

          // 3️⃣ filter tanggal (overlap)
          .filter((task) => {
            if (!task.start_date || !task.due_date) return false;

            const taskStart = this.toDate(task.start_date);
            const taskEnd = this.toDate(task.due_date);

            return taskStart <= end && taskEnd >= start;
          })

        // 3️⃣ buang assignee tanpa task
        .filter((item) => item.tasks.length > 0)
      );
    },
    isAppView() {
      return this.$route.query.view === "app";
    },
  },
  watch: {
    startDate: "onDateChange",
    endDate: "onDateChange",

    selectedStatus(val) {
      console.log("STATUS AKTIF:", val);
    },
    // selected() {
    //   this.filterAssignee();
    // },
  },
};
</script>
