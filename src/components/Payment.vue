<template>
  <button @click="pay">Thanh toán VNPAY</button>
</template>

<script setup>
import { data } from "autoprefixer";
import axios from "axios";

const pay = async () => {
  const res = await axios.post(
    "https://karson-semicathartic-nondeprecatively.ngrok-free.dev/api/vnpay/create",
    {
      amount: 50000,
      orderInfo: "Thanh toan don hang 123",
    }
  );
  console.log(res.data);
  // window.location.href = res.data.paymentUrl;
};
</script>
