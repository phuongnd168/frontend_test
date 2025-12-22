<template>
  <div>
    <label>Amount (VND):</label>
    <input v-model.number="amount" type="number" placeholder="100000" />

    <label>Order ID:</label>
    <input v-model="orderId" type="text" placeholder="ORDER123" />

    <button @click="pay">Pay with VNPay</button>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";

const amount = ref(100000);
const orderId = ref("ORDER123");

const pay = async () => {
  try {
    // gọi backend tạo URL VNPay

    const response = await axios.post(
      `https://karson-semicathartic-nondeprecatively.ngrok-free.dev/api/payment/vnpay/create?amount=${amount.value}&orderId=${orderId.value}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );
    const data = await response.json();
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
