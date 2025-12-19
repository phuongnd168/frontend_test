<template>
  <div class="flex justify-content-center align-items-center h-screen">
    <Card class="w-4 shadow-4 border-round-xl p-4">
      <template #title>
        <div class="text-center text-2xl font-bold mb-3">📝 Đăng ký</div>
      </template>

      <template #content>
        <Form @submit="onSubmit">
          <div class="field mb-4">
            <label for="fullName" class="font-semibold">Họ tên</label>
            <InputText
              id="fullName"
              v-model="fullName"
              v-bind="fullNameAttrs"
              class="w-full mt-2"
              placeholder="Nhập họ tên"
            />
            <span class="text-red-500 text-sm"> {{ errors.fullName }}</span>
          </div>
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
          <div class="field mb-4">
            <label for="confirmPassword" class="font-semibold">Mật khẩu</label>
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
            <span class="text-red-500 text-sm"> {{ errors.confirmPassword }}</span>
          </div>

          <Button
            label="Quay lại"
            class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
            icon="pi pi-sign-in"
            @click="login()"
          />

          <Button
            label="Đăng ký"
            class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md transition ml-3"
            severity="info"
            icon="pi pi-user-plus"
            type="submit"
          />
        </Form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";

import Card from "primevue/card";
import { useRouter } from "vue-router";
import Button from "primevue/button";

import Password from "primevue/password";
const router = useRouter();

import { Form } from "vee-validate";
import { useForm } from "vee-validate";
import * as yup from "yup";
import InputText from "primevue/inputtext";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
const toast = useToast();
const authStore = useAuthStore();
const loading = ref(false);
const login = () => {
  router.push("/login");
};
const { defineField, errors, handleSubmit, setFieldError } = useForm({
  validationSchema: yup.object({
    email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    fullName: yup.string().required("Vui lòng nhập họ tên"),
    password: yup
      .string()
      .required("Vui lòng nhập mật khẩu")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/,
        "Mật khẩu dài ít nhất 6 ký tự và phải có chữ hoa, chữ thường, số"
      ),
    confirmPassword: yup
      .string()
      .required("Vui lòng nhập mật khẩu lần 2")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/,
        "Mật khẩu dài ít nhất 6 ký tự và phải có chữ hoa, chữ thường, số"
      ),
  }),
});
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
const [fullName, fullNameAttrs] = defineField("fullName");
const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword");
const onSubmit = handleSubmit(async (values) => {
  const { email, password, fullName, confirmPassword } = values;
  loading.value = true;
  try {
    const response = await axios.post(
      `https://karson-semicathartic-nondeprecatively.ngrok-free.dev/api/auth/register`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        email,
        password,
        fullName,
        confirmPassword,
      }
    );
    if (response.data.Message === "Email đã tồn tại") {
      setFieldError("email", response.data.Message);
      return;
    }
    if (response.data.StatusCode === 400) {
      setFieldError("confirmPassword", response.data.Message);
      return;
    }

    sessionStorage.setItem("registerSuccess", true);
    router.push("/login");
  } catch (e) {
    console.error("Fetch error:", e);
  }
});
</script>
