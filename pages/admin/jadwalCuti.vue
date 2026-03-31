<template>
  <div class="isi">
    <h2>Jadwal Cuti</h2>
    <p>Kelola jadwal cuti karyawan</p>

    <div v-if="isLoading" class="loading">
      <div class="loading_tanggal">
        <i class="fa-solid fa-spinner"></i>
        <p>Tunggu Sebentar</p>
      </div>
    </div>

    <div class="success-message" v-if="isSukses">
      <div class="message-content">
        <i class="fa-solid fa-check-circle"></i>
        <p>{{ successMessage }}</p>
      </div>
    </div>

    <div class="error-message" v-if="isError">
      <div class="message-content">
        <!-- <i class="fa-solid fa-check-circle"></i> -->
        <i class="fa-solid fa-circle-xmark"></i>
        <p>{{ errorMessage }}</p>
      </div>
    </div>

    <div class="background_delete" v-if="hapus">
      <div class="delete_tanggal">
        <p>Apakah anda yakin <br />ingin menghapus hari libur ini?</p>
        <div class="submit_delete">
          <div class="batal">
            <button @click="closeSetTanggal" type="button">Batal</button>
          </div>
          <div class="simpan">
            <button
              @click="deleteTanggal(selectedData)"
              :disabled="isLoading"
              type="button"
              :class="{ disabled_btn: isLoading }"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="background_tanggal" v-if="createTanggal">
      <div class="create_tanggal">
        <div class="header_tanggal">
          <h3>Tambah Hari Libur</h3>
          <i class="fa-solid fa-xmark" @click="closeSetTanggal"></i>
        </div>
        <p>Tambahkan hari libur untuk {{ selectedKaryawan?.name }}</p>

        <form action="" class="form_tanggal" @submit.prevent="saveTanggal">
          <div class="tanggal">
            <label for="tanggal">Tanggal</label>
            <input type="date" v-model="tanggal" />
          </div>
          <div class="kategori">
            <label for="hari">Kategori</label>
            <select name="" id="" v-model="kategori">
              <option value="">Pilih Kategori</option>
              <option v-for="c in category" :key="c.id" :value="c">
                {{ c }}
              </option>
            </select>
          </div>
          <div class="hari">
            <label for="hari">Keterangan</label>
            <input
              type="text"
              placeholder="Contoh: Izin sakit flu"
              v-model="keterangan"
            />
          </div>

          <div class="submit_tanggal">
            <div class="batal">
              <button @click="closeSetTanggal" type="button">Batal</button>
            </div>
            <div class="simpan">
              <button
                @click="saveTanggal"
                :disabled="isDisabled"
                type="button"
                :class="{ disabled_btn: isDisabled }"
              >
                Simpan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Filter -->
    <div class="filter">
      <div class="title">
        <i class="fa-solid fa-filter"></i>
        <p>Filter & Pencarian</p>
      </div>
      <div class="filter-detail">
        <div class="filter-item">
          <input
            type="search"
            placeholder="Cari nama karyawan"
            v-model="searchInput"
            @submit.prevent
          />
        </div>
        <div class="filter-item">
          <select v-model="selectedCategory">
            <option value="">Semua Kategori</option>
            <option v-for="(c, index) in category" :key="index" :value="c">
              {{ c }}
            </option>
          </select>
        </div>
        <!-- <div class="total_karyawan">
          <i class="fa-solid fa-users"></i>
          <div class="jumlah_karyawan">
            <p>Total Karyawan</p>
            <p class="jumlah">
              <strong>{{ daftarKaryawan.length }} Karyawan</strong>
            </p>
          </div>
        </div> -->
      </div>
    </div>

    <!-- Daftar Karyawan -->
    <div class="daftarKaryawan">
      <div
        class="karyawan"
        style="padding-top: 20px"
        v-for="(k, index) in daftarKaryawan"
        :key="k.clickup_id"
      >
        <!-- <div class="header-card">
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

                <div
                  v-if="roleMenuOpen === k.clickup_id"
                  class="role-submenu"
                  :class="{ 'open-left': isLastCard(index) }"
                >

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

                  
                  <button
                    v-if="showNewRoleInput !== k.clickup_id"
                    @click.stop="showNewRoleInput = k.clickup_id"
                    class="create-role"
                  >
                    + Role Baru
                  </button>

                
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
        </div> -->
        <div class="identitas">
          <div class="photo-wrapper" @click.stop>
            <!-- <img src="/img/profil.png" alt="" /> -->
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
          <!-- <div class="edit-image">
            <span class="material-symbols-outlined"> add_a_photo </span>
          </div> -->
          <h4>{{ k.name }}</h4>
          <div class="peran">
            <i class="fa-solid fa-briefcase"></i>
            <p>Web</p>
          </div>
        </div>
        <!-- <div class="kinerja">
          <div class="status-member">
            <p>Status:</p>
            <p>{{ k.status }}</p>
          </div>
        </div> -->

        <div class="holiday">
          <div class="list_hari" v-for="h in k.cuti">
            <div class="keterangan_libur">
              <div class="header-list">
                <h5>{{ h.tanggal_ui }}</h5>
                <div class="category-label">
                  <p>{{ h.kategori }}</p>
                </div>
              </div>
              <p>{{ h.keterangan }}</p>
            </div>
            <!-- <i class="fa-solid fa-xmark" @click="deleteTanggal(h.tanggal)"></i> -->
            <i class="fa-solid fa-xmark" @click="openDelete(h)"></i>
          </div>
          <!-- <div class="belum_tersedia">
              <h4>Hari Libur belum tersedia</h4>
            </div> -->
        </div>

        <div class="create-cuti">
          <div class="set-tanggal" @click="setTanggal(k)">
            <i class="fa-solid fa-plus"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-detail {
  /* border: 1px solid #e5e7eb; */
  border-radius: 10px;
  display: flex;
  margin-top: 12px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  width: 300px;
}

.filter-item input {
  background: var(--bg-muted);
  padding: 8px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-soft);
  width: 100%;
}

.filter-item select {
  background: var(--bg-muted);
  padding: 8px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-soft);
  width: 100%;
}
</style>

<!-- Style Background Delete -->
<style scoped>
.background_delete,
.background_tanggal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.delete_tanggal p {
  text-align: center;
}

.delete_tanggal .header_delete {
  text-align: right;
}

.delete_tanggal .submit_delete {
  display: flex;
  justify-content: center;
  gap: 10px;
  /* margin-top: 30px; */
}

.submit_delete .batal button {
  padding: 8px 10px;
  border-radius: 6px;
  background-color: #fff;
  border: 1px solid #dedede;
}

.submit_delete .batal button:hover {
  background-color: #f7f7f7;
}

.submit_delete .simpan button {
  background: var(--primary);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  color: #fff;
}

.submit_delete .simpan button:hover {
  background-color: rgb(0, 0, 180);
}

.delete_tanggal {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.delete_tanggal,
.create_tanggal {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 28px;
  width: 420px;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.25);
  animation: modalFade 0.25s ease;
}

@keyframes modalFade {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>

<!-- Style Background tanggal -->
<style scoped>
.background_tanggal {
  position: fixed;
  z-index: 9999;
  background-color: rgb(0, 0, 0, 0.2);
  width: 100vw;
  height: 101vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.background_tanggal .create_tanggal {
  background-color: #fff;
  padding: 25px;
  border-radius: 8px;
  width: 500px;
}

.create_tanggal .header_tanggal {
  display: flex;
  justify-content: space-between;
}

.header_tanggal h3 {
  font-weight: 600;
  margin-bottom: 5px;
}

.create_tanggal p {
  font-size: 13px;
  font-weight: 300;
}

.create_tanggal .form_tanggal {
  margin-top: 20px;
}

.form_tanggal .tanggal,
.form_tanggal .hari,
.form_tanggal .kategori {
  display: flex;
  flex-direction: column;
  margin: 15px 0;
}

.form_tanggal .tanggal label,
.form_tanggal .hari label,
.form_tanggal .kategori label {
  font-size: 13px;
  font-weight: 600;
  padding: 0 0 3px 3px;
}

.form_tanggal .tanggal input,
.form_tanggal .hari input,
.form_tanggal .kategori select {
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  border: 4px solid #f1f1f1;
}

.form_tanggal .tanggal input:focus,
.form_tanggal .hari input:focus,
.form_tanggal .kategori select:focus {
  border: 4px solid #cfcfcf;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}

.submit_tanggal {
  display: flex;
  justify-content: end;
  gap: 8px;
  margin-top: 30px;
}

.submit_tanggal .batal button {
  padding: 8px 10px;
  border-radius: 6px;
  background-color: #fff;
  border: 1px solid #dedede;
}

.submit_tanggal .batal button:hover {
  background-color: #f7f7f7;
}

.submit_tanggal .simpan button {
  background: var(--primary);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  color: #fff;
}

.submit_tanggal .simpan button:hover {
  background-color: rgb(0, 63, 210);
}
</style>

<!-- Container -->
<style scoped>
.create-cuti {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
}

.create-cuti .set-tanggal {
  background: var(--primary);
  color: #fff;
  border-radius: 999px;
  padding: 10px 16px;
  width: fit-content;
  font-size: 18px;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);

  transition: transform 0.2s ease;
}

.create-cuti .set-tanggal:hover {
  background: var(--primary-hover);
  transform: scale(1.05);
}

.holiday {
  margin-top: 12px;
  display: flex;
  /* border: 1px solid #010101; */
  width: 100%;
  /* justify-content: flex-start; */
  gap: 14px;
  flex-wrap: wrap;
  max-height: 150px;
  overflow-y: auto;
  padding-right: 6px;
  border-radius: 10px;

  scrollbar-width: thin;
  scrollbar-color: #c7d2fe transparent;
}

.holiday::-webkit-scrollbar {
  width: 6px;
}

.holiday::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 10px;
}

.belum_tersedia {
  font-size: 16px;
  font-weight: 500;
  color: #888888;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.list_hari {
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  padding: 8px 16px;

  background: var(--bg-muted);
  border-radius: var(--radius-md);
  border: none;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.list_hari i {
  font-size: 14px;
  color: #94a3b8;
  cursor: pointer;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.list_hari i:hover {
  color: #ef4444;
  transform: scale(1.15);
}

.keterangan_libur {
  text-align: justify;
  max-width: 180px;
}

.keterangan_libur .header-list {
  display: flex;
  /* justify-content: space-between; */
  gap: 6px;
  align-items: center;
}

.header-list .category-label {
  background-color: #e0e7ff;
  border: 1px solid #c7d2fe;
  color: #3730a3;
  font-size: 8px;
  padding: 0 6px;
  border-radius: 6px;
}

.header-list .category-label p {
  font-size: 9px;
  font-weight: 600;
}

.keterangan_libur h5 {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-main);
}

.keterangan_libur p {
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 2px;
  max-width: 165px;
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

<script>
export default {
  data() {
    return {
      name: "",
      daftarKaryawan: [],
      searchInput: "",
      category: [],
      selectedCategory: "",
      isLoading: false,
      isSukses: false,
      isError: false,
      successMessage: "",
      errorMessage: "",
      assigneeColors: {},
      createTanggal: false,
      hapus: false,
      selectedData: null,
      selectedKaryawan: null,
      kategori: "",
      tanggal: "",
      keterangan: "",
    };
  },
  mounted() {
    this.ambilData();
  },
  created() {
    this.debouncedAmbilData = this.debounce(this.ambilData, 500);
  },
  methods: {
    debounce(func, delay) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    },
    async saveTanggal() {
      this.isLoading = true;
      try {
        const [tanggal, bulan, tahun] = this.tanggal.split("-");
        const formattedTanggal = `${tahun}-${bulan}-${tanggal}`;

        const save = await this.$api.post("/api/v1/cuti/users", {
          clickup_id: this.selectedKaryawan?.clickup_id,
          tanggal: formattedTanggal,
          kategori: this.kategori,
          keterangan: this.keterangan,
        });

        await this.ambilData();
        this.createTanggal = false;

        this.isSukses = true;
        this.successMessage = save.data.message;
      } catch (err) {
        this.errorMessage =
          err?.response?.data?.error ||
          "Terjadi kesalahan saat mengubah password";
        this.isError = true;
      } finally {
        this.isLoading = false;
        this.closeSetTanggal();

        setTimeout(() => {
          this.isError = false;
          this.isSukses = false;
        }, 5000);
      }
    },
    setTanggal(k) {
      this.selectedKaryawan = k;
      this.createTanggal = true;
    },
    closeSetTanggal() {
      this.createTanggal = false;
      this.hapus = false;
      this.tanggal = "";
      this.keterangan = "";
      this.kategori = "";
    },
    openDelete(tanggal) {
      this.hapus = true;
      this.selectedData = tanggal;
    },
    async deleteTanggal(k) {
      this.isLoading = true;
      console.log(k.tanggal);
      console.log(k.clickup_id);

      try {
        // const [tanggal, bulan, tahun] = k.tanggal.split("-");
        // const formattedTanggal = `${ta}-${bulan}-${tanggal}`;
        const deleteTanggal = await this.$api.delete("/api/v1/cuti/users", {
          data: {
            id: k.id,
            clickup_id: k.clickup_id,
            tanggal: k.tanggal,
          },
        });

        await this.ambilData();
        this.hapus = false;

        this.isSukses = true;
        this.successMessage = deleteTanggal.data.message;
      } catch (err) {
        this.errorMessage =
          err?.response?.data?.error ||
          "Terjadi kesalahan saat mengubah password";
        console.log("gagal", err);

        this.isError = true;
      } finally {
        this.closeSetTanggal();
        this.isLoading = false;

        setTimeout(() => {
          this.isError = false;
          this.isSukses = false;
        }, 5000);
      }
    },
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

      // console.log("Nama pertama adalah:", firstName);
      // console.log("Nama terakhir adalah:", lastName);

      return firstName + lastName;
    },
    getProfileImage(url) {
      const baseURL = "https://api.clickup.devlmu.com";

      if (!url) return "";

      return baseURL + url;
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

    async ambilData() {
      this.isLoading = true;

      try {
        const params = new URLSearchParams();

        if (this.searchInput) params.append("name", this.searchInput);
        if (this.selectedCategory)
          params.append("kategori", this.selectedCategory);

        const [memberRes, fotoRes, roleRes, categoryRes] = await Promise.all([
          this.$api.get(`/api/v1/cuti/users?${params.toString()}`),
          this.$api.get("/api/v1/clickup/members"),
          this.$api.get("/api/v1/roles"),
          this.$api.get("/api/v1/cuti/kategori"),
        ]);

        const members = memberRes?.data?.data || [];
        const fotos = fotoRes?.data?.users || [];

        const fotoMap = new Map(
          fotos.map((f) => [
            f.clickup_id,
            {
              profile_picture_url: f.profile_picture_url,
              color: f.color,
            },
          ]),
        );

        this.daftarKaryawan = members.map((m) => {
          const fotoData = fotoMap.get(m.clickup_id);

          return {
            ...m,
            profile_picture_url: fotoData?.profile_picture_url || null,
            color: fotoData?.color || "#ccc",
            imageError: false,
          };
        });

        this.daftarRole = roleRes?.data?.data || [];
        this.category = categoryRes?.data?.data || [];
      } catch (error) {
        console.error("API Error:", error?.response?.data || error.message);
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

      // // filter nama
      // if (this.searchInput) {
      //   hasil = hasil.filter((k) =>
      //     k.name.toLowerCase().includes(this.searchInput.toLowerCase()),
      //   );
      // }

      // // filter posisi (role)
      // if (this.posisi) {
      //   hasil = hasil.filter(
      //     (k) => k.role.toLowerCase() === this.posisi.toLowerCase(),
      //   );
      // }

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
    searchInput: {
      handler() {
      this.debouncedAmbilData();
    },
    },
    selectedCategory() {
      this.ambilData();
    },
  },
};
</script>
