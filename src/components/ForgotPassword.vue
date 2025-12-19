<template>
  <Toast />
  <div
    v-if="!otpSessionTime || (otpSessionTime < new Date().getTime() && !resetToken)"
    class="flex justify-content-center align-items-center h-screen"
  >
    <Card class="w-4 shadow-4 border-round-xl p-4">
      <template #title>
        <div class="text-center text-2xl font-bold mb-3">🔑 Quên mật khẩu</div>
      </template>

      <template #content>
        <Form @submit="onSubmit">
          <div class="field mb-4">
            <label for="email" class="font-semibold">Email</label>
            <InputText
              v-model="email"
              v-bind="emailAttrs"
              class="w-full mt-2"
              placeholder="Nhập email"
            />
            <span class="text-red-500 text-sm"> {{ emailErrors.email }}</span>
          </div>

          <Button
            label="Gửi OTP qua email"
            class="w-full"
            :loading="loading"
            severity="info"
            icon="pi pi-send"
            type="submit"
          />
        </Form>
      </template>
    </Card>
  </div>
  <div
    v-if="otpSessionTime && new Date().getTime() < otpSessionTime && !resetToken"
    class="flex justify-content-center align-items-center h-screen"
  >
    <Card class="w-4 shadow-4 border-round-xl p-4">
      <template #title>
        <div class="text-center text-2xl font-bold mb-3">🔢 Nhập mã OTP</div>
      </template>

      <template #content>
        <Form @submit="sendOtp">
          <div class="field mb-4">
            <InputOtp
              v-bind="otpAttrs"
              v-model="otp"
              integerOnly
              :length="6"
              class="justify-center"
            />
            <span class="text-red-500 text-sm"> {{ otpErrors.otp }}</span>
          </div>

          <Button
            label="Xác nhận"
            class="w-full"
            :loading="loading"
            severity="info"
            icon="pi pi-send"
            type="submit"
          />
        </Form>
      </template>
    </Card>
  </div>
  <div v-if="resetToken" class="flex justify-content-center align-items-center h-screen">
    <Card class="w-4 shadow-4 border-round-xl p-4">
      <template #title>
        <div class="text-center text-2xl font-bold mb-3">🔁 Đổi mật khẩu</div>
      </template>

      <template #content>
        <Form @submit="changePassword">
          <div class="field mb-4">
            <label for="password" class="font-semibold">Mật khẩu</label>
            <Password
              id="password"
              v-model="password"
              v-bind="passwordAttrs"
              class="w-full mt-2"
              toggleMask
              inputClass="p-inputtext p-component w-full"
              :feedback="false"
              placeholder="Nhập mật khẩu"
            />
            <span class="text-red-500 text-sm"> {{ passwordErrors.password }}</span>
          </div>
          <div class="field mb-4">
            <label for="confirmPassword" class="font-semibold">Nhập lại mật khẩu</label>
            <Password
              id="confirmPassword"
              v-model="confirmPassword"
              v-bind="confirmPasswordAttrs"
              class="w-full mt-2"
              toggleMask
              inputClass="p-inputtext p-component w-full"
              :feedback="false"
              placeholder="Nhập lại mật khẩu"
            />
            <span class="text-red-500 text-sm">
              {{ passwordErrors.confirmPassword }}</span
            >
          </div>
          <Button
            label="Đổi mật khẩu"
            class="w-full"
            :loading="loading"
            severity="info"
            icon="pi pi-pen-to-square"
            type="submit"
          />
        </Form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import Password from "primevue/password";
import Card from "primevue/card";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import InputOtp from "primevue/inputotp";
import Toast from "primevue/toast";
import { Form } from "vee-validate";
import { useForm } from "vee-validate";
import * as yup from "yup";
import InputText from "primevue/inputtext";
import axios from "axios";

const router = useRouter();
const toast = useToast();

const otpSessionTime = ref(JSON.parse(sessionStorage.getItem("otpSessionTime")) ?? null);
const resetToken = ref(sessionStorage.getItem("resetToken") ?? null);

const loading = ref(false);
onMounted(() => {
  if (otpSessionTime.value) {
    setInterval(() => {
      if (otpSessionTime.value < new Date().getTime()) {
        sessionStorage.removeItem("otpSessionTime");
        sessionStorage.removeItem("email");

        return;
      }
    }, 1000);
  }
});
const {
  defineField: defineEmailField,
  handleSubmit: handleEmailSubmit,
  errors: emailErrors,
  setFieldError: setFieldErrorEmail,
} = useForm({
  validationSchema: yup.object({
    email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
  }),
});
const [email, emailAttrs] = defineEmailField("email");

const onSubmit = handleEmailSubmit(async (values) => {
  const { email } = values;
  loading.value = true;
  try {
    const response = await axios.post(
      `https://karson-semicathartic-nondeprecatively.ngrok-free.dev/auth/send-otp`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        email,
      }
    );

    if (response.data.StatusCode !== 201 && response.data.StatusCode !== 200) {
      setFieldErrorEmail("email", response.data.Message);
      return;
    }

    toast.add({
      severity: "success",
      summary: "Thành công",
      detail: "Gửi thành công, vui lòng kiểm tra email",
      life: 3000,
    });
    sessionStorage.setItem(
      "otpSessionTime",
      JSON.stringify(new Date().getTime() + 5 * 60 * 1000)
    );
    sessionStorage.setItem("email", email);
    otpSessionTime.value = JSON.stringify(new Date().getTime() + 5 * 60 * 1000);
  } catch (e) {
    console.error("Fetch error:", e);
  } finally {
    loading.value = false;
  }
});

const {
  defineField: defineOtpField,
  handleSubmit: handleOtpSubmit,
  errors: otpErrors,
  setFieldError: setFieldErrorOtp,
} = useForm({
  validationSchema: yup.object({
    otp: yup.string().length(6, "OTP phải đủ 6 số").required("Vui lòng nhập OTP"),
  }),
});

const [otp, otpAttrs] = defineOtpField("otp");
const sendOtp = handleOtpSubmit(async (values) => {
  const { otp } = values;
  const email = sessionStorage.getItem("email");
  loading.value = true;
  try {
    const response = await axios.post(
      `https://karson-semicathartic-nondeprecatively.ngrok-free.dev/api/auth/forgot-password`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        email,
        otp,
      }
    );

    if (response.data.StatusCode !== 200) {
      setFieldErrorOtp("otp", response.data.Message);
      return;
    }
    sessionStorage.removeItem("otpSessionTime");
    sessionStorage.removeItem("email");
    sessionStorage.setItem("resetToken", response.data.Data.resetToken);
    resetToken.value = response.data.Data.resetToken;
  } catch (e) {
    console.error("Fetch error:", e);
  } finally {
    loading.value = false;
  }
});

const {
  defineField: definePasswordField,
  handleSubmit: handlePasswordSubmit,
  errors: passwordErrors,
  setFieldError: setFieldErrorPassword,
} = useForm({
  validationSchema: yup.object({
    password: yup
      .string()
      .required("Vui lòng nhập mật khẩu")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/,
        "Mật khẩu dài ít nhất 6 ký tự và phải có chữ hoa, chữ thường, số"
      ),
    confirmPassword: yup
      .string()
      .required("Vui lòng nhập lại mật khẩu")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/,
        "Mật khẩu dài ít nhất 6 ký tự và phải có chữ hoa, chữ thường, số"
      )
      .oneOf([yup.ref("password")], "Mật khẩu không khớp"),
  }),
});
const [password, passwordAttrs] = definePasswordField("password");
const [confirmPassword, confirmPasswordAttrs] = definePasswordField("confirmPassword");
const changePassword = handlePasswordSubmit(async (values) => {
  const { password, confirmPassword } = values;
  const resetToken = sessionStorage.getItem("resetToken");
  loading.value = true;
  try {
    const response = await axios.post(
      `https://karson-semicathartic-nondeprecatively.ngrok-free.dev/api/auth/change-password-forgot`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        password,
        confirmPassword,
        resetToken,
      }
    );

    if (response.data.StatusCode !== 200) {
      setFieldErrorPassword("confirmPassword", response.data.Message);
      return;
    }

    sessionStorage.removeItem("resetToken");
    sessionStorage.setItem("changePassword", true);
    router.push("/login");
  } catch (e) {
    console.error("Fetch error:", e);
  } finally {
    loading.value = false;
  }
});
</script>
