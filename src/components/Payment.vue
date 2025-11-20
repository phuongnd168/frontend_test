<template>
  <button @click="pay">Thanh toán VNPAY</button>
</template>

<script setup>
const pay = async () => {
  const res = await axios.post("https://your-api.com/api/vnpay/create", {
    amount: 50000,
    orderInfo: "Thanh toan don hang 123",
  });

  window.location.href = res.data.paymentUrl;
};
</script>
