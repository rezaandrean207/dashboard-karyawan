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
    <h2>Performance Setting</h2>
    <p>Atur batas performa untuk setiap kategori kinerja karyawan</p>

    <form action="" class="submit-wrapper" @submit.prevent="saveSetting">
      <div class="container-wrapper">
        <div class="container-setting" v-for="data in dataSetting">
          <div class="header-container">
            <h4>{{ data.name }}</h4>
          </div>
          <div class="limit-wrapper">
            <div class="limit">
              <div class="desc-limit">
                <p>Batas Atas {{ data.name }}</p>
              </div>
              <div class="value-limit">
                <input type="number" name="" id="" v-model="data.batas_atas" />
                <span>%</span>
              </div>
            </div>
            <div class="limit">
              <div class="desc-limit">
                <p>Batas Bawah {{ data.name }}</p>
              </div>
              <div class="value-limit">
                <input type="number" name="" id="" v-model="data.batas_bawah" />
                <span>%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="submit-button">
        <div class="reset">
          <button type="button" @click="resetSetting()">Reset</button>
        </div>
        <div class="save">
          <button type="submit" :disabled="hasChange || isLoading">
            Simpan
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<!-- Konten utama -->
<style scoped>
/* .isi h2 {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
}

.isi p {
  margin-top: 6px;
  color: #64748b;
  font-size: 14px;
} */

.container-wrapper {
  margin-top: 20px;
  width: 96%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.container-setting {
  border: 1px solid var(--border-soft);
  background: var(--bg-card);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  transition: all 0.2s ease;
}

.container-setting:hover {
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.header-container {
  padding-bottom: 12px;
  border-bottom: 1px dashed var(--border-soft);
}

.header-container h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.container-setting .limit-wrapper {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.limit-wrapper .limit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-soft);
}

.limit:last-child {
  border: none;
}

.desc-limit p {
  font-size: 14px;
  color: #475569;
}

.value-limit {
  display: flex;
  align-items: center;
  gap: 10px;
}

.value-limit input {
  width: 120px;
  text-align: justify;
  background-color: var(--bg-page);
  border: 1px solid var(--border-soft);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.value-limit input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  background: var(--bg-page);
}

.value-limit input:not(:placeholder-shown) {
  background: #eef2ff;
}

.value-limit span {
  font-size: 14px;
  color: #64748b;
}

.submit-button {
  width: 96%;
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  margin: 40px 0;
  padding-top: 24px;
  border-top: 1px solid var(--border-soft);
}

.reset button {
  background: var(--bg-page);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  padding: 10px 22px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset button:hover {
  background: #f9fafb;
}

.save button {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: #ffffff;
  border: none;
  padding: 10px 24px;
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.35);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save button:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.save button:disabled {
  background: #cbd5f5;
  cursor: not-allowed;
}
</style>

<!-- message -->
<style scoped>
.success-message {
  position: fixed;
  top: 20px;
  right: 50px;
  background-color: #e6ffed;
  border: 1px solid #34d399;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.5s ease-out;
}

.error-message {
  position: fixed;
  top: 20px;
  right: 50px;
  background-color: rgb(255, 226, 226);
  border: 1px solid rgb(215, 45, 45);
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.success-message .message-content,
.error-message .message-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.success-message .message-content i {
  font-size: 20px;
  color: #10b981;
}

.error-message .message-content i {
  font-size: 20px;
  color: red;
}

.success-message .message-content p {
  font-size: 16px;
  color: #065f46;
}

.error-message .message-content p {
  font-size: 16px;
  color: rgb(132, 8, 8);
}
</style>

<script>
export default {
  data() {
    return {
      dataSetting: [],
      isLoading: false,
      isSukses: false,
      isError: false,
      errorMessages: "",
      succesMessages: "",
    };
  },
  mounted() {
    this.ambilData();
  },
  methods: {
    async ambilData() {
      console.log("Data setting sedang di proses");
      this.isLoading = true;
      try {
        const setting = await this.$api.get("/api/v1/settings/performance");
        this.dataSetting = setting.data.data;

        console.log(setting.data.message, ":", setting);
      } catch (err) {
        console.log("Gagal memproses data", err);
      } finally {
        this.isLoading = false;
      }
    },
    async saveSetting() {
      this.isLoading = true;
      try {
        console.log("Memproses Perubahan");

        // Kirim setiap item satu per satu sesuai format backend
        const payload = this.dataSetting.map((b) => ({
          id: b.id,
          batas_atas: b.batas_atas,
          batas_bawah: b.batas_bawah,
        }));

        // kirim array ke backend
        const save = await this.$api.put(
          "/api/v1/settings/performance",
          payload,
        );

        // ambil message dari API
        this.succesMessages = save.data.message;

        // trigger sukses
        this.isSukses = true;

        console.log("Settings saved:", payload, save);
        await this.ambilData();
      } catch (err) {
        console.error("Gagal menyimpan settingan bug:", err);
        this.errorMessage =
          err?.response?.data?.error ||
          "Terjadi kesalahan saat mengubah setting";
        this.isError = true;
      } finally {
        this.isLoading = false;
        setTimeout(() => {
          this.isSukses = false;
        }, 5000);
      }
    },
    resetSetting() {
      this.ambilData();
    },
  },
};
</script>
