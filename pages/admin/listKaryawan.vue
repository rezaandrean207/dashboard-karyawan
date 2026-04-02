<template>
  <div v-if="isLoading" class="loading">
    <div class="loading_tanggal">
      <i class="fa-solid fa-spinner"></i>
      <p>Tunggu Sebentar</p>
    </div>
  </div>

  <div class="success-message" v-if="isSukses">
    <div class="message-content">
      <i class="fa-solid fa-check-circle"></i>
      <p>{{ succesMessages }}</p>
    </div>
  </div>

  <div class="error-message" v-if="isError">
    <div class="message-content">
      <!-- <i class="fa-solid fa-check-circle"></i> -->
      <i class="fa-solid fa-circle-xmark"></i>
      <p>{{ errorMessage }}</p>
    </div>
  </div>

  <!-- Isi Konten -->
  <div class="isi">
    <!-- Animasi sukses -->
    <!-- <div class="success-animation">
      </div> -->

    <div v-if="isLoading" class="loading">
      <div class="loading_tanggal">
        <i class="fa-solid fa-spinner"></i>
        <p>Tunggu Sebentar</p>
      </div>
    </div>

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

    <h2>Daftar Karyawan</h2>
    <p>Kelola dan pantau kinerja karyawan</p>

    <!-- Filter -->
    <div class="filter">
      <div class="title">
        <i class="fa-solid fa-filter"></i>
        <p>Filter & Pencarian</p>
      </div>
      <div class="filter_detail">
        <form action="">
          <div class="filter-item">
            <input
              type="search"
              placeholder="Cari nama karyawan"
              v-model="searchInput"
              @submit.prevent
            />
          </div>
          <div class="filter-item">
            <select v-model="posisi">
              <option value="">Semua Posisi</option>
              <option
                v-for="(role, index) in roleOptions"
                :key="index"
                :value="role.value"
              >
                {{ role.label }}
              </option>
            </select>
          </div>
        </form>
        <div class="total_karyawan">
          <i class="fa-solid fa-users"></i>
          <div class="jumlah_karyawan">
            <p>Total Karyawan</p>
            <p class="jumlah">
              <strong>{{ daftarKaryawan.length }} Karyawan</strong>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Daftar Karyawan -->
    <div class="daftarKaryawan">
      <div
        class="karyawan"
        @click="openDetail(k)"
        v-for="(k, index) in filteredKaryawan"
        :key="k.clickup_id"
      >
        <div class="header-card">
          <div class="menu-wrapper" @click.stop>
            <button class="menu-btn" @click.stop="toggleMenu(k.clickup_id)">
              ⋮
            </button>

            <Transition name="dropdown">
              <div
                v-if="menuOpen === k.clickup_id"
                class="menu-dropdown"
                :class="{ 'open-left': isLastCard(index) }"
                @click.stop
              >
                <div class="button-wraper">
                  <button
                    v-if="k.status === 'nonaktif'"
                    @click.stop="ubahStatus(k, 'aktif')"
                  >
                    Aktifkan
                  </button>

                  <button
                    v-else
                    class="danger"
                    @click.stop="ubahStatus(k, 'nonaktif')"
                  >
                    Nonaktifkan
                  </button>

                  <button
                    class="role-setting submenu-trigger"
                    @click.stop="toggleRoleMenu(k)"
                  >
                    Atur Role
                  </button>
                </div>

                <!-- <button @click.stop="toggleRoleMenu(k.id)">Atur Role ▶</button> -->

                <div
                  v-if="roleMenuOpen === k.clickup_id"
                  class="role-submenu"
                  :class="{ 'open-left': isLastCard(index) }"
                >
                  <!-- <label v-for="role in daftarRole" :key="role.value">
                    <input
                      type="checkbox"
                      :value="role.name"
                      v-model="selectedRoles"
                    />
                    {{ role.name }}
                  </label> -->

                  <label
                    v-for="role in daftarRole"
                    :key="role.id"
                    class="role-item"
                  >
                    <div class="role-left">
                      <input
                        type="checkbox"
                        :value="role.name"
                        v-model="selectedRoles"
                      />
                      <span>{{ role.name }}</span>
                    </div>

                    <button class="delete-role" @click.stop="openDelete(role)">
                      <i class="fa-solid fa-trash"></i>
                    </button>

                    <div
                      class="delete-overlay"
                      v-if="deleteRoleId === role.id"
                      @click.stop="cancelDeleteRole"
                    >
                      <div class="delete-wraper">
                        <p>Apakah Anda yakin ingin menghapus?</p>
                        <div class="confirm-buttons">
                          <button
                            class="confirm"
                            @click.stop="confirmDeleteRole(role)"
                          >
                            Ya
                          </button>
                          <button class="cancel" @click.stop="cancelDeleteRole">
                            Tidak
                          </button>
                        </div>
                      </div>
                    </div>
                  </label>

                  <!-- BUTTON ROLE BARU -->
                  <button
                    v-if="showNewRoleInput !== k.clickup_id"
                    @click.stop="showNewRoleInput = k.clickup_id"
                    class="create-role"
                  >
                    + Role Baru
                  </button>

                  <!-- INPUT ROLE BARU -->
                  <div v-else class="new-role-input" @click.stop>
                    <input
                      type="text"
                      v-model="newRoleName"
                      placeholder="Masukkan nama role"
                      @keyup.enter="addRole(k)"
                      autofocus
                    />
                    <button @click="addRole(k)">
                      <span class="material-symbols-outlined"> add </span>
                    </button>
                    <button class="cancel" @click="cancelRoleInput">✕</button>
                  </div>

                  <button @click="saveRole(k)" class="save-role">Simpan</button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
        <div class="identitas">
          <!-- <img :src="k.user.profilPicture" alt="" /> -->
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

            <div class="camera-overlay" @click.stop="triggerFileInput(k)">
              <i class="fa-solid fa-camera"></i>
            </div>

            <input
              type="file"
              accept="image/*"
              :ref="'fileInput-' + k.clickup_id"
              class="hidden-file"
              @change="handlePhotoChange($event, k)"
            />
          </div>
          <!-- <div class="edit-image">
            <span class="material-symbols-outlined"> add_a_photo </span>
          </div> -->
          <h4>{{ k.name }}</h4>
          <div class="peran">
            <i class="fa-solid fa-briefcase"></i>
            <p>{{ k.role }}</p>
          </div>
          <!-- <div
              class="bebanKerja"
              :class="{
                kuning: kategoriBeban(k.beban) === 'Sedang',
                merah: kategoriBeban(k.beban) === 'Berat',
                hijau: kategoriBeban(k.beban) === 'Mudah',
                putih: kategoriBeban(k.beban) === '',
              }"
            >
              <i class="fa-solid fa-clock"></i>
              <p>
                {{ kategoriBeban(k.beban) }}
              </p>
            </div> -->
        </div>
        <div class="kinerja">
          <div class="status-member">
            <p>Status:</p>
            <p>{{ k.status }}</p>
          </div>
          <!-- <div class="performa">
              <p>Performa:</p>
              <p>{{ k.performa }}</p>
            </div> -->
        </div>
      </div>
    </div>
  </div>

  <!-- Detail Karyawan -->
  <div v-if="detailKaryawan" class="background">
    <div class="detailKaryawan" v-if="detailKaryawan">
      <div class="header">
        <h3>Detail Karyawan</h3>
        <i class="fa-solid fa-xmark" @click="close"></i>
      </div>

      <div class="profilImage">
        <div class="photo-wrapper">
          <img
            v-if="!selected.imageError"
            :src="getProfileImage(selected.profile_picture_url)"
            alt="Profile Picture"
            @error="selected.imageError = true"
          />

          <div
            class="photo-option"
            style="margin-bottom: 22px"
            :style="{ backgroundColor: selected.color }"
            v-else
          >
            <p>{{ setInitial(selected.name) }}</p>
          </div>
        </div>
        <p>{{ selected.name }}</p>
        <div class="peran">
          <i class="fa-solid fa-briefcase"></i>
          <p>{{ selected.role }}</p>
        </div>
        <div class="wraper-beban">
          <div class="bebanKerja" :class="bebanClass(selected.workload_status)">
            <i class="fa-solid fa-clock"></i>
            <!-- <p>Beban Kerja: {{ kategoriBeban(beban) }}</p> -->
            <p>Beban Kerja: {{ selected.workload_status }}</p>
          </div>
        </div>
      </div>

      <div class="infoKontak">
        <p class="judul">Informasi Kontak</p>
        <div class="emailTelepon">
          <div class="email">
            <i class="fa-solid fa-envelope"></i>
            <div class="isiEmail">
              <p class="keterangan">Email</p>
              <p>{{ selected.email }}</p>
            </div>
          </div>
          <!-- <div class="telepon">
              <i class="fa-solid fa-phone"></i>
              <div class="isiTelepon">
                <p class="keterangan">Telepon</p>
                <p>{{ selected.gaji }}</p>
              </div>
            </div> -->
        </div>
        <!--
            <div class="alamat">
              <i class="fa-solid fa-location-dot"></i>
              <div class="detailAlamat">
                <p class="keterangan">Alamat</p>
                <p>Jl Indonesia, Bekasi, JawaBarat</p>
              </div>
            </div>
            -->
      </div>

      <!-- <div class="infoKerja">
          <p class="judul">Informasi Pekerjaan</p>
          <div class="kerja">
            <div class="join">
              <i class="fa-solid fa-calendar"></i>
              <div class="detail">
                <p class="keterangan">Tanggal Bergabung</p>
                <p>{{ selected.created_at }}</p>
              </div>
            </div>
            <div class="status">
              <i class="fa-solid fa-briefcase"></i>
              <div class="detail">
                <p class="keterangan">Update at</p>
                <p>{{ selected.updated_at }}</p>
              </div>
            </div>
          </div>
        </div> -->

      <div class="statistikKinerja">
        <p class="judul">Ringkasan Kerja</p>
        <div class="statistik">
          <div class="proyek">
            <div class="judul">
              <p>Proyek</p>
              <h3>{{ selected.project_count }}</h3>
            </div>
            <div class="logo">
              <!-- <i class="fa-solid fa-check"></i> -->
              <span class="material-symbols-outlined"> work_history </span>
            </div>
          </div>

          <div class="completed">
            <div class="judul">
              <!-- <p>Completed</p> -->
              <p>Selesai</p>
              <h3>{{ selected.completed_tasks }}</h3>
            </div>
            <div class="logo">
              <i class="fa-solid fa-check"></i>
            </div>
          </div>

          <div class="on_progress">
            <div class="judul">
              <p>Sedang Dikerjakan</p>
              <!-- <p>Dikerjakan</p> -->
              <h3>{{ selected.in_progress_tasks }}</h3>
            </div>
            <div class="logo">
              <!-- <i class="fa-solid fa-chart-simple"></i> -->
              <span class="material-symbols-outlined"> pending_actions </span>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="keahlian">
          <p class="judul">Keahlian</p>
          <div class="daftarSkil">
            <div class="skil">
              <p>{{ selected.keahlian }}Frontend</p>
            </div> -->
      <!-- <div class="skil"><p>Backend</p></div> -->
      <!-- </div>
        </div> -->
    </div>
  </div>
  <!-- </div> -->
</template>

<!-- Conditioning colour -->
<style scoped>
/* SEDANG */
.kuning {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
  box-shadow: 0 2px 6px rgba(250, 204, 21, 0.35);
}

/* BERAT */
.merah {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #991b1b;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.35);
}

/* MUDAH */
.hijau {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #166534;
  box-shadow: 0 2px 6px rgba(34, 197, 94, 0.35);
}

/* DEFAULT / EMPTY */
.putih {
  background: #f8fafc;
  color: #334155;
  border: 1px dashed #cbd5e1;
}
</style>

<!-- Dropdown -->
<style scoped>
.header-card {
  text-align: right;
}

.menu-wrapper {
  position: relative;
  left: 6px;
}

.menu-btn {
  background: transparent;
  border: none;
  padding: 6px 8px;
  font-size: 18px;
  cursor: pointer;
}

.menu-btn:hover {
  background: #f1f5f9;
  border-radius: 6px;
}

.menu-dropdown {
  position: absolute;
  top: 28px;
  right: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  min-width: 140px;
  padding: 4px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
  z-index: 20;
  /* animation: fadeIn 0.2s ease; */
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

/* saat aktif animasi */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 160ms ease;
}

/* posisi akhir */
.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.menu-dropdown .button-wraper button {
  width: 100%;
  padding: 10px 12px;
  background: none;
  /* border: none; */
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  cursor: pointer;
}

.menu-dropdown button:last-child {
  border-bottom: none;
}

.menu-dropdown button:hover {
  background: #f1f5f9;
}

.menu-dropdown .danger {
  color: #b91c1c;
}

/* Trigger Button */
.submenu-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  font-size: 14px;
}

.submenu-trigger:hover {
  background: #f8fafc;
}

/* Arrow */
.submenu-trigger .arrow {
  font-size: 12px;
  opacity: 0.6;
}

/* Submenu Container */
.role-submenu {
  position: absolute;
  top: 0;
  left: 100%;
  margin-left: 8px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  /* min-width: 180px; */
  width: 260px;
  padding: 8px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  align-items: flex-start;
}

.role-submenu.open-left {
  right: auto;
  left: -200%;
}

.role-submenu label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
}

.role-submenu label:hover {
  background: #f1f5f9;
}

.menu-dropdown .role-submenu .save-role {
  width: 100%;
  /* margin-top: 8px; */
  padding: 8px;
  border: none;
  border-radius: 6px;
  background-color: #1d4ed8;
  /* border: 1px solid #1d4ed8; */
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s ease;
}

.create-role {
  width: 100%;
  margin-top: 8px;
  padding: 8px;
  border: none;
  border-radius: 6px;
  background-color: #e5e7eb;
  border: 1px solid #1d4ed8;
  border: 1px solid var(--border-soft);
  color: black;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s ease;
}

/* Checkbox Item */
.role-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.role-item:hover {
  background: #f1f5f9;
}

.role-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.delete-role {
  background: transparent;
  border: none;
  /* color: #ef4444; */
  color: var(--text-main);
  font-size: 14px;
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.role-item:hover .delete-role {
  opacity: 1;
}

.delete-role:hover {
  color: #66676a;
}

/* Checkbox styling */
.role-item input {
  accent-color: #1d4ed8;
  width: 16px;
  height: 16px;
}

/* Save Button */
.save-btn {
  width: 100%;
  margin-top: 8px;
  padding: 8px;
  border: none;
  border-radius: 6px;
  background: #1d4ed8;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s ease;
}

.save-btn:hover {
  background: #1e40af;
}

.new-role-input {
  display: flex;
  gap: 6px;
  width: 100%;
  margin-top: 6px;
}

.new-role-input input {
  flex: 1;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  font-size: 13px;
  outline: none;
}

.new-role-input input:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.1);
}

.new-role-input button {
  /* padding: 6px 10px; */
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background: #1d4ed8;
  color: white;
  border: none;
  cursor: pointer;
  transition: 0.2s ease;
  font-size: 14px;
}

.new-role-input button .material-symbols-outlined {
  font-size: 14px;
}

.new-role-input button:hover {
  background: #1e40af;
}

.new-role-input .cancel {
  background: #e5e7eb;
  color: #374151;
}

.new-role-input .cancel:hover {
  background: #f1f5f9;
}
</style>

<!-- Edit image -->
<style scoped>
.photo-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto;
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
  font-size: 24px;
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

<!-- Delete overlay -->
<style scoped>
.delete-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 6px;
}

.delete-overlay .delete-wraper {
  background: white;
  padding: 20px 30px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.delete-overlay p {
  font-size: 14px;
  font-weight: 500;
}

.confirm-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}

.confirm {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background-color: #ef4444;
  color: white;
  cursor: pointer;
}

.confirm:hover {
  background-color: #b91c1c;
}

.cancel {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background-color: #e5e7eb;
  color: #374151;
  cursor: pointer;
}

.cancel:hover {
  background-color: #f1f5f9;
}
</style>

<style scoped>
.listKaryawan {
  background-color: rgb(16, 67, 185);
}

.filter .filter_detail {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.filter_detail form {
  width: 70%;
  /* border: 1px solid #010101; */
  margin-top: 25px;
  display: flex;
  height: 5vh;
  gap: 10px;
}

.filter_detail .total_karyawan {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  /* text-align: justify; */
  border: 1px solid rgb(164, 199, 255);
  border-radius: 10px;
  width: 30%;
  height: 12vh;
  background-color: rgb(234, 241, 252);
}

.total_karyawan i {
  font-size: 16px;
  background-color: darkblue;
  padding: 11.5px 20px;
  text-align: center;
  display: flex;
  border-radius: 50%;
  justify-content: center;
  color: #fff;
}

.total_karyawan p {
  font-size: 14px;
  text-align: justify;
  font-weight: 300;
}

.total_karyawan .jumlah {
  color: darkblue;
}

.filter-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.filter-item {
  display: flex;
  align-items: center;

  flex: 1 250px;

  padding: 6px;
  border-radius: 10px;

  background: #ffffff;
  border: 1px solid #e5e7eb;

  transition: all 0.15s ease;
}

.filter-item:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.filter-item input {
  width: 100%;
  border: none;
  outline: none;

  padding: 10px 12px;
  border-radius: 8px;

  background: transparent;
  font-size: 14px;

  color: #0f172a;
}

.filter-item input::placeholder {
  color: #9ca3af;
}

.filter-item select {
  width: 100%;
  border: none;
  outline: none;

  padding: 10px 12px;
  border-radius: 8px;

  background: transparent;
  font-size: 14px;

  color: #0f172a;
  cursor: pointer;
}

/* form input,
form select {
  background-color: #ddd;
  width: 50%;
  border-radius: 10px;
  padding: 0 15px;
  margin: 0 10px;
  border: var(--borderCard);
  border: 1px solid rgb(164, 199, 255);
} */

form select {
  background: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20448%20512'%3E%3Cpath%20d='M224%20248a120%20120%200%201%201%200-240%20120%20120%200%201%201%200%20240zm-30.5%2056l61%200c9.7%200%2017.5%207.8%2017.5%2017.5%200%204.2-1.5%208.2-4.2%2011.4l-27.4%2032%2031%20115.1%20.6%200%2034.6-138.5c2.2-8.7%2011.1-14%2019.5-10.8%2061.9%2023.6%20105.9%2083.6%20105.9%20153.8%200%2015.1-12.3%2027.4-27.4%2027.4L43.4%20512c-15.1%200-27.4-12.3-27.4-27.4%200-70.2%2044-130.2%20105.9-153.8%208.4-3.2%2017.3%202.1%2019.5%2010.8l34.6%20138.5%20.6%200%2031-115.1-27.4-32c-2.7-3.2-4.2-7.2-4.2-11.4%200-9.7%207.8-17.5%2017.5-17.5z'/%3E%3C/svg%3E")
    no-repeat 10px center;
  background-size: 14px;
  padding-left: 35px;
}

form input {
  /* font-family: "Font Awesome 7 Free";
  font-weight: 900;
  content: "\f002"; */
  background: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'%3E%3Cpath%20d='M416%20208c0%2045.9-14.9%2088.3-40%20122.7L502.6%20457.4c12.5%2012.5%2012.5%2032.8%200%2045.3s-32.8%2012.5-45.3%200L330.7%20376C296.3%20401.1%20253.9%20416%20208%20416%2093.1%20416%200%20322.9%200%20208S93.1%200%20208%200%20416%2093.1%20416%20208zM208%20352a144%20144%200%201%200%200-288%20144%20144%200%201%200%200%20288z'/%3E%3C/svg%3E")
    no-repeat 10px center;
  background-size: 14px;
  padding-left: 35px;
}

/* ============================== */
/*   RESPONSIVE LAYOUT CSS        */
/* ============================== */

/* Tablet */
@media (max-width: 768px) {
  /* .filter .filter_detail {
    flex-direction: column;
    gap: 20px;
  } */

  .filter_detail form {
    width: 100%;
    height: auto;
    flex-direction: column;
  }

  form input,
  form select {
    width: 100%;
    margin: 0;
    height: 5.5vh;
  }

  .filter_detail .total_karyawan {
    width: 100%;
    height: auto;
    padding: 12px 0;
    font-size: 14px;
  }

  /* .karyawan {
    width: 30%;
    font-size: 14px;
  } */

  .karyawan .identitas img {
    width: 60px;
    height: 60px;
    object-fit: cover;
  }

  .karyawan .identitas .bebanKerja {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    margin: 10px 65px;
    padding: 3px 0;
    font-size: 12px;
    border-radius: 15px;
  }

  .kinerja .proyekAktif {
    font-size: 12px;
  }
}

/* Handphone */
@media (max-width: 576px) {
  .konten {
    overflow-x: hidden;
  }

  .konten .background .sidebar_responsive {
    width: 59%;
  }

  .konten .isi {
    width: 100%;
    position: relative;
    left: 0;
  }

  .filter .filter_detail {
    flex-direction: column;
    width: 100%;
    display: flex;
    gap: 15px;
  }

  .filter_detail form {
    flex-direction: column;
    width: 100%;
    height: auto;
    gap: 12px;
  }

  form input,
  form select {
    width: 100%;
    margin: 0;
    height: 45px;
    padding-left: 38px;
  }

  form select {
    background-size: 14px;
    padding-left: 32px;
  }

  form input {
    background-size: 14px;
    padding-left: 35px;
  }

  .filter_detail .total_karyawan {
    width: 100%;
    padding: 15px;
    justify-content: flex-start;
  }

  .total_karyawan i {
    padding: 10px 18px;
    font-size: 16px;
  }

  .total_karyawan p {
    font-size: 13px;
  }

  /* .karyawan { */
  /* height: 70vh; */
  /* padding: 60px 0; */
  /* } */

  .daftarKaryawan {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .karyawan {
    margin-top: 20px;
    border: var(--borderCard);
    width: 95%;
    /* height: 50vh; */
    text-align: center;
    border-radius: 15px;
    transition: transform 0.3s ease;
  }

  .karyawan:hover {
    border: 1px solid rgb(68, 41, 203);
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    transform: scale(1.05);
  }

  .karyawan .identitas img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    border: 5px solid rgb(193, 222, 232);
    /* margin-top: 20px; */
  }

  .karyawan h4 {
    color: rgb(16, 50, 130);
    margin-top: 10px;
  }

  .karyawan .peran {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
  }

  .karyawan .identitas .bebanKerja {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    margin: 10px 180px;
    padding: 5px 0;
    font-size: 13px;
    border-radius: 15px;
  }

  .karyawan .kinerja {
    margin: 0 30px;
    margin-top: 20px;
    border-top: 2px solid rgb(222, 221, 226);
  }

  .kinerja .proyekAktif {
    margin-top: 10px;
  }

  .kinerja .proyekAktif,
  .performa {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
  }

  .detailKaryawan {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    font-size: 15px;
  }

  .detailKaryawan .profilImage {
    margin: 0 70px;
  }
}

/* Handphone Kecil / Compact Layout */
@media (max-width: 430px) {
  .konten .background .sidebar_responsive {
    width: 60%;
  }

  .filter_detail {
    gap: 10px;
  }

  .filter_detail form {
    gap: 10px;
  }

  form input,
  form select {
    height: 42px;
    font-size: 13px;
  }

  .total_karyawan {
    flex-direction: column;
    text-align: center;
    padding: 15px 10px;
  }

  .total_karyawan p {
    text-align: center;
  }
}
</style>

<script>
export default {
  data() {
    return {
      detailKaryawan: false,
      dataKaryawan: true,
      sidebar: false,
      name: "",
      posisi: "",
      kerja: "",
      selected: {},
      selectedUser: null,
      daftarKaryawan: [],
      searchInput: "",
      loading: false,
      sukses: false,
      menuOpen: null,
      roleMenuOpen: null,
      selectedRoles: [],
      currentRoles: [],
      daftarRole: [],
      isLoading: false,
      isSukses: false,
      isError: false,
      errorMessage: "",
      succesMessages: "",
      showNewRoleInput: null,
      newRoleName: "",
      deleteRoleId: null,
      assigneeColors: {},
    };
  },
  mounted() {
    this.ambilData();
    // this.$router.replace({
    //   path: "/admin/listKaryawan",
    //   query: {
    //     ...this.$route.query, // 🔥 PENTING
    //   },
    // });
  },
  methods: {
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
    getProfileImage(url) {
      const baseURL = "https://api.clickup.devlmu.com";

      if (!url) return "";

      return baseURL + url;
    },
    // setFirstName(data) {
    //   if (!data) return "";

    //   const parts = data.trim().split(" ");
    //   const [firstName] = parts;

    //   console.log("Nama pertama adalah:", firstName);
    //   return firstName;
    // },
    // setLastName(data) {
    //   if (!data) return "";

    //   const parts = data.trim().split(" ");
    //   const lastName = parts[parts.length - 1];

    //   console.log("Nama terakhir adalah:", lastName);
    //   return lastName;
    // },
    isLastCard(index) {
      return (index + 1) % 4 === 0;
    },
    openDelete(k) {
      this.deleteRoleId = k.id;
    },
    cancelDeleteRole() {
      this.deleteRoleId = null;
    },
    async confirmDeleteRole(role) {
      console.log("Delete diklik");
      this.isLoading = true;
      this.deleteRoleId = null;
      // Panggil API untuk menghapus role dengan this.deleteRoleId
      try {
        // Contoh API call (sesuaikan dengan endpoint yang benar)
        const hapus = await this.$api.delete("/api/v1/roles", {
          data: {
            name: role.name,
          },
        });

        this.succesMessages = hapus.data.message;
        this.isSukses = true;

        // Setelah berhasil, refresh daftar role
        this.ambilData();
      } catch (error) {
        this.errorMessage =
          error?.response?.data?.error || "Gagal menghapus role";
        this.isError = true;
        console.error("Gagal menghapus role:", error);
      } finally {
        setTimeout(() => {
          this.isSukses = false;
          this.isError = false;
        }, 5000);
      }
    },
    triggerFileInput(k) {
      this.selectedUser = k;
      this.$refs["fileInput-" + k.clickup_id][0].click();
    },
    async handlePhotoChange(event, k) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        alert("Maksimal 2MB");
        return;
      }

      const formData = new FormData();
      formData.append("profile_picture", file);

      this.isLoading = true;

      try {
        const response = await this.$api.post(
          `/api/v1/users/${k.clickup_id}/profile-picture`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        // update foto langsung
        k.profile_picture_url = response.data.profile_picture_url;

        this.succesMessages = "Foto profil berhasil diubah";
        this.isSukses = true;
      } catch (error) {
        console.error("Upload gagal:", error);
        alert("Gagal upload foto");
      } finally {
        this.isLoading = false;
        setTimeout(() => {
          this.isSukses = false;
        }, 5000);
      }
    },

    // handleImgError(event) {
    //   event.target.src = "/img/profil.png";
    // },
    async addRole() {
      if (this.isLoading) return;

      const roleName = this.newRoleName.trim().toLowerCase();
      if (!roleName) return;

      const exists = this.daftarRole.some(
        (r) => r.name.toLowerCase() === roleName,
      );

      if (exists) {
        this.errorMessage = "Role sudah ada";
        this.isError = true;
        return;
      }

      try {
        this.isLoading = true;

        const response = await this.$api.post("/api/v1/roles", {
          name: roleName,
        });

        const newRole = response.data.data;

        this.daftarRole.push(newRole);
        // this.selectedRoles.push(newRole.name);

        this.newRoleName = "";
        this.showNewRoleInput = null;
        this.errorMessage = "";

        this.succesMessages = "Role berhasil ditambahkan";
        this.isSukses = true;
      } catch (error) {
        console.error("Gagal menambahkan role:", error);
        this.errorMessage = "Gagal menambahkan role";
      } finally {
        this.isLoading = false;
        setTimeout(() => {
          this.isSukses = false;
        }, 5000);
        setTimeout(() => {
          this.isError = false;
        }, 5000);
      }
    },
    cancelRoleInput() {
      this.showNewRoleInput = null;
      this.newRoleName = "";
    },

    toggleRoleMenu(karyawan) {
      if (this.roleMenuOpen === karyawan.clickup_id) {
        this.roleMenuOpen = null;
        return;
      }

      this.roleMenuOpen = karyawan.clickup_id;

      console.log("Karyawan di pilih: ", karyawan);

      if (karyawan.role) {
        this.selectedRoles = karyawan.role
          .split(",") // pisah berdasarkan koma
          .map((r) => r.trim()); // hilangkan spasi
      } else {
        this.selectedRoles = [];
      }

      console.log("Role yang di pilih: ", this.selectedRoles);
    },
    async saveRole(karyawan) {
      // const roleString = this.selectedRoles.join(",");
      const roleString = this.selectedRoles;
      try {
        const response = await this.$api.put(
          `/api/v1/clickup/users/${karyawan.clickup_id}/roles?id=${karyawan.clickup_id}`,
          {
            // clickup_id: karyawan.clickup_id,
            roles: roleString,
          },
        );

        // ambil message dari API
        this.succesMessages = response.data.message;

        // trigger sukses
        this.isSukses = true;

        console.log("Role updated:", response);
        this.roleMenuOpen = null;
        this.menuOpen = null;

        this.ambilData();
      } catch (error) {
        console.error("Failed to update role:", error);

        this.errorMessage =
          error?.response?.data?.error ||
          "Terjadi kesalahan saat mengubah setting";
        this.isError = true;
      } finally {
        // Sukses
        setTimeout(() => {
          this.isSukses = false;
        }, 5000);

        // Error
        setTimeout(() => {
          this.isError = false;
        }, 5000);
      }
    },

    toggleMenu(id) {
      this.menuOpen = this.menuOpen === id ? null : id;
    },

    async ubahStatus(user, status) {
      const oldStatus = user.status;

      user.status = status;
      this.isLoading = true;
      this.menuOpen = null;

      // nanti kalau mau:
      // call API update status di sini
      try {
        const change = await this.$api.put("/api/v1/clickup/members/status", {
          clickup_id: user.clickup_id,
          status: status,
        });
      } catch (err) {
        user.status = oldStatus;
        alert("Gagal mengubah status", err);
        console.log("Gagal mengubah status", err);
      } finally {
        this.isLoading = false;
      }
    },
    logout() {
      const token = useCookie("token");
      token.value = null;
      this.$router.push("/login");
    },
    menu() {
      this.sidebar = true;
    },
    kategoriBeban(beban) {
      if (beban < 40) return "Mudah";
      if (beban <= 60) return "Sedang";
      if (beban > 60) return "Berat";
      return "";
    },
    bebanClass(beban) {
      // const kategori = this.kategoriBeban(beban);

      return {
        kuning: beban === "Underload",
        merah: beban === "Overload",
        hijau: beban === "Normal",
        putih: beban === "",
      };
    },
    openDetail(k) {
      this.selected = k;
      this.detailKaryawan = true;
    },
    close() {
      this.detailKaryawan = false;
      this.sidebar = false;
    },
    plus() {
      this.daftarKaryawan.push({
        nama: this.name,
        peran: this.posisi,
        beban: this.kerja,
      });
    },
    closeSukses() {
      this.sukses = false;
    },

    async ambilData() {
      this.isLoading = true;
      try {
        const member = await this.$api.get("/api/v1/clickup/members");
        const role = await this.$api.get("/api/v1/roles");

        this.daftarKaryawan = member.data.users;
        this.daftarKaryawan = member.data.users.map((k) => ({
          ...k,
          imageError: false,
        }));

        this.daftarRole = role.data.data;

        console.log("Struktur API:", member.data);
        console.log("Roles API:", this.daftarRole);
      } catch (error) {
        console.error("API Error:", error);
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

        console.log("Berhasil: ", sync);

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
  },
  computed: {
    filteredKaryawan() {
      let hasil = this.daftarKaryawan;

      // filter nama
      if (this.searchInput) {
        hasil = hasil.filter((k) =>
          k.name.toLowerCase().includes(this.searchInput.toLowerCase()),
        );
      }

      // filter posisi (role)
      if (this.posisi) {
        hasil = hasil.filter(
          (k) => k.role.toLowerCase() === this.posisi.toLowerCase(),
        );
      }

      return hasil;
    },
    totalKaryawan() {
      return this.filteredKaryawan.length || 0;
    },
    roleOptions() {
      return [
        { value: "pm", label: "Project Manager" },
        { value: "admin", label: "Admin" },
        { value: "analis", label: "Data Analys" },
        { value: "backend", label: "Backend" },
        { value: "web", label: "Web Developer" },
        { value: "mobile apps", label: "Mobile Apps" },
        { value: "UI-UX", label: "UI-UX" },
      ];
    },
  },
  watch: {
    posisi() {
      // Reset search input saat filter posisi berubah
      this.searchInput = "";
    },
    roleMenuOpen(val) {
      if (!val) {
        this.selectedRoles = [];
      }
    },
  },
};
</script>
