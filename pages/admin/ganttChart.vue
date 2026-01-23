<template>
  <div class="isi">
    <!-- <h2>Gantt Chart</h2>
    <p>Daftar task karyawan menggunakan chart</p> -->

    <!-- Filter -->

    <!-- Filter Tanggal Gantt dan Assignee -->
    <div class="filter-gant">
      <div class="search-tanggal">
        <div class="dates">
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

      <div class="multi-select">
        <div class="select-box" @click="open = !open">
          <span v-if="selected.length">
            {{ selected.join(", ") }}
          </span>
          <span v-else class="placeholder"> Pilih assignee </span>
          <i class="arrow">▾</i>
        </div>

        <div class="dropdown" v-if="open">
          <label v-for="task in daftarTask" :key="task.id" class="option">
            <input type="checkbox" :value="task.assignee" v-model="selected" />
            {{ task.assignee }}
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
            v-for="task in  filteredTask"
            :key="task.id"
            :style="{
              minHeight: task.tasks.length * 32 + 26 + 'px',
            }"
          >
            <div class="task-name">{{ task.assignee }}</div>

            <div class="task-timeline" :style="{ minWidth: totalWidth + 'px' }">
              <div
                class="task-bar"
                v-for="(k, index) in task.tasks"
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
                <p>{{ k.id }}</p>
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
.multi-select {
  width: 260px;
  position: relative;
  z-index: 105;
}

.select-box {
  border: 1px solid #ccc;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}

.dropdown {
  position: absolute;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
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

.placeholder {
  color: #999;
}
</style>

<!-- Style Filter -->
<style scoped>
.filter-gant {
  display: flex;
  align-items: center;
  /* width: 100%; */
}

.search-tanggal {
  display: flex;
  margin-top: 20px;
  gap: 20px;
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
  background-color: rgb(216, 255, 216);
  border: 1px solid rgb(115, 255, 115);
  color: green;
}

.task_inProgress {
  /* background-color: rgb(216, 216, 255);
  border: 1px solid rgb(176, 176, 255); */
  background-color: #fdff8b;
  border: 1px solid #ffff47;
}

.task_todo {
  background-color: #b3b7bd;
  border: 1px solid rgb(176, 176, 255);
}

.task_inReview {
  background-color: #14b8a6;
  border: 1px solid rgb(176, 176, 255);
}

.task_cancelled {
  background-color: #ffb3b3;
  border: 1px solid #ff4d4d;
  color: #800000;
}
</style>

<style scoped>
/* SCROLL VIEWPORT */
.kalender {
  height: 70vh;
  overflow: auto;
  border: 1px solid #c8c8c8;
  /* background: #f7f7f7; */
  background-color: #fff;
  margin: 20px 0;
  /* display: flex; */
  padding-bottom: 10px;
  /* gap: 10px; */
}

.header-container {
  display: flex;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 100;
}

.header-name {
  padding: 26px 0;
  flex-shrink: 0;
  width: 200px;
  border-bottom: 1px solid #c8c8c8;
  border-right: 1px solid #c8c8c8;
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  /* background: #f7f7f7; */
  background-color: #fff;
  position: sticky;
  /* top: 0; */
  left: 0;
  z-index: 101;
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
  /* justify-content: center; */
  padding-left: 20%;
  /* justify-content: center; */
  border-right: 1px solid #c8c8c8;
  background: #f7f7f7;
  position: sticky;
  top: 0;
  /* left: 10px; */
  z-index: 9;
}

/* HEADER TANGGAL */
.daftar-tanggal {
  display: flex;
  height: 40px;
  background: #fff;
  border-bottom: 1px solid #c8c8c8;
  border-top: 1px solid #c8c8c8;
}

.hari-tanggal {
  width: 100px;
  text-align: center;
  line-height: 40px;
  border-right: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.task-row {
  /* height: 40px; */
  display: flex;
  position: relative;
  min-height: 40px;
  /* background: #fff; */
  /* background: rgba(255, 0, 0, 0.1); */
}

.task-timeline {
  /* align-items: center; */
  flex: 1; /* ⬅️ PALING PENTING */
  position: relative;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
  background: #f7f7f7;
}

.task-bar {
  position: absolute;
  top: auto;
  height: 24px;
  /* background: red; */
  border-radius: 4px;
  text-align: center;
  /* border: 1px solid rgb(108, 108, 255); */
  font-size: 12px;
  font-weight: 500;
  /* color: #fff; */
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
}

.task-name {
  flex-shrink: 0;
  width: 200px;
  background: #fff;
  border-right: 1px solid #c8c8c8;
  border-bottom: 1px solid #c8c8c8;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  font-size: 16px;
  font-weight: 500;
  padding-left: 10px;
  position: sticky;
  /* top: 0; */
  left: 0;
  z-index: 99;
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
      open: false,
      filteredTask: [],
      selected: [],
      
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

     filterAssignee() {
    if (this.selected.length === 0) {
      this.filteredTask = this.daftarTask
      return
    }

    this.filteredTask = this.daftarTask.filter(task =>
      this.selected.includes(task.assignee)
    )
  },


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

      try {
        const task = await this.$api.get(
          `/api/v1/gantt/tasks?start_date=${this.formatTanggal(this.startDate)}&end_date=${this.formatTanggal(this.endDate)}`,
        );

        this.daftarTask = task.data;
            this.filteredTask = this.daftarTask;

        console.log("daftar task", this.daftarTask);
      } catch (err) {
        console.log("Gagal mengambil task", err);
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
    
  },
  watch: {
    startDate: "onDateChange",
    endDate: "onDateChange",
    selected() {
    this.filterAssignee()
  }
  },
};
</script>
