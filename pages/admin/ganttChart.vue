<template>
  <!-- Loading Animation -->
  <div v-if="isLoading" class="loading">
    <div class="loading_tanggal">
      <i class="fa-solid fa-spinner"></i>
      <p>Tunggu Sebentar</p>
    </div>
  </div>

  <!-- POPUP DETAIL TASK -->
  <div
    v-if="showDetail"
    class="detail-overlay"
    @click.self="showDetail = false"
  >
    <div class="detail-modal">
      <!-- Header -->
      <div
        class="detail-header"
        :style="{ background: gradientFromColor(detailTask.color) }"
      >
        <div class="name-description">
          <h3>{{ detailTask.name }}</h3>
          <p>{{ detailTask.description }}</p>
        </div>
        <button class="close-btn" @click="showDetail = false">✕</button>
      </div>

      <!-- Content -->
      <div class="detail-body">
        <div class="detail-item">
          <span class="label">Assignee</span>
          <span class="value">{{ detailTask.assignee_to }}</span>
        </div>

        <div class="detail-item">
          <span class="label">Status</span>
          <span class="status-badge">
            {{ detailTask.status_name }}
          </span>
        </div>

        <div class="detail-item">
          <span class="label">Start Date</span>
          <span class="value">{{ detailTask.start_date }}</span>
        </div>

        <div class="detail-item">
          <span class="label">Due Date</span>
          <span class="value">{{ detailTask.due_date }}</span>
        </div>

        <div class="detail-item">
          <span class="label">Duration</span>
          <span class="value">{{ detailTask.duration_days }}</span>
        </div>

        <div class="detail-item" v-if="detailTask.date_done">
          <span class="label">Completed At</span>
          <span class="value">{{ detailTask.date_done }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Isi Konten -->
  <div class="isi" :class="{ viewApp: isAppView }">
    <!-- Header -->
    <div class="header-gant-chart">
      <div class="icon-header">
        <span class="material-symbols-outlined"> deployed_code </span>
        <p>Gantt Chart</p>
      </div>

      <!-- Filter Tanggal Gantt dan Assignee -->
      <div class="filter-gant">
        <div class="search-tanggal">
          <div class="dates-gant">
            <!-- <label for="tanggal">Tanggal</label> -->
            <div class="tanggal">
              <ClientOnly>
                <VueDatePicker
                  format="dd-MM-yyyy"
                  v-model="startDate"
                  model-type="yyyy-MM-dd"
                  :time-config="{ enableTimePicker: false }"
              /></ClientOnly>
              <span class="separator">➡️</span>
              <ClientOnly>
                <VueDatePicker
                  format="dd-MM-yyyy"
                  v-model="endDate"
                  model-type="yyyy-MM-dd"
                  :time-config="{ enableTimePicker: false }"
              /></ClientOnly>
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
            <span v-else class="placeholder">Pilih status</span>
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
    </div>

    <!-- Kalender -->
    <div class="kalender">
      <div class="gantt-wrapper">
        <div
          v-if="todayOffset !== null"
          class="today-line"
          :style="{ left: todayOffset + 'px' }"
        >
          <span class="today-label">Today</span>
        </div>

        <div class="header-container" :style="{ minWidth: totalWidth + 'px' }">
          <!-- <div class="header-name">
            <p>Name</p>
          </div> -->
          <div class="header-gant">
            <div class="dates-range" :style="{ minWidth: totalWidth + 'px' }">
              <div class="bulan-header" style="display: flex; width: 100%">
                <div
                  v-for="(days, month, index) in tanggalPerBulan"
                  :key="month"
                  :style="{ width: bulanWidths[index] + 'px' }"
                  class="bulan-item"
                >
                  {{ formatMonth(month) }}
                </div>
              </div>
            </div>

            <div
              class="daftar-tanggal"
              :style="{ minWidth: totalWidth + 'px' }"
            >
              <div
                class="hari-tanggal"
                :class="{
                  weekend: isWeekend(item),
                  holiday: isHoliday(item),
                }"
                :style="{ minWidth: dayWidth + 'px' }"
                v-for="(item, index) in flatDates"
                :key="index"
              >
                <p :class="{ today: isToday(item) }">
                  {{ item.day }}
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
            <div
              class="task-timeline"
              :style="{
                minWidth: totalWidth + 'px',
                '--day-width': dayWidth + 'px',
              }"
            >
              <div
                class="task-bar"
                @click="cekDetail(task)"
                :style="{
                  marginLeft: taskOffset(task) * dayWidth + 'px',
                  width: taskWidth(task) * dayWidth + 'px',
                  background: gradientFromColor(task.color),

                  // top: '8px',
                }"
              >
                <span class="assignee">{{ task.assignee_to }}</span>
                <span class="task-title">{{ task.name }}</span>
                <span class="status-task">{{ task.status_name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Zoom -->
    <div class="zoom-wrapper">
      <div class="zoom-panel">
        <button class="zoom-btn" @click="zoomOut">−</button>

        <span class="zoom-level">{{ dayWidth }}%</span>

        <button class="zoom-btn" @click="zoomIn">+</button>
      </div>
    </div>

    <div class="kosong">
      <p>tes</p>
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

.hari-tanggal .today {
  background: #eff6ff;
  color: #2563eb;
  border-radius: 6px;
  padding: 2px 6px;
}
</style>

<!-- Header -->
<style scoped>
.header-gant-chart {
  margin-top: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 60px;

  padding: 16px 20px;
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff, #f8fafc);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.06);
}

.icon-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-header p {
  font-size: 20px;
  font-weight: 700;
  /* padding-right: 20px; */
  color: #0f172a;
}

.icon-header span {
  width: 50px;
  height: 48px;
  font-size: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;

  background: linear-gradient(
    135deg,
    #3b82f6,
    /* blue-500 */ #1e40af /* blue-800 */
  );

  color: #ffffff;

  box-shadow:
    0 6px 18px rgba(59, 130, 246, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.filter-gant {
  flex-wrap: wrap;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-tanggal {
  display: flex;
  gap: 20px;
}

.dates-gant {
  width: 100%;
  margin-right: 10px;
}

.dates-gant .tanggal {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  gap: 5px;
}

/* Gaya Utama (Desktop) */
.multi-select {
  width: 200px;
  position: relative;
  font-size: 14px;
  /* z-index: 98; */
}

.select-box {
  height: 40px;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;

  border: 1px solid var(--border-soft);
  background: linear-gradient(180deg, #ffffff, #f8fafc);
}

.select-box:hover {
  border-color: #93c5fd;
  background: #ffffff;
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

<!-- Kalender -->
<style scoped>
* {
  box-sizing: border-box;
}

.kalender {
  max-height: 100dvh;
  overflow: auto;
  margin-top: 20px;
  padding-bottom: 10px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
}

.header-container {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 90;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}
/* CANVAS PANJANG */
.gantt-wrapper {
  position: relative;
  min-height: 100%;
  /* background: #f7f7f7; */
}

.today-line {
  position: absolute;
  top: 59px;
  bottom: 0;
  width: 1.5px;
  background: linear-gradient(
    to bottom,
    transparent,
    #3b82f6 20%,
    #1e40af 80%,
    transparent
  );

  z-index: 15;
  pointer-events: none;
}

/* label kecil di atas */
.today-label {
  /* position: sticky;
  top: 65px; */
  position: relative;
  top: 4px;
  transform: translateX(-50%);

  font-size: 9px;
  letter-spacing: 0.06em;
  font-weight: 700;

  background: #3b82f6;
  color: #ffffff;

  padding: 6px 20px;
  border-radius: 4px;

  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
  /* z-index: 99; */
}

/* HEADER RANGE */
.dates-range {
  /* height: 35px; */
  display: flex;
  align-items: center;
  /* padding-left: 20%; */
  background: #f9fafb;
  border-right: 1px solid #979797;
  position: sticky;
  top: 0;
  z-index: 9;
  font-size: 14px;
  font-weight: 700;
  color: #475569;
}

.bulan-header {
  height: 35px;
  display: flex;
  /* border-bottom: 1px solid #e5e7eb; */
  /* background: #f3f4f6; */
  font-weight: 700;
  /* color: #1f2937; */
  /* font-size: 16px; */
  background: linear-gradient(180deg, #f8fafc, #f1f5f9);
  border-bottom: 1px solid var(--border-soft);

  font-size: 14px;
  letter-spacing: 0.02em;
  color: #334155;
}

.bulan-item {
  display: flex;
  justify-content: center;
  align-items: center;
  /* border-right: 1px solid #aeb0b3; */
  border-right: 1px solid rgba(15, 23, 42, 0.2);
}

/* HEADER TANGGAL */
.daftar-tanggal {
  display: flex;
  height: 30px;
  background: #ffffff;
  border-top: 1px solid var(--border-soft);
  border-bottom: 1px solid var(--border-soft);
}

.hari-tanggal {
  /* width: 100px; */
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid var(--border-muted);
  font-weight: 500;
  color: var(--text-muted);
  font-size: 13px;
  margin: 0;
  line-height: 1;
  /* flex-shrink: 0; */
}

.weekend {
  background: #f3f4f6;
  color: grey;
  border-left: 1px solid #e5e7eb;
}

.holiday {
  background: linear-gradient(135deg, #fff1f2, #ffe4e6);
}

.task-row {
  /* height: 40px; */
  display: flex;
  position: relative;
  min-height: 40px;
  background: #ffffff;
}

.task-timeline {
  position: relative;
  background-image: repeating-linear-gradient(
    to right,
    transparent 0,
    transparent calc(var(--day-width) - 1px),
    rgba(15, 23, 42, 0.06) calc(var(--day-width) - 1px),
    rgba(15, 23, 42, 0.06) var(--day-width)
  );
}

.task-bar {
  position: relative;
  text-align: center;
  text-wrap: wrap;
  min-height: 28px;
  border-radius: 8px;
  /* font-size: 10px; */
  /* font-size: clamp(9px, calc(var(--day-width) * 0.28), 12px); */
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 5px 12px;
  color: #ffffff;
  white-space: normal; /* IZINKAN TURUN BARIS */
  word-break: break-word; /* potong kata panjang */
  /* line-height: 1.4; */
  line-height: clamp(1, calc(var(--day-width) / 20), 1.4);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  transition:
    /* transform 0.2s ease, */
    box-shadow 0.2s ease,
    transform 0.15s ease,
    filter 0.15s ease;
  cursor: pointer;
  margin-top: 30px;

  z-index: 16;

  /* transition:
    transform 0.15s ease,
    filter 0.15s ease; */
}

.task-bar .assignee {
  /* font-size: 9px; */
  /* font-size: clamp(9px, calc(9px + (var(--day-width) - 100px) * 0.025), 12px); */
  letter-spacing: 0.04em;
  font-weight: 600;
  opacity: 0.85;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin: 1px 0;
}

.task-bar .task-title {
  /* font-size: 11px; */
  font-size: clamp(1px, calc(11px + (var(--day-width) - 100px) * 0.08), 20px);
  font-weight: 700;
  text-align: center;
  line-height: 1.3;
}

.task-bar .status-task {
  /* font-size: 9px; */
  /* font-size: clamp(9px, calc(9px + (var(--day-width) - 100px) * 0.025), 12px); */
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-top: 2px;

  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(2px);
}

.task-bar .assignee,
.task-bar .status-task {
  font-size: clamp(1px, calc(9px + (var(--day-width) - 100px) * 0.045), 14px);
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
  gap: 10px;

  padding-left: 14px;
  border-left: 3px solid #c7d2fe;

  background: linear-gradient(135deg, #f8fafc, #f1f5f9);

  color: #475569;
  font-style: italic;
  font-size: 13px;
}

.kosong {
  /* display: none; */
  height: 50px;
  color: #fff;
}
</style>

<!-- Popup detail task -->
<style scoped>
.detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow-y: auto;
}

.detail-modal {
  width: 500px;
  max-height: 80dvh;
  max-width: 90%;
  background: #fff;
  border-radius: 14px;
  overflow: auto;

  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  animation: popup 0.25s ease;
}

@keyframes popup {
  from {
    transform: translateY(10px) scale(0.97);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}

.detail-header {
  padding: 14px 16px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-header .name-description h3 {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
}

.name-description p {
  font-size: 10px;
  text-wrap: wrap;
  max-width: 420px;
  margin-top: 3px;
  text-shadow: 0 1px 2px rgba(15, 23, 42, 0.35);

  white-space: pre-line;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}

.detail-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(255, 255, 255, 0.92);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  color: #64748b;
  font-weight: 600;
}

.detail-item .value {
  color: #0f172a;
  font-weight: 600;
}

.status-badge {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(15, 23, 42, 0.12);
  text-transform: capitalize;
}
</style>

<!-- Zoom -->
<style scoped>
.zoom-wrapper {
  width: 99%;
  text-align: right;
  margin-top: 5px;
}

.zoom-panel {
  /* position: absolute;
  top: 10px;
  right: 16px; */

  display: inline-flex;
  align-items: center;
  /* justify-content: right; */
  gap: 6px;

  padding: 6px 10px;
  border-radius: 12px;

  /* background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border: 1px solid #bfdbfe; */

  backdrop-filter: blur(10px);
  background: rgba(239, 246, 255, 0.85);

  box-shadow:
    0 8px 24px rgba(59, 130, 246, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);

  z-index: 99;
}

/* tombol */
.zoom-btn {
  width: 32px;
  height: 32px;

  border-radius: 8px;
  border: none;

  background: linear-gradient(135deg, #3b82f6, #2563eb);

  color: #ffffff;
  font-size: 18px;
  font-weight: 700;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.15s ease;
}

.zoom-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.4);
}

.zoom-btn:active {
  transform: scale(0.95);
}

/* level text */
.zoom-level {
  min-width: 48px;
  text-align: center;

  font-size: 12px;
  font-weight: 600;
  color: #1e3a8a;
}
</style>

<!-- <script setup>
definePageMeta({
  layout: "dashboard",
});
</script> -->

<script>
import { VueDatePicker } from "@vuepic/vue-datepicker";

definePageMeta({
  layout: "dashboard",
});

export default {
  data() {
    return {
      startDate: "",
      endDate: "",
      tanggalPerBulan: {},
      daftarTask: [],
      detailTask: null,
      showDetail: false,
      openAssignee: false,
      openStatus: false,
      isLoading: false,
      selected: [], // assignee
      selectedStatus: [], // status_name
      dayWidth: 100, // px per hari (default)
      minZoom: 20,
      maxZoom: 200,
      zoomStep: 20,
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
    shadeColor(color, percent) {
      let r = parseInt(color.slice(1, 3), 16);
      let g = parseInt(color.slice(3, 5), 16);
      let b = parseInt(color.slice(5, 7), 16);

      r = Math.min(255, Math.max(0, r + r * percent));
      g = Math.min(255, Math.max(0, g + g * percent));
      b = Math.min(255, Math.max(0, b + b * percent));

      return `rgb(${r}, ${g}, ${b})`;
    },
    gradientFromColor(color) {
      return `linear-gradient(
    135deg,
    ${this.shadeColor(color, -0.5)},
    ${this.shadeColor(color, 0.1)}
  )`;
    },
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

    cekDetail(task) {
      this.detailTask = task;
      this.showDetail = true;

      console.log("Data Task", task);

      console.log("Data detail task", this.detailTask);
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
    },
    async ambilTask() {
      console.log("Task sedang di proses");
      this.isLoading = true;

      try {
        const task = await this.$api.get(
          `/api/v1/gantt/tasks?start_date=${this.formatTanggal(this.startDate)}&end_date=${this.formatTanggal(this.endDate)}`,
        );
        this.daftarTask = task.data;
        this.$nextTick(() => {
          const el = document.querySelector(".kalender");
          if (!el) return;

          // zoom dengan Ctrl+Wheel
          el.addEventListener(
            "wheel",
            (e) => {
              if (!e.ctrlKey) return;
              e.preventDefault();
              if (e.deltaY < 0) this.zoomIn();
              else this.zoomOut();
            },
            { passive: false },
          );

          // scroll otomatis ke Today
          if (this.todayOffset !== null) {
            const scrollLeft = this.todayOffset - el.clientWidth / 2;
            el.scrollTo({
              left: Math.max(0, scrollLeft),
              behavior: "smooth",
            });
          }
        });
        console.log("daftar task", this.daftarTask);
      } catch (err) {
        console.log("Gagal mengambil task", err);
      } finally {
        this.isLoading = false;
      }
    },
    formatRange(start, end) {
      const startDate = new Date(start);
      const endDate = new Date(end);

      const optionsStart = { day: "numeric", month: "short" };
      const optionsEnd = { day: "numeric", month: "short", year: "numeric" };

      // Contoh: "1 Jan 2025 - 20 Jan 2025"
      return `${startDate.toLocaleDateString("id-ID", optionsStart)} - ${endDate.toLocaleDateString("id-ID", optionsEnd)}`;
    },
    formatMonth(monthKey) {
      const [year, month] = monthKey.split("-");
      const date = new Date(year, month - 1);
      return date.toLocaleString("id-ID", { month: "short", year: "numeric" });
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
    isToday(item) {
      const d = this.createDate(item);
      const t = new Date();

      return d.toDateString() === t.toDateString();
    },
    createDate(item) {
      const [year, month] = item.month.split("-");
      return new Date(year, month - 1, item.day);
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

      return end - start + 1;
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

    zoomIn() {
      this.dayWidth = Math.min(this.maxZoom, this.dayWidth + this.zoomStep);
    },
    zoomOut() {
      this.dayWidth = Math.max(this.minZoom, this.dayWidth - this.zoomStep);
    },
  },
  computed: {
    bulanWidths() {
      return Object.values(this.tanggalPerBulan).map(
        (days) => days.length * this.dayWidth,
      );
    },
    todayOffset() {
      if (!this.startDate || !this.endDate) return null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const start = new Date(this.startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(this.endDate);
      end.setHours(0, 0, 0, 0);

      // kalau hari ini di luar range
      if (today < start || today > end) return null;

      const diffTime = today - start;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      return diffDays * this.dayWidth; // 1 hari = 100px
    },
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
      return this.flatDates.length * this.dayWidth;
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
        // .filter((item) => item.tasks.length > 0)
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
