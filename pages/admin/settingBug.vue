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

  <div class="isi">
    <h2>Setting Bug Page</h2>
    <p>Pengaturan penalti berdasarkan prioritas</p>

    <div class="container">
      <div class="bug-setting">
        <div class="header-setting">
          <div class="priority-penalty-labels">
            <h4>Prioritas</h4>
            <!-- <h4>Penalti (%)</h4> -->
          </div>
        </div>
        <div class="bug-item" v-for="(b, index) in penaltyBug" :key="index">
          <div class="priority-penalty-name">
            <p :class="teksColour(b.name)">{{ b.name }}</p>
            <div class="input-group">
              <input
                v-if="b.name === 'No Bug Reward'"
                type="number"
                v-model.number="b.value"
              />
              <input
                v-else
                type="number"
                :value="-b.value"
                @input="b.value = Math.abs($event.target.value)"
              />
              <span>%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="container_bug">
      <div class="card-setting" v-for="(b, index) in penaltyBug" :key="index">
        <h4>{{ b.name }}</h4>
        <p v-if="b.name === 'No Bug Reward'">
          Reward: <span>{{ b.value }}%</span>
        </p>
        <p v-else>
          Penalti: <span>-{{ b.value }}%</span>
        </p>
        <div class="form-group">
          <label for=""> Edit Penalty </label>
          <input type="number" v-model.number="b.value" />
        </div>
      </div>
    </div> -->

    <div class="submit-button">
      <div class="reset">
        <button type="button" @click="resetSetting()">Reset</button>
      </div>
      <div class="save">
        <button
          type="button"
          @click="saveSetting()"
          :disabled="hasChange || isLoading"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
</template>

<!-- Responsive -->
<style scoped>
@media (max-width: 768px) {
  .bug-item .priority-penalty-name {
    width: 100%;
  }
}
</style>

<!-- Style success message -->
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

.success-message .message-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.success-message .message-content i {
  font-size: 20px;
  color: #10b981;
}

.success-message .message-content p {
  font-size: 16px;
  color: #065f46;
}
</style>

<style scoped>
.container {
  width: 100%;
  margin-top: 24px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.06);
}

.bug-setting {
  width: 100%;
}

.header-setting {
  padding-bottom: 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.priority-penalty-labels {
  display: flex;
  justify-content: space-between;
  width: 45%;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.bug-item {
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
}

.bug-item:not(:last-child) {
  border-bottom: 1px solid #f1f5f9;
}

.priority-penalty-name {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 55%;
  padding-left: 6px;
  font-size: 14px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.input-group input {
  width: 90px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-size: 14px;
  transition: all 0.2s ease;
}

.input-group input:focus {
  outline: none;
  background: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.input-group span {
  font-weight: 600;
  color: #6b7280;
}

.submit-button {
  margin-top: 32px;
  width: 96%;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.reset button {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 10px 22px;
  border-radius: 10px;
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
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save button:hover:not(:disabled) {
  filter: brightness(1.05);
}

.save button:disabled {
  background: #cbd5f5;
  cursor: not-allowed;
}

.low {
  color: #6b7280;
}

.normal {
  color: #2563eb;
}

.high {
  color: #d97706;
}

.urgent {
  color: #dc2626;
}

.noBug {
  color: #16a34a;
}
</style>

<script>
definePageMeta({
  layout: "dashboard",
});

export default {
  data() {
    return {
      penaltyBug: null,
      //   low: null,
      //   normal: null,
      //   high: null,
      //   urgent: null,
      //   noBugReward: null,
      angka: null,
      isLoading: false,
      isSukses: false,
      // save: null,
    };
  },
  mounted() {
    this.daftarPenaltyBug();
  },
  methods: {
    async daftarPenaltyBug() {
      console.log("Memuat daftar Penalty");

      try {
        const penalty = await this.$api.get("/api/v1/workload/settings");
        console.log("berikut daftar penalty", penalty);
        this.penaltyBug = penalty.data.bug_setting;
        // this.save = this.penaltyBug.map((b) => b.value);

        // sync ke form
        // this.low = null;
        // this.normal = null;
        // this.high = null;
        // this.urgent = null;
      } catch (error) {
        console.error("Gagal memuat daftar penalty bug:", error);
      }
    },
    async saveSetting() {
      this.isLoading = true;
      try {
        console.log("Menyimpan settingan bug");
        // Kirim setiap item satu per satu sesuai format backend
        // ambil semua id & value dari penaltyBug
        const payload = this.penaltyBug.map((b) => ({
          id: b.id,
          value: b.value,
        }));

        // kirim array ke backend
        const save = await this.$api.put("/api/v1/workload/settings", payload);

        // const save = await this.$api.put("/api/v1/workload/settings", {
        //   payload,
        // });

        //   low_penalty:
        //     this.low !== null && this.low !== ""
        //       ? Number(this.low)
        //       : this.penaltyBug.low_penalty,

        //   normal_penalty:
        //     this.normal !== null && this.normal !== ""
        //       ? Number(this.normal)
        //       : this.penaltyBug.normal_penalty,

        //   high_penalty:
        //     this.high !== null && this.high !== ""
        //       ? Number(this.high)
        //       : this.penaltyBug.high_penalty,

        //   urgent_penalty:
        //     this.urgent !== null && this.urgent !== ""
        //       ? Number(this.urgent)
        //       : this.penaltyBug.urgent_penalty,
        //   no_bug_reward:
        //     this.noBugReward !== null && this.noBugReward !== ""
        //       ? Number(this.noBugReward)
        //       : this.penaltyBug.no_bug_reward,
        // });

        console.log("Settings saved:", payload, save);
        await this.daftarPenaltyBug();
      } catch (error) {
        console.error("Gagal menyimpan settingan bug:", error);
      } finally {
        // this.low = null;
        // this.normal = null;
        // this.high = null;
        // this.urgent = null;
        // this.noBugReward = null;
        this.isLoading = false;
        this.isSukses = true;
        setTimeout(() => {
          this.isSukses = false;
        }, 5000);
      }
    },
    resetSetting() {
      //   this.low = this.penaltyBug.low_penalty;
      //   this.normal = this.penaltyBug.normal_penalty;
      //   this.high = this.penaltyBug.high_penalty;
      //   this.urgent = this.penaltyBug.urgent_penalty;
      this.low = null;
      this.normal = null;
      this.high = null;
      this.urgent = null;
      this.noBugReward = null;
    },
    teksColour(nama) {
      return {
        low: nama === "Low Penalty",
        normal: nama === "Normal Penalty",
        high: nama === "High Penalty",
        urgent: nama === "Urgent Penalty",
        noBug: nama === "No Bug Reward",
      };
    },
  },
  computed: {
    hasChange() {
      return (
        this.low === null &&
        this.normal === null &&
        this.high === null &&
        this.urgent === null &&
        this.noBugReward === null
      );
    },
  },
};
</script>
