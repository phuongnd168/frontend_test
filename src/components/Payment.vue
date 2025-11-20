<template>
  <button @click="pay">Thanh toán VNPAY</button>
</template>

<script setup>
import axios from "axios";

const pay = async () => {
  const res = await axios.post(
    "https://karson-semicathartic-nondeprecatively.ngrok-free.dev/vnpay/create",
    {
      amount: 50000,
      orderInfo: "Thanh toan don hang 123",
    }
  );

  window.location.href = res.data.paymentUrl;
};
</script>
