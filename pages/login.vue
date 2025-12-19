<template>
  <div class="login">
    <div v-if="isLoading" class="loading">
      <div class="loading_tanggal">
        <i class="fa-solid fa-circle-notch fa-spin"></i>
        <p>Tunggu Sebentar</p>
      </div>
    </div>
    <div class="wraper" id="app" :class="{ shake: isError }">
      <div class="hero">
        <div class="ikon_login">
          <!-- <i class="fa-solid fa-users"></i> -->
          <img src="/img/logo dna.png" alt="" />
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
            <button type="submit">Login</button>
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

<!-- <style>
:root {
  --primary: blue;
  --bg: #5c5b58;
  --text: #010101;
}

* {
  margin: 0;
  padding: 0;
  font-family: "Poppins", Sans-Serif;
  box-sizing: border-box;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: rgb(218, 236, 248);
  color: #010101;
}

.wraper {
  background-color: #fff;
  width: 320px;
  padding: 24px;
  /* border: 5px solid rgb(255, 255, 255, 0.1); */
  border: 1px solid rgb(197, 197, 255);
  border-radius: 16px;
  /* backdrop-filter: blur(25px); */
  box-shadow: 0px 0px 30px 20px rgba(57, 106, 255, 0.1);
  color: var(--text);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wraper img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 5px solid rgb(193, 222, 232);
  border-radius: 50%;
}

.wraper h2 {
  margin-bottom: 16px;
}

.input {
  display: flex;
  width: 100%;
  position: relative;
  margin-top: 20px;
}

.wraper .form input {
  margin: 4px 0;
  width: 250px;
  padding: 10px 10px 10px 14px;
  border-radius: 10px;
  border: 3px solid transparent;
  background-color: #eeecec;
  outline: none;
  caret-color: var(--text);
  color: var(--text);
  font-weight: 500;
  transition: 0.25s;
  border: 1px solid rgb(197, 197, 255);
}

.input input:focus {
  border: 1px solid blue;
}

.wraper .form input::placeholder {
  /* color: var(--text); */
}

.input input::-ms-reveal {
  filter: invert(100%);
}

.input i {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 14px;
  color: rgb(255, 255, 255, 0.75);
  font-size: 18px;
  transition: 0.25s;
}

.input input:focus + i {
  color: #fff;
}

.form .button button {
  margin-top: 24px;
  width: 100%;
  padding: 10px 0;
  background-color: var(--primary);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  outline: transparent 3px solid;
  transition: 0.1s;
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
</style> -->

<style>
.shake {
  -webkit-animation: shake-horizontal 0.2s
    cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
  animation: shake-horizontal 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
  border: 1px solid red;
}

@-webkit-keyframes shake-horizontal {
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
  background-color: rgb(218, 236, 248);
  /* background: #020024;
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(9, 9, 121, 1) 35%,
    rgba(0, 64, 255, 1) 94%
  ); */
  color: #010101;
}

* {
  margin: 0;
  padding: 0;
  font-family: "Poppins", Sans-Serif;
  box-sizing: border-box;
}

.wraper {
  background-color: #fff;
  width: 440px;
  height: 500px;
  padding: 15px 24px;
  /* border: 5px solid rgb(255, 255, 255, 0.1); */
  border: 1px solid rgb(197, 197, 255);
  border-radius: 16px;
  /* backdrop-filter: blur(25px); */
  box-shadow: 0px 0px 30px 20px rgba(57, 106, 255, 0.1);
  color: var(--text);
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
}

.wraper .hero {
  text-align: center;
  width: 100%;
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

/* .wraper .hero img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 5px solid rgb(193, 222, 232);
  border-radius: 50%;
} */

.wraper .hero h2 {
  margin-top: px;
  font-weight: 600;
  font-size: 20px;
  color: rgb(0, 170, 213);
}

.hero p {
  font-weight: 300;
  margin-bottom: 16px;
  font-size: 16px;
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

.input .username {
  display: flex;
}

.wraper .form input {
  margin: 4px 0;
  width: 100%;
  padding: 10px 15px;
  border-radius: 5px;
  border: 3px solid transparent;
  /* background-color: #eeecec; */
  outline: none;
  caret-color: var(--text);
  color: var(--text);
  font-weight: 500;
  font-size: 15px;
  transition: 0.25s;
  border: 1px solid rgb(197, 197, 255);
}

.input input:focus {
  border: 1px solid blue;
}

/* .wraper .form input::placeholder {
  /* color: var(--text); */

.input input::-ms-reveal {
  filter: invert(100%);
}

.input .username i {
  position: absolute;
  top: 47.8%;
  transform: translateY(-50%);
  left: 38%;
  /* color: rgb(255, 255, 255, 0.75); */
  color: #010101;
  font-size: 18px;
  transition: 0.25s;
}

.input .password i {
  position: relative;
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
  padding: 10px 0;
  background-color: blue;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  outline: transparent 3px solid;
  transition: 0.1s;
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
      this.isLoading = true;
      // const { $api } = useNuxtApp();
      const router = useRouter();
      try {
        const res = await this.$api.post("/api/v1/auth/login", {
          username: this.form.username,
          password: this.form.password,
        });
        console.log("Login sukses:", res.data.token);

        const token = useCookie("token", {
          maxAge: 60 * 60 * 24, // 1 hari
          sameSite: "lax",
          path: "/",
        });

        token.value = res.data.data.token;

        const username = this.form.username;

        if (username === "admin") {
          // 👉 Redirect otomatis
          router.push("/listKaryawan");
          console.log("Anda masuk ke dashboard ", username);
        } else if (username === "karyawan") {
          router.push("/detailTask");
          console.log("Anda masuk ke dashboard karyawan");
        }
      } catch (error) {
        console.error("API Error:", error);
        this.isError = true;
        setTimeout(() => {
          this.isError = false;
          // alert("Input tidak cocok");
        }, 500);
        // alert("Input tidak cocok");
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
