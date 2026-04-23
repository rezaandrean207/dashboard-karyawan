<template>
  <!-- Details Task -->
  <div class="isi" :class="{ hidden: detailBug }">
    <div v-if="isLoading" class="loading">
      <div class="loading_tanggal">
        <i class="fa-solid fa-spinner"></i>
        <p>Tunggu Sebentar</p>
      </div>
    </div>

    <div class="filter">
      <div class="title">
        <i class="fa-solid fa-filter"></i>
        <p>Filter & Pencarian</p>
      </div>
      <div class="filter-detail dates-picker">
        <div class="filter-item">
          <label for="tanggal">Tanggal</label>
          <div class="dates">
            <ClientOnly>
              <VueDatePicker
                ref="startPicker"
                v-model="start"
                format="dd-MM-yyyy"
                model-type="yyyy-MM-dd"
                :time-config="{ enableTimePicker: false }"
                :max-date="end"
                @update:model-value="onStartDateSelected"
            /></ClientOnly>
            <span class="separator">
              <span class="material-symbols-outlined"> arrow_range </span>
            </span>
            <ClientOnly>
              <VueDatePicker
                ref="endPicker"
                v-model="end"
                format="dd-MM-yyyy"
                model-type="yyyy-MM-dd"
                :time-config="{ enableTimePicker: false }"
                :min-date="start"
            /></ClientOnly>
          </div>
        </div>
      </div>
    </div>

    <div class="notifikasi-detail" v-if="hasNotifikasi">
      <div class="notifikasi" :class="{ gap: !hasNotifikasi }">
        <i class="fa-regular fa-bell"></i>

        <!-- <span class="notif-dot" v-if="hasNotifikasi"></span> -->
        <span class="notif-dot"></span>
        <h4>{{ listNotifikasi.length }} Notifikasi</h4>
      </div>
      <!-- <div class="header_notif">
        <h4 class="judul-notif">Notifikasi Sistem</h4>
      </div> -->
      <div class="container-notif">
        <div
          class="isi_notif"
          :class="notifClass(notif.category)"
          v-for="notif in listNotifikasi"
          :key="notif.id"
        >
          <span
            class="material-symbols-outlined"
            style="color: rgb(214, 16, 16)"
            v-if="notif.category === '-'"
          >
            error
          </span>
          <span
            class="material-symbols-outlined"
            style="color: rgb(0, 255, 0)"
            v-else
          >
            thumb_up
          </span>
          <div class="teks-notif">
            <h4>{{ notif.name }}</h4>
            <p>{{ notif.message }}</p>
          </div>
        </div>
        <div
          class="isi-not-found"
          v-if="!listNotifikasi || listNotifikasi.length === 0"
        >
          <!-- <h4>Header Notifikasi</h4> -->
          <p>Belum ada notifikasi baru.</p>
        </div>
      </div>
    </div>

    <div class="kinerja-karyawan" v-if="detailKaryawan">
      <div class="row profil">
        <div class="user-summary">
          <div class="profil-karyawan">
            <div class="photo-wrapper" @click.stop>
              <img
                v-if="!detailKaryawan.imageError"
                :src="getProfileImage(detailKaryawan.profile_picture_url)"
                alt="Profile Picture"
                @error="detailKaryawan.imageError = true"
              />
              <div
                class="photo-option"
                :style="{ backgroundColor: detailKaryawan.color }"
                v-else
              >
                <p>{{ setInitial(detailKaryawan.name) }}</p>
              </div>
            </div>
            <div class="about">
              <h3>{{ detailKaryawan.username }}</h3>
              <p>{{ detailKaryawan.role }}</p>
              <div class="periode">
                <p v-if="start === '' && end === ''">Seluruh Periode</p>
                <p v-else>
                  Periode: {{ formatTanggalUI(start) }} -
                  {{ formatTanggalUI(end) }}
                </p>
              </div>
            </div>
          </div>
          <div class="status-karyawan">
            <div
              class="box"
              :class="availableClass(detailKaryawan.availability_status)"
            >
              <i class="fa-solid fa-circle"></i>
              <p>{{ detailKaryawan.availability_status }}</p>
            </div>
            <div
              class="box"
              :class="workloadClass(detailKaryawan.workload_status)"
            >
              <i
                class="fa-solid fa-arrow-trend-up"
                v-if="detailKaryawan.workload_status === 'Overload'"
              ></i>
              <i
                class="fa-solid fa-equals"
                v-if="detailKaryawan.workload_status === 'Normal'"
              ></i>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16px"
                viewBox="0 -960 960 960"
                width="16px"
                v-if="detailKaryawan.workload_status === 'Underload'"
              >
                <path
                  d="M640-240v-80h104L536-526 376-366 80-664l56-56 240 240 160-160 264 264v-104h80v240H640Z"
                />
              </svg>
              <p>{{ detailKaryawan.workload_status }}</p>
            </div>
          </div>
        </div>

        <div
          class="performance"
          :class="performaClass(detailKaryawan.performance_bugs.category)"
        >
          <i class="fa-solid fa-chart-line"></i>
          <div class="text">
            <p>Performa</p>
            <span
              ><strong
                >{{ detailKaryawan.performance_bugs.score }}%</strong
              ></span
            >
          </div>
        </div>
      </div>
      <div class="row container-summary">
        <div
          class="summary-card"
          :class="ketepatanClass(detailKaryawan.avg_time_efficiency.category)"
        >
          <div class="teks">
            <p>Tepat Waktu Kerja</p>
            <h4>{{ detailKaryawan.avg_time_efficiency.avg_percentage }}%</h4>
          </div>
          <div class="ikon">
            <i class="fa-solid fa-list-check"></i>
          </div>
        </div>
        <div class="summary-card summary-expected">
          <div class="teks">
            <p>Total Beban Kerja (Seharusnya)</p>
            <h4>{{ detailKaryawan.expected_hours }} Jam</h4>
          </div>
          <div class="ikon">
            <i class="fa-regular fa-clock"></i>
          </div>
        </div>
        <div
          class="summary-card"
          :class="totalBebanClass(detailKaryawan.total_spent_hours.category)"
        >
          <div class="teks">
            <p>Total Beban Kerja (Aktif)</p>
            <h4>
              {{ detailKaryawan.total_spent_hours.percentage }}% ({{
                detailKaryawan.total_spent_hours.hours
              }}
              Jam)
            </h4>
          </div>
          <div class="ikon">
            <i class="fa-regular fa-clock"></i>
          </div>
        </div>
        <div
          class="summary-card"
          :class="performaClass(detailKaryawan.performance_bugs.bugs_category)"
        >
          <div class="teks">
            <p>Performa Bug</p>
            <h4>{{ detailKaryawan.performance_bugs.bugs }}%</h4>
          </div>
          <div class="ikon">
            <i class="fa-solid fa-bug"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="bug-background" v-if="detailBug" @click.self="closeDetailBug()">
      <div class="container">
        <div class="container-header">
          <i class="fa-solid fa-xmark" @click="closeDetailBug"></i>
        </div>
        <div class="card-detail">
          <div class="card-header">
            <div class="card-title">
              <p>{{ detailBug.task_name }}</p>
            </div>
            <div class="card-meta">
              <div class="card-label tags">Tags</div>
              <div class="card-label tags">
                <p>{{ detailBug.bug_label }}</p>
              </div>
            </div>
          </div>
          <div class="card-description">
            <p>{{ detailBug.description }}</p>
          </div>
          <div class="card-info">
            <div class="info-item start_date">
              <i class="fa-regular fa-calendar"></i>
              <p>Mulai: {{ detailBug.start_date_ui }}</p>
            </div>
            <div class="info-item deadline">
              <i class="fa-regular fa-calendar"></i>
              <p>Target: {{ detailBug.due_date_ui }}</p>
            </div>
            <div class="info-item done_date">
              <i class="fa-regular fa-calendar"></i>
              <p>Selesai: {{ detailBug.date_done_ui }}</p>
            </div>
            <div class="info-item created_by">
              <i class="fa-regular fa-user"></i>
              <p>Bug Terbuat oleh: {{ detailBug.assignee_name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Card -->
    <div
      class="container task"
      v-for="k in detailKaryawan?.tasks"
      @click.stop="handleCardClick(k)"
    >
      <div class="card-header">
        <div class="header-item card-title">
          <p>{{ k.name }}</p>
        </div>
        <div class="header-item card-meta">
          <div class="card-label bug" v-if="k.bug_label">
            <p>{{ k.bug_label }}</p>
          </div>

          <div
            class="card-label progres"
            :class="statusTaskClass(k.status_name)"
          >
            <p>{{ statusLabel(k.status_name) }}</p>
          </div>
          <div
            class="card-label priority"
            :class="priorityClass(k.priority_name)"
            v-if="k.priority_name"
          >
            <p>{{ k.priority_name }}</p>
          </div>

          <!-- Dari Project mana task tersebut -->
          <div class="card-label project">
            <p>{{ k.project_name }}</p>
          </div>
        </div>
      </div>
      <div class="card-description">
        <p>{{ k.description }}</p>
      </div>

      <!-- Ketika start date tersedia -->
      <div
        class="card-performance"
        v-if="k.time_efficiency_percentage"
        :class="achivClass(k.time_efficiency_percentage)"
      >
        <div class="performance-item">
          <p>Ketepatan Pengerjaan Tugas</p>
          <h4>{{ k.time_efficiency_percentage }}%</h4>
          <h4>{{ k.remaining_duration }}</h4>
        </div>
        <div class="ikon" v-if="k.bug_label === 'Bug Terbuat'">
          <i class="fa-solid fa-bug"></i>
        </div>
      </div>

      <!-- Ketika start date tidak tersedia-->
      <div
        class="card-performance not_special"
        v-if="
          (k.status_name === 'done dev' || k.status_name === 'completed') &&
          !k.start_date
        "
      >
        <div class="performance-item">
          <p>Ketepatan Pengerjaan Tugas</p>
          <h4>Tidak Tersedia</h4>
        </div>
      </div>

      <div class="card-info">
        <div class="info-item jam">
          <i class="fa-regular fa-clock"></i>
          <p>Waktu Pengerjaan: {{ k.time_estimate_hours }} Jam</p>
        </div>
        <div class="info-item start_date">
          <i class="fa-regular fa-calendar"></i>
          <p v-if="k.start_date">Mulai: {{ k.start_date_ui }}</p>
          <p v-if="!k.start_date">Mulai: <i>Tidak Valid</i></p>
        </div>
        <div class="info-item deadline">
          <i class="fa-regular fa-calendar"></i>
          <p v-if="k.due_date">Target: {{ k.due_date_ui }}</p>
          <p v-if="!k.due_date">Target: <i>Tidak Valid</i></p>
        </div>
        <div
          class="info-item done_date"
          v-if="k.status_name === 'done dev' || k.status_name === 'completed'"
        >
          <i class="fa-regular fa-calendar"></i>
          <p>Selesai: {{ k.date_done_ui }}</p>
        </div>
        <div class="info-item created_by">
          <i class="fa-regular fa-user"></i>
          <p>Dibuat oleh: {{ k.creator_name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Conditioning color -->
<style scoped>
.positive {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.negative {
  background: #fef2f2;
  color: #7f1d1d;
  border: 1px solid #fecaca;
}
</style>

<!-- Style detail -->
<style scoped>
.notifikasi-detail {
  width: 100%;
  border: 1px solid rgb(192, 192, 192);
  margin-top: 20px;
  border-radius: 5px;
}

.notifikasi-detail .notifikasi {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(236, 236, 236);
  /* color: #fff; */
  color: var(--text-main);
  padding: 10px 0;
  /* border-radius: 8px; */
  /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); */
  box-shadow: -2px 0 8px rgba(134, 0, 0, 0.1);
  border-bottom: 1px solid var(--border-soft);
  cursor: pointer;
}

.sidebar_notif {
  /* width: 350px; */
  /* width: 100%; */
  height: 100%;
  background-color: rgb(255, 217, 217);
  border-radius: 8px;
  box-shadow: -2px 0 8px rgba(134, 0, 0, 0.1);
  padding: 20px;
  margin-top: 10px;

  /* border: 1px solid rgb(255, 208, 208); */
}

details[open] .sidebar-notif {
  animation: slideIn 0.2s ease-out forwards;
}

@keyframes slideIn {
  from {
    transform: translateY(-10px);
  }
  to {
    transform: translateY(0);
  }
}

.header_notif {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.header_notif .judul-notif {
  color: rgb(16, 50, 130);
}

.close_notif {
  cursor: pointer;
}

.container-notif {
  /* margin-top: 20px; */
  display: flex;
  flex-direction: column;
}

.isi_notif {
  padding: 15px 10px;
  display: flex;
  gap: 10px;
  border-top: 1px solid var(--border-soft);
}

.isi_notif span {
  /* color: rgb(214, 16, 16); */
  padding-top: 4px;
}

.isi_notif h4 {
  /* padding-bottom: 5px; */
  margin-bottom: 5px;
  /* color: rgb(16, 50, 130); */
  /* border-bottom: 1px solid #dddddd; */
}

.isi_notif p {
  font-size: 14px;
  color: #555;
}
</style>

<!-- Sidebar Notifikasi  -->
<style scoped>
.notif-dot {
  position: relative;
  top: -6px;
  right: 22px;
  width: 8px;
  height: 8px;
  background-color: #1e1e1e;
  border-radius: 50%;
}

.gap {
  gap: 10px;
}

.notifikasi i {
  font-size: 20px;
}

/* .notifikasi:hover {
  background-color: rgb(252, 198, 198);
}

.notifikasi:active {
  background-color: rgb(252, 198, 198);
} */

.background-notif {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}
</style>

<!-- Main Page -->
<style scoped>
.holiday {
  background-color: #fff;
  padding: 15px 20px;
  margin-top: 20px;
  width: 100%;
  border: 1px solid var(--border_color);
}

.holiday .list_hari {
  margin-top: 10px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.list_hari .hari_tanggal {
  background-color: #efefef;
  width: 24%;
  border-radius: 10px;
  padding: 14px 16px;

  background: var(--bg-muted);
  border-radius: var(--radius-md);
  border: none;
}

.hari_tanggal h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
}

.hari_tanggal p {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 2px;
}

.flexGrow {
  flex: 1 200px;
}

.not_found {
  margin-top: 50px;
  width: 100%;
  font-weight: 500;
  text-align: center;
  font-size: 25px;
  color: #6b788a;
  font-style: italic;
}

.no_task {
  text-align: center;
  position: relative;
  top: 50px;
  font-size: 20px;
  font-weight: 500;
  filter: drop-shadow(2px 2px 8px #d0d0d0);
  color: #6b788a;
  font-style: italic;
}

.kinerja-karyawan {
  border: var(--borderCard);
  margin-top: 20px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  /* border: 1px solid #e5e7eb; */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.kinerja-karyawan:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
}

.kinerja-karyawan .row {
  display: flex;
  align-items: center;
}

.kinerja-karyawan .profil {
  padding-bottom: 10px;
  font-weight: 300;
  font-size: 15px;
  flex-wrap: wrap;

  display: flex;
  align-items: center;
  gap: 15px;
}

.profil .user-summary {
  flex: 4;
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 9px;
}

.user-summary .profil-karyawan {
  display: flex;
  align-items: center;
  gap: 8px;
}

.profil-karyawan .cuti-wraper {
  position: relative;
  /* border: 1px solid #dbdbdb; */
}

.cuti-wraper .total-cuti {
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 0px;
  position: relative;
  top: -11px;

  cursor: pointer;

  border: 1px solid var(--border-soft);
  padding: 2px 5px;
  border-radius: 7px;

  text-wrap: nowrap;
}

.total-cuti svg {
  fill: #64748b;
  font-size: 10px;
  width: 14px;
  height: 14px;
}

.total-cuti span {
  transition: transform 0.2s ease;
}

.opened {
  transform: rotate(180deg);
}

.dropdown-cuti {
  font-size: 13px;

  position: absolute;
  top: 50%; /* tepat di bawah tombol */
  left: 0; /* atau left: 0 kalau mau rata kiri */

  width: 260px;
  margin-top: 8px;

  background: #fff;
  border-radius: 10px;
  padding: 12px;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  z-index: 10;

  animation: fadeIn 0.2s ease;
}

.dropdown-cuti .title {
  font-weight: 600;
  margin-bottom: 6px;
}

.jenis-cuti {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.disclaimer {
  font-size: 11px;
  color: #64748b;
  margin-top: 8px;
}

.user-summary .status-karyawan {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.status-karyawan .box {
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 6px;
  border: 1px solid #dbdbdb;
  text-wrap: nowrap;
}

.box i {
  font-size: 8px;
}

.status-karyawan .available i {
  color: rgb(0, 255, 0);
}

.status-karyawan .working i {
  color: red;
}

.profil .performance {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 12px;
}

.performance i {
  font-size: 30px;
}

.overloadTask {
  position: relative;
  background: #fff;
  z-index: 0;
  border: 5px solid #c0b838;
}

.overloadTask::before {
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

.underloadTask {
  background-color: rgb(255, 237, 237);
  border: 1px solid rgb(255, 204, 204);
  color: rgb(203, 0, 0);
}

.underloadTask svg {
  fill: rgb(203, 0, 0);
}

.normalTask {
  background-color: rgb(212, 255, 212);
  border: 1px solid rgb(154, 255, 154);
  color: green;
}

.container-summary {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.container-summary .summary-card {
  flex: 1 250px;
  padding: 15px;
  border-radius: 10px;
  font-weight: 400;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-card .ikon i {
  font-size: 30px;
}

.summary-card h4 {
  font-size: large;
}

.summary-expected {
  background-color: #f5f5f5;
  border: 1px solid #d1d1d1;
  color: #333333;
}

.detail_task {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 8px;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  margin: 10px 0;
}

.detail_task {
  background-color: blue;
  color: #fff;
}

.detail_task:hover {
  background-color: rgb(7, 7, 183);
}
</style>

<!-- Detail Page -->
<style scoped>
.filter .dates-picker {
  width: 600px;
}

.isi .header-detail {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
}

.header-detail .back-button {
  display: flex;
  border: 1px solid rgb(165, 192, 255);
  align-items: center;
  gap: 15px;
  font-size: 13px;
  padding: 5px 10px;
  border-radius: 8px;
  background-color: #fff;
  position: fixed;
  box-shadow: 2px 2px 8px rgb(170, 170, 170);
  z-index: 5;
  cursor: pointer;
  background-color: #0041c2;
  color: #fff;
}

.back-button:hover {
  background-color: #0037a6;
}

.container-progres {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  border-radius: 10px;
  gap: 20px;
  width: 100%;
}

.container-progres .progres-card {
  flex: 1;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  flex-direction: column;
  display: flex;
  gap: 6px;
}

.progres-card p {
  font-size: 15px;
}

.container-progres .complete {
  background: linear-gradient(145deg, #f7faff, #eef4ff);
  border: 1px solid rgba(136, 190, 255, 0.25);
}
.complete p {
  color: #2f5bd3;
}

.container-progres .on-progres {
  background: linear-gradient(145deg, #fff8f0, #fff1e6);
  border: 1px solid rgba(255, 170, 100, 0.25);
}
.on-progres p {
  color: #d96b1a;
}

.container-progres .to-do {
  background: linear-gradient(145deg, #faf7ff, #f3edff);
  border: 1px solid rgba(168, 85, 247, 0.25);
}
.to-do p {
  color: #7a4bd1;
}

.container-progres .cancel {
  background: linear-gradient(145deg, #fff5f5, #ffecec);
  border: 1px solid rgba(255, 120, 120, 0.25);
}
.cancel p {
  color: #d14343;
}

.bug-background {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* flex-direction: column; */
  flex-wrap: wrap;
  gap: 100px;
  z-index: 1005;
  pointer-events: all;
  width: 100vw;
  height: 101vh;
  overflow-y: scroll;

  backdrop-filter: blur(6px);
  background: rgba(15, 23, 42, 0.4);
  animation: fadeIn 0.2s ease-out;
}

.container {
  margin: 20px 0;

  background: #ffffff;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0.96);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.container:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.card-header {
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.card-header .card-title {
  color: var(--font-color);
  font-weight: 700;
}

.card-header .card-meta {
  display: flex;
  align-items: center;
  justify-content: right;
  gap: 10px;
  font-size: 11px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .task-header {
    flex-direction: column;
    align-items: baseline;
    gap: 8px;
  }
}

.card-meta .card-label {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 5px;
  border-radius: 7px;
  text-wrap: nowrap;
}

.card-meta .project,
.card-meta .bug {
  border: 1px solid var(--border_color);
  color: var(--font-color);
  cursor: default;
}

.card-description {
  margin: 5px 0 10px 0;
  font-weight: 400;
  font-size: small;
  color: var(--text-muted);

  white-space: pre-line;
}

.card-performance {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  padding: 12px;
}

.not_special {
  background-color: #f5f5f5;
}

.card-performance .performance-item p {
  font-weight: 400;
  font-size: 14px;
}

.card-performance .performance-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: #010101;
  margin: 0;
  padding: 0;
}

.penghargaan .label {
  margin-top: 10px;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  font-weight: 400;
  margin: 10px 0;
  flex-wrap: wrap;

  font-size: 13px;
  color: #64748b;
}

.card-info i {
  font-size: 16px;
  color: #94a3b8;
}

.card-info .info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  text-wrap: nowrap;
  font-size: 13.5px;
  font-weight: 400;
}

@media (max-width: 576px) {
  .card-info {
    flex-direction: column;
    gap: 10px;
    align-items: baseline;
  }
}
</style>

<!-- Foto Profil -->
<style scoped>
.photo-wrapper {
  width: 80px;
  height: 80px;
}

.photo-option {
  font-size: 25px;
}
</style>

<!-- Conditioning Color -->
<style scoped>
.late {
  background-color: rgb(255, 200, 200);
  border: 1px solid rgb(255, 100, 100);
  border-radius: 7px;
}

.late .penghargaan p {
  color: rgb(200, 0, 0);
}

.ontime {
  background-color: rgb(200, 255, 200);
  border: 1px solid rgb(100, 255, 100);
  border-radius: 7px;
}

.ontime .penghargaan p {
  color: rgb(0, 100, 0);
}

.early {
  background-color: rgb(200, 255, 200);
  border: 1px solid rgb(100, 255, 100);
  border-radius: 7px;
}

.early .penghargaan p {
  color: rgb(0, 100, 0);
}

.task_inProgres h4 {
  color: var(--font-color);
}

.taskTodo h4 {
  color: orange;
}

.task_review .task h4 {
  color: rgb(0, 255, 221);
}

.achiv_overload {
  background-color: red;
  border: 1px solid rgb(253, 199, 199);
}

.achiv_normal {
  background-color: green;
  border: 1px solid rgb(124, 255, 124);
}
.achiv_underload {
  background-color: orange;
  border: 1px solid rgb(251, 251, 45);
}

.taskCompleted {
  background-color: rgb(216, 255, 216);
  border: 1px solid rgb(115, 255, 115);
  color: green;
}

.taskInprogres {
  background-color: #fdff8b;
  border: 1px solid #ffff47;
}

.taskTodo {
  background-color: #b3b7bd;
  border: 1px solid rgb(176, 176, 255);
}

.taskInReview {
  background-color: #14b8a6;
  border: 1px solid rgb(176, 176, 255);
}

.taskCancelled {
  background-color: #ffb3b3;
  border: 1px solid #ff4d4d;
  color: #800000;
}

.urgent {
  background-color: rgb(255, 219, 219);
  border: 1px solid rgb(255, 137, 137);
  color: red;
}

.high {
  background-color: rgb(255, 255, 219);
  border: 1px solid rgb(255, 255, 95);
  color: rgb(220, 114, 0);
}

.minimum {
  background-color: rgb(221, 221, 255);
  border: 1px solid rgb(163, 163, 255);
  color: blue;
}

.low {
  background-color: #f5f5f5;
  border: 1px solid #dbdbdb;
}
</style>

<script>
import { formatTanggal, setDefaultTanggal } from "@/utils/helpers";

export default {
  data() {
    return {
      daftarKaryawan: [],
      sidebar: false,
      notFound: false,
      loading: false,
      sukses: false,
      detailKaryawan: null,
      // detailKaryawanBug: null,
      start: "",
      end: "",
      openTaskList: false,
      karyawanLuar: [],
      complete: [],
      progres: "",
      isLoading: false,
      isClose: false,
      taskBug: "",
      detailBug: null,
      daftarHari: [],
      notif: false,
      listNotifikasi: null,
    };
  },
  mounted() {
    const result = setDefaultTanggal();

    this.start = result.mulai;
    this.end = result.akhir;
  },
  methods: {
    onStartDateSelected() {
      this.$nextTick(() => {
        this.$refs.endPicker.openMenu();
      });
    },
    formatTanggalUI(tgl) {
      return new Date(tgl).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },
    notifClass(data) {
      return {
        positive: data === "+",
        negative: data === "-",
      };
    },
    getProfileImage(url) {
      const baseURL = "https://api.clickup.devlmu.com";

      if (!url) return "";

      return baseURL + url;
    },
    handleImgError(event) {
      event.target.src = "/img/profil.png";
    },
    setInitial(data) {
      if (!data) return "";

      const parts = data.trim().split(" ");
      const [firstName] = parts[0];
      const lastName = parts.length > 1 ? parts[1][0] : "";

      console.log("Nama pertama adalah:", firstName);
      console.log("Nama terakhir adalah:", lastName);

      return firstName + lastName;
    },
    onDateChange() {
      if (!this.start || !this.end) return;

      // Normalisasi range
      if (this.start > this.end) {
        this.start = this.end;
        return;
      }

      if (this.isLoading) return;

      this.ambilTask();
      // this.hariLibur();
    },
    closeSukses() {
      this.sukses = false;
    },

    async ambilTask() {
      this.isLoading = true;
      console.log("Ambil task dipanggil");
      try {
        const task = await this.$api.get(
          `/api/v1/workload/tasks-by-range?start_date=${formatTanggal(
            this.start,
          )}&end_date=${formatTanggal(this.end)}`,
        );
        // this.daftarKaryawan = task.data.assignees || [];
        console.log("TASK DATA:", task.data);
        const assignee = task.data.assignees?.[0] || null;

        this.detailKaryawan = assignee
          ? { ...assignee, imageError: false }
          : null;
        this.listNotifikasi = task.data.notifications || [];
        console.log("Berhasil ambil task:", task);
      } catch (error) {
        console.error("Gagal ambil task:", error);
        this.daftarKaryawan = [];
      } finally {
        this.isLoading = false;
      }
    },
    openTask() {
      this.openTaskList = !this.openTaskList;
    },
    statusLabel(status) {
      const map = {
        "done dev": "Done Dev",
        completed: "Completed",
        "in progress": "In Progress",
        "to do": "To Do",
        "in review": "In Review",
        cancelled: "Cancel",
      };
      return map[status] ?? "-";
    },
    priorityClass(priority) {
      return {
        urgent: priority === "urgent",
        high: priority === "high",
        minimum: priority === "normal",
        low: priority === "low",
      };
    },
    achivClass(achiv) {
      return {
        special: achiv > 100,
        ontime: achiv == 100,
        late: achiv < 100,
      };
    },
    totalBebanClass(beban = 0) {
      return {
        special: beban === "++",
        ontime: beban === "+",
        late: beban === "-" || !beban,
      };
    },
    ketepatanClass(ketepatan) {
      return {
        special: ketepatan === "++",
        ontime: ketepatan === "+",
        late: ketepatan === "-" || !ketepatan,
      };
    },
    performaClass(performa) {
      return {
        // special: performa > this.dataSetting.batas_atas,
        // ontime:
        //   performa >= this.dataSetting.batas_bawah &&
        //   performa <= this.dataSetting.batas_atas,
        // late: performa < this.dataSetting.batas_bawah,
        special: performa === "++",
        ontime: performa === "+",
        late: performa === "-" || !performa,
      };
    },
    availableClass(available) {
      return {
        available: available === "Available",
        working: available === "Working",
      };
    },
    workloadClass(workload) {
      return {
        overloadTask: workload === "Overload",
        underloadTask: workload === "Underload",
        normalTask: workload === "Normal",
      };
    },
    statusTaskClass(status) {
      return {
        taskTodo: status === "to do" || status === "backlog",
        taskCompleted: status === "done dev" || status === "completed",
        taskInprogres: status === "in progress",
        taskInReview: status === "in review",
        taskCancelled: status === "cancelled",
      };
    },
    handleCardClick(k) {
      // if (k.tags[0] !== "bugs") return;
      if (!k.bug_label) return;

      console.log("HandleCardClick berhasil di klik");

      this.showBugDetail(k);
    },

    showBugDetail(task) {
      this.detailBug = task.bug_source_info;
      console.log(task);
      console.log("Data detailBug", this.detailBug);
    },
    closeDetailBug() {
      this.detailBug = null;
    },
    openNotif() {
      this.notif = true;
    },
  },
  computed: {
    // filteredKaryawan() {
    //   let hasil = this.daftarKaryawan;
    //   // let hasilBug = this.daftarKaryawan;

    //   // filter nama
    //   if (this.searchInput) {
    //     hasil = hasil.filter((k) =>
    //       k.name.toLowerCase().includes(this.searchInput.toLowerCase())
    //     );
    //     this.notFound = hasil.length === 0;
    //   } else {
    //     this.notFound = false;
    //   }

    //   // filter posisi (role)
    //   if (this.posisi) {
    //     hasil = hasil.filter(
    //       (k) => k.role.toLowerCase() === this.posisi.toLowerCase()
    //     );
    //   }

    //   // Sortir Tertinggi

    //   // Performa Tasks
    //   if (this.sortPerform === "highest" || this.sortPerform === "lowest") {
    //     hasil = hasil
    //       .filter(
    //         (k) =>
    //           k.performance_bugs && typeof k.performance_bugs.score === "number"
    //       )

    //       .sort((a, b) => {
    //         if (this.sortPerform === "highest") {
    //           return b.performance_bugs.score - a.performance_bugs.score;
    //         }
    //         return a.performance_bugs.score - b.performance_bugs.score;
    //       });
    //   }

    //   // Performa Bug
    //   else if (
    //     this.sortPerformBug === "highest" ||
    //     this.sortPerformBug === "lowest"
    //   ) {
    //     hasil = hasil
    //       .filter(
    //         (k) =>
    //           k.performance_bugs && typeof k.performance_bugs.bugs === "number"
    //       )

    //       .sort((a, b) => {
    //         if (this.sortPerformBug === "highest") {
    //           return b.performance_bugs.bugs - a.performance_bugs.bugs;
    //         }
    //         return a.performance_bugs.bugs - b.performance_bugs.bugs;
    //       });
    //   }

    //   // Ketepatan Tugas
    //   else if (
    //     this.sortKetepatan === "highest" ||
    //     this.sortKetepatan === "lowest"
    //   ) {
    //     hasil = hasil
    //       .filter(
    //         (k) =>
    //           k.avg_time_efficiency &&
    //           typeof k.avg_time_efficiency.avg_percentage === "number"
    //       )
    //       .sort((a, b) => {
    //         if (this.sortKetepatan === "highest") {
    //           return (
    //             b.avg_time_efficiency.avg_percentage -
    //             a.avg_time_efficiency.avg_percentage
    //           );
    //         }
    //         return (
    //           a.avg_time_efficiency.avg_percentage -
    //           b.avg_time_efficiency.avg_percentage
    //         );
    //       });
    //   }
    //   // Beban Kerja
    //   else if (this.sortBeban === "highest" || this.sortBeban === "lowest") {
    //     hasil = hasil
    //       .filter(
    //         (k) =>
    //           k.total_spent_hours &&
    //           typeof k.total_spent_hours.percentage === "number"
    //       )
    //       .sort((a, b) => {
    //         if (this.sortBeban === "highest") {
    //           return (
    //             b.total_spent_hours.percentage - a.total_spent_hours.percentage
    //           );
    //         }
    //         return (
    //           a.total_spent_hours.percentage - b.total_spent_hours.percentage
    //         );
    //       });
    //   }

    //   // Performa Bug
    //   // Kode untuk Performa Bug

    //   return hasil;
    //   // return hasilBug;
    // },

    // filteredKaryawanDetail() {
    //   let hasil = this.detailKaryawan.tasks.length > 0 ? this.detailKaryawan.tasks : [];
    //   // filter berdasarkan progress task (jika dipilih)
    //   if (this.progres) {
    //     hasil = hasil.filter(
    //       (k) => k.status_name.toLowerCase() === this.progres.toLowerCase()
    //     );
    //   }
    //   // Filter Sortir
    //   if (
    //     this.sortKetepatanDetail === "highest" ||
    //     this.sortKetepatanDetail === "lowest"
    //   ) {
    //     hasil = hasil
    //       .filter((k) => typeof k.time_efficiency_percentage === "number")
    //       .sort((a, b) => {
    //         if (this.sortKetepatanDetail === "highest") {
    //           return (
    //             b.time_efficiency_percentage - a.time_efficiency_percentage
    //           );
    //         }
    //         return a.time_efficiency_percentage - b.time_efficiency_percentage;
    //       });
    //   }

    //   // Filter Bug & Task
    //   // if (this.taskBug) {
    //   //   hasil = hasil.filter(
    //   //     (k) =>
    //   //       (this.taskBug === "bug") ===
    //   //       k.tags?.some((t) => t.toLowerCase() === "bug")
    //   //   );
    //   // }

    //   if (this.taskBug === "bug") {
    //     hasil = hasil.filter((k) =>
    //       k.tags?.some((t) => t.toLowerCase() === "bug")
    //     );
    //   } else if (this.taskBug === "task") {
    //     hasil = hasil.filter(
    //       (k) => !k.tags?.some((t) => t.toLowerCase() === "bug")
    //     );
    //   }
    //   return hasil;
    // },
    listHariTanggal() {
      // let hasil = this.daftarHari;
      // let hari = hasil.hari_libur;

      // return hari;
      return this.daftarHari.flatMap((bulan) => bulan.hari_libur);
    },
    judulNotifikasi() {
      if (this.notifikasi.workload) {
        return "Beban Kerja";
      } else if (this.notifikasi.on_time) {
        return "Tepat Waktu Kerja";
      } else if (this.notifikasi.performance) {
        return "Performa Kerja";
      }
    },
    hasNotifikasi() {
      return this.listNotifikasi && this.listNotifikasi.length > 0;
    },
  },

  watch: {
    start: "onDateChange",
    end: "onDateChange",
  },
};
</script>
