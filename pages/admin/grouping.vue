<template>
  <div v-if="isLoading" class="loading">
    <div class="loading_tanggal">
      <i class="fa-solid fa-spinner"></i>
      <p>Tunggu Sebentar</p>
    </div>
  </div>

  <!-- daftar karyawan -->
  <div class="isi" :class="{ viewApp: isAppView }">
    <h2>Grouping</h2>
    <!-- <p>
      Karyawan dengan performa rendah (< {{ searchInput }}%) berdasarkan
      kategori
    </p> -->
    <p>Karyawan dengan performa rendah (< 85%) berdasarkan kategori</p>
    <div class="filter">
      <div class="title">
        <i class="fa-solid fa-filter"></i>
        <p>Filter & Pencarian</p>
      </div>
      <div class="search-tanggal">
        <div class="dates">
          <label for="tanggal">Tanggal</label>
          <div class="tanggal">
            <!-- <input type="date" name="start" v-model="start" /> -->
            <ClientOnly>
              <VueDatePicker
                format="dd-MM-yyyy"
                v-model="start"
                model-type="yyyy-MM-dd"
                :time-config="{ enableTimePicker: false }"
            /></ClientOnly>
            <span class="separator">➡️</span>
            <!-- <input type="date" name="end" v-model="end" /> -->
            <ClientOnly>
              <VueDatePicker
                format="dd-MM-yyyy"
                v-model="end"
                model-type="yyyy-MM-dd"
                :time-config="{ enableTimePicker: false }"
            /></ClientOnly>
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
        <div class="kurang-lebih-dari">
          <label for="">Kurang/lebih dari</label>
          <div class="kurang-lebih">
            <select name="" id="" v-model="kurangLebih">
              <option value="kurangDari">Kurang Dari</option>
              <option value="lebihDari">Lebih Dari</option>
            </select>
          </div>
        </div>
        <div class="search-input">
          <label for="">Set default</label>
          <div class="search">
            <input type="number" v-model="searchInput" />
          </div>
        </div>
      </div>
    </div>

    <div class="container-kategory">
      <div
        class="kategory"
        v-for="(kategori, index) in filteredKaryawan"
        :key="kategori.category"
      >
        <div class="header-kategory">
          <h4>{{ kategori.category }}</h4>
          <p>{{ kategori.data.length }} Karyawan</p>
        </div>
        <div class="container-karyawan">
          <div
            class="group-karyawan"
            v-for="(k, index) in kategori.data"
            :key="k.clickup_id"
            @click="cekDetail(k.clickup_id)"
          >
            <div class="left">
              <div class="index">
                <p>{{ index + 1 }}</p>
              </div>
              <div class="profil-karyawan">
                <div class="photo-wrapper" @click.stop>
                  <img
                    v-if="!k.imageError"
                    :src="getProfileImage(k.profile_picture_url)"
                    alt="Profile Picture"
                    @error="k.imageError = true"
                  />

                  <div
                    class="photo-option"
                    :style="{ backgroundColor: k.color}"
                    v-else
                  >
                    <p>{{ setInitial(k.name) }}</p>
                  </div>

                  <!-- <div class="camera-overlay" @click.stop="triggerFileInput(k)">
                    <i class="fa-solid fa-camera"></i>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    :ref="'fileInput-' + k.clickup_id"
                    class="hidden-file"
                    @change="handlePhotoChange($event, k)"
                  /> -->
                </div>
                <div class="name-role">
                  <h4>{{ k.name }}</h4>
                  <p>{{ k.role }}</p>
                </div>
              </div>
            </div>
            <div class="right">
              <h4 :class="teksColorClass(k.value)" v-if="k.missing_hours">
                {{ k.value }}% <span>({{ k.missing_hours }} Jam)</span>
              </h4>
              <h4 :class="teksColorClass(k.value)" v-else>{{ k.value }}%</h4>
              <p>{{ kategori.category }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="isi" v-else-if="selectedKaryawan">
    <div class="detail-page">
      <div class="header">
        <button class="back" @click="$router.back()">← Kembali</button>

        <div class="profile">
          <img src="/img/profil.png" alt="profil" />
          <div class="info">
            <h2>{{ selectedKaryawan.name }}</h2>
            <p>{{ selectedKaryawan.role }}</p>
            <div class="badge">
              <span :class="workloadClass">{{
                selectedKaryawan.workload_status
              }}</span>
              <span class="available">{{
                selectedKaryawan.availability_status
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="kpi">
        <div class="card">
          <p>Beban Kerja</p>
          <h3>{{ selectedKaryawan.performance_bugs.workload_score }}%</h3>
        </div>
        <div class="card">
          <p>Tepat Waktu</p>
          <h3>{{ onTimeScore }}%</h3>
        </div>
        <div class="card">
          <p>Performa Bug</p>
          <h3>{{ selectedKaryawan.performance_bugs.bugs }}</h3>
        </div>
        <div class="card">
          <p>Total Task</p>
          <h3>{{ selectedKaryawan.total_tasks }}</h3>
        </div>
      </div>

      <div class="section">
        <h3>Jam Kerja</h3>
        <ul>
          <li>Expected : {{ selectedKaryawan.expected_hours }} jam</li>
          <li>Spent : {{ selectedKaryawan.total_spent_hours.hours }} jam</li>
          <li>
            Selisih :
            <strong
              :class="{
                over:
                  selectedKaryawan.total_spent_hours.hours >
                  selectedKaryawan.expected_hours,
              }"
            >
              {{ selisihJam }} jam
            </strong>
          </li>
        </ul>
      </div>

      <div class="section">
        <h3>Daftar Task</h3>

        <div v-if="!selectedKaryawan.tasks.length" class="empty">
          Tidak ada task
        </div>

        <div
          class="task-card"
          v-for="task in selectedKaryawan.tasks"
          :key="task.id"
        >
          <div class="task-header">
            <h4>{{ task.name }}</h4>
            <span class="status" :class="task.status_type">
              {{ task.status_name }}
            </span>
          </div>

          <p class="project">{{ task.project_name }}</p>

          <div class="meta">
            <span>Est: {{ task.time_estimate_hours }}j</span>
            <span>Spent: {{ task.time_spent_hours }}j</span>
            <span>Selesai: {{ task.date_done }}</span>
          </div>

          <div class="tags">
            <span v-for="tag in task.tags" :key="tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <div class="section insight">
        <h3>Insight</h3>
        <ul>
          <li v-if="selectedKaryawan.performance_bugs.workload_score > 100">
            ⚠️ Beban kerja melebihi kapasitas
          </li>
          <li v-if="onTimeScore < 100">
            ⚠️ Beberapa task melewati estimasi waktu
          </li>
          <li v-if="selectedKaryawan.total_tasks">
            ✅ Task berhasil diselesaikan
          </li>
        </ul>
      </div>
    </div>
  </div> -->
</template>

<!-- Style Filter Sortir -->
<style scoped>
.style_sortir label,
.style_progres label,
.sortir_style label,
.filter_task label {
  padding-left: 2px;
  text-wrap: nowrap;
  font-size: 14px;
  font-weight: 500;
}

.sortir_ketepatan {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-width='32' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='200'/%3E%3Cpath d='M160 270l56 56 136-136'/%3E%3C/svg%3E")
    no-repeat 10px center;
  background-size: 14px;
}

.sortir_performa,
.sortir_beban,
.sortir_ketepatan,
.select_task,
.task_style {
  border: var(--borderCard);
  font-size: 14px;
  padding: 8px 8px 8px 35px;
  border-radius: 6px;
  /* margin-top: 20px; */
  display: block;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter_task {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.sortir_style,
.style_progres,
.filter_bug {
  width: 300px;
}
</style>

<style scoped>
* {
  -webkit-font-smoothing: antialiased;
}

.container-kategory {
  margin-top: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.kategory {
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}

.header-kategory {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-kategory h4 {
  font-size: 18px;
  font-weight: 600;
}

.header-kategory p {
  font-size: 14px;
  color: #6b7280;
}

.container-karyawan {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-karyawan {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  padding: 16px 18px;
  border-radius: 14px;
  border: none;
  transition: all 0.2s ease;
}

.group-karyawan:hover {
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.group-karyawan .left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.left .index {
  background: linear-gradient(135deg, #6366f1, #4338ca);
  width: 36px;
  height: 36px;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.left .profil-karyawan {
  display: flex;
  align-items: center;
  gap: 12px;
  text-transform: capitalize;
}

.profil-karyawan img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.name-role h4 {
  font-size: 15px;
  font-weight: 600;
}

.name-role p {
  font-size: 13px;
  color: #6b7280;
}

.group-karyawan .right {
  text-align: right;
}

.right h4 {
  font-size: 16px;
  font-weight: 700;
}

.right span {
  font-size: 13px;
  font-weight: 400;
  color: #6b7280;
}

.right p {
  font-size: 13px;
  color: #9ca3af;
}

.search-tanggal {
  display: flex;
  margin-top: 20px;
  gap: 20px;
  /* border: 1px solid #010101; */
  flex-wrap: wrap;
}

.dates {
  /* width: 35%; */
  flex: 1;
  min-width: 300px;
}

.kurang-lebih-dari,
.search-input {
  /* width: 25%; */
  flex: 1;
  min-width: 250px;
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
  /* padding: 10px; */
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
</style>

<!-- Responsive -->
<style scoped>
@media (max-width: 576px) {
  .right h4 {
    display: flex;
    flex-direction: column;
  }

  .card_karyawan {
    font-size: 14px;
    flex-wrap: wrap;
  }

  .card_karyawan .card_profile {
    width: 75%;
  }

  .header_container {
    flex-wrap: wrap;
    gap: 10px;
  }

  .keterangan_waktu {
    display: flex;
    flex-direction: column; /* ⬅️ lebih tepat daripada wrap */
    gap: 6px; /* ⬅️ jarak antar baris */
    align-items: flex-start;
  }

  .keterangan_waktu .jam,
  .keterangan_waktu .start_date,
  .keterangan_waktu .deadline,
  .keterangan_waktu .done_date,
  .keterangan_waktu .created_by {
    margin: 0;
    width: 100%;
    line-height: 0;
  }
}
</style>

<!-- Conditioning color -->
<style scoped>
.bad {
  color: red;
}

.normal {
  color: green;
}

.good {
  color: gold;
  filter: drop-shadow(2px 2px 4px rgb(255, 251, 228));
}

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
  padding: 5px;
}

.ontime .penghargaan p {
  color: rgb(0, 100, 0);
}

.early {
  background-color: rgb(200, 255, 200);
  border: 1px solid rgb(100, 255, 100);
  border-radius: 7px;
  padding: 5px;
}

.early .penghargaan p {
  color: rgb(0, 100, 0);
}
</style>

<!-- Container Progress -->
<style scoped>
.posisi select,
.posisi select option {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.container_progres {
  display: flex;
  justify-content: space-between;
  /* margin: 20px; */
  padding: 10px 0 20px 0;
  /* background-color: #f5f5f5; */
  border-radius: 10px;
  gap: 20px;
  width: 100%;
}

.container_selesai,
.container_onProgres,
.container_todo,
.container_cancel {
  flex: 1;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  flex-direction: column;
  display: flex;
  gap: 6px;
}

.container_selesai p,
.container_onProgres p,
.container_todo p,
.container_cancel p {
  font-size: 15px;
}

.container_selesai {
  background-color: rgb(233, 243, 255);
  border: 1px solid rgb(136, 190, 255);
}
.container_selesai p {
  color: rgb(16, 50, 130);
}

.container_onProgres {
  background-color: rgb(255, 244, 230);
  border: 1px solid rgb(255, 200, 150);
}
.container_onProgres p {
  color: rgb(218, 58, 0);
}

.container_todo {
  background-color: #f3e8ff;
  border: 1px solid #d8b4fe;
}
.container_todo p {
  color: purple;
}

.container_cancel {
  background-color: rgb(255, 224, 224);
  border: 1px solid rgb(255, 130, 130);
}

.container_cancel p {
  color: red;
}
</style>

<style scoped>
.isi .header_task {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
}

.header_task .back_button {
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
  /* margin: 10px 0; */
  cursor: pointer;
  /* background-color: rgb(16, 50, 130); */
  background-color: #0041c2;
  color: #fff;
}

.back_button:hover {
  background-color: #0037a6;
}

.detailTask_karyawan .name_karyawan {
  font-size: 23px;
  font-weight: 500;
  color: rgb(16, 50, 130);
  margin: 10px 0;
}

.detailTask_karyawan .periode {
  font-size: 16px;
  font-weight: 300;
}

.card_karyawan {
  margin: 20px 0;
  background: var(--bg-card);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid var(--border-soft);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease;
}

.card_karyawan:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
}

.card_karyawan .card_profile {
  flex-wrap: wrap;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.card_profile .card_left {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 70%;
}

.card_karyawan .card_profile .card_left img {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e0e7ff;
}

.card_name h3 {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.card_name p {
  font-size: 14px;
  color: #64748b;
}

.card_profile .performa_karyawan {
  flex: 2;
}

.card_karyawan .card_task {
  text-align: end;
  font-weight: 400;
}

.isi .container {
  /* position: relative;
  top: 20px; */
  border: 1px solid var(--border_color);
  /* background-color: var(--border_color); */
  padding: 20px;
}

.task h4 {
  margin: 25px 0 0 0;
  font-weight: 500;
  color: green;
}

.task .container_task {
  margin: 20px 0;

  background: #ffffff;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.container_task:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.header_container {
  font-size: 16px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.header_container .name_task p {
  color: var(--font-color);
  font-weight: 500;
}

.status_task {
  display: flex;
  gap: 10px;
  font-size: 11px;
  font-weight: 500;
}

.status_task .bug {
  cursor: pointer;
}

.status_task .task_project,
.bug {
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: #fff;
  border: 1px solid var(--border_color);
  border-radius: 7px;
  padding: 2px 5px;
  padding-top: 4px;
  color: var(--font-color);
}

.status_task .progres_task {
  border-radius: 7px;
  padding: 2px 5px;
  display: flex;
  align-items: center;
  text-wrap: nowrap;
}

.task_priority {
  padding: 2px 5px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  text-wrap: nowrap;
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
  border: rgb(163, 163, 255);
  color: blue;
}

.low {
  background-color: #f5f5f5;
  border: 1px solid #dbdbdb;
}

.description {
  margin: 10px 0;
  font-weight: 300;
}

.achievement {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* gap: 10px; */
  border-radius: 10px;
  padding: 12px;
}

.not_special {
  background-color: #f5f5f5;
}

.achievement .achievement_logo i {
  /* color: green; */
  font-weight: 600;
}

.achievement .penghargaan p {
  font-weight: 400;
  /* color: green; */
  font-size: 14px;
}

.achievement .penghargaan h4 {
  font-size: 16px;
  font-weight: 600;
  color: #010101;
  margin: 0;
  padding: 0;
}

.penghargaan .label {
  margin-top: 10px;
}

.keterangan_waktu {
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

.keterangan_waktu i {
  font-size: 16px;
  color: #94a3b8;
}

.keterangan_waktu .jam,
.start_date,
.deadline,
.done_date,
.created_by {
  display: flex;
  align-items: center;
  gap: 4px;
  text-wrap: nowrap;
  font-size: 13.5px;
  font-weight: 400;
}

.jenis_data {
  display: flex;
  gap: 15px;
  font-size: 12px;
}

.jenis_data .form,
.jenis {
  padding: 2px 5px;
  border: 1px solid var(--border_color);
  border-radius: 7px;
  color: var(--font-color);
}

.task_inProgres h4 {
  color: var(--font-color);
}

.task_todo h4 {
  color: orange;
}

.task_review .task h4 {
  color: rgb(0, 255, 221);
}

.select_task,
.sortir,
.task_style {
  border: 1px solid var(--border_color);
  padding: 8px 8px 8px 30px;
  font-size: 14px;
  border-radius: 6px;
  background-color: #fff;
}

.select_task {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' stroke='%2364748b' stroke-width='32' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='160'/%3E%3Cpath d='M256 96v160l96 64'/%3E%3Cpath d='M64 96h384M128 160h256'/%3E%3C/svg%3E")
    no-repeat 10px center;
  background-size: 14px;
  background-color: #fff;
}

.task_style {
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M32%2064C19.1%2064%207.4%2071.8%202.4%2083.8S.2%20109.5%209.4%20118.6L192%20301.3V416c0%208.5%203.4%2016.6%209.4%2022.6l64%2064c9.2%209.2%2022.9%2011.9%2034.9%206.9S320%20492.9%20320%20480V301.3L502.6%20118.6c9.2%209.2%2011.9%2022.9%206.9%2034.9S492.9%2064%20480%2064H32z'/></svg>")
    no-repeat 12px center;
  background-size: 14px;
  background-color: #fff;
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

<!-- Edit image -->
<style scoped>
.photo-wrapper {
  position: relative;
  width: 40px;
  height: 40px;
  /* margin: 0 auto; */
}

.photo-wrapper img,
.photo-option {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid rgb(193, 222, 232);
  transition: 0.2s ease;
}

.photo-option {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  /* background: linear-gradient(135deg, #3b82f6, #6366f1); */
  color: white;
  border: none;
}

/* .photo-option {
  background-color: red;
  width: 100%;
  height: 100%;
  border-radius: 50%;
} */

/* Overlay */
.camera-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.2s ease;

  z-index: 10;
}

.photo-wrapper:hover .camera-overlay {
  opacity: 1;
}

/* Hidden file input */
.hidden-file {
  display: none;
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
      daftarKaryawan: [],
      sidebar: false,
      loading: false,
      sukses: false,
      start: "",
      end: "",
      isLoading: false,
      isClose: false,
      default: 85,
      searchInput: 85,
      kurangLebih: "kurangDari",
      assigneeColors: {},
    };
  },

  components: {
    VueDatePicker,
  },
  mounted() {
    this.setDefaultTanggal();
    // this.ambilTask();
    // this.hariLibur();
  },
  methods: {
    getProfileImage(url) {
      const baseURL = "https://api.clickup.devlmu.com";

      if (!url) return "";

      return baseURL + url;
    },
    // handleImgError(event) {
    //   event.target.src = "/img/profil.png";
    // },
    getUserColor(name) {
      if (this.assigneeColors[name]) {
        return this.assigneeColors[name];
      }

      // --- FNV-1a hash implementation ---
      let hash = 2166136261;
      for (let i = 0; i < name.length; i++) {
        hash ^= name.charCodeAt(i);
        hash +=
          (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
      }

      // Convert hash to RGB
      const red = (hash >> 16) & 255;
      const green = (hash >> 8) & 255;
      const blue = hash & 255;

      const color = `#${this.toHex(red)}${this.toHex(green)}${this.toHex(blue)}`;

      this.assigneeColors[name] = color;
      return color;
    },

    toHex(value) {
      return value.toString(16).padStart(2, "0");
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
    teksColorClass(warna) {
      return {
        good: warna > 100,
        normal: warna == 100,
        bad: warna < 100,
      };
    },
    onDateChange() {
      if (!this.start || !this.end) return;
      if (this.isLoading) return;

      const startDate = new Date(this.start);
      const endDate = new Date(this.end);

      if (startDate > endDate) {
        this.start = this.end;
        return;
      }
      const format = (date) => date.toISOString().split("T")[0];

      // this.$router.replace({
      //   query: {
      //     startDate: format(startDate),
      //     endDate: format(endDate),
      //   },
      // });
      this.$router.replace({
        path: "/admin/grouping",
        query: {
          ...this.$route.query, // 🔥 PENTING
          start: this.formatTanggal(this.start),
          end: this.formatTanggal(this.end),
        },
      });

      this.ambilTask();
    },

    logout() {
      const token = useCookie("token");
      token.value = null;
      this.$router.push("/login");
    },
    formatTanggal(tgl) {
      const [year, month, day] = tgl.split("-");
      return `${day}-${month}-${year}`;
    },

    setDefaultTanggal() {
      if (this.start && this.end) return;
      const today = new Date();
      const firstDay = new Date();
      // sevenDaysAgo.setDate(today.getDate() - 30);
      firstDay.setDate(1);

      // Format ke YYYY-MM-DD (format input type="date")
      const format = (date) => date.toISOString().split("T")[0];
      this.start = format(firstDay);
      this.end = format(today);

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
    closeSukses() {
      this.sukses = false;
    },

    async ambilTask() {
      this.isLoading = true;
      console.log("Ambil task dipanggil");
      try {
        const task = await this.$api.get(
          `/api/v1/workload/tasks-by-range?start_date=${this.formatTanggal(
            this.start,
          )}&end_date=${this.formatTanggal(this.end)}`,
        );

        this.daftarKaryawan = task.data.grouping || [];
        this.daftarKaryawan = task.data.grouping.map((k) => ({
          ...k,
          imageError: false,
        }));

        console.log("Berhasil ambil task:", task);
      } catch (error) {
        console.error("Gagal ambil task:", error);
        this.daftarKaryawan = [];
      } finally {
        this.isLoading = false;
      }
    },

    async syncData() {
      // Prevent Spam Klik
      if (this.loading) return;

      console.log("Sync data di proses");

      this.loading = true;
      this.sukses = false;

      try {
        const sync = await this.$api.post("/api/v1/sync/all");
        // this.daftarKaryawan = sync.data;
        console.log("Berhasil: ", sync);
        // alert("Berhasil");
        this.loading = false;

        // Sukses
        this.sukses = true;

        // Hidden animasi
        setTimeout(() => {
          this.sukses = false;
        }, 15000);
      } catch (error) {
        console.error("Sync tidak berfungsi:", error);
        this.loading = false;
        setTimeout(() => {
          alert("Sync data gagal");
        }, 500);

        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
        console.log("MESSAGE:", error.message);
      } finally {
        this.sukses = true;
        this.loading = false;
      }
    },
    cekDetail(clickupId) {
      if (!clickupId) {
        console.warn("clickup_id kosong");
        return;
      }

      this.$router.push({
        path: "/admin/bebanKerja",
        query: {
          id: clickupId,
          start: this.start,
          end: this.end,
          source: "grouping",
        },
      });
    },

    menu() {
      this.sidebar = true;
    },
    close() {
      this.isClose = true;

      setTimeout(() => {
        this.sidebar = false;
        this.isClose = false;
      }, 200);
    },
    kembali() {
      this.selectedKaryawan = null;
      this.progres = "";
      this.sortKetepatanDetail = "";
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
        backlog: "Backlog",
      };
      return map[status] ?? "-";
    },
  },

  computed: {
    // detailKaryawanMap() {
    //   const map = {};
    //   this.detailKaryawan.forEach((a) => {
    //     map[a.clickup_id] = a;
    //   });
    //   return map;
    // },

    filteredKaryawan() {
      const limit = Number(this.searchInput);

      if (isNaN(limit)) {
        return this.daftarKaryawan || [];
      }

      if (this.kurangLebih === "kurangDari") {
        return (this.daftarKaryawan || [])
          .map((group) => ({
            ...group,
            data: group.data.filter((k) => Number(k.value) < limit),
          }))
          .filter((group) => group.data.length > 0);
      }
      if (this.kurangLebih === "lebihDari") {
        return (this.daftarKaryawan || [])
          .map((group) => ({
            ...group,
            data: group.data.filter((k) => Number(k.value) > limit),
          }))
          .filter((group) => group.data.length > 0);
      }
    },
    isAppView() {
      return this.$route.query.view === "app";
    },
  },

  watch: {
    start: "onDateChange",
    end: "onDateChange",

    // query berubah → fetch data
    // "$route.query": {
    //   handler() {
    //     if (!this.$route.query.start || !this.$route.query.end) return;
    //     this.ambilTask();
    //   },
    //   immediate: true,
    // },
  },
};
</script>
