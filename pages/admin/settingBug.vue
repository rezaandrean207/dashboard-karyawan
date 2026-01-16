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

<!-- Style container Bug -->
<!-- <style scoped>
.container_bug {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  width: 96%;
  margin-top: 20px;
  gap: 14px;
  flex-wrap: wrap;
}

.card-setting {
  width: 19%;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #eee;
}

.card-setting h4 {
  margin-bottom: 16px;
}

.card-setting span {
  font-weight: 700;
}

.form-group {
  margin-top: 14px;
  border-top: 1px solid #eee;
  padding-top: 12px;
}

.form-group label {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
  color: #444;
}

.form-group input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.submit-button {
  margin-top: 30px;
  /* text-align: right; */
  width: 96%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.reset button {
  background: #fff;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.reset button:hover {
  background: #f3f4f6;
}

.save button {
  background: #1d4ed8;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.save button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.save button:disabled:hover {
  background: #ccc;
}

.save button:hover {
  background: #1e40af;
}
</style> -->

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
  width: 96%;
  margin-top: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  background: #fff;
  padding: 20px;
}

.bug-setting {
  width: 100%;
}

.header-setting {
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  /* margin-bottom: 10px; */
}

.header-setting .priority-penalty-labels {
  display: flex;
  justify-content: space-between;
  width: 40%;
  padding-left: 10px;
}

.bug-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.bug-item .priority-penalty-name {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 42%;
  font-size: 14px;
  font-weight: 500;
  padding-left: 10px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.priority-penalty-name .input-group input {
  width: 95px;
  padding: 5px;
  border: 1px solid #ddd;
  background-color: #f6f6f6;
  border-radius: 4px;
}

.submit-button {
  margin-top: 30px;
  /* text-align: right; */
  width: 96%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.reset button {
  background: #fff;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.reset button:hover {
  background: #f3f4f6;
}

.save button {
  background: #1d4ed8;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.save button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.save button:disabled:hover {
  background: #ccc;
}

.save button:hover {
  background: #1e40af;
}

.low {
  color: grey;
}

.normal {
  color: blue;
}

.high {
  color: orange;
}

.urgent {
  color: red;
}

.noBug {
  color: green;
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
