<template>
  <div class="container_progres">
    <div class="container_selesai">
      <span>Task Selesai</span>
      <span>2 Task</span>
      <p>24 Jam</p>
    </div>
    <div class="container_onProgres">
      <span>Sedang Dikerjakan</span>
      <span>3 Task</span>
      <p>12 Jam</p>
    </div>
    <div class="container_todo">
      <span>Akan Datang</span>
      <span>5 Task</span>
      <p>48 Jam</p>
    </div>
  </div>
  <div class="background_bug">
    <div class="container_bug">
      <div class="header_containerBug">
        <i class="fa-solid fa-xmark"></i>
      </div>
      <div class="bug_detail">
        <div class="header_bug">
          <div class="name_bug">
            <p>INFRA - Refused monitoring dan restart otomatis</p>
          </div>
          <div class="status_bug">
            <div class="bug_priority"></div>
          </div>
        </div>
        <div class="description">
          <p>restart service kiklelang restart elasticsearch</p>
        </div>
        <div class="keterangan_waktu">
          <div class="jam">
            <i class="fa-regular fa-clock"></i>
            <!-- <p>Waktu Pengerjaan: {{ k.time_estimate_hours }} Jam</p> -->
            <p>Waktu Pengerjaan: 8 Jam</p>
          </div>
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
            <p>Dibuat oleh: Karyawan</p>
          </div>
        </div>
      </div>
      <div class="bug_detail">
        <div class="header_bug">
          <div class="name_bug">
            <p>INFRA - Refused monitoring dan restart otomatis</p>
          </div>
          <div class="status_bug">
            <div class="bug_priority"></div>
          </div>
        </div>
        <div class="description">
          <p>restart service kiklelang restart elasticsearch</p>
        </div>
        <div class="keterangan_waktu">
          <div class="jam">
            <i class="fa-regular fa-clock"></i>
            <!-- <p>Waktu Pengerjaan: {{ k.time_estimate_hours }} Jam</p> -->
            <p>Waktu Pengerjaan: 8 Jam</p>
          </div>
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
            <p>Dibuat oleh: Karyawan</p>
          </div>
        </div>
      </div>
      <div class="bug_detail">
        <div class="header_bug">
          <div class="name_bug">
            <p>INFRA - Refused monitoring dan restart otomatis</p>
          </div>
          <div class="status_bug">
            <div class="bug_priority"></div>
          </div>
        </div>
        <div class="description">
          <p>restart service kiklelang restart elasticsearch</p>
        </div>
        <div class="keterangan_waktu">
          <div class="jam">
            <i class="fa-regular fa-clock"></i>
            <!-- <p>Waktu Pengerjaan: {{ k.time_estimate_hours }} Jam</p> -->
            <p>Waktu Pengerjaan: 8 Jam</p>
          </div>
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
            <p>Dibuat oleh: Karyawan</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>

<style scoped>
.container_bug {
  background-color: #fff;
  padding: 10px 20px 15px 20px;
  border-radius: 10px;
  width: 80%;
}

.header_containerBug {
  text-align: right;
}

.bug_detail {
  /* position: fixed;
  top: 0;
  left: 0; */
  border: 1px solid var(--border_color);
  padding: 15px;
  border-radius: 10px;
  margin: 15px 0;
  background-color: #fff;
  /* width: 90vw; */
  /* height: 20vh; */
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
  height: 100%;
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

.description {
  margin: 10px 0;
  font-weight: 300;
}
</style>

<style scoped>
.container_progres {
  display: flex;
  justify-content: space-between;
  /* margin: 20px; */
  padding: 20px;
  /* background-color: #f5f5f5; */
  border-radius: 10px;
  gap: 20px;
}

.container_selesai,
.container_onProgres,
.container_todo {
  flex: 1;
  background-color: #ffffff;
  padding: 20px 20px 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  flex-direction: column;
  display: flex;
  gap: 8px;
}

.container_selesai p,
.container_onProgres p,
.container_todo p {
  position: relative;
  bottom: 7px;
}

.container_selesai {
  background-color: rgb(233, 243, 255);
  border: 1px solid rgb(136, 190, 255);
}
.container_selesai span {
  color: rgb(16, 50, 130);
  font-size: 15px;
}

.container_onProgres {
  background-color: rgb(255, 244, 230);
  border: 1px solid rgb(255, 200, 150);
}
.container_onProgres span {
  color: rgb(218, 58, 0);
  font-size: 15px;
}

.container_todo {
  background-color: #f3e8ff;
  border: 1px solid #d8b4fe;
}
.container_todo span {
  color: purple;
  font-size: 15px;
}
</style>

<script>
export default {
  mounted() {
    this.tesEnv();
  },
  methods: {
    async tesEnv() {
      const { $api } = useNuxtApp();
      console.log($api.defaults.baseURL);
    },
  },
};
</script>
