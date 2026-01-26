<template>
  <div v-if="isLoading" class="loading">
    <div class="loading_tanggal">
      <i class="fa-solid fa-spinner"></i>
      <p>Tunggu Sebentar</p>
    </div>
  </div>
  <div class="isi">
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
          <span v-if="selected.length">
            {{ selected.join(", ") }}
          </span>
          <span v-else class="placeholder"> Pilih assignee </span>
          <span class="material-symbols-outlined"> keyboard_arrow_down </span>
        </div>

        <div class="dropdown" v-if="openAssignee" @click.stop>
          <label v-for="task in daftarTask" :key="task.id" class="option">
            <input type="checkbox" :value="task.assignee" v-model="selected" />
            {{ task.assignee }}
          </label>
        </div>
      </div>

      <!-- Status Task -->
      <div class="multi-select">
        <div class="select-box" @click="openStatus = !openStatus">
          <span v-if="selectedStatus.length">
            {{ selectedStatus.join(", ") }}
          </span>
          <span v-else class="placeholder">Pilih status</span>
          <span class="material-symbols-outlined">keyboard_arrow_down</span>
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
          <div class="header-name">
            <p>Name</p>
          </div>
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
                v-for="(item, index) in flatDates"
                :key="index"
              >
                <p>{{ item.day }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="container-task" :style="{ minWidth: totalWidth + 'px' }">
          <div
            class="task-row"
            v-for="task in filteredTask"
            :key="task.id"
            :style="{
              minHeight: task.tasks.length * 36 + 30 + 'px',
            }"
          >
            <!-- <div class="task-name">{{ task.assignee }}</div> -->

            <div class="task-timeline" :style="{ minWidth: totalWidth + 'px' }">
              <div
                class="task-bar"
                v-for="(k, index) in task.tasks"
                v-if="task.tasks.length > 0"
                :class="taskBarClass(k.status_name)"
                :style="{
                  marginLeft:
                    Math.max(0, dayDiff(startDate, k.start_date)) * 100 + 'px',

                  width:
                    (Math.min(
                      dayDiff(startDate, k.due_date),
                      dayDiff(startDate, endDate),
                    ) -
                      Math.max(0, dayDiff(startDate, k.start_date)) +
                      1) *
                      100 +
                    'px',
                  top: 8 + index * 36 + 'px',
                }"
              >
                <p>{{ k.name }}</p>
              </div>
              <div class="no-task" v-else>
                <p>Task belum Tersedia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Style multi select -->
<style scoped>
/* Gaya Utama (Desktop) */
.multi-select {
  width: 25%;
  position: relative;
  z-index: 98;
}

.select-box {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  transition: all 0.2s ease;
  padding: 16px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box; /* Tambahkan ini agar padding tidak merusak lebar */
}

.select-box:hover {
  border-color: #3b82f6;
}

/* Gaya Mobile (Tablet ke bawah) */
@media (max-width: 768px) {
  .multi-select,
  .select-box {
    width: 100%; /* Menggabungkan selector agar lebih ringkas */
  }

  .search-tanggal,
  .dates-gant,
  .tanggal {
    width: 100%;
  }
}

.dropdown {
  position: absolute;
  width: 100%;
  background: white;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.option {
  display: flex;
  gap: 8px;
  padding: 6px 10px;
}

.option:hover {
  background: #f9fafb;
}

.placeholder {
  color: #999;
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
  border: var(--borderCard);
  border-radius: 5px;
  padding: 10px 15px;
  gap: 15px;
  background-color: #fff;
}

.kurang-lebih-dari {
  width: 20%;
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
  padding: 10px;
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
</style>

<style scoped>
/* SCROLL VIEWPORT */
.kalender {
  height: 80vh;
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

.task-timeline {
  position: relative;
  background: repeating-linear-gradient(
    to right,
    #ffffff 0px,
    #fbfbfb 99px,
    #dbdee1 100px
  );
  border-bottom: 1px solid #e5e7eb;
}

.task-bar {
  position: absolute;
  text-align: center;
  text-wrap: wrap;
  min-height: 28px;
  border-radius: 9px;
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
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
}

.task-bar:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
  z-index: 20;
}

.no-task {
  font-size: 12px;
  font-weight: 400;
  font-style: italic;
  position: relative;
  top: 3px;
  left: 10px;
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
    this.ambilTask();
  },
  methods: {
    taskBarClass(status) {
      return {
        task_todo: status === "to do" || status === "backlog",
        task_selesai: status === "done dev" || status === "completed",
        task_inProgress: status === "in progress",
        task_inReview: status === "in review",
        task_cancelled: status === "cancelled",
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
      return (
        this.daftarTask
          // 1️⃣ filter assignee
          .filter((item) => {
            if (this.selected.length === 0) return true;
            return this.selected.includes(item.assignee);
          })

          // 2️⃣ filter task by status
          .map((item) => {
            let tasks = item.tasks;

            if (this.selectedStatus.length > 0) {
              tasks = tasks.filter((t) =>
                this.selectedStatus.includes(t.status_name),
              );
            }

            return {
              ...item,
              tasks,
            };
          })

        // 3️⃣ buang assignee tanpa task
        .filter((item) => item.tasks.length > 0)
      );
    },
  },
  watch: {
    startDate: "onDateChange",
    endDate: "onDateChange",
    // selected() {
    //   this.filterAssignee();
    // },
  },
};
</script>
