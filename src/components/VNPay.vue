<template>
  <Toast />

  <div>
    <label>Amount (VND):</label>
    <InputText type="number" v-model.number="amount" />
  </div>
  <div>
    <label>Order ID:</label>
    <InputText type="text" v-model="orderId" />
  </div>
  <div>
    <Button label="Success" @click="pay" severity="success" rounded />
  </div>
</template>

<script setup>
import Button from "primevue/button";
import InputText from "primevue/inputtext";

import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
const toast = useToast();
const route = useRoute();
const status = route.query.status;

const amount = ref(100000);
const orderId = ref("ORDER123");
onMounted(() => {
  if (status === "success") {
    toast.add({
      severity: "success",
      summary: "Thành công",
      detail: "Thanh toán thành công",
      life: 3000,
    });
  }
  if (status === "error") {
    toast.add({
      severity: "danger",
      summary: "Thành công",
      detail: "Thanh toán thất bại",
      life: 3000,
    });
  }
});
const pay = async () => {
  try {
    // gọi backend tạo URL VNPay
    const res = await fetch(
      `https://karson-semicathartic-nondeprecatively.ngrok-free.dev/api/payment/vnpay/create?amount=${amount.value}&orderId=${orderId.value}`,
      { method: "POST", headers: { "ngrok-skip-browser-warning": "69420" } }
    );
    const data = await res.json();
    if (data.paymentUrl) {
      // Chỉ redirect, không load JS VNPay
      window.location.href = data.paymentUrl;
    } else {
      alert("VNPay error: " + JSON.stringify(data));
    }
  } catch (err) {
    console.error(err);
    alert("Error calling backend");
  }
};
</script>
