<script setup>
import Card from "primevue/card";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { Form } from "vee-validate";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const { locale } = useI18n();
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import RadioButton from "primevue/radiobutton";
import Button from "primevue/button";
import router from "@/router";
import { useLanguageStore } from "../store/languageStore";
import { useOrderStore } from "@/store/orderStore";

const orders = useOrderStore();

const languageStore = useLanguageStore();
const loading = ref(false);
const getBill = ref("noReceipt");

const setLocale = () => {
  languageStore.toggle();
  locale.value = languageStore.language;
};

const showBill = () => {
  if (getBill.value === "noReceipt") {
    return false;
  }
  return true;
};

onMounted(async () => {
  orders.sync();
  try {
    if (!languageStore.language) {
      localStorage.setItem("language", locale.value);
    }
    if (!sessionStorage.getItem("carts")) {
      sessionStorage.setItem("carts", JSON.stringify([]));
    }

    locale.value = languageStore.language;
  } catch (error) {
    console.error(error);
  }
});
const price = computed(() => orders.totalPrice);

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: yup.object({
    name: yup.string().required(() => t("message.requiredNameTitle")),
    phone: yup
      .string()
      .matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, {
        message: () => t("message.formatPhoneTitle"),
        excludeEmptyString: true,
      })
      .notRequired(),
    taxCode: yup.string().when({
      is: () => getBill.value === "getInvoice", // điều kiện phải validate
      then: (schema) =>
        schema
          .required(() => t("message.requiredTaxCode"))
          .matches(/^(?:\d{10}|\d{10}-\d{3}|\d{12})$/, () =>
            t("message.formatTaxCodeTitle")
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
});
const [phone, phoneAttrs] = defineField("phone");
const [name, nameAttrs] = defineField("name");

const [taxCode, taxCodeAttrs] = defineField("taxCode");
const [budgetRelationshipCode, budgetRelationshipCodeAttrs] = defineField(
  "budgetRelationshipCode"
);

const [companyName, companyNameAttrs] = defineField("companyName");
const [companyAddress, companyAddressAttrs] = defineField("companyAddress");
const values = reactive({});
const onSubmit = handleSubmit((data) => {
  if (getBill.value === "noReceipt") {
    values.name = data.name;
    values.phone = data.phone;
  } else {
    values.name = data.name;
    values.phone = data.phone;
    values.taxCode = data.taxCode;

    values.budgetRelationshipCode = data.budgetRelationshipCode;
    values.companyName = data.companyName;
    values.companyAddress = data.companyAddress;
  }

  showConfirm();
});

const nameDialog = ref("");
const visible = ref(false);
const showConfirm = () => {
  visible.value = true;

  nameDialog.value =
    t("message.yourOrderTitle") +
    " (" +
    (orders.countInCart ?? 0) +
    " " +
    t("message.orderUnit") +
    orders.addString(locale.value) +
    ")";
};

async function OrderComplete() {
  loading.value = true;
  const dataPatch = [];

  orders.carts.forEach((cart) => {
    dataPatch.push({
      id: cart.id,
      count: cart.count,
    });
  });

  const dataPost = [];
  orders.carts.forEach((cart) => {
    dataPost.push({
      id: cart.id,
      count: cart.count,
      price: cart.price,
      totalPrice: cart.price * cart.count,
      nameEn: cart.nameEn,
      nameVi: cart.nameVi,
      img: cart.img,
    });
  });

  const value = dataPost.map((x) => JSON.stringify(x)).join(",");
  const addOrder = await orders.addOrder(8, value);
  const updateQuantity = await orders.updateQuantity(dataPatch);
  if (addOrder && updateQuantity) {
    loading.value = false;
    orders.clear();
    sessionStorage.setItem("order", true);

    router.push({ name: "Home" });
  }
}
function goToHome() {
  router.push({ name: "Home" });
}
</script>
<template>
  <div class="flex justify-content-center">
    <Button
      class="m-2"
      icon="pi pi-arrow-left"
      @click="goToHome"
      severity="info"
      rounded
    />
    <div class="w-6">
      <h2>{{ $t("message.orderInfoTitle") }}</h2>
      <p>{{ $t("message.orderInfoSubTitle") }}</p>
    </div>

    <Button
      class="m-2"
      icon="pi pi-globe"
      severity="info"
      @click="setLocale()"
      :label="locale === 'vi' ? 'EN' : 'VI'"
      rounded
    />
  </div>
  <div class="flex justify-content-center">
    <Card class="m-2 w-7">
      <template #title>{{
        $t("message.yourOrderTitle") +
        " (" +
        (orders.countInCart ?? 0) +
        " " +
        $t("message.orderUnit") +
        orders.addString(locale) +
        ")"
      }}</template>
      <template #content>
        <Dialog
          v-model:visible="visible"
          modal
          :style="{ width: '480px' }"
          class="rounded-3xl overflow-hidden"
        >
          <!-- HEADER -->
          <template #header>
            <div class="flex items-center justify-between w-full">
              <h2 class="text-xl font-bold text-gray-800">
                {{ nameDialog }}
              </h2>
            </div>
          </template>

          <!-- BODY -->
          <div class="p-5 space-y-6">
            <!-- Danh sách sản phẩm -->
            <div class="space-y-4">
              <div
                v-for="product in orders.carts"
                :key="product.id"
                class="flex gap-3 bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200"
              >
                <img
                  :src="product.img"
                  class="w-16 h-16 object-cover rounded-lg shadow"
                  alt="product"
                />

                <div class="flex-1">
                  <div class="font-semibold text-gray-800">
                    {{ locale === "vi" ? product.nameVi : product.nameEn }}
                    {{
                      "(" +
                      product.price.toLocaleString("vi-VN") +
                      "đ" +
                      " x " +
                      product.count +
                      ")"
                    }}
                  </div>

                  <div class="text-blue-600 font-bold mt-1">
                    {{ (product.price * product.count).toLocaleString("vi-VN") }}đ
                  </div>
                </div>
              </div>
            </div>

            <!-- Thông tin khách hàng -->
            <div class="bg-white rounded-2xl p-4 shadow border border-gray-100 space-y-2">
              <h3 class="text-lg font-bold text-gray-800 mb-2">
                {{ $t("message.titleForm") }}
              </h3>

              <div class="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                <span class="text-gray-500">{{ $t("message.nameInputName") + ":" }}</span>
                <span class="font-medium text-gray-700">{{ values.name }}</span>
              </div>

              <div class="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                <span class="text-gray-500">{{
                  $t("message.nameInputPhone") + ":"
                }}</span>
                <span class="font-medium text-gray-700">{{ values.phone }}</span>
              </div>

              <div class="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                <span class="text-gray-500">{{
                  $t("message.nameInputTaxCode") + ":"
                }}</span>
                <span class="font-medium text-gray-700">{{ values.taxCode }}</span>
              </div>

              <div class="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                <span class="text-gray-500">{{
                  $t("message.nameInputBudgetRelationshipCode") + ":"
                }}</span>
                <span class="font-medium text-gray-700">{{
                  values.budgetRelationshipCode
                }}</span>
              </div>

              <div class="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                <span class="text-gray-500">{{
                  $t("message.nameInputCompanyName") + ":"
                }}</span>
                <span class="font-medium text-gray-700">{{ values.companyName }}</span>
              </div>

              <div class="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                <span class="text-gray-500">{{
                  $t("message.nameInputCompanyAddress") + ":"
                }}</span>
                <span class="font-medium text-gray-700">{{ values.companyAddress }}</span>
              </div>
            </div>

            <!-- Tổng cộng -->
            <div
              class="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t"
            >
              <span>{{ $t("message.totalPrice") + ":" }}</span>
              <span class="text-blue-600">{{ price.toLocaleString("vi-VN") }}đ</span>
            </div>
          </div>

          <!-- FOOTER -->
          <template #footer>
            <Button
              @click="OrderComplete()"
              rounded
              severity="info"
              :loading="loading"
              class="w-full"
              :label="$t('message.buttonOrderConfirmation')"
            />
          </template>
        </Dialog>

        <div v-for="product in orders.carts" class="flex justify-content-between">
          <div class="flex justify-content-start">
            <img
              alt="food"
              :src="product.img"
              class="w-[100px] h-[100px] object-cover rounded p-2"
            />
            <div class="flex flex-column-reverse gap-3">
              <p>{{ (product.price * product.count).toLocaleString("vi-VN") }}đ</p>
              <p>
                {{ locale === "vi" ? product.nameVi : product.nameEn }}
                {{ "x" + product.count }}
              </p>
            </div>
          </div>

          <div class="flex align-items-center gap-2">
            <Button
              rounded
              :disabled="orders.checkDisable(product)"
              @click="orders.removeFromCart(product)"
              icon="pi pi-minus m-2"
              severity="danger"
              variant="outlined"
            />

            <span class="m-2">{{ orders.countInProduct(product.id) }}</span>

            <Button
              @click="orders.addToCart(product)"
              icon="pi pi-plus m-2"
              severity="primary"
              variant="outlined"
              :disabled="orders.checkQuantity(product)"
              rounded
            />
            <Button
              @click="orders.deleteItem(product)"
              icon="pi pi-trash m-2"
              severity="danger"
              variant="outlined"
              rounded
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div v-if="!orders.countInCart" class="flex flex-column align-items-center">
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

  <div v-if="orders.countInCart" class="flex justify-content-center">
    <Card class="m-2 w-7">
      <template #title>{{ $t("message.titleForm") }}</template>
      <template #content>
        <Form @submit="onSubmit">
          <div class="field mb-3">
            <label for="name">{{ $t("message.nameInputName") }}</label>
            <InputText
              id="name"
              :placeholder="$t('message.placeholderInputName')"
              class="w-full"
              v-model="name"
              v-bind="nameAttrs"
            />
            <span class="text-red-500 text-sm"> {{ errors.name }}</span>
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
            <span class="text-red-500 text-sm"> {{ errors.phone }}</span>
          </div>

          <!-- Ghi chú -->
          <label>{{ $t("message.nameInputBill") }}</label>
          <div class="flex flex-wrap gap-4 p-2">
            <div class="flex items-center gap-2">
              <RadioButton value="noReceipt" v-model="getBill" />
              <label>{{ $t("message.nameRadioNoReceipt") }}</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton value="getInvoice" v-model="getBill" />
              <label>{{ $t("message.nameRadioNoGetInvoice") }}</label>
            </div>
          </div>
          <div v-if="showBill()">
            <div class="field mb-3">
              <label for="taxCode">{{ $t("message.nameInputTaxCode") }}</label>
              <InputText
                id="taxCode"
                class="w-full"
                v-model="taxCode"
                v-bind="taxCodeAttrs"
                :placeholder="$t('message.placeholderTaxCode')"
              />
              <span class="text-red-500 text-sm"> {{ errors.taxCode }}</span>
            </div>

            <div class="field mb-3">
              <label for="budgetRelationshipCode">{{
                $t("message.nameInputBudgetRelationshipCode")
              }}</label>
              <InputText
                id="budgetRelationshipCode"
                class="w-full"
                v-model="budgetRelationshipCode"
                v-bind="budgetRelationshipCodeAttrs"
                :placeholder="$t('message.placeholderBudgetRelationshipCode')"
              />
            </div>

            <div class="field mb-3">
              <label for="companyName">{{ $t("message.nameInputCompanyName") }}</label>
              <InputText
                id="companyName"
                class="w-full"
                v-model="companyName"
                v-bind="companyNameAttrs"
                :placeholder="$t('message.placeholderCompanyName')"
              />
            </div>

            <div class="field mb-3">
              <label for="companyAddress">{{
                $t("message.nameInputCompanyAddress")
              }}</label>
              <InputText
                id="companyAddress"
                class="w-full"
                v-model="companyAddress"
                v-bind="companyAddressAttrs"
                :placeholder="$t('message.placeholderCompanyAddress')"
              />
            </div>
          </div>
          <div class="flex justify-content-evenly align-center p-2">
            <Button
              @click="goToHome"
              class="col-5"
              :label="$t('message.buttonPreviewOrderInfo')"
              severity="contrast"
              rounded
            />
            <Button
              rounded
              severity="info"
              class="col-5"
              :label="$t('message.buttonNextOrderInfo')"
              type="submit"
            />
          </div>
        </Form>
      </template>
    </Card>
  </div>
</template>
