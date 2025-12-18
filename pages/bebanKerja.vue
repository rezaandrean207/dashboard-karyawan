<template>
  <div class="konten">
    <div class="navbar">
      <div class="menu">
        <i class="fa-solid fa-bars" @click="menu"></i>
      </div>
      <p>Dashboard</p>
    </div>

    <div class="background" v-show="sidebar" @click="close">
      <div class="sidebar_responsive" v-show="sidebar">
        <div class="logo">
          <img src="/img/logo dna.png" alt="" />
          <div class="keterangan">
            <h5>Digital Nayaka Abhinaya</h5>
            <p>Kinerja Karyawan</p>
          </div>
        </div>

        <div class="sidebar-text">
          <NuxtLink to="/listKaryawan" class="listKaryawan">
            <i class="fa-solid fa-users"></i>
            <p>Daftar Karyawan</p>
          </NuxtLink>
          <NuxtLink to="/bebanKerja" class="performance">
            <i class="fa-regular fa-clock"></i>
            <p>Beban Kerja</p>
          </NuxtLink>
          <!-- <div class="setting">
          <i class="fa-solid fa-gear"></i>
          <a href="">Pengaturan</a>
        </div> -->
        </div>

        <div class="footer_sidebar">
          <div class="user">
            <p>Logged in sebagai</p>
            <h4>Reza Andrean</h4>
            <p>Karyawan</p>
          </div>
          <div class="sync">
            <button
              class="btn"
              @click="syncData"
              :disabled="loading"
              :style="{
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }"
            >
              <span v-if="loading" class="spinner"></span>
              <!-- <i v-else class="fa-solid fa-rotate-right"></i> -->
              <i v-else class="fa-solid fa-rotate-right"></i>

              {{ loading ? "Menyinkronkan..." : "Sync" }}
              <!-- <i v-else class="fa-solid fa-circle-check"></i>     -->
            </button>
          </div>
          <NuxtLink to="/" class="logout">Logout</NuxtLink>
        </div>
      </div>
    </div>

    <div class="sidebar">
      <div class="logo">
        <img src="/img/logo dna.png" alt="" />
        <div class="keterangan">
          <h5>Digital Nayaka Abhinaya</h5>
          <p>Kinerja Karyawan</p>
        </div>
      </div>

      <div class="sidebar-text">
        <NuxtLink to="/listKaryawan" class="listKaryawan">
          <i class="fa-solid fa-users"></i>
          <p>Daftar Karyawan</p>
        </NuxtLink>
        <NuxtLink to="/bebanKerja" class="performance">
          <i class="fa-regular fa-clock"></i>
          <p>Beban Kerja</p>
        </NuxtLink>

        <!-- <NuxtLink to="/laporanKinerja" class="report">
          <i class="fa-solid fa-chart-simple"></i>
          <p>Laporan Kinerja</p>
        </NuxtLink> -->
        <!-- <div class="setting">
          <i class="fa-solid fa-gear"></i>
          <a href="">Pengaturan</a>
        </div> -->
      </div>

      <div class="footer_sidebar">
        <div class="user">
          <p>Logged in sebagai</p>
          <h4>Reza Andrean</h4>
          <p>Karyawan</p>
        </div>
        <div class="sync">
          <button
            class="btn"
            @click="syncData"
            :disabled="loading"
            :style="{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }"
          >
            <span v-if="loading" class="spinner"></span>
            <i v-else class="fa-solid fa-rotate-right"></i>
            {{ loading ? "Menyinkronkan..." : "Sync" }}
          </button>
          <!-- <NuxtLink to="/historySync" class="btn">
            <i class="fa-solid fa-clock-rotate-left"></i>
            <p>History Sync</p>
          </NuxtLink> -->
        </div>
        <NuxtLink to="/" class="logout">Logout</NuxtLink>
      </div>
    </div>

    <div class="isi" v-if="detailKaryawan === null">
      <!-- Animasi sukses -->
      <div v-if="sukses" class="success-animation">
        <div class="sukses">
          <div class="berhasil">
            <div class="ceklis">
              <i class="fa-solid fa-check"></i>
            </div>
            <p>Sinkronisasi Berhasil!</p>
          </div>
          <div class="silang" @click="closeSukses">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="loading">
        <div class="loading_tanggal">
          <i class="fa-solid fa-circle-notch fa-spin"></i>
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
            <!-- <select name="posisi" id="" v-model="posisi">
              <option value="">Semua Posisi</option>
              <option value="frontend">Frontend Developer</option>
              <option value="backend">Backend Developer</option>
              <option value="ui/ux">UI/UX Designer</option>
              <option value="project manager">Project Manager</option>
            </select> -->
            <select v-model="posisi">
              <option value="" selected>Semua Posisi</option>
              <option value="pm">Project Manager</option>
              <option value="analis">Data Analys</option>
              <option value="backend">Backend</option>
              <option value="backend-web">Backend Web Developer</option>
              <option value="web">Web Developer</option>
              <option value="mobile apps">Mobile Apps</option>
              <option value="UI-UX">UI-UX</option>
            </select>
          </div>
          <!-- <div class="tanggal_mulai">
            <label for="tanggal">Tanggal Mulai</label>
            <input type="date" name="tanggal" id="" />
          </div> -->
          <div class="dates">
            <label for="tanggal">Tanggal</label>
            <div class="tanggal">
              <input type="date" name="start" v-model="start" />

              <!-- <NuxtTime :datetime="sekarang" day="2-digit" month="2-digit" year="numeric" /> -->

              <span class="separator">➡️</span>
              <input type="date" name="end" v-model="end" />
            </div>
          </div>
          <!-- <div class="tanggal_akhir">
            <label for="tanggal">Tanggal Akhir</label>
            
          </div> -->
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

      <div class="not_found" v-show="notFound">
        <p>Not Found</p>
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
              <!-- <h4>{{ k.name }}</h4> -->
              <h4>{{ k.username }}</h4>
              <!-- <p>{{ k.position }}</p> -->
              <!-- <p v-if="ambilTask">{{ k.tasks.length }}</p>
              <p v-else>{{ totalFilteredTask(k) }}</p> -->
              <p>{{ k.role }}</p>
              <!-- <p v-if="k.role === 'pm'">Project Manager</p>
              <p v-if="k.role === 'analis'">Data Analys</p>
              <p v-if="k.role === 'backend'">Backend</p>
              <p v-if="k.role === 'web'">Web Developer</p>
              <p v-if="k.role === 'backend-web'">Backend-Web Developer</p>
              <p v-if="k.role === 'mobile apps'">Mobile Apps</p>
              <p v-if="k.role === 'UI-UX'">UI-UX Designer</p> -->
            </div>
          </div>

          <div class="status_karyawan">
            <div
              :class="{
                available: k.availability_status === 'Available',
                not_available: k.availability_status === 'Not Available',
              }"
            >
              <i class="fa-solid fa-circle"></i>
              <p>{{ k.availability_status }}</p>
            </div>
            <div
              :class="{
                overload_task: k.workload_status === 'Overload',
                underload_task: k.workload_status === 'Underload',
                normal_task: k.workload_status === 'Normal',
              }"
            >
              <i
                :class="{
                  'fa-solid fa-chart-line': k.workload_status === 'Underload',
                  'fa-solid fa-equals': k.workload_status === 'Normal',
                  'fa-solid fa-arrow-trend-up':
                    k.workload_status === 'Overload',
                }"
              ></i>
              <!-- <i class="fa-solid fa-chart-line"></i>
              <i class="fa-solid fa-arrow-trend-up"></i>
              <i class="fa-solid fa-equals"></i> -->
              <p>{{ k.workload_status }}</p>
            </div>
          </div>
          <div
            class="performa_karyawan"
            :class="{
              special: k.performance.score > 100,
              ontime: k.performance.score > 80 && k.performance.score <= 100,
              late: k.performance.score <= 80,
            }"
          >
            <i class="fa-solid fa-chart-line"></i>
            <div class="text">
              <p>Performa</p>
              <span
                ><strong>{{ k.performance.score }}%</strong></span
              >
            </div>
          </div>
        </div>

        <!-- <details class="details">
          <summary class="beban_karyawan">Beban Kerja Karyawan</summary> -->
        <div class="keterangan_karyawan">
          <div class="container_flex">
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
              :class="{
                special: k.total_spent_hours.percentage > 100,
                ontime:
                  k.total_spent_hours.percentage > 80 &&
                  k.total_spent_hours.percentage <= 100,
                late: k.total_spent_hours.percentage <= 80,
              }"
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
            <!-- <div
              class="ketepatan_pengerjaan"
              v-if="k.avg_time_efficiency.avg_percentage == null"
            >
              <div class="teks">
                <p>Ketepatan Pengerjaan Semua Tugas</p>
                <h4>-</h4>
              </div>
              <div class="ikon">
                <i class="fa-solid fa-list-check"></i>
              </div>
            </div> -->
            <div
              class="ketepatan_pengerjaan"
              v-if="k.avg_time_efficiency.avg_percentage"
              :class="{
                special: k.avg_time_efficiency.avg_percentage > 100,
                ontime:
                  k.avg_time_efficiency.avg_percentage > 80 &&
                  k.avg_time_efficiency.avg_percentage <= 100,
                late: k.avg_time_efficiency.avg_percentage <= 80,
              }"
            >
              <div class="teks">
                <p>Ketepatan Pengerjaan Semua Tugas</p>
                <h4>{{ k.avg_time_efficiency.avg_percentage }}%</h4>
              </div>
              <div class="ikon">
                <i class="fa-solid fa-list-check"></i>
              </div>
            </div>
          </div>
          <!-- <div class="container_block">
              <p>Breakdown Detail</p>
              <div class="container1">
                <p>Selesai</p>
                <p>-</p>
              </div>
              <div class="container2">
                <p>Sedang Dikerjakan</p>
                <p>-</p>
              </div>
              <div class="container3">
                <p>Akan Datang</p>
                <p>-</p>
              </div>
              <div class="container4">
                <p>Total Aktif:</p>
                <p>-</p>
              </div>
              <div class="container5">
                <p>Standar (Seharusnya)</p>
                <p>{{ k.expected_hours }} Jam</p>
              </div>
            </div> -->
        </div>
        <!-- </details> -->

        <div class="detail_task" @click="detail(k)">
          <i class="fa-solid fa-list-check"></i>
          <p v-if="ambilTask">Task Detail ({{ k.tasks.length }} Task)</p>
          <p v-else>{{ totalFilteredTask(k) }}</p>
          <i class="fa-solid fa-arrow-up-from-bracket"></i>
        </div>

        <!-- <details class="details">
          <summary class="ringkasan">Ringkasan</summary>
          <div class="ringkasan_task">
            <p class="jud">Jenis Task:</p>
            <details class="task_detail" v-for="task in k.tasks">
              <summary class="jenis_task">
                <div class="jenis_1">
                  <p class="kategori">{{ task.name }}</p>
                  <p>2 task - 56 jam</p>
                </div>
              </summary>
              <div class="content">
                <div class="name_task">
                  <p>{{ task.description }}</p>
                  <div class="progres-level">
                    <div class="kemajuan">
                      <p>Selesai</p>
                    </div>
                    <div class="kesulitan">
                      <p>High</p>
                    </div>
                  </div>
                </div>
                <p class="ket">{{ k.text_content }}</p>
                <div class="time">
                  <div class="jam">
                    <i class="fa-regular fa-clock"></i>
                    <p>32 jam</p>
                  </div>
                  <div class="tanggal">
                    <i class="fa-regular fa-calendar"></i>
                    <p>15/9/2025</p>
                  </div>
                  <div class="project">
                    <p>Clickup</p>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </details> -->

        <!-- <div class="detail_task">
          <p>Detail Task</p>

          <div class="task">
            <div class="task1-2">
              <div class="task_1">
                <i class="fa-solid fa-circle"></i>
                <div class="keterangan_task">
                  <p>Develop Landing Page</p>
                  <div class="kondisi_task">
                    <p>32 jam - 15/09/2025</p>
                    <div class="progres">
                      <p>Selesai</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="task_2">
                <i class="fa-solid fa-circle"></i>
                <div class="keterangan_task">
                  <p>Fix Bug In Dashboard</p>
                  <div class="kondisi_task">
                    <p>32 jam - 15/09/2025</p>
                    <div class="progres">
                      <p>Selesai</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="task_2">
                <i class="fa-solid fa-circle"></i>
                <div class="keterangan_task">
                  <p>Fix Bug In Dashboard</p>
                  <div class="kondisi_task">
                    <p>32 jam - 15/09/2025</p>
                    <div class="progres">
                      <p>Selesai</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="task_2">
                <i class="fa-solid fa-circle"></i>
                <div class="keterangan_task">
                  <p>Fix Bug In Dashboard</p>
                  <div class="kondisi_task">
                    <p>32 jam - 15/09/2025</p>
                    <div class="progres">
                      <p>Selesai</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> -->
      </div>
      <!-- <div class="panduan">
        <div class="panduan_overload">
          <i class="fa-solid fa-circle"></i>
          <p>Overload:</p>
          <p>></p>
          <p>160 jam/bulan</p>
        </div>
        <div class="panduan_normal">
          <i class="fa-solid fa-circle"></i>
          <p>Normal:</p>
          <p>100-160 jam/bulan</p>
        </div>
        <div class="panduan_underload">
          <i class="fa-solid fa-circle"></i>
          <p>Underload:</p>
          <p><</p>
          <p>100 jam/bulan</p>
        </div>
      </div> -->
    </div>

    <!-- Details Task -->
    <div class="isi" v-else>
      <div class="header_task">
        <div class="back_button" @click="kembali">
          <i class="fa-solid fa-arrow-left"></i>
          <p>Kembali</p>
        </div>
        <!-- <div class="detailTask_karyawan">
          <p class="name_karyawan">
            Detail Task - {{ detailKaryawan.username }}
          </p>
          <div class="periode">
             <p>Periode: {{ start }} - {{ end }}</p> -->
        <!-- <p v-if="start === '' && end === ''">Seluruh Periode</p>
            <p v-else>Periode: {{ start }} - {{ end }}</p>
          </div>
        </div>  -->
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
            <div
              :class="{
                available: detailKaryawan.availability_status === 'Available',
                not_available:
                  detailKaryawan.availability_status === 'Not Available',
              }"
            >
              <i class="fa-solid fa-circle"></i>
              <p>{{ detailKaryawan.availability_status }}</p>
            </div>
            <div
              :class="{
                overload_task: detailKaryawan.workload_status === 'Overload',
                underload_task: detailKaryawan.workload_status === 'Underload',
                normal_task: detailKaryawan.workload_status === 'Normal',
              }"
            >
              <i
                :class="{
                  'fa-solid fa-chart-line':
                    detailKaryawan.workload_status === 'Underload',
                  'fa-solid fa-equals':
                    detailKaryawan.workload_status === 'Normal',
                  'fa-solid fa-arrow-trend-up':
                    detailKaryawan.workload_status === 'Overload',
                }"
              ></i>
              <!-- <i class="fa-solid fa-chart-line"></i>
              <i class="fa-solid fa-arrow-trend-up"></i>
              <i class="fa-solid fa-equals"></i> -->
              <p>{{ detailKaryawan.workload_status }}</p>
            </div>
          </div>
          <div
            class="performa_karyawan"
            :class="{
              special: detailKaryawan.performance.score > 100,
              ontime:
                detailKaryawan.performance.score > 80 &&
                detailKaryawan.performance.score <= 100,
              late: detailKaryawan.performance.score <= 80,
            }"
          >
            <i class="fa-solid fa-chart-line"></i>
            <div class="text">
              <p>Performa</p>
              <span
                ><strong>{{ detailKaryawan.performance.score }}%</strong></span
              >
            </div>
          </div>
        </div>
        <!-- <div class="card_task">
          <p>Total Task</p>
          <p>{{ detailKaryawan.total_tasks }}</p>
        </div> -->
        <div class="keterangan_karyawan">
          <div class="container_flex">
            <div class="total_seharusnya">
              <div class="teks">
                <p>Total Beban Kerja (Seharusnya)</p>
                <h4>{{ detailKaryawan.expected_hours }} Jam</h4>
              </div>
              <div class="ikon">
                <i class="fa-regular fa-clock"></i>
              </div>
            </div>
            <div class="total_beban">
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
              class="ketepatan_pengerjaan"
              v-if="detailKaryawan.avg_time_efficiency.avg_percentage"
              :class="{
                special:
                  detailKaryawan.avg_time_efficiency.avg_percentage > 100,
                ontime:
                  detailKaryawan.avg_time_efficiency.avg_percentage > 80 &&
                  detailKaryawan.avg_time_efficiency.avg_percentage <= 100,
                late: detailKaryawan.avg_time_efficiency.avg_percentage <= 80,
              }"
            >
              <div class="teks">
                <p>Ketepatan Pengerjaan Semua Tugas</p>
                <h4>
                  {{ detailKaryawan.avg_time_efficiency.avg_percentage }}%
                </h4>
              </div>
              <div class="ikon">
                <i class="fa-solid fa-list-check"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container_progres">
        <div class="container_selesai">
          <p>Task Selesai</p>
          <p>
            <strong>{{ completedTask }} Task</strong>
          </p>
        </div>
        <div class="container_onProgres">
          <p>Sedang Dikerjakan</p>
          <p>
            <strong>{{ inProgressTask }} Task</strong>
          </p>
        </div>
        <div class="container_todo">
          <p>Akan Datang</p>
          <p>
            <strong>{{ todoTask }} Task</strong>
          </p>
        </div>
      </div>

      <div class="task">
        <select name="" id="" class="select_task" v-model="progres">
          <option value="">Semua Progress</option>
          <option value="completed">Complete</option>
          <option value="done dev">Done Dev</option>
          <option value="in progress">In Progress</option>
          <option value="in review">In Review</option>
          <option value="to do">To Do</option>
        </select>

        <!-- <div class="select_task" @click="openTask">Semua Progres</div>

        <div class="opsi" v-if="openTaskList">
          <label for="">
            <input type="checkbox" name="" id="" v-model="complete" /> Complete
          </label>
          <label for="">
            <input type="checkbox" name="" id="" v-model="inProgres" /> In
            Progress
          </label>
          <label for="">
            <input type="checkbox" name="" id="" v-model="todo" /> To Do
          </label>
          <label for="">
            <input type="checkbox" name="" id="" v-model="inReview" /> In Review
          </label>
        </div> -->

        <div
          class="no_task"
          v-if="!detailKaryawan?.tasks || detailKaryawan.tasks.length === 0"
        >
          Tidak ada data
        </div>
        <div
          class="container_task"
          v-else
          v-for="k in detailKaryawan.tasks.filter(
            (t) =>
              t.status_name !== 'backlog' &&
              (!progres ||
                t.status_name.toLowerCase() === progres.toLowerCase())
          )"
        >
          <div class="header_container">
            <div class="name_task">
              <p>{{ k.name }}</p>
            </div>
            <div class="status_task">
              <div
                class="progres_task"
                :class="{
                  task_todo: k.status_name === 'to do',
                  task_selesai:
                    k.status_name === 'done dev' ||
                    k.status_name === 'completed',
                  task_inProgress: k.status_name === 'in progress',
                  task_inReview: k.status_name === 'in review',
                  task_cancelled: k.status_name === 'cancelled',
                }"
              >
                <p v-if="k.status_name === 'done dev'">Done Dev</p>
                <p v-if="k.status_name === 'completed'">Complete</p>
                <p v-if="k.status_name === 'in progress'">In Progress</p>
                <p v-if="k.status_name === 'to do'">To Do</p>
                <p v-if="k.status_name === 'in review'">In Review</p>
                <p v-if="k.status_name === 'cancelled'">Cancel</p>
              </div>
              <div class="task_priority" v-if="k.priority_task">
                <p>{{ k.priority_task }}</p>
              </div>
              <div class="task_priority" v-else>
                <p>No Priority</p>
              </div>

              <div class="task_penghargaan">
                <!-- <i class="fa-solid fa-award"></i> -->
                <p>{{ k.project_name }}</p>
              </div>
            </div>
          </div>
          <div class="description">
            <p>{{ k.description }}</p>
          </div>
          <div
            class="achievement"
            v-if="k.status_name === 'done dev' || k.status_name === 'completed'"
            :class="{
              special: k.time_efficiency_percentage > 100,
              ontime: k.time_efficiency_percentage === 100,
              late: k.time_efficiency_percentage < 100,
            }"
          >
            <div class="penghargaan">
              <p>Ketepatan Pengerjaan Tugas</p>
              <h4>{{ k.time_efficiency_percentage }}%</h4>

              <!-- <p class="label">Lebih Cepat</p> -->
              <h4>{{ k.remaining_duration }}</h4>
            </div>
            <!-- <div class="penghargaan" v-if="k.time_efficiency_percentage > 100">
              <p>
               
                Ketepatan Pengerjaan Tugas
              </p>
              <h4>{{ k.time_efficiency_percentage }}%</h4>

              <p class="label">Lebih Cepat</p>
              <h4>{{ k.remaining_duration }} Jam</h4>
            </div>
            <div
              class="penghargaan"
              v-else-if="k.time_efficiency_percentage === 100"
            >
              <p>Ketepatan Pengerjaan Tugas</p>
              <h4>{{ k.time_efficiency_percentage }}%</h4>

              <p class="label">Tepat Waktu</p>
              <h4>{{ k.remaining_duration }} Jam</h4>
            </div>
            <div
              class="penghargaan"
              v-else-if="k.time_efficiency_percentage < 100"
            >
              <p>
                Ketepatan Pengerjaan Tugas
              </p>
              <h4>{{ k.time_efficiency_percentage }}%</h4>

              <p class="label">Lebih Lambat</p>
              <h4>{{ k.remaining_duration }} Jam</h4>
            </div> -->
          </div>
          <div class="keterangan_waktu">
            <div class="jam">
              <i class="fa-regular fa-clock"></i>
              <p>Waktu Pengerjaan: {{ k.time_estimate_hours }} Jam</p>
            </div>
            <div class="start_date">
              <i class="fa-regular fa-calendar"></i>
              <p>Mulai: {{ k.start_date }}</p>
            </div>
            <div class="deadline">
              <i class="fa-regular fa-calendar"></i>
              <p>Target: {{ k.due_date }}</p>
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
          </div>

          <!-- <div class="jenis_data">
            <div class="form">
              <p>ClickUp</p>
            </div>
            <div class="jenis">
              <p>Frontend</p>
            </div>
          </div> -->
        </div>
      </div>
      <!-- <div class="task">
        <h4>Task Complete ({{ jumlahSelesai }})</h4>
        <div
          class="container_task"
          v-for="k in detailKaryawan.tasks.filter(
            (t) => t.status_name === 'done dev' || t.status_name === 'completed'
          )"
        >
          <div class="header_container">
            <div class="name_task">
              <p>{{ k.name }}</p>
            </div>
            <div class="status_task">
              <div class="progres_task">
                <p>Selesai</p>
              </div>
              <div class="task_priority">
                <p>High</p>
              </div>
              <div class="task_penghargaan">
                <i class="fa-solid fa-award"></i>
                <p>Achievement</p>
              </div>
            </div>
          </div>
          <div class="description">
            <p>{{ k.description }}</p>
          </div>
          <div class="achievement" v-show="achiv">
            <div class="achievement_logo">
              <i class="fa-solid fa-award"></i>
            </div>
            <div class="penghargaan">
              <p>
                🎉 <strong>Penghargaan!</strong> Selesai 2 hari lebih cepat dari
                deadline
              </p>
              <p>Lebih cepat: 48 jam</p>
            </div>
          </div>
          <div class="keterangan_waktu">
            <div class="jam">
              <i class="fa-regular fa-clock"></i>
              <p>16 jam</p>
            </div>
            <div class="start_date">
              <i class="fa-regular fa-calendar"></i>
              <p>Tanggal: 02/12/2024</p>
            </div>
            <div class="deadline">
              <i class="fa-regular fa-calendar"></i>
              <p>Deadline: 05/12/2024</p>
            </div>
            <div class="done_date">
              <i class="fa-regular fa-calendar"></i>
              <p>Selesai: 03/12/2024</p>
            </div>
          </div>

          <div class="jenis_data">
            <div class="form">
              <p>ClickUp</p>
            </div>
            <div class="jenis">
              <p>Frontend</p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="task_inProgres"
        v-if="detailKaryawan.tasks.some((t) => t.status_name === 'in progress')"
      >
        <div class="task">
          <h4>In Progress ({{ jumlahInProgress }})</h4>
          <div
            class="container_task"
            v-for="k in detailKaryawan.tasks.filter(
              (t) => t.status_name === 'in progress'
            )"
          >
            <div class="header_container">
              <div class="name_task">
                <p>{{ k.name }}</p>
              </div>
              <div class="status_task">
                <div class="progres_task">
                  <p>Selesai</p>
                </div>
                <div class="task_priority">
                  <p>High</p>
                </div>
                <div class="task_penghargaan">
                  <i class="fa-solid fa-award"></i>
                  <p>Achievement</p>
                </div>
              </div>
            </div>
            <div class="description">
              <p>Create responsive landing page for new product</p>
            </div>
            <div class="achievement" v-show="achiv">
              <div class="achievement_logo">
                <i class="fa-solid fa-award"></i>
              </div>
              <div class="penghargaan">
                <p>
                  🎉 <strong>Penghargaan!</strong> Selesai 2 hari lebih cepat
                  dari deadline
                </p>
                <p>Lebih cepat: 48 jam</p>
              </div>
            </div>
            <div class="keterangan_waktu">
              <div class="jam">
                <i class="fa-regular fa-clock"></i>
                <p>16 jam</p>
              </div>
              <div class="start_date">
                <i class="fa-regular fa-calendar"></i>
                <p>Tanggal: 02/12/2024</p>
              </div>
              <div class="deadline">
                <i class="fa-regular fa-calendar"></i>
                <p>Deadline: 05/12/2024</p>
              </div>
              <div class="done_date">
                <i class="fa-regular fa-calendar"></i>
                <p>Selesai: 03/12/2024</p>
              </div>
            </div>

            <div class="jenis_data">
              <div class="form">
                <p>ClickUp</p>
              </div>
              <div class="jenis">
                <p>Frontend</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="task_review"
        v-if="detailKaryawan.tasks.some((t) => t.status_name === 'in review')"
      >
        <div class="task">
          <h4>In Review ({{ inReview }})</h4>
          <div
            class="container_task"
            v-for="k in detailKaryawan.tasks.filter(
              (t) => t.status_name === 'in review'
            )"
          >
            <div class="header_container">
              <div class="name_task">
                <p>{{ k.name }}</p>
              </div>
              <div class="status_task">
                <div class="progres_task">
                  <p>Selesai</p>
                </div>
                <div class="task_priority">
                  <p>High</p>
                </div>
                <div class="task_penghargaan">
                  <i class="fa-solid fa-award"></i>
                  <p>Achievement</p>
                </div>
              </div>
            </div>
            <div class="description">
              <p>Create responsive landing page for new product</p>
            </div>
            <div class="achievement" v-show="achiv">
              <div class="achievement_logo">
                <i class="fa-solid fa-award"></i>
              </div>
              <div class="penghargaan">
                <p>
                  🎉 <strong>Penghargaan!</strong> Selesai 2 hari lebih cepat
                  dari deadline
                </p>
                <p>Lebih cepat: 48 jam</p>
              </div>
            </div>
            <div class="keterangan_waktu">
              <div class="jam">
                <i class="fa-regular fa-clock"></i>
                <p>16 jam</p>
              </div>
              <div class="start_date">
                <i class="fa-regular fa-calendar"></i>
                <p>Tanggal: 02/12/2024</p>
              </div>
              <div class="deadline">
                <i class="fa-regular fa-calendar"></i>
                <p>Deadline: 05/12/2024</p>
              </div>
              <div class="done_date">
                <i class="fa-regular fa-calendar"></i>
                <p>Selesai: 03/12/2024</p>
              </div>
            </div>

            <div class="jenis_data">
              <div class="form">
                <p>ClickUp</p>
              </div>
              <div class="jenis">
                <p>Frontend</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="task_todo"
        v-if="detailKaryawan.tasks.some((t) => t.status_name === 'to do')"
      >
        <div class="task">
          <h4>To Do ({{ jumlahTodo }})</h4>
          <div
            class="container_task"
            v-for="k in detailKaryawan.tasks.filter(
              (t) => t.status_name === 'to do'
            )"
          >
            <div class="header_container">
              <div class="name_task">
                <p>{{ k.name }}</p>
              </div>
              <div class="status_task">
                <div class="progres_task">
                  <p>Selesai</p>
                </div>
                <div class="task_priority">
                  <p>High</p>
                </div>
                <div class="task_penghargaan">
                  <i class="fa-solid fa-award"></i>
                  <p>Achievement</p>
                </div>
              </div>
            </div>
            <div class="description">
              <p>Create responsive landing page for new product</p>
            </div>
            <div class="achievement" v-show="achiv">
              <div class="achievement_logo">
                <i class="fa-solid fa-award"></i>
              </div>
              <div class="penghargaan">
                <p>
                  🎉 <strong>Penghargaan!</strong> Selesai 2 hari lebih cepat
                  dari deadline
                </p>
                <p>Lebih cepat: 48 jam</p>
              </div>
            </div>
            <div class="keterangan_waktu">
              <div class="jam">
                <i class="fa-regular fa-clock"></i>
                <p>16 jam</p>
              </div>
              <div class="start_date">
                <i class="fa-regular fa-calendar"></i>
                <p>Tanggal: 02/12/2024</p>
              </div>
              <div class="deadline">
                <i class="fa-regular fa-calendar"></i>
                <p>Deadline: 05/12/2024</p>
              </div>
              <div class="done_date">
                <i class="fa-regular fa-calendar"></i>
                <p>Selesai: 03/12/2024</p>
              </div>
            </div>

            <div class="jenis_data">
              <div class="form">
                <p>ClickUp</p>
              </div>
              <div class="jenis">
                <p>Frontend</p>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

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
  width: 96%;
}

.container_selesai,
.container_onProgres,
.container_todo {
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  flex-direction: column;
  display: flex;
  gap: 6px;
}

.container_selesai {
  background-color: rgb(233, 243, 255);
  border: 1px solid rgb(136, 190, 255);
}
.container_selesai p {
  color: rgb(16, 50, 130);
  font-size: 15px;
}

.container_onProgres {
  background-color: rgb(255, 244, 230);
  border: 1px solid rgb(255, 200, 150);
}
.container_onProgres p {
  color: rgb(218, 58, 0);
  font-size: 15px;
}

.container_todo {
  background-color: #f3e8ff;
  border: 1px solid #d8b4fe;
}
.container_todo p {
  color: purple;
  font-size: 15px;
}
</style>

<!-- Style Responsive -->
<style scoped>
@media (max-width: 576px) {
  .dates {
    width: 100%;
    /* position: relative; */
  }

  .dates .tanggal {
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
  .keterangan_waktu .done_date {
    margin: 0;
    width: 100%;
    line-height: 1.2;
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
  width: 96%;
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

.header_task .detailTask_karyawan {
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
  width: 96%;
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
  flex: 10;
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
  width: 96%;
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

.status_task .task_penghargaan {
  display: flex;
  align-items: center;
  gap: 5px;
  /* background-color: rgb(222, 255, 222);
  border: 1px solid rgb(115, 255, 115); */
  background-color: #fff;
  border: 1px solid var(--border_color);
  border-radius: 7px;
  padding: 2px 5px;
  padding-top: 4px;
  color: var(--font-color);
  /* color: #fff; */
}

.status_task .progres_task {
  /* background-color: rgb(216, 216, 255);
  border: 1px solid rgb(176, 176, 255); */
  border-radius: 7px;
  padding: 2px 5px;
  /* color: rgb(0, 0, 255); */
  display: flex;
  align-items: center;
}

.task_priority {
  background-color: rgb(255, 47, 47);
  padding: 2px 5px;
  border-radius: 7px;
  /* border: 1px solid rgb(255, 0, 0); */
  color: #fff;
  display: flex;
  align-items: center;
}

.description {
  margin: 10px 0;
  font-weight: 400;
}

.achievement {
  display: flex;
  gap: 10px;
  /* background-color: rgb(222, 255, 222);
  border: 1px solid rgb(115, 255, 115); */
  border-radius: 10px;
  padding: 12px;
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
}

.keterangan_waktu .jam,
.start_date,
.deadline,
.done_date {
  display: flex;
  align-items: center;
  gap: 4px;
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

.select_task {
  /* background: #fff
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")
    no-repeat right 10px center;
  background-size: 16px; */
  border: 1px solid #010101;
  padding: 4px 8px;
  font-size: 14px;
  border-radius: 6px;
  width: 200px;
}

.opsi {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 200px;
  /* align-items: center; */
  justify-content: center;
  border: 1px solid var(--border_color);
  /* padding: 10px; */
  background-color: #fff;
  position: absolute;
  margin-top: 10px;
  border-radius: 6px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
}

.opsi label {
  border: 1px solid #f5f3f3;
  padding: 10px;
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

/* Laporan Pages */
.isi .keterangan_kerja {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  width: 96%;
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
  width: 96%;
  border-radius: 10px;
  padding: 25px;
  background-color: #fff;
}

.kinerja_karyawan .profil {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-right: 20px;
  /* justify-content: space-between; */
  /* border-bottom: 1px solid #b5b5b5c9; */
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
.not_available {
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
  /* text-wrap: nowrap; */
}

.status_karyawan .available i {
  color: rgb(0, 255, 0);
  font-size: 8px;
}

.status_karyawan .not_available i {
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

.overload_task {
  background-color: rgb(212, 255, 212);
  border: 1px solid rgb(154, 255, 154);
}

.overload_task p {
  color: green;
}

.underload_task {
  background-color: rgb(255, 237, 237);
  /* color: rgb(203, 0, 0); */
  border: 1px solid rgb(255, 204, 204);
}

.underload_task p {
  color: rgb(203, 0, 0);
}

.normal_task {
  background-color: #f5f5f5;
  border: 1px solid #dbdbdb;
  color: #010101;
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
.container_flex .ketepatan_pengerjaan {
  width: 100%;
  padding: 20px 15px;
  border-radius: 10px;
  font-weight: 400;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kinerja_karyawan .keterangan_karyawan .container_block {
  padding: 20px;
  border: 1px solid #010101;
  margin-top: 20px;
  border: var(--borderCard);
  border-radius: 10px;
}

.container_block p {
  font-weight: 300;
}

.container_block .container2,
.container_block .container1,
.container_block .container3,
.container_block .container4,
.container_block .container5 {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  border-radius: 5px;
  font-weight: 300;
  font-size: 14px;
  margin-top: 10px;
}

.container1 {
  background-color: rgb(236, 244, 255);
  /* border: 1px solid rgb(186, 215, 255); */
}

.container2 {
  background-color: rgb(255, 247, 232);
  /* border: 1px solid rgb(255, 224, 166); */
}

.container3 {
  background-color: rgb(249, 239, 255);
  /* border: 1px solid rgb(220, 160, 255); */
}

.container4 {
  background-color: #eeeeee;
  border-top: 3px solid #ddd;
}

.container5 {
  background-color: #f7f7f7;
  /* border: 1px solid #e0e0e0; */
}
.ikon i {
  font-size: 30px;
}

.total_beban .ikon {
  /* color: blue; */
}

/* .total_beban {
  background-color: rgb(226, 255, 225);
  border: 1px solid rgb(166, 255, 163);
  color: rgb(16, 130, 50);
} */

.total_beban h4,
.total_seharusnya h4,
.ketepatan_pengerjaan h4 {
  font-size: large;
}

.total_seharusnya {
  background-color: #f5f5f5;
  border: 1px solid #d1d1d1;
  color: #333333;
}

/* .ketepatan_pengerjaan {
  background-color: rgb(245, 239, 255);
  border: 1px solid rgb(245, 239, 255);
} */

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

/* .detail_task { */
/* border: 1px solid #010101; */
/* margin-top: 10px;
} */

.detail_task {
  position: relative;
  z-index: 999;
  cursor: pointer;
}

.detail_task .task .task1-2 {
  display: flex;
  /* justify-content: center; */
  gap: 20px;
  flex-wrap: wrap;
}

.task1-2 .task_1,
.task1-2 .task_2 {
  background-color: #f9f9f9;
  width: 49%;
  text-align: justify;
  padding: 8px 10px;
  font-size: 16px;
  border-radius: 10px;
  display: flex;
  align-items: baseline;
  gap: 10px;
  border: 1px solid rgb(230, 230, 255);
  margin-top: 10px;
}

.task_1 i,
.task_2 i {
  font-size: 8px;
  color: red;
}

.task_1 .keterangan_task .kondisi_task,
.task_2 .keterangan_task .kondisi_task {
  display: flex;
  gap: 10px;
  align-items: center;
}

.kondisi_task .progres {
  border: 1px solid #a7a7a7;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 5px;
  font-weight: 600;
}

.panduan {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 35px;
  background-color: rgb(231, 244, 255);
  font-size: 14px;
  height: 80px;
  width: 96%;
  margin: 20px 0;
  border: var(--borderCard);
  border-radius: 10px;
}

.panduan_overload,
.panduan_normal,
.panduan_underload {
  display: flex;
  align-items: center;
  gap: 5px;
}

.panduan_overload i {
  color: red;
}

.panduan_normal i {
  color: rgb(4, 229, 4);
}

.panduan_underload i {
  color: orange;
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

.progres-level .kemajuan,
.kesulitan {
  /* padding: 5px; */
  padding: 0px 8px;
  border: var(--borderCard);
  border-radius: 8px;
  font-size: 12px;
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

.jenis_task {
  padding: 30px 20px;
  font-weight: 300;
  background-color: #f5f5f5;
}

.jenis_task:hover {
  background-color: #e3e3e3;
}

.kategori {
  font-size: 16px;
  font-weight: 400;
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
  /* font-family: "Font Awesome 7 Free";
  font-weight: 900;
  content: "\f002"; */
  background: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'%3E%3Cpath%20d='M416%20208c0%2045.9-14.9%2088.3-40%20122.7L502.6%20457.4c12.5%2012.5%2012.5%2032.8%200%2045.3s-32.8%2012.5-45.3%200L330.7%20376C296.3%20401.1%20253.9%20416%20208%20416%2093.1%20416%200%20322.9%200%20208S93.1%200%20208%200%20416%2093.1%20416%20208zM208%20352a144%20144%200%201%200%200-288%20144%20144%200%201%200%200%20288z'/%3E%3C/svg%3E")
    no-repeat 10px center;
  background-size: 14px;
  padding-left: 35px;
}

.detail_task {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: blue;
  border-radius: 10px;
  padding: 8px;
  color: #fff;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
}

.detail_task:hover {
  background-color: rgb(7, 7, 183);
}

/* ========================================================= */
/*                       RESPONSIVE                          */
/* ========================================================= */

/* ----------- 1024px (Tablet Landscape) ----------- */
@media (max-width: 1024px) {
  html {
    font-size: 65%;
  }

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

  .task1-2 .task_1,
  .task1-2 .task_2 {
    width: 48%;
  }

  .panduan {
    gap: 20px;
    font-size: 13px;
  }

  .back_button {
    margin-top: 30px;
  }

  .container_progres {
    flex-wrap: wrap;
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

  .task1-2 {
    flex-direction: column;
  }

  .task1-2 .task_1,
  .task1-2 .task_2 {
    width: 100%;
  }

  .panduan {
    flex-direction: column;
    height: auto;
    padding: 15px 0;
    gap: 10px;
  }

  .content {
    font-size: 14px;
  }

  /* .content .time {
    flex-direction: column;
    gap: 8px;
  } */

  .detail_task {
    font-size: 13px;
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

  .container_block .container1,
  .container_block .container2,
  .container_block .container3,
  .container_block .container4,
  .container_block .container5 {
    height: auto;
    padding: 10px;
    font-size: 13px;
  }

  .task1-2 .task_1,
  .task1-2 .task_2 {
    font-size: 14px;
    padding: 10px;
  }

  /* .name_task {
    flex-direction: column;
    gap: 8px;
  } */

  input,
  select {
    background-position: 10px center !important;
    padding-left: 32px !important;
  }

  form .tanggal_mulai {
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

  .detail_task {
    font-size: 10px;
  }
}
</style>

<script setup>
definePageMeta({
  middleware: "auth",
});
</script>

<script>
import DetailTask from "./detailTask.vue";

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
      start: "",
      end: "",
      achiv: true,
      openTaskList: false,
      karyawanLuar: [],
      complete: [],
      progres: "",
      isLoading: false,
    };
  },
  mounted() {
    this.setDefaultTanggal();
    this.ambilTask();
  },
  methods: {
    convertTime(value) {
      // Kalau nilainya mendekati ms (3,600,000 ms = 1 jam)
      if (value >= 360000) {
        return value / 1000 / 60;
      }

      // Kalau nilainya lebih kecil, pakai faktor 10000
      return value / 10000;
    },
    formatTanggal(tgl) {
      const [year, month, day] = tgl.split("-");
      return `${day}-${month}-${year}`;
    },

    setDefaultTanggal() {
      if (this.start && this.end) return;
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 30);

      // Format ke YYYY-MM-DD (format input type="date")
      const format = (date) => date.toISOString().split("T")[0];
      this.start = format(sevenDaysAgo);
      this.end = format(today);
    },
    closeSukses() {
      this.sukses = false;
    },

    async ambilTask() {
      this.isLoading = true;
      console.log("Ambil task dipanggil");
      // const { $api } = useNuxtApp();

      // const task = await $api_task.get("/api/v1/workload/tasks-by-range?start=2025-08-01&end=2025-12-30");
      // const task = await $api.get("/api/v1/clickup/tasks");
      try {
        const task = await this.$api.get(
          `/api/v1/workload/tasks-by-range?start_date=${this.formatTanggal(
            this.start
          )}&end_date=${this.formatTanggal(this.end)}`
          // "/api/v1/workload/tasks-by-range?start_date=01-07-2025&end_date=31-12-2025"
        );
        this.daftarKaryawan = task.data.assignees;

        console.log("Berhasil ambil task:", task);
        this.isLoading = false;
      } catch (error) {
        console.error("Gagal ambil task:", error);
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }

      // const task = await $api.get(
      //   "/api/v1/workload/tasks-by-range?start_date=01-07-2025&end_date=31-12-2025"
      // );
      // this.daftarKaryawan = task.data.assignees;

      // const tampilanLuar = await $api.get(
      //   `/api/v1/workload/summary?start_date=09-12-2025&end_date=10-12-2025`
      // );
      // this.karyawanLuar = tampilanLuar.data.assignees;

      // console.log(task);
    },

    async syncData() {
      // const { $api } = useNuxtApp();
      // console.log("SYNC DATA DIPANGGIL !");

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
      this.sidebar = false;
    },
    detail(karyawan) {
      // this.daftarKaryawan = karyawan;
      this.detail_task = true;
      this.detailKaryawan = karyawan;

      // jika filter tanggal aktif → tasks detail juga harus disaring ulang
      if (this.start && this.end) {
        const startFilter = new Date(this.start);
        const endFilter = new Date(this.end);

        this.detailTasks = karyawan.tasks.filter((t) => {
          const tgl = new Date(t.start_date);
          return tgl >= startFilter && tgl <= endFilter;
        });
      } else {
        this.detailTasks = karyawan.tasks; // tampilkan full
      }
    },
    kembali() {
      this.detail_task = false;
      this.detailKaryawan = null;
      this.progres = "";
    },
    openTask() {
      this.openTaskList = !this.openTaskList;
    },
  },
  computed: {
    filteredKaryawan() {
      let hasil = this.daftarKaryawan;

      // filter nama
      if (this.searchInput) {
        hasil = hasil.filter(
          (k) => k.name.toLowerCase().includes(this.searchInput.toLowerCase()),
          (this.notFound = false)
        );

        if (hasil.length === 0) {
          // alert("Tidak ditemukan");
          this.notFound = true;
        }
      }

      // filter posisi (role)
      if (this.posisi) {
        hasil = hasil.filter(
          (k) => k.role.toLowerCase() === this.posisi.toLowerCase()
        );
      }

      // filter berdasarkan progress task (jika dipilih)
      if (this.progres) {
        hasil = hasil.filter((k) =>
          (k.tasks || []).some(
            (t) => t.status_name.toLowerCase() === this.progres.toLowerCase()
          )
        );
      }

      // Filter by tanggal
      // if (this.start && this.end) {
      //   const startFilter = new Date(this.start);
      //   const endFilter = new Date(this.end);
      //   // Convert DD-MM-YYYY → Date
      //   const fixDate = (tanggal) => {
      //     if (!tanggal) return null;

      //     const [dd, mm, yyyy] = tanggal.split("-");
      //     return new Date(`${yyyy}-${mm}-${dd}`);
      //   };

      //   hasil = hasil
      //     .map((karyawan) => {
      //       // Filter task per karyawan
      //       const filteredTasks = (karyawan.tasks || []).filter((t) => {
      //         const startDate = fixDate(t.start_date);
      //         const dueDate = fixDate(t.due_date);

      //         // Task masuk range jika:
      //         // - Mulai atau selesai di antara range
      //         // - Atau range berada di dalam rentang task
      //         return startDate <= endFilter && dueDate >= startFilter;
      //       });

      //       return { ...karyawan, filteredTasks: filteredTasks };
      //     })
      //     .filter((k) => k.tasks.length > 0); // Hanya tampilkan karyawan yg punya task dalam range
      // }

      return hasil;
    },

    filteredTask() {
      return this.detailKaryawan.tasks.filter((t) => {
        // Jika tidak ada filter
        if (
          !this.complete &&
          !this.inProgress &&
          !this.todo &&
          !this.inReview
        ) {
          return true; // Tampilkan semua
        }

        if (this.complete && t.status_name === "completed") {
          return true;
        }
        if (this.inProgress && t.status_name === "in progress") {
          return true;
        }
        if (this.todo && t.status_name === "to do") {
          return true;
        }
        if (this.inReview && t.status_name === "in review") {
          return true;
        }

        return false;
      });
    },

    totalFilteredTask() {
      return (karyawan) => {
        if (!this.start || !this.end) return karyawan.tasks.length;

        const startDate = new Date(this.start);
        const endDate = new Date(this.end);

        return karyawan.tasks.filter((t) => {
          const tgl = new Date(t.start_date);
          return tgl >= startDate && tgl <= endDate;
        }).length;
      };
    },
    completedTask() {
      return this.detailKaryawan.tasks.filter(
        (t) => t.status_name === "completed" || t.status_name === "done dev"
      ).length;
    },
    inProgressTask() {
      return this.detailKaryawan.tasks.filter(
        (t) => t.status_name === "in progress"
      ).length;
    },
    todoTask() {
      return this.detailKaryawan.tasks.filter((t) => t.status_name === "to do")
        .length;
    },
    // jumlahSelesai() {
    //   const selesai = ["completed", "done dev"];
    //   return this.detailKaryawan.tasks.filter((t) =>
    //     selesai.includes(t.status_name)
    //   ).length;
    // },
    // jumlahInProgress() {
    //   return this.detailKaryawan.tasks.filter(
    //     (t) => t.status_name === "in progress"
    //   ).length;
    // },
    // jumlahTodo() {
    //   return this.detailKaryawan.tasks.filter((t) => t.status_name === "to do")
    //     .length;
    // },
    // inReview() {
    //   return this.detailKaryawan.tasks.filter(
    //     (t) => t.status_name === "in review"
    //   ).length;
    // },
  },
  watch: {
    // start(newVal, oldVal) {
    //   this.ambilTask();
    // },
    // end(newVal, oldVal) {
    //console.log("END berubah:", newVal);
    //this.ambilTask();
    //},
    start() {
      if (this.start > this.end) {
        this.end = this.start;
        console.log("mulai");
      }
      if (this.start && this.end) this.ambilTask();
    },
    end() {
      if (this.end < this.start) {
        this.start = this.end;
        console.log("akhir");
      }
      if (this.start && this.end) this.ambilTask();
    },
  },
};
</script>
