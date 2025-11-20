<template>
  <div>
    <input v-model.number="amount" placeholder="Nhập số tiền" />
    <button @click="pay">Thanh toán VNPAY</button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const amount = ref(0);

async function pay() {
  const res = await fetch(
    "https://karson-semicathartic-nondeprecatively.ngrok-free.dev/api/vnpay/create",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(amount.value),
    }
  );
  const data = await res.json();
  if (data.paymentUrl) {
    window.location.href = data.paymentUrl;
  } else {
    alert("Tạo payment URL lỗi");
  }
}
</script>
