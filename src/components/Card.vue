<template>
  <Dialog v-model:visible="visible" modal :header="nameDialog" :style="{ width: '30vw' }">
    <img :src="selectedImage" class="w-full border-round" />
  </Dialog>
  <div class="grid m-3">
    <div class="col-4" v-for="product in products" :key="product.id">
      <Card
        class="rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-3"
        style="white-space: nowrap"
      >
        <template #subtitle>
          <div class="flex justify-content-between align-items-center">
            <div class="flex align-items-center">
              <img
                @click="
                  showImage(product.Img, product.NameVi, product.NameEn, product.Price)
                "
                class="w-[100px] h-[100px] object-cover rounded"
                alt="food"
                :src="product.Img"
              />
              <div class="p-2 p-2 min-w-0">
                <p
                  class="text-1xl font-bold inline-block max-w-[180px] whitespace-nowrap"
                >
                  {{ props.language === "vi" ? product.NameVi : product.NameEn }}
                </p>

                <p class="text-1xl font-bold">
                  {{ product.Price.toLocaleString("vi-VN") }}đ
                </p>
                <label
                  :class="
                    product.Quantity > 0
                      ? 'bg-green-100 text-sm p-1'
                      : 'bg-red-100 text-sm p-1'
                  "
                >
                  {{ $t("message.quantityTitle") + ": " + product.Quantity }}
                </label>
              </div>
            </div>
            <div>
              <Button
                @click="carts.remove(product)"
                v-if="carts.isAdded(product.Id)"
                icon="pi pi-minus m-2"
                severity="danger"
                variant="outlined"
                rounded
              />

              <span class="m-2" v-if="carts.isAdded(product.Id)">{{
                carts.getCount(product.Id)
              }}</span>

              <Button
                @click="carts.add(product)"
                v-if="carts.isAdded(product.Id)"
                icon="pi pi-plus m-2"
                severity="primary"
                variant="outlined"
                :disabled="carts.isMax(product)"
                rounded
              />

              <Button
                severity="danger"
                disabled="true"
                v-if="!product.Quantity"
                icon="pi pi-times"
                class="text-sm h-8"
                :label="$t('message.buttonSoldOut')"
                rounded
              />
              <Button
                v-if="product.Quantity && !carts.isAdded(product.Id)"
                icon="pi pi-plus"
                :label="$t('message.buttonAdd')"
                class="text-sm h-8"
                @click="carts.add(product)"
                rounded
              />
            </div></div
        ></template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import Card from "primevue/card";
import Button from "primevue/button";
import { ref, watch } from "vue";
import { defineEmits } from "vue";
import Dialog from "primevue/dialog";
import { useCartStore } from "@/store/cartStore";

const emit = defineEmits(["quantity"]);

const props = defineProps({
  products: Array,
  language: String,
});

const carts = useCartStore();

watch(
  carts,
  () => {
    const quantity = carts.totalQuantity;
    emit("quantity", quantity);
  },
  { deep: true }
);

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
