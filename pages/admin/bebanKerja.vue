<template>
  <div class="isi" v-if="detailKaryawan === null">
    <div v-if="isLoading" class="loading">
      <div class="loading_tanggal">
        <i class="fa-solid fa-spinner"></i>
        <p>Tunggu Sebentar</p>
      </div>
    </div>

    <h2>Manajemen Beban Kerja</h2>
    <p>
      Pantau dan kelola beban kerja karyawan berdasarkan total jam dan jumlah
      task
    </p>
    <!-- Filter -->
    <div class="filter">
      <div class="title">
        <i class="fa-solid fa-filter"></i>
        <p>Filter & Pencarian</p>
      </div>
      <form action="">
        <div class="cari">
          <label for="search">Cari Karyawan</label>
          <input
            type="search"
            name="search"
            placeholder="Cari nama karyawan"
            v-model="searchInput"
          />
        </div>
        <div class="posisi">
          <label for="posisi">Filter Posisi</label>
          <select v-model="posisi">
            <option value="" selected>Semua Posisi</option>
            <option value="analis">Data Analys</option>
            <option value="backend">Backend</option>
            <option value="web">Web Developer</option>
            <option value="mobile apps">Mobile Apps</option>
            <option value="UI-UX">UI-UX</option>
          </select>
        </div>
        <div class="dates">
          <label for="tanggal">Tanggal</label>
          <div class="tanggal">
            <!-- <input type="date" name="start" v-model="start" /> -->
            <VueDatePicker
              format="dd-MM-yyyy"
              v-model="start"
              model-type="yyyy-MM-dd"
              :time-config="{ enableTimePicker: false }"
            />
            <span class="separator">➡️</span>
            <!-- <input type="date" name="end" v-model="end" /> -->
            <VueDatePicker
              format="dd-MM-yyyy"
              v-model="end"
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
      </form>
    </div>
    <!-- <div class="keterangan_kerja">
        <div class="total_karyawan">
          <p>Total Karyawan</p>
          <p class="font_color">1</p>
        </div>
        <div class="overload">
          <p>Overload</p>
          <p class="font_color">0</p>
        </div>
        <div class="normal">
          <p>Normal</p>
          <p class="font_color">1</p>
        </div>
        <div class="underload">
          <p>Underload</p>
          <p class="font_color">0</p>
        </div>
        <div class="average">
          <p>Rata-rata Jam</p>
          <p class="font_color">0</p>
        </div>
        <div class="upcoming">
          <p>Total Upcoming</p>
          <p class="font_color">0</p>
        </div>
      </div> -->

    <div class="holiday">
      <div class="header_holiday">
        <p>📅 Hari Libur</p>
        <!-- <p>{{ daftarHari }}</p> -->
      </div>
      <div class="list_hari">
        <div
          class="hari_tanggal"
          v-for="(h, index) in daftarHari"
          :key="index"
          v-if="daftarHari && daftarHari.length"
        >
          <h4>{{ h.hari }}, {{ h.tanggal.split("-")[0] }} {{ h.bulan }}</h4>
          <p>{{ h.keterangan }}</p>

          <!-- <h4>01 Kamis</h4>
            <p>Hari Raya Idul Fitri</p> -->
        </div>
        <div class="no_tanggal" v-if="!daftarHari?.length">
          <h4>Belum ada Hari libur</h4>
        </div>
      </div>
    </div>

    <div class="filter">
      <div class="title">
        <i class="fa-solid fa-filter"></i>
        <p>Sortir Kinerja Karyawan</p>
      </div>
      <div class="filter_sortir">
        <div class="style_sortir">
          <label for="">Performa</label>
          <select name="" id="" class="sortir_performa" v-model="sortPerform">
            <option value="">Semua Performa</option>
            <option value="highest">Tertinggi</option>
            <option value="lowest">Terendah</option>
          </select>
        </div>

        <!-- <div class="style_sortir">
            <label for="">Performa Bug</label>
            <select
              name=""
              id=""
              class="sortir_performa"
              v-model="sortPerformBug"
            >
              <option value="">Semua Performa</option>
              <option value="highest">Tertinggi</option>
              <option value="lowest">Terendah</option>
            </select>
          </div> -->

        <div class="style_sortir">
          <label for="">Ketepatan Tugas</label>
          <select
            name=""
            id=""
            class="sortir_ketepatan"
            v-model="sortKetepatan"
          >
            <option value="">Semua Ketepatan</option>
            <option value="highest">Tertinggi</option>
            <option value="lowest">Terendah</option>
          </select>
        </div>

        <div class="style_sortir">
          <label for="">Beban Kerja</label>
          <select name="" id="" class="sortir_beban" v-model="sortBeban">
            <option value="">Semua Beban Kerja</option>
            <option value="highest">Tertinggi</option>
            <option value="lowest">Terendah</option>
          </select>
        </div>
      </div>
    </div>

    <div class="not_found" v-show="notFound">
      <p><i>Not Found</i></p>
    </div>

    <div
      class="kinerja_karyawan"
      v-for="k in filteredKaryawan"
      :key="k.clickup_id"
    >
      <div class="profil">
        <div class="profil_karyawan">
          <img src="/img/profil.png" alt="" />
          <div class="about">
            <h4>{{ k.username }}</h4>
            <p>{{ k.role }}</p>
          </div>
        </div>

        <div class="status_karyawan">
          <div :class="availableClass(k.availability_status)">
            <i class="fa-solid fa-circle"></i>
            <p>{{ k.availability_status }}</p>
          </div>
          <div :class="workloadClass(k.workload_status)">
            <i
              class="fa-solid fa-arrow-trend-up"
              v-if="k.workload_status === 'Overload'"
            ></i>
            <i
              class="fa-solid fa-minus"
              v-if="k.workload_status === 'Normal'"
            ></i>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16px"
              viewBox="0 -960 960 960"
              width="16px"
              v-if="k.workload_status === 'Underload'"
            >
              <path
                d="M640-240v-80h104L536-526 376-366 80-664l56-56 240 240 160-160 264 264v-104h80v240H640Z"
              />
            </svg>
            <p>{{ k.workload_status }}</p>
          </div>
        </div>
        <div
          class="performa_karyawan"
          :class="performaClass(k.performance_bugs.score)"
        >
          <i class="fa-solid fa-chart-line"></i>
          <div class="text">
            <p>Performa</p>
            <span
              ><strong>{{ k.performance_bugs.score }}%</strong></span
            >
          </div>
        </div>
      </div>

      <!-- <details class="details">
          <summary class="beban_karyawan">Beban Kerja Karyawan</summary> -->
      <div class="keterangan_karyawan">
        <div class="container_flex">
          <div
            class="ketepatan_pengerjaan"
            :class="ketepatanClass(k.avg_time_efficiency.avg_percentage)"
          >
            <div class="teks">
              <p>Tepat Waktu Kerja</p>
              <h4>{{ k.avg_time_efficiency.avg_percentage }}%</h4>
            </div>
            <div class="ikon">
              <i class="fa-solid fa-list-check"></i>
            </div>
          </div>

          <div class="total_seharusnya">
            <div class="teks">
              <p>Total Beban Kerja (Seharusnya)</p>
              <h4>{{ k.expected_hours }} Jam</h4>
            </div>
            <div class="ikon">
              <i class="fa-regular fa-clock"></i>
            </div>
          </div>
          <div
            class="total_beban"
            :class="totalBebanClass(k.total_spent_hours.percentage)"
          >
            <div class="teks">
              <p>Total Beban Kerja (Aktif)</p>
              <h4>
                {{ k.total_spent_hours.percentage }}% ({{
                  k.total_spent_hours.hours
                }}
                Jam)
              </h4>
            </div>
            <div class="ikon">
              <i class="fa-regular fa-clock"></i>
            </div>
          </div>
          <div
            class="performa_bug"
            :class="performaClass(k.performance_bugs.bugs)"
          >
            <div class="teks">
              <p>Performa Bug</p>
              <h4>{{ k.performance_bugs.bugs }}%</h4>
            </div>
            <div class="ikon">
              <i class="fa-solid fa-bug"></i>
            </div>
          </div>
        </div>
      </div>
      <!-- </details> -->

      <div class="detail_task" @click="detail(k)">
        <i class="fa-solid fa-list-check"></i>
        <p>Informasi Detail</p>
        <i class="fa-solid fa-arrow-up-from-bracket"></i>
      </div>
      <!-- <div class="detail_bug" @click="detailBug(k)">
          <i class="fa-solid fa-list-check"></i>
          <p>Bug Detail (Bug)</p>
          <i class="fa-solid fa-arrow-up-from-bracket"></i>
        </div> -->
    </div>
  </div>

  <!-- Details Task -->
  <div class="isi" :class="{ hidden: detailBug }" v-else-if="detailKaryawan">
    <div class="header_task">
      <div class="back_button" @click="kembali">
        <i class="fa-solid fa-arrow-left"></i>
        <p>Kembali</p>
      </div>
    </div>

    <div class="card_karyawan">
      <div class="card_profile">
        <div class="card_left">
          <img src="/img/profil.png" alt="" />
          <div class="card_name">
            <h3>{{ detailKaryawan.username }}</h3>
            <p>{{ detailKaryawan.role }}</p>
            <div class="periode">
              <p v-if="start === '' && end === ''">Seluruh Periode</p>
              <p v-else>Periode: {{ start }} - {{ end }}</p>
            </div>
          </div>
        </div>

        <div class="status_karyawan">
          <div :class="availableClass(detailKaryawan.availability_status)">
            <i class="fa-solid fa-circle"></i>
            <p>{{ detailKaryawan.availability_status }}</p>
          </div>
          <div :class="workloadClass(detailKaryawan.workload_status)">
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
        <div
          class="performa_karyawan"
          :class="performaClass(detailKaryawan.performance_bugs.score)"
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
      <div class="keterangan_karyawan">
        <div class="container_flex">
          <div
            class="ketepatan_pengerjaan"
            v-if="detailKaryawan.avg_time_efficiency.avg_percentage"
            :class="
              ketepatanClass(detailKaryawan.avg_time_efficiency.avg_percentage)
            "
          >
            <div class="teks">
              <p>Tepat Waktu Kerja</p>
              <h4>{{ detailKaryawan.avg_time_efficiency.avg_percentage }}%</h4>
            </div>
            <div class="ikon">
              <i class="fa-solid fa-list-check"></i>
            </div>
          </div>
          <div class="total_seharusnya">
            <div class="teks">
              <p>Total Beban Kerja (Seharusnya)</p>
              <h4>{{ detailKaryawan.expected_hours }} Jam</h4>
            </div>
            <div class="ikon">
              <i class="fa-regular fa-clock"></i>
            </div>
          </div>
          <div
            class="total_beban"
            :class="
              totalBebanClass(detailKaryawan.total_spent_hours.percentage)
            "
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
            class="performa_bug"
            :class="performaClass(detailKaryawan.performance_bugs.bugs)"
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
    </div>

    <div class="container_progres">
      <div class="container_selesai">
        <p>Selesai</p>
        <p>
          <strong
            >{{ detailKaryawan.task_status_summary.completed }} Task</strong
          >
        </p>
      </div>
      <div class="container_onProgres">
        <p>Sedang Dikerjakan</p>
        <p>
          <strong
            >{{ detailKaryawan.task_status_summary.in_progress }} Task</strong
          >
        </p>
      </div>
      <div class="container_todo">
        <p>Akan Datang</p>
        <p>
          <strong
            >{{ detailKaryawan.task_status_summary.upcoming }} Task</strong
          >
        </p>
      </div>
      <div class="container_cancel">
        <p>Dibatalkan</p>
        <p>
          <strong
            >{{ detailKaryawan.task_status_summary.upcoming }} Task</strong
          >
        </p>
      </div>
    </div>

    <div class="task">
      <div class="filter_task">
        <div class="style_progres">
          <label for="">Progres</label>
          <select name="" id="" class="select_task" v-model="progres">
            <option value="">Semua Progress</option>
            <option value="completed">Complete</option>
            <option value="done dev">Done Dev</option>
            <option value="in progress">In Progress</option>
            <option value="in review">In Review</option>
            <option value="to do">To Do</option>
          </select>
        </div>

        <div class="sortir_style">
          <label for="">Ketepatan Tugas</label>
          <select
            name=""
            id=""
            class="sortir_ketepatan sortir"
            v-model="sortKetepatanDetail"
          >
            <option value="">Semua Ketepatan</option>
            <option value="highest">Tertinggi</option>
            <option value="lowest">Terendah</option>
          </select>
        </div>

        <div class="filter_bug">
          <label for="">Tugas</label>
          <select name="" id="" class="task_style" v-model="taskBug">
            <option value="">Semua</option>
            <option value="bug">Bug</option>
            <option value="task">Task</option>
          </select>
        </div>
      </div>

      <div
        class="no_task"
        v-if="!filteredKaryawanDetail || filteredKaryawanDetail.length === 0"
      >
        <i>Data tidak tersedia</i>
      </div>

      <div
        class="background_bug"
        v-if="detailBug"
        @click.self="detailBug = null"
      >
        <div class="container_bug">
          <div class="header_containerBug">
            <i class="fa-solid fa-xmark" @click="closeDetailBug"></i>
          </div>
          <div class="bug_detail">
            <div class="header_bug">
              <div class="name_bug">
                <p>{{ detailBug.name }}</p>
              </div>
              <div class="status_bug">
                <div class="project_bug">
                  <p>{{ detailBug.project_name }}</p>
                </div>
                <div class="tags">
                  <!-- {{ detailBug.project_name }} -->
                  Tags
                </div>
              </div>
            </div>
            <div class="description_bug">
              <p>Deskripsi Task</p>
            </div>
            <div class="keterangan_waktu">
              <!-- <div class="jam">
                  <i class="fa-regular fa-clock"></i>
                  <p>Waktu Pengerjaan: {{ k.time_estimate_hours }} Jam</p>
                  <p>Waktu Pengerjaan: 8 Jam</p>
                </div> -->
              <div class="start_date">
                <i class="fa-regular fa-calendar"></i>
                <!-- <p v-if="k.start_date">Mulai: {{ k.start_date }}</p>
          <p v-if="!k.start_date">Mulai: <i>Tidak Valid</i></p> -->
                <p>Mulai: 20-08-2025</p>
              </div>
              <div class="deadline">
                <i class="fa-regular fa-calendar"></i>
                <!-- <p v-if="k.due_date">Target: {{ k.due_date }}</p>
          <p v-if="!k.due_date">Target: <i>Tidak Valid</i></p> -->
                <p>Target: 20-08-2025</p>
              </div>
              <div class="done_date">
                <i class="fa-regular fa-calendar"></i>
                <!-- <p>Selesai: {{ k.date_done }}</p> -->
                <p>Selesai: 20-08-2025</p>
              </div>
              <div class="created_by">
                <i class="fa-regular fa-user"></i>
                <!-- <p>Dibuat oleh: {{ k.creator_name }}</p> -->
                <p>Bug Terbuat Oleh oleh: Karyawan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          class="container_task"
          v-for="k in filteredKaryawanDetail"
          @click="handleCardClick(k)"
        >
          <div class="header_container">
            <div class="name_task">
              <p>{{ k.name }}</p>
            </div>
            <div class="status_task">
              <div class="bug" v-if="k.tags">
                <p>{{ k.tags[0] }}</p>
              </div>
              <!-- <div class="bug">
                  <p>Bug</p>
                </div> -->

              <!-- <div
                  class="background_bug"
                  v-if="detailBug"
                  @click.self="detailBug = null"
                >
                  <div class="bug_detail">
                    <p>Detail Bug Karyawan</p>
                    <p>{{ detailBug.name }}</p>
                  </div>
                </div> -->

              <div class="progres_task" :class="statusTaskClass(k.status_name)">
                <p>{{ statusLabel(k.status_name) }}</p>
              </div>
              <div
                class="task_priority"
                :class="priorityClass(k.priority_name)"
                v-if="k.priority_name"
              >
                <p>{{ k.priority_name }}</p>
              </div>

              <!-- Dari Project mana task tersebut -->
              <div class="task_project">
                <p>{{ k.project_name }}</p>
              </div>
            </div>
          </div>
          <div class="description">
            <p>{{ k.description }}</p>
          </div>

          <!-- Ketika start date tersedia -->
          <div
            class="achievement"
            v-if="k.time_efficiency_percentage"
            :class="achivClass(k.time_efficiency_percentage)"
          >
            <div class="penghargaan">
              <p>Ketepatan Pengerjaan Tugas</p>
              <h4>{{ k.time_efficiency_percentage }}%</h4>
              <h4>{{ k.remaining_duration }}</h4>
            </div>
          </div>

          <!-- Ketika start date tidak tersedia-->
          <div
            class="achievement not_special"
            v-if="
              (k.status_name === 'done dev' || k.status_name === 'completed') &&
              !k.start_date
            "
          >
            <div class="penghargaan">
              <p>Ketepatan Pengerjaan Tugas</p>
              <h4>Tidak Tersedia</h4>
            </div>
          </div>
          <div class="keterangan_waktu">
            <div class="jam">
              <i class="fa-regular fa-clock"></i>
              <p>Waktu Pengerjaan: {{ k.time_estimate_hours }} Jam</p>
            </div>
            <div class="start_date">
              <i class="fa-regular fa-calendar"></i>
              <p v-if="k.start_date">Mulai: {{ k.start_date }}</p>
              <p v-if="!k.start_date">Mulai: <i>Tidak Valid</i></p>
            </div>
            <div class="deadline">
              <i class="fa-regular fa-calendar"></i>
              <p v-if="k.due_date">Target: {{ k.due_date }}</p>
              <p v-if="!k.due_date">Target: <i>Tidak Valid</i></p>
            </div>
            <div
              class="done_date"
              v-if="
                k.status_name === 'done dev' || k.status_name === 'completed'
              "
            >
              <i class="fa-regular fa-calendar"></i>
              <p>Selesai: {{ k.date_done }}</p>
            </div>
            <div class="created_by">
              <i class="fa-regular fa-user"></i>
              <p>Dibuat oleh: {{ k.creator_name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
  width: 19%;
  padding: 10px;
  border-radius: 10px;
}
</style>

<!-- Style detail bug -->
<style scoped>
.hidden {
  overflow: hidden;
}

.container_bug {
  background-color: #fff;
  padding: 10px 20px 15px 20px;
  border-radius: 10px;
  width: 80%;
}

.header_containerBug {
  text-align: right;
  font-size: 14px;
}

.bug_detail {
  border: 1px solid var(--border_color);
  padding: 15px;
  border-radius: 10px;
  margin: 15px 0;
  background-color: #fff;
}

.background_bug {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* flex-direction: column; */
  flex-wrap: wrap;
  gap: 100px;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1005;
  pointer-events: all;
  animation: fadeIn 0.18s ease-out both;
  width: 100vw;
  height: 101vh;
  overflow-y: scroll;
}

.header_bug {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  align-items: center;
}

.name_bug {
  /* color: var(--font-color); */
  color: rgb(16, 50, 130);
  font-weight: 500;
}

.description_bug {
  margin: 10px 0;
  font-weight: 300;
}

.status_bug {
  display: flex;
  gap: 10px;
  font-size: 11px;
  font-weight: 500;
}

.project_bug,
.tags {
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
</style>

<!-- Style Filter Sortir -->
<style scoped>
.filter_sortir {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-top: 20px; */
  width: 100%;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 15px;
}

.style_sortir {
  width: 32%;
}

.style_sortir label,
.style_progres label,
.sortir_style label,
.filter_task label {
  padding-left: 2px;
  text-wrap: nowrap;
  font-size: 14px;
  font-weight: 500;
}

.sortir_performa {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-width='32' viewBox='0 0 512 512'%3E%3Cpath d='M64 448V224M192 448V128M320 448V256M448 448V64'/%3E%3C/svg%3E")
    no-repeat 10px center;
  background-size: 14px;
}

.sortir_ketepatan {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-width='32' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='200'/%3E%3Cpath d='M160 270l56 56 136-136'/%3E%3C/svg%3E")
    no-repeat 10px center;
  background-size: 14px;
}

.sortir_beban {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-width='32' viewBox='0 0 512 512'%3E%3Crect x='32' y='128' width='448' height='288' rx='32'/%3E%3Cpath d='M176 128V96a80 80 0 0 1 160 0v32'/%3E%3C/svg%3E")
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

<!-- Style Container Progress -->
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

<!-- Style Responsive -->
<style scoped>
@media (max-width: 576px) {
  .dates {
    width: 100%;
  }

  .tanggal input {
    position: relative;
    width: 45%;
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
    /* display: flex;
    flex-wrap: wrap; */
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

.late {
  background-color: rgb(255, 200, 200);
  border: 1px solid rgb(255, 100, 100);
  border-radius: 7px;
  padding: 5px;
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

<style scoped>
.performance {
  background-color: rgb(16, 67, 185);
}

:global(:root) {
  --border_color: rgb(193, 222, 232);
  --font-color: rgb(16, 50, 130);
}

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
  /* display: flex;
  align-items: center;
  justify-content: space-between; */
  border: 1px solid rgb(198, 215, 253);
  border-radius: 10px;
  padding: 25px;
  /* position: relative;
  top: 20px; */
  margin: 20px 0;
  background-color: #fff;
  width: 100%;
}

.card_karyawan .card_profile {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
}

.card_profile .card_left {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 70%;
}

.card_karyawan .card_profile .card_left img {
  width: 100px;
  /* border: 1px solid #010101; */
  border-radius: 50%;
  border: 5px solid rgb(193, 222, 232);
}

.card_profile .card_name h3 {
  color: rgb(16, 50, 130);
}

.card_name p {
  font-weight: 400;
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
  border: 1px solid var(--border_color);
  padding: 15px;
  border-radius: 10px;
  margin: 10px 0 20px 0;
  background-color: #fff;
  width: 100%;
}

.container_task:hover {
  /* border: 1px solid rgb(125, 206, 233); */
  filter: drop-shadow(2px 2px 4px rgb(125, 206, 233));
  background-color: #f3f3f3;
}

.header_container {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  align-items: center;
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

/* .status_task .bug {
  border: 1px solid rgb(178, 178, 255);
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: rgb(178, 178, 255);
  border-radius: 7px;
  padding: 2px 5px;
  padding-top: 4px;
  color: var(--font-color);
} */

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
  gap: 10px;
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

<style scoped>
.performance {
  background-color: rgb(16, 67, 185);
}

.not_found {
  /* margin: 20px 0; */
  margin-top: 50px;
  width: 100%;
  font-weight: 500;
  text-align: center;
  font-size: 25px;
}

.no_task {
  text-align: center;
  position: relative;
  top: 50px;
  font-size: 20px;
  font-weight: 500;
  filter: drop-shadow(2px 2px 8px #d0d0d0);
}

/* Laporan Pages */
.isi .keterangan_kerja {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  width: 100%;
  gap: 15px;
}

.keterangan_kerja .total_karyawan,
.overload,
.normal,
.underload,
.average,
.upcoming {
  width: 17%;
  padding: 25px 0;
  text-align: center;
  font-weight: 300;
  font-size: 16px;
  border-radius: 10px;
}

.total_karyawan {
  border: var(--borderCard);
}

.total_karyawan .font_color {
  margin-top: 2px;
}

.overload {
  background-color: rgb(255, 241, 241);
  border: 1px solid rgb(253, 199, 199);
}

.overload .font_color {
  color: rgb(255, 11, 11);
  margin-top: 2px;
}

.normal {
  background-color: rgb(236, 255, 236);
  border: 1px solid rgb(124, 255, 124);
}

.normal .font_color {
  color: rgb(82, 178, 82);
  margin-top: 2px;
}

.underload {
  background-color: rgb(255, 255, 232);
  border: 1px solid rgb(251, 251, 45);
}

.underload .font_color {
  color: rgb(188, 188, 83);
  margin-top: 2px;
}

.average {
  border: var(--borderCard);
}

.average .font_color {
  margin-top: 2px;
}

.upcoming {
  border: 1px solid rgb(214, 173, 255);
  background-color: rgb(243, 233, 253);
}

.upcoming .font_color {
  color: purple;
  margin-top: 2px;
}

.kinerja_karyawan {
  border: var(--borderCard);
  margin-top: 20px;
  width: 100%;
  border-radius: 10px;
  padding: 25px;
  background-color: #fff;
}

.kinerja_karyawan .profil {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 10px;
  font-weight: 300;
  font-size: 15px;
  flex-wrap: wrap;
}

.profil .profil_karyawan {
  display: flex;
  /* border: 1px solid #010101; */
  align-items: center;
  gap: 15px;
  flex: 12;
}

.profil_karyawan img {
  width: 75px;
  height: 75px;
  object-fit: cover;
  border-radius: 50%;
  border: 5px solid rgb(193, 222, 232);
}

.profil .container_status {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.status_karyawan {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 2;
}

.status_karyawan .available,
.working {
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

.status_karyawan .available i {
  color: rgb(0, 255, 0);
  font-size: 8px;
}

.status_karyawan .working i {
  color: red;
  font-size: 8px;
}

.overload_task,
.underload_task,
.normal_task {
  display: flex;
  /* background-color: #f5f5f5; */
  /* background-color: #010101; */
  /* border: 1px solid #dbdbdb; */
  /* color: #fff; */
  font-weight: 600;
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 6px;
  /* margin: 0 15 %; */
  text-align: center;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

/* .overload_task {
  background-color: rgb(212, 255, 212);
  border: 1px solid rgb(154, 255, 154);
}

.overload_task {
  color: green;
} */
.overload_task {
  position: relative;
  background: #fff;
  z-index: 0;
  border: 5px solid #c0b838;
}

.overload_task::before {
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

.underload_task {
  background-color: rgb(255, 237, 237);
  border: 1px solid rgb(255, 204, 204);
  color: rgb(203, 0, 0);
}

.underload_task svg {
  fill: rgb(203, 0, 0);
}

.normal_task {
  /* background-color: #f5f5f5;
  border: 1px solid #dbdbdb;
  color: #010101; */
  background-color: rgb(212, 255, 212);
  border: 1px solid rgb(154, 255, 154);
  color: green;
}

.status_karyawan .keterangan_status {
  /* color: rgb(255, 217, 4); */
  font-weight: 500;
  margin-top: 5px;
  font-size: 15px;
}

.performa_karyawan {
  /* border: 1px solid #dbdbdb;
  background-color: #f5f5f5; */
  border-radius: 6px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 2;
  margin-left: auto;
}

.performa_karyawan i {
  font-size: 25px;
}

.performa_karyawan .text {
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 5px;
  font-size: 16px;
}

.text span {
  font-weight: 500;
  font-size: 18px;
}

.keterangan_karyawan .container_flex {
  display: flex;
  justify-content: space-evenly;
  gap: 15px;
  margin-top: 10px;
}

.container_flex .total_seharusnya,
.container_flex .total_beban,
.container_flex .ketepatan_pengerjaan,
.container_flex .performa_bug {
  width: 100%;
  padding: 15px;
  border-radius: 10px;
  font-weight: 400;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ikon i {
  font-size: 30px;
}

.total_beban h4,
.total_seharusnya h4,
.ketepatan_pengerjaan h4,
.performa_bug h4 {
  font-size: large;
}

.total_seharusnya {
  background-color: #f5f5f5;
  border: 1px solid #d1d1d1;
  color: #333333;
}

.special {
  position: relative;
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  z-index: 0;
  border: 5px solid #c0b838;
}

.special::before {
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

/* Animasi berjalan */
@keyframes gold-run {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 300% 50%;
  }
}

.detail_task,
.detail_bug {
  position: relative;
  cursor: pointer;
}

.content {
  /* border: var(--borderCard); */
  /* border-radius: 10px; */
  padding: 15px;
  font-weight: 300;
  font-size: 15px;
}

.content .ket {
  margin: 10px 0;
}

.content .name_task {
  display: flex;
  justify-content: space-between;
  font-weight: 400;
}

.name_task .progres-level {
  display: flex;
  /* border: 1px solid #010101; */
  justify-content: flex-end;
  gap: 10px;
}

.content .time {
  display: flex;
  gap: 16px;
}

.time .jam,
.tanggal,
.project {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tanggal input {
  background-color: #fff;
  /* width: 90%; */
}

.time .project {
  border: 1px solid rgb(163, 224, 255);
  font-size: 12px;
  padding: 3px 7px;
  border-radius: 6px;
  font-weight: 400;
}

:deep(details summary::marker),
:deep(details summary::-webkit-details-marker) {
  display: none;
}

details {
  margin: 10px 0 20px 0;
}

summary {
  cursor: pointer;
  display: flex;
  align-items: center;
  /* margin-top: 20px; */
  border: 1px solid #ddd;
  height: 36px;
  width: 100%;
  padding: 0 15px;
  border-radius: 10px;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
}

.beban_karyawan::before {
  content: "\f017";
  font-family: "Font Awesome 7 Free";
}

.ringkasan::before {
  content: "\f022";
  font-family: "Font Awesome 7 Free";
}

summary::after {
  content: ">";
  margin-left: auto;
  transition: transform 0.2s ease;
  font-size: 25px;
}

summary:hover {
  background-color: #f4f4f4;
}

:deep(details[open] > summary::after) {
  transform: rotate(90deg);
}

.keterangan_karyawan {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transform: translateY(-5px);
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.keterangan_karyawan {
  max-height: 800px; /* cukup besar agar muat semua */
  opacity: 1;
  transform: translateY(0);
}

.ringkasan_task .jud {
  margin-top: 20px;
}

.task_detail {
  margin-top: 10px;
  border: 1px solid rgb(219, 214, 246);
  border-radius: 10px;
}

.tanggal_mulai input,
.tanggal_akhir input {
  background: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20448%20512'%3E%3Cpath%20d='M120%200c13.3%200%2024%2010.7%2024%2024l0%2040%20160%200%200-40c0-13.3%2010.7-24%2024-24s24%2010.7%2024%2024l0%2040%2032%200c35.3%200%2064%2028.7%2064%2064l0%20288c0%2035.3-28.7%2064-64%2064L64%20480c-35.3%200-64-28.7-64-64L0%20128C0%2092.7%2028.7%2064%2064%2064l32%200%200-40c0-13.3%2010.7-24%2024-24zm0%20112l-56%200c-8.8%200-16%207.2-16%2016l0%2048%20352%200%200-48c0-8.8-7.2-16-16-16l-264%200zM48%20224l0%20192c0%208.8%207.2%2016%2016%2016l320%200c8.8%200%2016-7.2%2016-16l0-192-352%200z'/%3E%3C/svg%3E")
    no-repeat 10px center;
  background-size: 14px;
  padding-left: 35px;
}

form select {
  background: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20448%20512'%3E%3Cpath%20d='M224%20248a120%20120%200%201%201%200-240%20120%20120%200%201%201%200%20240zm-30.5%2056l61%200c9.7%200%2017.5%207.8%2017.5%2017.5%200%204.2-1.5%208.2-4.2%2011.4l-27.4%2032%2031%20115.1%20.6%200%2034.6-138.5c2.2-8.7%2011.1-14%2019.5-10.8%2061.9%2023.6%20105.9%2083.6%20105.9%20153.8%200%2015.1-12.3%2027.4-27.4%2027.4L43.4%20512c-15.1%200-27.4-12.3-27.4-27.4%200-70.2%2044-130.2%20105.9-153.8%208.4-3.2%2017.3%202.1%2019.5%2010.8l34.6%20138.5%20.6%200%2031-115.1-27.4-32c-2.7-3.2-4.2-7.2-4.2-11.4%200-9.7%207.8-17.5%2017.5-17.5z'/%3E%3C/svg%3E")
    no-repeat 10px center;
  background-size: 14px;
  padding-left: 35px;
}

.cari input {
  background: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'%3E%3Cpath%20d='M416%20208c0%2045.9-14.9%2088.3-40%20122.7L502.6%20457.4c12.5%2012.5%2012.5%2032.8%200%2045.3s-32.8%2012.5-45.3%200L330.7%20376C296.3%20401.1%20253.9%20416%20208%20416%2093.1%20416%200%20322.9%200%20208S93.1%200%20208%200%20416%2093.1%20416%20208zM208%20352a144%20144%200%201%200%200-288%20144%20144%200%201%200%200%20288z'/%3E%3C/svg%3E")
    no-repeat 10px center;
  background-size: 14px;
  padding-left: 35px;
}

.detail_task,
.detail_bug {
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

.detail_bug {
  border: 1px solid #bdbdbd;
}

.detail_bug:hover {
  background-color: #e6e6e6;
}

.detail_task:hover {
  background-color: rgb(7, 7, 183);
}

/* ========================================================= */
/*                       RESPONSIVE                          */
/* ========================================================= */

/* ----------- 1024px (Tablet Landscape) ----------- */
@media (max-width: 1024px) {
  .konten .sidebar .sidebar_text {
    gap: 9px;
  }

  .konten .sidebar .sidebar_text a {
    font-size: 200px;
  }

  .konten.sidebar .sidebar_text i {
    font-size: 15px;
  }

  .isi .keterangan_kerja {
    flex-wrap: wrap;
    gap: 10px;
  }

  .keterangan_kerja .total_karyawan,
  .overload,
  .normal,
  .underload,
  .average {
    width: 32%;
  }

  /* .kinerja_karyawan {
    padding: 20px;
  } */

  /* .profil {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  } */

  .container_flex {
    gap: 10px;
  }

  .back_button {
    margin-top: 30px;
  }

  .container_progres {
    flex-wrap: wrap;
  }

  .tanggal input {
    position: relative;
    /* width:; */
  }
}

/* ----------- 768px (Tablet / Small Laptop) ----------- */
@media (max-width: 768px) {
  .isi .keterangan_kerja {
    flex-wrap: wrap;
  }

  .keterangan_kerja .total_karyawan,
  .overload,
  .normal,
  .underload,
  .average {
    width: 48%;
  }

  /* .profil {
    flex-direction: column;
  } */

  /* .profil_karyawan img {
    width: 65px;
    height: 65px;
  } */

  .container_flex {
    flex-direction: column;
  }

  .container_flex .total_beban,
  .container_flex .performs {
    width: 100%;
  }

  .content {
    font-size: 14px;
  }

  .style_sortir {
    width: 100%;
  }
}

/* ----------- 576px (Mobile) ----------- */
@media (max-width: 576px) {
  .konten .background .sidebar_responsive {
    width: 59%;
  }
  .isi .keterangan_kerja {
    /* flex-direction: column; */
    flex-wrap: wrap;
    width: 100%;
  }

  .keterangan_kerja .total_karyawan,
  .overload,
  .normal,
  .underload,
  .average,
  .upcoming {
    width: 48%;
  }

  /* .kinerja_karyawan {
    padding: 15px;
  } */

  .container_flex {
    flex-direction: column;
    gap: 10px;
  }

  .total_beban,
  .performs {
    padding: 15px;
    font-size: 14px;
  }

  input,
  select {
    background-position: 10px center !important;
    padding-left: 32px !important;
  }

  form .tanggal_mulai {
    width: 100%;
  }
  .card_profile .card_left {
    width: 100%;
  }

  .sortir_style,
  .style_progres,
  .filter_bug {
    width: 47%;
  }

  .select_task,
  .sortir,
  .sortir_style label,
  .style_progres label,
  .filter_bug label {
    font-size: 12px;
  }

  .kinerja_karyawan {
    width: 100%;
  }
}

/* ----------- 430px (Small Mobile) ----------- */
@media (max-width: 430px) {
  /* .profil_karyawan img {
    width: 50px;
  } */
  .konten .background .sidebar_responsive {
    width: 60%;
  }
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
      posisi: "",
      daftarKaryawan: [],
      sidebar: false,
      searchInput: "",
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
      sortPerform: "",
      sortPerformBug: "",
      sortBeban: "",
      sortKetepatan: "",
      sortKetepatanDetail: "",
      taskBug: "",
      detailBug: null,
      daftarHari: [],
    };
  },
  components: {
    VueDatePicker,
  },
  mounted() {
    this.setDefaultTanggal();
    this.ambilTask();
    // this.hariLibur();
  },
  methods: {
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
            this.start
          )}&end_date=${this.formatTanggal(this.end)}`
        );
        this.daftarKaryawan = task.data.assignees || [];
        this.daftarHari = task.data.jadwal_libur || [];
        // this.daftarHari = task.data.jadwal_libur
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
    // async hariLibur() {
    //   console.log("Hari Libur sedang di proses");

    //   try {
    //     const holiday = await this.$api.get(
    //       `/api/v1/workload/tasks-by-range?start_date=${this.formatTanggal(
    //         this.start
    //       )}&end_date=${this.formatTanggal(this.end)}`
    //     );
    //     this.daftarHari = holiday.data.jadwal_libur || [];
    //     console.log("Berhasil");
    //   } catch (error) {
    //     console.error("Gagal ambil task:", error);
    //     this.daftarHari = [];
    //   }
    // },
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
    detail(karyawan) {
      // this.daftarKaryawan = karyawan;
      this.detailKaryawan = karyawan;
      this.sortPerform = "";
      this.sortBeban = "";
      this.sortKetepatn = "";
      this.taskBug = "";
    },
    // detailBug(bug) {
    //   this.detailKaryawanBug = bug;
    //   console.log("hhhhh");
    //   console.log(bug);
    // },
    // kembaliBug() {
    //   this.detailKaryawanBug = null;
    // },
    kembali() {
      this.detailKaryawan = null;
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
    totalBebanClass(beban) {
      return {
        special: beban > 100,
        ontime: beban >= 85 && beban <= 100,
        late: beban < 85,
      };
    },
    ketepatanClass(ketepatan) {
      return {
        special: ketepatan > 100,
        ontime: ketepatan >= 85 && ketepatan <= 100,
        late: ketepatan < 85,
      };
    },
    performaClass(performa) {
      return {
        special: performa > 100,
        ontime: performa >= 85 && performa <= 100,
        late: performa < 85,
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
        overload_task: workload === "Overload",
        underload_task: workload === "Underload",
        normal_task: workload === "Normal",
      };
    },
    statusTaskClass(status) {
      return {
        task_todo: status === "to do",
        task_selesai: status === "done dev" || status === "completed",
        task_inProgress: status === "in progress",
        task_inReview: status === "in review",
        task_cancelled: status === "cancelled",
      };
    },
    handleCardClick(k) {
      if (!k.tags) return;

      this.BugDetail(k);
    },
    BugDetail(bug) {
      this.detailBug = bug;
      console.log(bug);
    },
    closeDetailBug() {
      this.detailBug = null;
    },
  },
  computed: {
    filteredKaryawan() {
      let hasil = this.daftarKaryawan;
      // let hasilBug = this.daftarKaryawan;

      // filter nama
      if (this.searchInput) {
        hasil = hasil.filter((k) =>
          k.name.toLowerCase().includes(this.searchInput.toLowerCase())
        );
        this.notFound = hasil.length === 0;
      } else {
        this.notFound = false;
      }

      // filter posisi (role)
      if (this.posisi) {
        hasil = hasil.filter(
          (k) => k.role.toLowerCase() === this.posisi.toLowerCase()
        );
      }

      // Sortir Tertinggi

      // Performa Tasks
      if (this.sortPerform === "highest" || this.sortPerform === "lowest") {
        hasil = hasil
          .filter(
            (k) =>
              k.performance_bugs && typeof k.performance_bugs.score === "number"
          )

          .sort((a, b) => {
            if (this.sortPerform === "highest") {
              return b.performance_bugs.score - a.performance_bugs.score;
            }
            return a.performance_bugs.score - b.performance_bugs.score;
          });
      }

      // Performa Bug
      else if (
        this.sortPerformBug === "highest" ||
        this.sortPerformBug === "lowest"
      ) {
        hasil = hasil
          .filter(
            (k) =>
              k.performance_bugs && typeof k.performance_bugs.bugs === "number"
          )

          .sort((a, b) => {
            if (this.sortPerformBug === "highest") {
              return b.performance_bugs.bugs - a.performance_bugs.bugs;
            }
            return a.performance_bugs.bugs - b.performance_bugs.bugs;
          });
      }

      // Ketepatan Tugas
      else if (
        this.sortKetepatan === "highest" ||
        this.sortKetepatan === "lowest"
      ) {
        hasil = hasil
          .filter(
            (k) =>
              k.avg_time_efficiency &&
              typeof k.avg_time_efficiency.avg_percentage === "number"
          )
          .sort((a, b) => {
            if (this.sortKetepatan === "highest") {
              return (
                b.avg_time_efficiency.avg_percentage -
                a.avg_time_efficiency.avg_percentage
              );
            }
            return (
              a.avg_time_efficiency.avg_percentage -
              b.avg_time_efficiency.avg_percentage
            );
          });
      }
      // Beban Kerja
      else if (this.sortBeban === "highest" || this.sortBeban === "lowest") {
        hasil = hasil
          .filter(
            (k) =>
              k.total_spent_hours &&
              typeof k.total_spent_hours.percentage === "number"
          )
          .sort((a, b) => {
            if (this.sortBeban === "highest") {
              return (
                b.total_spent_hours.percentage - a.total_spent_hours.percentage
              );
            }
            return (
              a.total_spent_hours.percentage - b.total_spent_hours.percentage
            );
          });
      }

      // Performa Bug
      // Kode untuk Performa Bug

      return hasil;
      // return hasilBug;
    },

    filteredKaryawanDetail() {
      let hasil = this.detailKaryawan.tasks;
      // filter berdasarkan progress task (jika dipilih)
      if (this.progres) {
        hasil = hasil.filter(
          (k) => k.status_name.toLowerCase() === this.progres.toLowerCase()
        );
      }
      // Filter Sortir
      if (
        this.sortKetepatanDetail === "highest" ||
        this.sortKetepatanDetail === "lowest"
      ) {
        hasil = hasil
          .filter((k) => typeof k.time_efficiency_percentage === "number")
          .sort((a, b) => {
            if (this.sortKetepatanDetail === "highest") {
              return (
                b.time_efficiency_percentage - a.time_efficiency_percentage
              );
            }
            return a.time_efficiency_percentage - b.time_efficiency_percentage;
          });
      }

      // Filter Bug & Task
      // if (this.taskBug) {
      //   hasil = hasil.filter(
      //     (k) =>
      //       (this.taskBug === "bug") ===
      //       k.tags?.some((t) => t.toLowerCase() === "bug")
      //   );
      // }

      if (this.taskBug === "bug") {
        hasil = hasil.filter((k) =>
          k.tags?.some((t) => t.toLowerCase() === "bug")
        );
      } else if (this.taskBug === "task") {
        hasil = hasil.filter(
          (k) => !k.tags?.some((t) => t.toLowerCase() === "bug")
        );
      }
      return hasil;
    },
    listHariTanggal() {
      // let hasil = this.daftarHari;
      // let hari = hasil.hari_libur;

      // return hari;
      return this.daftarHari.flatMap((bulan) => bulan.hari_libur);
    },

    // detailBugKaryawan() {
    //   // let hasil = this.detailBug.tasks;
    //   return this.detailBug?.tasks || [];
    // },

    // filteredBugDetail() {
    //   let hasilBug = this.detailKaryawanBug.tasks;

    //   if (!hasilBug || !hasilBug) {
    //     return [];
    //   }
    //   return hasilBug;
    // },
  },

  watch: {
    start: "onDateChange",
    end: "onDateChange",
  },
};
</script>
