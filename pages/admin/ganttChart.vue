<template>
  <div class="isi">
    <div class="gantt-wrapper">
      <!-- HEADER TIMELINE -->
      <div class="gantt-header">
        <div class="left-spacer"></div>
        <div class="date-row">
          <div v-for="day in days" :key="day" class="date-cell">
            {{ formatDay(day) }}
          </div>
        </div>
      </div>

      <!-- BODY -->
      <div class="gantt-body">
        <!-- TASK LIST -->
        <div class="task-list">
          <div class="task-row" v-for="task in tasks" :key="task.id">
            <strong>{{ task.title }}</strong>
            <small>{{ task.assignee }}</small>
          </div>
        </div>

        <!-- TIMELINE -->
        <div class="timeline">
          <!-- GRID -->
          <div class="grid">
            <div v-for="day in days" :key="day" class="grid-col">
              <div v-for="task in tasks" :key="task.id" class="grid-row" />
            </div>
          </div>

          <!-- BARS -->
          <div class="bars">
            <div
              v-for="(task, index) in tasks"
              :key="task.id"
              class="bar"
              :style="barStyle(task, index)"
            >
              {{ task.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gantt-wrapper {
  height: 100%;
  width: 96%;
  display: flex;
  flex-direction: column;
  background: #fff;
  margin-top: 20px;
  border-radius: 10px;
  border: 1px solid #ececec;
}

.gantt-header {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
}

.left-spacer {
  width: 260px;
}

.date-row {
  display: flex;
}

.date-cell {
  width: 40px;
  text-align: center;
  font-size: 11px;
  color: #475569;
  padding: 8px 0;
  border-right: 1px solid #e5e7eb;
}

.gantt-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.task-list {
  width: 260px;
  border-right: 1px solid #e5e7eb;
  background: #fff;
}

.task-row {
  height: 48px;
  padding: 8px 12px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.timeline {
  position: relative;
  flex: 1;
  overflow: auto;
}

.grid {
  display: flex;
}

.grid-col {
  width: 40px;
}

.grid-row {
  height: 48px;
  border-bottom: 1px solid #f1f5f9;
  border-right: 1px solid #f1f5f9;
}

.bars {
  position: absolute;
  top: 0;
  left: 0;
}

.bar {
  position: absolute;
  height: 32px;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 12px;
  color: white;
  background: #6366f1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  white-space: nowrap;
}
</style>

<script>
definePageMeta({
  layout: "dashboard",
});

export default {
  data() {
    return {
      // ukuran dasar
      dayWidth: 40,
      rowHeight: 48,

      // range timeline
      startDate: "2026-04-20",
      endDate: "2026-05-10",

      // data task (anggap ini sudah dari API)
      tasks: [
        {
          id: 1,
          title: "Wireframes",
          assignee: "Reza",
          start: "2026-04-22",
          end: "2026-05-03",
          color: "#e11d48",
        },
        {
          id: 2,
          title: "Front-End Development",
          assignee: "Andre",
          start: "2026-05-01",
          end: "2026-05-10",
          color: "#f59e0b",
        },
        {
          id: 3,
          title: "QA Testing",
          assignee: "Dina",
          start: "2026-04-28",
          end: "2026-05-05",
          color: "#22c55e",
        },
      ],
    };
  },

  computed: {
    // generate hari di timeline
    days() {
      const days = [];
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
      }
      return days;
    },
  },

  methods: {
    // selisih hari
    dayDiff(a, b) {
      const oneDay = 1000 * 60 * 60 * 24;
      return Math.floor((new Date(b) - new Date(a)) / oneDay);
    },

    // posisi & ukuran bar
    barStyle(task, index) {
      const left = this.dayDiff(this.startDate, task.start) * this.dayWidth;

      const width = (this.dayDiff(task.start, task.end) + 1) * this.dayWidth;

      return {
        left: left + "px",
        top: index * this.rowHeight + 8 + "px",
        width: width + "px",
        background: task.color,
      };
    },

    // format header tanggal
    formatDay(date) {
      return date.getDate();
    },
  },
};
</script>
