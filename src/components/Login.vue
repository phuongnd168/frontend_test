<template>
  <div class="flex justify-content-center align-items-center h-screen">
    <Card class="w-4 shadow-4 border-round-xl p-4">
      <template #title>
        <div class="text-center text-2xl font-bold mb-3">🔐 Đăng nhập</div>
      </template>

      <template #content>
        <Form @submit="onSubmit">
          <div class="field mb-4">
            <label for="email" class="font-semibold">Email</label>
            <InputText
              id="email"
              v-model="email"
              v-bind="emailAttrs"
              class="w-full mt-2"
              placeholder="Nhập email"
            />
            <span class="text-red-500 text-sm"> {{ errors.email }}</span>
          </div>

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
            <span class="text-red-500 text-sm"> {{ errors.password }}</span>
          </div>

          <Button
            label="Đăng nhập"
            class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
            icon="pi pi-sign-in"
            type="submit"
            :loading="loading"
          />

          <Button
            label="Đăng ký"
            class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md transition ml-3"
            severity="info"
            icon="pi pi-user-plus"
            @click="register()"
          />
        </Form>
        <div class="flex justify-content-end">
          <Button
            label="Quên mật khẩu?"
            @click="forgotPassword()"
            variant="link"
            class="text-sm text-blue-500"
          />
        </div>
      </template>
    </Card>

    <!-- Toast -->
    <Toast />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useToast } from "primevue/usetoast";

import Card from "primevue/card";
import { useRouter } from "vue-router";
import Button from "primevue/button";

import Password from "primevue/password";
const router = useRouter();
import Toast from "primevue/toast";
import { Form } from "vee-validate";
import { useForm } from "vee-validate";
import * as yup from "yup";
import InputText from "primevue/inputtext";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
const toast = useToast();
const authStore = useAuthStore();
const loading = ref(false);

const register = () => {
  router.push("/register");
};
const forgotPassword = () => {
  router.push("/forgot-password");
};
const { defineField, errors, handleSubmit, setFieldError } = useForm({
  validationSchema: yup.object({
    email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    password: yup
      .string()
      .required("Vui lòng nhập mật khẩu")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/,
        "Mật khẩu dài ít nhất 6 ký tự và phải có chữ hoa, chữ thường, số"
      ),
  }),
});
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");

const onSubmit = handleSubmit(async (values) => {
  const { email, password } = values;
  loading.value = true;
  try {
    const response = await axios.post(
      `https://karson-semicathartic-nondeprecatively.ngrok-free.dev/api/auth/login`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        email,
        password,
      }
    );

    if (response.data.StatusCode === 400) {
      loading.value = false;
      setFieldError("password", response.data.Message);
      return;
    }
    loading.value = false;
    authStore.setToken(response.data.Data.Token);

    router.push("/");
  } catch (e) {
    console.error("Fetch error:", e);
  }
});
onMounted(async () => {
  if (sessionStorage.getItem("registerSuccess")) {
    toast.add({
      severity: "success",
      summary: "Thành công",
      detail: "Tạo tài khoản thành công, vui lòng đăng nhập",
      life: 3000,
    });
    sessionStorage.removeItem("registerSuccess");
  }
  if (sessionStorage.getItem("changePassword")) {
    toast.add({
      severity: "success",
      summary: "Thành công",
      detail: "Đổi mật khẩu thành công, vui lòng đăng nhập lại",
      life: 3000,
    });
    sessionStorage.removeItem("changePassword");
  }
});
</script>
