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
            <input
              type="date"
              v-model="tanggal"
              :min="year ? `${year}-01-01` : null"
              :max="year ? `${year}-12-31` : null"
            />
          </div>
          <div class="kategori">
            <label for="hari">Kategori</label>
            <select name="" id="" v-model="kategori" required>
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
          <ClientOnly>
            <n-input
              v-model:value="searchInput"
              placeholder="Cari nama karyawan"
              type="search"
            ></n-input>
          </ClientOnly>
        </div>
        <div class="filter-item">
          <ClientOnly>
            <n-select
              v-model:value="selectedCategory"
              :options="[
                { label: 'Semua Kategori', value: '' },
                ...category.map((c) => ({ label: c, value: c })),
              ]"
            ></n-select>
          </ClientOnly>
        </div>
        <div class="filter-item">
          <ClientOnly>
            <VueDatePicker
              v-model="year"
              year-picker
              :formats="{ year: 'yo' }"
              class="month-picker"
            />
          </ClientOnly>
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
          <!-- <div class="peran">
            <i class="fa-solid fa-briefcase"></i>
            <p>Web</p>
          </div> -->
        </div>
        <!-- <div class="kinerja">
          <div class="status-member">
            <p>Status:</p>
            <p>{{ k.status }}</p>
          </div>
        </div> -->

        <div class="dropdown-cuti" v-if="k.total !== 0">
          <!-- Trigger -->
          <div class="summary" @click="toggleCuti(k)">
            <p>{{ k.total }} Cuti tersedia</p>
            <i
              class="fa-solid fa-chevron-down"
              :class="{ rotate: openCutiId === k.clickup_id }"
            ></i>
          </div>

          <!-- Dropdown -->
          <div class="holiday" v-if="openCutiId === k.clickup_id">
            <div class="list_hari" v-for="h in k.cuti" :key="h.id">
              <div class="keterangan_libur">
                <div class="header-list">
                  <h5>{{ h.tanggal_ui }}</h5>
                  <div class="category-label">
                    <p>{{ h.kategori }}</p>
                  </div>
                </div>
                <p>{{ h.keterangan }}</p>
              </div>

              <i class="fa-solid fa-xmark" @click.stop="openDelete(h)"></i>
            </div>

            <!-- Optional empty state -->
            <div v-if="!k.cuti.length" class="belum_tersedia">
              <h4>Hari Libur belum tersedia</h4>
            </div>
          </div>
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

<!-- Container Karyawan -->
<style scoped>
.daftarKaryawan {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  width: 100%;
}

.karyawan {
  border: var(--borderCard);
  background-color: #fff;
  flex: 1 250px;
  text-align: center;
  border-radius: 15px;
  transition:
    transform 0.3s ease,
    box-shadow 0.1s ease;
  padding: 10px 20px 20px 20px;
  overflow: visible;
}

.karyawan:hover {
  border: 1px solid rgb(68, 41, 203);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  /* transform: scale(1.02); */
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
  font-size: 15px;
  text-transform: capitalize;
}

.karyawan .identitas .bebanKerja {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 5px 0;
  font-size: 12px;
  border-radius: 15px;
}

.bebanKerja:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
}

.karyawan .kinerja {
  /* margin: 0 30px; */
  margin-top: 15px;
  border-top: 1px solid rgb(222, 221, 226);
}

.kinerja .status-member {
  margin-top: 10px;
  text-transform: capitalize;
}

.kinerja .status-member,
.performa {
  display: flex;
  justify-content: space-between;
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

.dropdown-cuti {
  position: relative;
  margin: 10px 0;

  /* width: 260px; */
}

.summary {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px 14px;
  border-radius: 12px;

  background: #ffffff;
  border: 1px solid #e5e7eb;

  cursor: pointer;
  transition: all 0.2s ease;
}

/* Hover effect */
.summary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* Active (saat dropdown buka) */
.summary:has(.rotate) {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
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

  animation: fadeSlide 0.3s ease;
}

@keyframes fadeSlide {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  font-size: 11px;
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

<!-- Foto Profil -->
<style scoped>
.photo-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto;
}

.photo-option {
  font-size: 28px;
  font-weight: 700;
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
      year: new Date().getFullYear(),
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
      openCutiId: null,
    };
  },
  mounted() {
    this.ambilData();
  },
  created() {
    this.debouncedAmbilData = this.debounce(this.ambilData, 500);
  },
  methods: {
    toggleCuti(k) {
      this.openCutiId = this.openCutiId === k.clickup_id ? null : k.clickup_id;
    },
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
        // this.successMessage = save.data.message;
        this.successMessage = "Berhasil menambahkan cuti";
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

      const today = new Date();

      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");

      if (this.year) {
        this.tanggal = `${this.year}-${month}-${day}`;
      } else {
        this.tanggal = new Date().toISOString().split("T")[0];
      }
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
        // this.successMessage = deleteTanggal.data.message;
        this.successMessage = "Berhasil dihapus";
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
        if (this.year) params.append("year", this.year);

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
    year() {
      this.ambilData();
    },
  },
};
</script>
