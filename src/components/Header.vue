<script setup>
import { onMounted, ref } from "vue";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import Button from "primevue/button";
import { useI18n } from "vue-i18n";
import { useLanguageStore } from "@/store/languageStore";
import { useProductStore } from "@/store/productStore";
import { useRouter } from "vue-router";
import Card from "./Card.vue";
import { useCartStore } from "@/store/cartStore";

const { locale, t } = useI18n();
const toast = useToast();
const languageStore = useLanguageStore();
const productStore = useProductStore();
const carts = useCartStore();
const router = useRouter();

const category = ref("All");
const count = ref(0);

const loading = ref(false);

const setLocale = () => {
  languageStore.toggle();
  locale.value = languageStore.language;
};

onMounted(async () => {
  carts.sync();

  count.value = carts.totalQuantity;
  loading.value = true;
  if (!languageStore.language) {
    localStorage.setItem("language", locale.value);
  }
  if (!sessionStorage.getItem("carts")) {
    sessionStorage.setItem("carts", JSON.stringify([]));
  }
  locale.value = languageStore.language;
  if (sessionStorage.getItem("order")) {
    toast.add({
      severity: "success",
      summary: t("message.orderSuccess"),
      detail: t("message.contentOrderSuccess"),
      life: 3000,
    });

    sessionStorage.removeItem("order");
  }
  const categories = await productStore.getCategory();
  const products = await productStore.getProduct();
  if (categories && products) {
    loading.value = false;
  }
});

function handleQuantity(quantity) {
  count.value = quantity;
}

function goToOrderInfo() {
  router.push("order-info");
}
</script>

<template>
  <Toast />

  <div class="p-2">
    <label class="text-2xl font-bold text-blue-600">{{ $t("message.title") }}</label>
  </div>
  <div>
    <label class="text-sm text-600">{{ $t("message.subTitle") }}</label>
  </div>
  <div class="flex justify-content-between">
    <Tabs v-model:value="category">
      <TabList>
        <Tab key="All" value="All">{{ locale === "vi" ? "Tất cả" : "All" }}</Tab>
        <Tab
          v-for="category in productStore.categories"
          :key="category.Id"
          :value="category.Id"
          >{{ locale === "vi" ? category.NameVi : category.NameEn }}</Tab
        >
      </TabList>
    </Tabs>

    <div class="flex">
      <Button class="m-2" icon="pi pi-receipt" severity="info" rounded />
      <Button
        class="m-2"
        icon="pi pi-globe"
        :label="locale === 'vi' ? 'EN' : 'VI'"
        @click="setLocale()"
        severity="info"
        rounded
      />
      <div class="relative w-fit">
        <Button
          @click="goToOrderInfo"
          class="m-2"
          icon="pi pi-shopping-cart"
          :disabled="!count"
          severity="info"
          rounded
        />

        <span
          class="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center"
          v-if="count"
        >
          {{ count }}
        </span>
      </div>
    </div>
  </div>
  <div>
    <!-- Loading spinner -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <i class="pi pi-spin pi-spinner text-3xl"></i>
    </div>

    <!-- Dữ liệu đã load xong -->
    <div v-else>
      <Card
        @quantity="handleQuantity"
        :products="productStore.filterByCategory(category)"
        :language="locale"
      />
    </div>
  </div>
</template>
