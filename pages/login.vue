<template>
  <div class="login">
    <div v-if="isLoading" class="loading">
      <div class="loading_tanggal">
        <!-- <i class="fa-solid fa-circle-notch fa-spin"></i> -->
        <i class="fa-solid fa-spinner"></i>
        <p>Tunggu Sebentar</p>
      </div>
    </div>
    <div class="wraper" id="app" :class="{ shake: isError }">
      <div class="hero">
        <div class="ikon_login">
          <!-- <i class="fa-solid fa-users"></i> -->
          <img src="/img/logo-dna.png" alt="" />
        </div>
        <h2>DNA Monitoring</h2>
        <p>Silahkan login untuk melanjutkan</p>

        <form action="#" method="POST" class="form" @submit.prevent="login">
          <div class="input">
            <div class="username">
              <!-- <i class="fa-solid fa-user"></i> -->
              <input
                type="text"
                id="nama"
                name="nama"
                placeholder=" "
                v-model="form.username"
              />
              <label for="username">Username</label>
            </div>
          </div>
          <!-- <label for="username" class="error">Minimal 8 karakter</label> -->

          <!-- <div class="input">
        <i class="bx bx-envelope-open"></i>
        <input type="email" id="email" name="email" placeholder="Email" />
      </div> -->
          <!-- <label for="email" class="error">Fromat email tidak valid</label> -->

          <div class="input">
            <div class="password">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                name="password"
                placeholder=" "
                v-model="form.password"
              />
              <label for="password">Password</label>

              <i
                class="fa-solid"
                :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                @click="showPassword = !showPassword"
                style="
                  cursor: pointer;
                  position: absolute;
                  right: 12px;
                  top: 50%;
                  transform: translateY(-50%);
                "
              ></i>
            </div>
          </div>
          <!-- <label for="password" class="error">Minimal 8 karakter</label> -->

          <!-- <div class="input">
        <i class="bx bx-lock"></i>
        <input
          type="password"
          id="retypePassword"
          name="retypePassword"
          placeholder="Retype Password"
        />
      </div> -->
          <!-- <label for="retypePassword" class="error">Password tidak valid</label> -->

          <div class="button">
            <button type="submit">Masuk</button>
          </div>

          <!-- <div class="register">
            <p>
              Don't have an account?
            </p>
          </div> -->
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shake {
  -webkit-animation: shake-horizontal 0.2s
    cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
  animation: shake-horizontal 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
  border: 1px solid red;
}
@keyframes shake-horizontal {
  0%,
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70% {
    -webkit-transform: translateX(-10px);
    transform: translateX(-10px);
  }
  20%,
  40%,
  60% {
    -webkit-transform: translateX(10px);
    transform: translateX(10px);
  }
  80% {
    -webkit-transform: translateX(8px);
    transform: translateX(8px);
  }
  90% {
    -webkit-transform: translateX(-8px);
    transform: translateX(-8px);
  }
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #eef4ff, #f8fbff);

  /* background-color: rgb(218, 236, 248); */
  /* background: #020024;
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(9, 9, 121, 1) 35%,
    rgba(0, 64, 255, 1) 94%
  ); */
  color: #010101;
}

.wraper {
  color: var(--text);
  display: flex;
  justify-content: center;
  align-items: center;

  background: #ffffff;
  width: 450px;
  height: 500px;
  padding: 32px 28px;

  border-radius: 20px;
  border: none;

  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.wraper .hero {
  text-align: center;
  width: 100%;
}

.wraper .hero h2 {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.2px;
}

.hero p {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 22px;
}

.hero .ikon_login {
  width: 100%;
  /* background-color: aliceblue; */
  display: flex;
  justify-content: center;
  position: relative;
  bottom: 20px;
  /* margin-bottom: 15px; */
}

.hero .ikon_login img {
  width: 70%;
  height: 80px;
  object-fit: cover;
  /* border: 1px solid #010101; */
}

.ikon_login i {
  font-size: 35px;
  padding: 20px 40px;
  color: #fff;
  background-color: blue;
  display: flex;
  justify-content: center;
  border-radius: 10px;
}

.wraper form {
  width: 100%;
}

.input {
  width: 100%;
  margin-top: 20px;
  text-align: justify;
  position: relative;
}

.input label {
  color: #94a3b8;
  font-size: 13px;
}

.input input:focus + label {
  color: #2563eb;
}

.input input:focus + label,
.input input:not(:placeholder-shown) + label {
  color: #3b82f6;
  font-weight: 500;
}

.input .username {
  display: flex;
}

.wraper .form input {
  margin: 4px 0;
  width: 100%;
  outline: none;
  caret-color: var(--text);
  color: var(--text);
  font-size: 14px;
  transition: 0.2s;
  font-weight: 500;

  padding: 14px 16px;
  border-radius: 12px;

  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.input input:focus {
  border-color: #3b82f6;
  background-color: #ffffff;
  /* box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15); */
}

.input input::-ms-reveal {
  filter: invert(100%);
}

.input .username i {
  position: absolute;
  top: 47.8%;
  transform: translateY(-50%);
  left: 38%;
  color: #010101;
  font-size: 18px;
  transition: 0.25s;
}

.input .password {
  position: relative;
}

.input .password i {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  cursor: pointer;
  transition: 0.2s;
}

.input .password i:hover {
  color: #3b82f6;
}

.input .username label {
  position: absolute;
  top: 30%;
  left: 15px;
  transition: 0.2s;
  pointer-events: none;
  font-size: 14px;
}

.input .username input:focus + label,
.input .username input:not(:placeholder-shown) + label {
  /* bottom: 64px;
  left: 8px; */
  top: -5px;
  left: 10px;
  background-color: #fff;
  padding: 0 4px;
  font-size: 12px;
  color: blue;
  /* border-top: 1px solid blue; */
  border-radius: 10px;
}

.input .password label {
  position: absolute;
  top: 30%;
  left: 15px;
  transition: 0.2s;
  pointer-events: none;
  /* color: red; */
  font-size: 14px;
}

.input .password input:focus + label,
.input .password input:not(:placeholder-shown) + label {
  /* bottom: 64px;
  left: 8px; */
  top: -5px;
  left: 10px;
  background-color: #fff;
  padding: 0 4px;
  font-size: 12px;
  color: blue;
  /* border-top: 1px solid blue; */
  border-radius: 10px;
}

.input input:focus + i {
  color: #fff;
}

.form .button button {
  margin-top: 24px;
  width: 100%;
  /* padding: 10px 0; */
  /* background-color: blue; */
  border: none;
  color: #fff;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  outline: transparent 3px solid;
  transition: 0.1s;

  height: 44px;
  border-radius: 12px;
  font-size: 15px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.35);
}

.form .button button:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(37, 99, 235, 0.45);
}

.form .button button:active {
  transform: translateY(0);
}

.form .button button:hover {
  background-color: rgb(0, 0, 199);
}

.form .button button:focus {
  outline: var(--primary) 3px solid;
}

.wraper .form .register p,
a {
  margin-top: 12px;
  text-align: center;
  color: var(--text);
}

/* Error message */

.error {
  color: #dc3545;
  font-size: 14px;
  font-weight: bold;
  margin-left: 8px;
}
</style>

<script setup>
definePageMeta({
  layout: "auth",
});
</script>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      showPassword: false,
      isError: false,
      isLoading: false,
    };
  },
  mounted() {
    // this.login();
  },
  methods: {
    async login() {
      if (this.isLoading) return;

      this.isLoading = true;
      this.isError = false;

      try {
        const res = await this.$api.post("/api/v1/auth/login", {
          username: this.form.username,
          password: this.form.password,
        });

        // 🔥 destructuring biar clean
        const { token, role, clickup_id, name } = res.data.data;

        // 🔥 centralize cookie config
        const cookieOptions = {
          maxAge: 10,
          sameSite: "lax",
          path: "/",
        };

        useCookie("token", cookieOptions).value = token;
        useCookie("role", cookieOptions).value = role;
        useCookie("clickup_id", cookieOptions).value = clickup_id;
        useCookie("name", cookieOptions).value = name;

        // 🔥 redirect clean
        const redirectPath =
          role === "admin" ? "/admin/listKaryawan" : "/karyawan/performaSaya";

        this.$router.replace(redirectPath);
      } catch (error) {
        console.error("Login Error:", error);

        this.isError = true;

        // 🔥 kasih message lebih jelas
        const status = error?.response?.status;

        // if (status === 401) {
        //   alert("Username atau password salah");
        // } else {
        //   alert("Terjadi kesalahan, coba lagi");
        // }

        setTimeout(() => {
          this.isError = false;
        }, 2000);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
