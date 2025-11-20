<script setup>
import Card from "primevue/card";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { Form } from "vee-validate";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const { locale } = useI18n();
import InputText from "primevue/inputtext";
import RadioButton from "primevue/radiobutton";
import RadioButtonGroup from "primevue/radiobuttongroup";
import Button from "primevue/button";
import router from "@/router";
const formOfPayment = ref("cash");
onMounted(() => {
  try {
    if (!localStorage.getItem("language")) {
      localStorage.setItem("language", locale.value);
    }
    if (!sessionStorage.getItem("carts")) {
      sessionStorage.setItem("carts", JSON.stringify([]));
    }

    locale.value = localStorage.getItem("language");
  } catch (error) {
    console.error(error);
  }
});
const data = sessionStorage.getItem("carts");

const carts = reactive(JSON.parse(data) ?? []);
const language = ref(localStorage.getItem("language"));
const check = computed(() => {
  return carts?.length;
});
const setLocale = () => {
  if (language.value === "vi") {
    locale.value = "en";
    language.value = "en";
    localStorage.setItem("language", "en");
  } else {
    locale.value = "vi";
    language.value = "vi";
    localStorage.setItem("language", "vi");
  }
};
const addCart = (product) => {
  const index = carts.findIndex((cart) => cart.id === product.id);

  if (index >= 0) {
    carts[index].count += 1;
  }
};

const removeCart = (product) => {
  const index = carts.findIndex((cart) => cart.id === product.id);
  if (index >= 0) {
    carts[index].count -= 1;
  }
};
const deleteCart = (product) => {
  const index = carts.findIndex((cart) => cart.id === product.id);
  if (index >= 0) {
    carts.splice(index, 1);
  }
};
const checkDisable = (product) => {
  const index = carts.findIndex((cart) => cart.id === product.id);
  if (index >= 0 && carts[index].count === 1) {
    return true;
  }
  return false;
};
watch(
  carts,
  () => {
    sessionStorage.setItem("carts", JSON.stringify(carts));
  },
  { deep: true }
);
const price = computed(() => {
  let value = 0;
  carts?.forEach((cart) => {
    value += cart.price * cart.count;
  });
  return value;
});
const count = (product) => {
  let count = null;
  carts.find((cart) => {
    if (cart.id === product.id) {
      count = cart.count;
    }
  });
  return count;
};
const addString = () => (carts?.length > 1 && language.value === "en" ? "s" : "");

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: yup.object({
    name: yup.string().required(() => t("message.requiredNameTitle")),
    phone: yup
      .string()
      .required(() => t("message.requiredPhoneTitle"))
      .matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, () =>
        t("message.formatPhoneTitle")
      ),
  }),
});

const [phone, phoneAttrs] = defineField("phone");
const [name, nameAttrs] = defineField("name");

const onSubmit = handleSubmit((values, { resetForm }) => {
  console.log(values);
  resetForm();
});
function goToHome() {
  router.push({ name: "Home" });
}
</script>
<template>
  <div class="flex justify-content-center">
    <Button class="m-2" icon="pi pi-arrow-left" @click="goToHome" severity="info" />
    <div class="w-6">
      <h2>{{ $t("message.orderInfoTitle") }}</h2>
      <p>{{ $t("message.orderInfoSubTitle") }}</p>
    </div>

    <Button
      class="m-2"
      icon="pi pi-globe"
      severity="info"
      @click="setLocale()"
      :label="language === 'vi' ? 'EN' : 'VI'"
    />
  </div>
  <div class="flex justify-content-center">
    <Card class="m-2 w-7">
      <template #title>{{
        $t("message.yourOrderTitle") +
        " (" +
        (check ?? 0) +
        " " +
        $t("message.orderUnit") +
        addString() +
        ")"
      }}</template>
      <template #content>
        <div v-for="product in carts" class="flex justify-content-between">
          <div class="flex justify-content-start">
            <img alt="food" :src="product.img" class="product-card p-2" />
            <div class="flex flex-column-reverse gap-3">
              <p>{{ (product.price * product.count).toLocaleString("vi-VN") }}đ</p>
              <p>{{ language === "vi" ? product.nameVi : product.nameEn }}</p>
            </div>
          </div>

          <div class="flex align-items-center gap-2">
            <Button
              :disabled="checkDisable(product)"
              @click="removeCart(product)"
              icon="pi pi-minus m-2"
              severity="secondary"
              style="height: 40px"
            />

            <span class="m-2" style="min-width: 28px; text-align: center">{{
              count(product)
            }}</span>

            <Button
              @click="addCart(product)"
              icon="pi pi-plus m-2"
              severity="secondary"
              style="height: 40px"
            />
            <Button
              @click="deleteCart(product)"
              icon="pi pi-trash m-2"
              severity="secondary"
              style="height: 40px"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div v-if="!check" class="flex flex-column align-items-center">
          <span style="font-size: 2rem" class="pi pi-shopping-cart"></span>
          <p>{{ $t("message.titleCartEmpty") }}</p>
          <p>{{ $t("message.subTitleCartEmpty") }}</p>
        </div>
        <div class="flex justify-content-between">
          <p>{{ $t("message.totalPrice") + ":" }}</p>
          <p>{{ price.toLocaleString("vi-VN") }}đ</p>
        </div>
      </template>
    </Card>
  </div>

  <div v-if="check" class="flex justify-content-center">
    <Card class="m-2 w-7">
      <template #title>{{ $t("message.titleForm") }}</template>
      <template #content>
        <Form @submit="onSubmit">
          <div class="field mb-3">
            <label for="name">{{ $t("message.nameInputName") }}</label>
            <InputText
              id="name"
              :placeholder="$t('message.nameInputName')"
              class="w-full"
              v-model="name"
              v-bind="nameAttrs"
            />
            <span class="p-error"> {{ errors.name }}</span>
          </div>

          <div class="field mb-3">
            <label for="phone">{{ $t("message.nameInputPhone") }}</label>
            <InputText
              id="phone"
              class="w-full"
              v-model="phone"
              v-bind="phoneAttrs"
              :placeholder="$t('message.placeholderInputPhone')"
            />
            <span class="p-error"> {{ errors.phone }}</span>
          </div>

          <!-- Ghi chú -->

          <div class="flex flex-wrap gap-4">
            <div class="flex items-center gap-2">
              <RadioButton value="cash" v-model="formOfPayment" />
              <label>Tiền mặt</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton value="transfer" v-model="formOfPayment" />
              <label>Chuyển khoản</label>
            </div>
          </div>
          <div class="flex justify-content-evenly align-center p-2">
            <Button
              @click="goToHome"
              class="col-5"
              label="Quay lại"
              severity="contrast"
            />
            <Button severity="info" class="col-5" label="Tiếp tục" type="submit" />
          </div>
        </Form>
      </template>
    </Card>
  </div>
</template>
<style>
.product-card {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}
.p-error {
  color: red;
  font-size: 0.875rem;
}
</style>
