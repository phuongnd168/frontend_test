<template>
  <Dialog v-model:visible="visible" modal :header="nameDialog" :style="{ width: '30vw' }">
    <img :src="selectedImage" class="w-full border-round" />
  </Dialog>
  <div class="grid m-3">
    <div class="col-4" v-for="product in products" :key="product.id">
      <Card class="shadow-3 hover-lift transition-all duration-300">
        <template #header>
          <img
            @click="showImage(product.Img, product.NameVi, product.NameEn, product.Price)"
            class="product-card"
            alt="food"
            :src="product.Img"
          />
        </template>

        <template #title>{{
          props.language === "vi" ? product.NameVi : product.NameEn
        }}</template>
        <template #subtitle>{{ product.Price.toLocaleString("vi-VN") }}đ</template>

        <template #content>
          <Button
            @click="removeCart(product)"
            v-if="check(product)"
            icon="pi pi-minus m-2"
            severity="secondary"
            style="height: 40px"
          />

          <span class="m-2" v-if="check(product)">{{ count(product) }}</span>

          <Button
            @click="addCart(product)"
            v-if="check(product)"
            icon="pi pi-plus m-2"
            severity="secondary"
            style="height: 40px"
          />

          <Button
            severity="info"
            v-if="!check(product)"
            icon="pi pi-plus"
            :label="$t('message.buttonAdd')"
            @click="addCart(product)"
            style="height: 40px"
          />
        </template>
        <template #footer> </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import Card from "primevue/card";
import Button from "primevue/button";
import { onMounted, reactive, ref, watch } from "vue";
import { defineEmits } from "vue";

import Dialog from "primevue/dialog";
const emit = defineEmits(["data"]);

const props = defineProps({
  products: Array,
  language: String,
});

const data = sessionStorage.getItem("carts");
const carts = reactive(JSON.parse(data) ?? []);

const addCart = (product) => {
  if (carts?.length) {
    const index = carts.findIndex((cart) => cart.id === product.Id);

    if (index >= 0) {
      carts[index].count += 1;
      return;
    }
    carts.push({
      id: product.Id,
      nameVi: product.NameVi,
      nameEn: product.NameEn,
      img: product.Img,
      price: product.Price,
      count: 1,
    });
    return;
  }
  console.log(carts);
  carts.push({
    id: product.Id,
    nameVi: product.NameVi,
    nameEn: product.NameEn,
    img: product.Img,
    price: product.Price,
    count: 1,
  });
};
const removeCart = (product) => {
  if (carts?.length) {
    const index = carts?.findIndex((cart) => cart.id === product.Id);
    if (index >= 0) {
      if (carts[index].count === 1) {
        carts.splice(index, 1);
        return;
      }
      carts[index].count -= 1;

      return;
    }
  }
};
const check = (product) => {
  return carts?.some((cart) => cart.id === product.Id);
};

watch(
  carts,
  () => {
    sessionStorage.setItem("carts", JSON.stringify(carts));

    let quantity = 0;

    carts.forEach((cart) => {
      quantity += cart.count;
    });
    emit("data", quantity);
  },
  { deep: true }
);
const count = (product) => {
  let count = null;
  carts?.find((cart) => {
    if (cart.id === product.Id) {
      count = cart.count;
    }
  });
  return count;
};

const nameDialog = ref("");
const visible = ref(false);
const selectedImage = ref("");

const showImage = (productImg, productNameVi, productNameEn, productPrice) => {
  selectedImage.value = productImg;
  visible.value = true;
  nameDialog.value =
    (props.language === "vi" ? productNameVi : productNameEn) +
    (props.language === "vi" ? " - Giá: " : " - Price: ") +
    productPrice.toLocaleString("vi-VN") +
    "đ";
};
</script>
<style>
.product-card {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}
.hover-lift {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}
.p-dialog .p-dialog-mask {
  background-color: white !important;
}
.hover-lift:hover {
  transform: translateY(-5px);
}
</style>
