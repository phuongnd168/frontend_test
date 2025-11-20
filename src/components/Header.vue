<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import Button from "primevue/button";
import SelectButton from "primevue/selectbutton";
import { useI18n } from "vue-i18n";
import { toRaw } from "vue";
const { locale } = useI18n();
const language = ref(localStorage.getItem("language"));
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

import { useRouter } from "vue-router";
import Card from "./Card.vue";

const router = useRouter();

import axios from "axios";

const API_BASE_URL = "https://karson-semicathartic-nondeprecatively.ngrok-free.dev/api";

const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);

    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
const getProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);

    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
const categories = reactive([]);
const products = reactive([]);
onMounted(async () => {
  try {
    if (!localStorage.getItem("language")) {
      localStorage.setItem("language", locale.value);
    }
    if (!sessionStorage.getItem("carts")) {
      sessionStorage.setItem("carts", JSON.stringify([]));
    }
    locale.value = localStorage.getItem("language");
    const categoriesValue = await getCategories();
    categories.value = categoriesValue.Data;

    const productsValue = await getProducts();
    products.value = productsValue.Data;
  } catch (error) {
    console.error(error);
  }
});

const categoryId = ref(1);

const filter = (categoryId) => {
  return products.value?.filter((product) => {
    return toRaw(product.Categories).some((x) => x.Id === categoryId);
  });
};

const count = ref(0);

const data = sessionStorage.getItem("carts");
const carts = reactive(JSON.parse(data) ?? []);
carts.forEach((cart) => {
  count.value += cart.count;
});
function handlePrice(quantity) {
  count.value = quantity;
}

function goToOrderInfo() {
  router.push("order-info");
}
</script>

<template>
  <div>
    <h2>{{ $t("message.title") }}</h2>
    <p>{{ $t("message.subTitle") }}</p>
  </div>
  <div class="flex justify-content-between">
    <SelectButton
      :options="categories.value"
      :optionLabel="language === 'vi' ? 'NameVi' : 'NameEn'"
      optionValue="Id"
      v-model="categoryId"
      aria-labelledby="basic"
      allowEmpty
    />
    <div class="cart-icon relative">
      <Button
        class="m-2"
        icon="pi pi-globe"
        :label="language === 'vi' ? 'EN' : 'VI'"
        @click="setLocale()"
        severity="info"
      />
      <Button
        @click="goToOrderInfo"
        class="m-2"
        icon="pi pi-shopping-cart"
        :disabled="!count"
        severity="info"
      />
      <span v-show="count" class="badge">{{ count }}</span>
    </div>
  </div>

  <Card @data="handlePrice" :products="filter(categoryId)" :language="language" />
</template>

<style>
h2 {
  color: #006dae;
}
.cart-icon {
  position: relative;
  display: inline-block;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #007bff; /* màu xanh */
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 50%;
  padding: 3px 7px;
  line-height: 1;
}
</style>
