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
      <p>Perubahan Berhasil Disimpan!</p>
    </div>
  </div>

  <div class="error-message" v-if="isError">
    <div class="message-content">
      <!-- <i class="fa-solid fa-check-circle"></i> -->
      <i class="fa-solid fa-circle-xmark"></i>
      <p>{{ errorMessage }}</p>
    </div>
  </div>

  <div class="isi">
    <h2>Ubah Password</h2>
    <p class="subtitle">Pastikan password baru Anda aman dan mudah diingat</p>

    <div class="wraper-pass">
      <div class="change-password">
        <!-- <h1>Ubah Password</h1>
      <p class="subtitle">Pastikan password baru Anda aman dan mudah diingat</p> -->

        <form class="card" @submit.prevent="changePassword">
          <div class="form-group">
            <label>Password Sekarang</label>
            <input
              type="password"
              v-model="oldPassword"
              autocomplete="current-password"
              required
            />
          </div>

          <div class="form-group">
            <label>Password Baru</label>
            <input
              type="password"
              v-model="newPassword"
              autocomplete="new-password"
              required
            />
          </div>

          <div class="form-group">
            <label>Konfirmasi Password Baru</label>
            <input
              type="password"
              v-model="confirmPassword"
              autocomplete="new-password"
              required
            />
          </div>

          <button class="btn-primary" type="submit">
            Simpan Password Baru
          </button>
        </form>

        <div class="tips">
          <strong>Tips:</strong>
          Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol.
        </div>
      </div>
    </div>
  </div>
</template>

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

<style scoped>
.wraper-pass {
  width: 100%;
  display: flex;
  justify-content: start;
  margin-top: 20px;
}

.change-password {
  /* max-width: 520px; */
  width: 100%;
}

.subtitle {
  color: #64748b;
  margin-bottom: 24px;
}

.card {
  background: white;
  padding: 28px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  margin-top: 16px;
  border-radius: 8px;
  border: none;
  color: white;
  font-weight: 600;
  /* background: linear-gradient(90deg, #4f46e5, #9333ea); */
  background-color: blue;
}

.tips {
  margin-top: 20px;
  padding: 14px;
  background: #eff6ff;
  border-radius: 12px;
  color: #1e40af;
}
</style>


<script>
export default {
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      isLoading: false,
      isSukses: false,
      isError: false,
      errorMessage: "",
    };
  },

  methods: {
    async changePassword() {
      // 🔒 VALIDASI DASAR
      if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
        this.errorMessage = "Semua field wajib diisi";
        this.isError = true;
        setTimeout(() => {
          this.isError = false;
        }, 3000);
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = "Konfirmasi password tidak cocok";
        this.isError = true;
        setTimeout(() => {
          this.isError = false;
        }, 3000);
        return;
      }

      this.isLoading = true;
      this.isError = false;
      this.isSukses = false;

      try {
        const response = await this.$api.post("/api/v1/auth/change-password", {
          old_password: this.oldPassword,
          new_password: this.newPassword,
          confirm_new_password: this.confirmPassword,
        });

        console.log("Password berhasil diubah", response);

        this.isSukses = true;

        // optional: reset form
        this.oldPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";
      } catch (err) {
        console.log("Gagal mengubah password", err);

        this.errorMessage =
          err?.response?.data?.error ||
          "Terjadi kesalahan saat mengubah password";
        this.isError = true;
      } finally {
        this.isLoading = false;

        setTimeout(() => {
          this.isError = false;
          this.isSukses = false;
        }, 5000);
      }
    },
  },
};
</script>
