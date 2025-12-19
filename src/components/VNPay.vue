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
import { ref } from "vue";

const amount = ref(100000);
const orderId = ref("ORDER123");

const pay = async () => {
  try {
    const res = await fetch(
      `https://karson-semicathartic-nondeprecatively.ngrok-free.dev/api/payment/vnpay/create?amount=${amount.value}&orderId=${orderId.value}`,
      { method: "POST" }
    );
    const data = await res.json();
    if (data.paymentUrl) {
      // Redirect sang VNPay sandbox
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

<style scoped>
input {
  margin: 5px;
}
button {
  margin-top: 10px;
  padding: 8px 16px;
}
</style>
