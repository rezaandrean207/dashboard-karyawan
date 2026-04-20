<template>
  <div
    v-if="isLoading"
    class="loading"
    :style="{
      background: isDetailMode
        ? 'rgba(255, 255, 255, 0.9)'
        : 'rgba(255, 255, 255, 0.6)',
    }"
  >
    <div class="loading_tanggal">
      <i class="fa-solid fa-spinner"></i>
      <p>Tunggu Sebentar</p>
    </div>
  </div>

  <div class="isi" v-if="detailKaryawan === null">
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
      <div class="filter-detail">
        <div class="filter-item">
          <label for="search">Cari Karyawan</label>
          <ClientOnly>
            <n-input
              placeholder="Cari nama karyawan"
              type="search"
              v-model:value="searchInput"
            ></n-input>
          </ClientOnly>
          <!-- <input
            type="search"
            name="search"
            placeholder="Cari nama karyawan"
            v-model="searchInput"
          /> -->
        </div>
        <div class="filter-item">
          <label for="posisi">Filter Posisi</label>
          <ClientOnly>
            <n-select
              placeholder="Cari nama karyawan"
              v-model:value="posisi"
              :options="[
                { label: 'Semua Posisi', value: '' },
                { label: 'Data Analyst', value: 'analis' },
                { label: 'Backend Developer', value: 'backend' },
                { label: 'Web Developer', value: 'web' },
                { label: 'Mobile Apps Developer', value: 'mobile apps' },
                { label: 'UI-UX Designer', value: 'UI-UX' },
              ]"
            ></n-select>
          </ClientOnly>
          <!-- <label for="posisi">Filter Posisi</label>
          <select v-model="posisi">
            <option value="" selected>Semua Posisi</option>
            <option value="analis">Data Analys</option>
            <option value="backend">Backend</option>
            <option value="web">Web Developer</option>
            <option value="mobile apps">Mobile Apps</option>
            <option value="UI-UX">UI-UX</option>
          </select> -->
        </div>
        <div class="filter-item">
          <label for="start">Tanggal Mulai</label>
          <div class="dates">
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
              />
            </ClientOnly>
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
    </div>
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
          <h4>
            {{ h.hari }}, {{ h.tanggal.split("-")[0] }} {{ h.bulan }}
            {{ h.tanggal.split("-")[2] }}
          </h4>
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
      <div class="filter-detail">
        <div class="filter-item">
          <label for="">Performa</label>
          <ClientOnly>
            <n-select
              placeholder="Cari nama karyawan"
              v-model:value="sortPerform"
              :options="[
                { label: 'Semua Performa', value: '' },
                { label: 'Tertinggi', value: 'highest' },
                { label: 'Terendah', value: 'lowest' },
              ]"
            ></n-select>
          </ClientOnly>
          <!-- <select name="" id="" class="sortir_performa" v-model="sortPerform">
            <option value="">Semua Performa</option>
            <option value="highest">Tertinggi</option>
            <option value="lowest">Terendah</option>
          </select> -->
        </div>
        <div class="filter-item">
          <!-- <label for="">Ketepatan Tugas</label>
          <select
            name=""
            id=""
            class="sortir_ketepatan"
            v-model="sortKetepatan"
          >
            <option value="">Semua Ketepatan</option>
            <option value="highest">Tertinggi</option>
            <option value="lowest">Terendah</option>
          </select> -->

          <label for="">Ketepatan Tugas</label>
          <ClientOnly>
            <n-select
              v-model:value="sortKetepatan"
              :options="[
                { label: 'Semua Ketepatan', value: '' },
                { label: 'Tertinggi', value: 'highest' },
                { label: 'Terendah', value: 'lowest' },
              ]"
            ></n-select>
          </ClientOnly>
        </div>

        <div class="filter-item">
          <label for="">Beban Kerja</label>
          <ClientOnly>
            <n-select
              v-model:value="sortBeban"
              :options="[
                { label: 'Semua Beban Kerja', value: '' },
                { label: 'Tertinggi', value: 'highest' },
                { label: 'Terendah', value: 'lowest' },
              ]"
            ></n-select>
          </ClientOnly>
          <!-- <select name="" id="" class="sortir_beban" v-model="sortBeban">
            <option value="">Semua Beban Kerja</option>
            <option value="highest">Tertinggi</option>
            <option value="lowest">Terendah</option>
          </select> -->
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
          <div class="photo-wrapper" @click.stop>
            <img
              v-if="!k.imageError"
              :src="getProfileImage(k.profile_picture_url)"
              alt="Profile Picture"
              @error="k.imageError = true"
            />

            <div
              class="photo-option"
              :style="{ backgroundColor: k.color }"
              v-else
            >
              <p>{{ setInitial(k.name) }}</p>
            </div>
          </div>
          <div class="about">
            <h4>{{ k.username }}</h4>
            <p>{{ k.role }}</p>
          </div>
          <div class="cuti-wraper" v-if="k.total_cuti !== 0">
            <div class="total-cuti" @click="toggleCuti(k.clickup_id)">
              <!-- <i class="fa-solid fa-calendar-xmark"></i> -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path
                  d="M17 10H7V12H17V10ZM19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H11V19H5V8H19V9H21V5C21 3.9 20.1 3 19 3Z"
                />

                <path
                  d="M18 12C16.34 12 15 13.34 15 15C15 16.66 16.34 18 18 18C19.66 18 21 16.66 21 15C21 13.34 19.66 12 18 12Z"
                />

                <path
                  d="M18 19C15.34 19 13 20.34 13 22V23H23V22C23 20.34 20.66 19 18 19Z"
                />

                <path d="M7 14H12V16H7V14Z" />
              </svg>
              <p>Total cuti: {{ k.total_cuti }} hari</p>
              <span
                class="material-symbols-outlined"
                :class="{ opened: openCuti === k.clickup_id }"
              >
                arrow_drop_down
              </span>
            </div>

            <div
              class="dropdown_cuti"
              v-if="openCuti === k.clickup_id && k.cuti_summary"
            >
              <!-- Summary -->
              <div class="cuti-summary">
                <p class="title">Ringkasan</p>
                <div
                  class="jenis-cuti"
                  v-for="item in k.cuti_summary"
                  :key="item.kategori"
                >
                  <span>{{ item.kategori }}</span>
                  <strong>{{ item.jumlah }} hari</strong>
                </div>

                <div class="disclaimer">
                  <p><i>*WFH tidak termasuk daftar cuti</i></p>
                </div>
              </div>

              <!-- Divider -->
              <hr />

              <!-- Detail -->
              <!-- <div class="cuti-detail">
              <p class="title">Detail Cuti</p>
              <div class="cuti-item" v-for="c in k.cuti" :key="c.id">
                <div class="row">
                  <span class="kategori">{{ c.kategori }}</span>
                  <span class="tanggal">{{ c.tanggal }}</span>
                </div>
                <p class="keterangan">{{ c.keterangan }}</p>
              </div>
            </div> -->
            </div>
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
          :class="performaClass(k.performance_bugs.category)"
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
            :class="ketepatanClass(k.avg_time_efficiency.category)"
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
            :class="totalBebanClass(k.total_spent_hours.category)"
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
            :class="performaClass(k.performance_bugs.bugs_category)"
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

      <div class="detail_task" @click="detail(k.clickup_id)">
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
      <div class="back_button" @click="kembali()">
        <i class="fa-solid fa-arrow-left"></i>
        <p>Kembali</p>
      </div>
    </div>

    <div class="card_karyawan">
      <div class="card_profile">
        <div class="card_left">
          <img
            v-if="!detailKaryawan.imageError"
            :src="getProfileImage(detailKaryawan.profile_picture_url)"
            alt="Profile Picture"
            @error="detailKaryawan.imageError = true"
          />
          <div class="photo-wrapper" @click.stop v-else>
            <div
              class="photo-option"
              :style="{ backgroundColor: detailKaryawan.color }"
            >
              <p>{{ setInitial(detailKaryawan.name) }}</p>
            </div>
          </div>
          <div class="card_name">
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
      <div class="keterangan_karyawan">
        <div class="container_flex">
          <!-- <div
            class="ketepatan_pengerjaan"
            v-if="detailKaryawan.avg_time_efficiency.avg_percentage"
            :class="ketepatanClass(detailKaryawan.avg_time_efficiency.category)"
          >
            <div class="teks">
              <p>Tepat Waktu Kerja</p>
              <h4>{{ detailKaryawan.avg_time_efficiency.avg_percentage }}%</h4>
            </div>
            <div class="ikon">
              <i class="fa-solid fa-list-check"></i>
            </div>
          </div> -->
          <div
            class="ketepatan_pengerjaan"
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
            class="performa_bug"
            :class="
              performaClass(detailKaryawan.performance_bugs.bugs_category)
            "
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
            <option value="bugs">Bug</option>
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
        @click.self="closeDetailBug()"
      >
        <div class="container_bug">
          <div class="header_containerBug">
            <i class="fa-solid fa-xmark" @click="closeDetailBug"></i>
          </div>
          <div class="bug_detail">
            <div class="header_bug">
              <div class="name_bug">
                <p>{{ detailBug.task_name }}</p>
              </div>
              <div class="status_bug">
                <div class="tags">
                  <!-- {{ detailBug.project_name }} -->
                  Tags
                </div>
                <div class="project_bug">
                  <p>{{ detailBug.bug_label }}</p>
                </div>
              </div>
            </div>
            <div class="description_bug">
              <p>{{ detailBug.description }}</p>
            </div>
            <div class="keterangan_waktu">
              <!-- <div class="jam">
                  <i class="fa-regular fa-clock"></i>
                  <p>Waktu Pengerjaan: {{ k.time_estimate_hours }} Jam</p>
                  <p>Waktu Pengerjaan: 8 Jam</p>
                </div> -->
              <div class="start_date">
                <i class="fa-regular fa-calendar"></i>
                <p>Mulai: {{ detailBug.start_date_ui }}</p>
              </div>
              <div class="deadline">
                <i class="fa-regular fa-calendar"></i>
                <p>Target: {{ detailBug.due_date_ui }}</p>
              </div>
              <div class="done_date">
                <i class="fa-regular fa-calendar"></i>
                <p>Selesai: {{ detailBug.date_done_ui }}</p>
              </div>
              <div class="created_by">
                <i class="fa-regular fa-user"></i>
                <p>Bug Terbuat oleh: {{ detailBug.assignee_name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="container_task"
        v-for="k in filteredKaryawanDetail"
        @click.stop="handleCardClick(k)"
      >
        <div class="header_container">
          <div class="name_task">
            <p>{{ k.name }}</p>
          </div>
          <div class="status_task">
            <div class="bug" v-if="k.bug_label">
              <p>{{ k.bug_label }}</p>
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
          <div class="ikon" v-if="k.bug_label === 'Bug Terbuat'">
            <i class="fa-solid fa-bug"></i>
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
            <p v-if="k.start_date">Mulai: {{ k.start_date_ui }}</p>
            <p v-if="!k.start_date">Mulai: <i>Tidak Valid</i></p>
          </div>
          <div class="deadline">
            <i class="fa-regular fa-calendar"></i>
            <p v-if="k.due_date">Target: {{ k.due_date_ui }}</p>
            <p v-if="!k.due_date">Target: <i>Tidak Valid</i></p>
          </div>
          <div
            class="done_date"
            v-if="k.status_name === 'done dev' || k.status_name === 'completed'"
          >
            <i class="fa-regular fa-calendar"></i>
            <p>Selesai: {{ k.date_done_ui }}</p>
          </div>
          <div class="created_by">
            <i class="fa-regular fa-user"></i>
            <p>Dibuat oleh: {{ k.creator_name }}</p>
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
</style>

<!-- Style detail bug -->
<style scoped>
.hidden {
  overflow: hidden;
}

.container_bug {
  padding: 10px 20px 15px 20px;
  border-radius: 10px;
  width: 80%;

  background: #ffffff;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
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
  z-index: 1005;
  pointer-events: all;
  width: 100vw;
  height: 101vh;
  overflow-y: scroll;

  backdrop-filter: blur(6px);
  background: rgba(15, 23, 42, 0.4);
  animation: fadeIn 0.2s ease-out;
}

.header_bug {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.name_bug {
  /* color: var(--font-color); */
  color: rgb(16, 50, 130);
  font-weight: 500;
}

.description_bug {
  margin: 5px 0 10px 0;
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
  font-size: 12px;
  font-weight: 600;
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
@media (max-width: 1024px) {
  .list_hari .hari_tanggal {
    width: 32.3%;
  }
}

@media (max-width: 768px) {
  .list_hari .hari_tanggal {
    width: 48.6%;
  }
}

@media (max-width: 576px) {
  .list_hari .hari_tanggal {
    width: 48%;
  }

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
  text-transform: capitalize;
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

  white-space: pre-line;
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
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  /* border: 1px solid #e5e7eb; */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.kinerja_karyawan:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
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
  gap: 12px;
  flex: 12;
  position: relative;
}

.profil_karyawan .about {
  text-transform: capitalize;
}

.profil_karyawan .cuti-wraper {
  position: relative;
  /* border: 1px solid #dbdbdb; */
}

.profil_karyawan .cuti-wraper .total-cuti {
  font-size: 12px;
  color: #64748b;
  /* margin-top: 4px; */
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 0px;
  /* border: 1px solid #dbdbdb; */
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

.dropdown_cuti {
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

.dropdown_cuti .title {
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

.cuti-item {
  padding: 6px 0;
  border-bottom: 1px solid #eee;
}

.cuti-item:last-child {
  border-bottom: none;
}

.cuti-item .row {
  display: flex;
  justify-content: space-between;
  font-weight: 500;
}

.keterangan {
  font-size: 12px;
  color: #666;
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

/* .available {
  background: #dcfce7;
  color: #15803d;
}

.working {
  background: #fee2e2;
  color: #991b1b;
} */

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

.name_task {
  display: flex;
  justify-content: space-between;

  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
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

/* .time .jam,
.tanggal,
.project {
  display: flex;
  align-items: center;
  gap: 4px;
} */

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
  background-color: #fff;
}

.cari input {
  background: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'%3E%3Cpath%20d='M416%20208c0%2045.9-14.9%2088.3-40%20122.7L502.6%20457.4c12.5%2012.5%2012.5%2032.8%200%2045.3s-32.8%2012.5-45.3%200L330.7%20376C296.3%20401.1%20253.9%20416%20208%20416%2093.1%20416%200%20322.9%200%20208S93.1%200%20208%200%20416%2093.1%20416%20208zM208%20352a144%20144%200%201%200%200-288%20144%20144%200%201%200%200%20288z'/%3E%3C/svg%3E")
    no-repeat 10px center;
  background-size: 14px;
  padding-left: 35px;
  background-color: #fff;
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

<!-- Edit image -->
<style scoped>
.photo-wrapper {
  /* position: relative; */
  width: 70px;
  height: 70px;
  /* margin: 0 auto; */
}

.photo-wrapper img,
.photo-option {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid rgb(193, 222, 232);
  transition: 0.2s ease;
}

.photo-option {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
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

<script>
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
      openCuti: null,
    };
  },
  async mounted() {
    const date = this.$route.query;

    if (date.start && date.end) {
      this.start = date.start;
      this.end = date.end;
    } else {
      this.setDefaultTanggal();
    }

    // await this.ambilTask();
    // this.cekSetting();
    // this.ambilTask();
    // this.hariLibur();
  },
  methods: {
    toggleCuti(id) {
      this.openCuti = this.openCuti === id ? null : id;

      this.$nextTick(() => {
        const dropdown = document.querySelector(".dropdown_cuti");
        if (!dropdown) return;

        const rect = dropdown.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        console.log("rect.bottom:", rect.bottom);
        console.log("viewportHeight:", window.innerHeight);
        console.log("selisih:", rect.bottom - window.innerHeight);

        if (rect.right > viewportWidth) {
          dropdown.style.left = "auto";
          dropdown.style.right = "0";
        }

        // if (rect.bottom > viewportHeight) {
        //   dropdown.style.top = 'auto';
        //   dropdown.style.bottom = '100%';
        //   dropdown.style.marginTop = '0';
        //   dropdown.style.marginBottom = '8px';
        // }
      });
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
    getProfileImage(url) {
      const baseURL = "https://api.clickup.devlmu.com";

      if (!url) return "";

      return baseURL + url;
    },
    handleImgError(event) {
      event.target.src = "/img/profil.png";
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
        path: "/admin/bebanKerja",
        query: {
          ...this.$route.query, // 🔥 PENTING
          // start: this.formatTanggal(this.start),
          // end: this.formatTanggal(this.end),
          start: this.start,
          end: this.end,
        },
      });

      // this.$router.push({
      //   path: "/admin/bebanKerja",
      //   query: {
      //     start: this.start,
      //     end: this.end,
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
    formatTanggalUI(tgl) {
      return new Date(tgl).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
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
        this.daftarKaryawan = task.data.assignees || [];
        this.daftarHari = task.data.jadwal_libur || [];

        // 🔥 PENTING
        this.resolveDetailKaryawan();
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
    detail(clickupId) {
      // this.daftarKaryawan = karyawan;
      // this.detailKaryawan = karyawan;
      this.sortPerform = "";
      this.sortBeban = "";
      this.sortKetepatan = "";
      this.taskBug = "";

      this.$router.push({
        path: "/admin/bebanKerja",
        query: {
          id: clickupId,
          // start: this.formatTanggal(this.start),
          // end: this.formatTanggal(this.end),
          start: this.start,
          end: this.end,
          source: "beban kerja",
        },
      });
    },
    resolveDetailKaryawan() {
      const id = this.$route.query.id;
      if (!id) {
        this.detailKaryawan = null;
        return;
      }

      const found = this.daftarKaryawan.find(
        (k) => String(k.clickup_id) === String(id),
      );

      this.detailKaryawan = found || null;
    },
    kembali() {
      // this.detailKaryawan = null;
      // this.$router.push({
      //   path: "/admin/bebanKerja",
      //   query: {
      //     // karyawan: karyawan.clickup_id,
      //     start: this.start,
      //     end: this.end,
      //   },
      // });

      // this.$router.back();
      const from = this.$route.query.from;

      if (from) {
        this.$router.push(from);
      } else {
        this.$router.back(); // fallback
      }

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
        overload_task: workload === "Overload",
        underload_task: workload === "Underload",
        normal_task: workload === "Normal",
      };
    },
    statusTaskClass(status) {
      return {
        task_todo: status === "to do" || status === "backlog",
        task_selesai: status === "done dev" || status === "completed",
        task_inProgress: status === "in progress",
        task_inReview: status === "in review",
        task_cancelled: status === "cancelled",
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
  },
  computed: {
    filteredKaryawan() {
      let hasil = this.daftarKaryawan;
      // let hasilBug = this.daftarKaryawan;

      // filter nama
      if (this.searchInput) {
        hasil = hasil.filter((k) =>
          k.name.toLowerCase().includes(this.searchInput.toLowerCase()),
        );
        this.notFound = hasil.length === 0;
      } else {
        this.notFound = false;
      }

      // filter posisi (role)
      if (this.posisi) {
        hasil = hasil.filter(
          (k) => k.role.toLowerCase() === this.posisi.toLowerCase(),
        );
      }

      // Sortir Tertinggi

      // Performa Tasks
      if (this.sortPerform === "highest" || this.sortPerform === "lowest") {
        hasil = hasil
          .filter(
            (k) =>
              k.performance_bugs &&
              typeof k.performance_bugs.score === "number",
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
              k.performance_bugs && typeof k.performance_bugs.bugs === "number",
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
              typeof k.avg_time_efficiency.avg_percentage === "number",
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
              typeof k.total_spent_hours.percentage === "number",
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
      if (!this.detailKaryawan || !this.detailKaryawan.tasks) {
        return [];
      }

      let hasil = this.detailKaryawan.tasks;
      // filter berdasarkan progress task (jika dipilih)
      if (this.progres) {
        hasil = hasil.filter(
          (k) => k.status_name.toLowerCase() === this.progres.toLowerCase(),
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

      // Filter BUG / TASK
      const isBugTask = (task) =>
        task.bug_label?.toLowerCase() === "bug terbuat";

      if (this.taskBug === "bugs") {
        hasil = hasil.filter(isBugTask);
      }

      if (this.taskBug === "task") {
        hasil = hasil.filter((task) => !isBugTask(task));
      }

      return hasil;
    },
    listHariTanggal() {
      // let hasil = this.daftarHari;
      // let hari = hasil.hari_libur;

      // return hari;
      return this.daftarHari.flatMap((bulan) => bulan.hari_libur);
    },
    isDetailMode() {
      return !!this.$route.query.id;
    },
  },

  watch: {
    start: "onDateChange",
    end: "onDateChange",

    "$route.query.id"() {
      this.resolveDetailKaryawan();
    },
  },
};
</script>
