<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>

  <div class="card">
    <DataTable
      @sort="onSort"
      :value="productStore.products"
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div class="flex justify-content-between">
          <label class="text-3xl font-bold text-blue-500">Danh sách sản phẩm </label>
          <Button
            label="Thêm"
            icon="pi pi-plus"
            severity="info"
            class="p-button-success p-button-sm"
            rounded
            @click="addProduct()"
          />
        </div>
        <div class="flex items-center justify-center">
          <InputText type="text" v-model="keyword" placeholder="Tìm kiếm..." />
        </div>
      </template>

      <Column
        sortField="nameVi"
        sortable
        field="NameVi"
        header="Tên sản phẩm VN"
      ></Column>
      <Column
        field="NameEn"
        sortField="nameEn"
        sortable
        header="Tên sản phẩm EN"
      ></Column>
      <Column header="Ảnh">
        <template #body="slotProps">
          <img
            :src="`${slotProps.data.Img}`"
            :alt="slotProps.data.Img"
            class="w-20 h-20 object-cover rounded"
          />
        </template>
      </Column>
      <Column sortField="price" sortable field="Price" header="Giá">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.Price) }}
        </template></Column
      >
      <Column sortField="quantity" sortable field="Quantity" header="Số lượng"></Column>
      <Column field="Categories" header="Danh mục">
        <template #body="{ data }">
          <MultiSelect
            v-model="data.CategoriesSelected"
            :options="productStore.categories"
            optionLabel="NameVi"
            filter
            placeholder="Select Categories"
            :maxSelectedLabels="2"
            class="w-100 truncate"
          />
        </template>
      </Column>
      <Column header="Thao tác">
        <template #body="{ data }">
          <div class="flex gap-2">
            <!-- Nút sửa -->
            <Button
              icon="pi pi-pencil"
              @click="updateProduct(data.Id)"
              class="p-button-sm p-button-rounded p-button-warn"
            />
            <!-- Nút xóa -->
            <Button
              icon="pi pi-trash"
              @click="confirmDelete(data.Id)"
              class="p-button-sm p-button-rounded p-button-danger"
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <Paginator
      :first="(page - 1) * rows"
      :rows="2"
      :totalRecords="length"
      @page="onPageChange"
      :rowsPerPageOptions="[2, 5, 10]"
    ></Paginator>
  </div>
</template>

<script setup>
import MultiSelect from "primevue/multiselect";
import { useRouter } from "vue-router";
import { ref, onMounted, watch } from "vue";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Button from "primevue/button";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import Paginator from "primevue/paginator";
import { useProductStore } from "@/store/productStore";
import InputText from "primevue/inputtext";
import _ from "lodash";

const confirm = useConfirm();
const toast = useToast();
const router = useRouter();
const loading = ref(false);
const keyword = ref("");
const productStore = useProductStore();
const rows = ref(2);
const page = ref(1);
const length = ref(0);
const sortField = ref(null);
const sortOrder = ref(null);

const debouncedSearch = _.debounce(async () => {
  page.value = 1;
  await productStore.getProductToFilters(
    rows.value,
    page.value,
    keyword.value,
    sortField.value,
    sortOrder.value
  );
  length.value = productStore.productLength;
  productStore.getCategoryName();
}, 300);

watch(keyword, () => {
  debouncedSearch();
});
const onPageChange = async (event) => {
  rows.value = event.rows;
  page.value = event.page + 1;
  await productStore.getProductToFilters(
    rows.value,
    page.value,
    keyword.value,
    sortField.value,
    sortOrder.value
  );
  length.value = productStore.productLength;
  productStore.getCategoryName();
};

const onSort = async (event) => {
  sortField.value = event.sortField;
  sortOrder.value = event.sortOrder;
  await productStore.getProductToFilters(
    rows.value,
    page.value,
    keyword.value,
    event.sortField,
    event.sortOrder
  );
  productStore.getCategoryName();
};
onMounted(async () => {
  if (sessionStorage.getItem("addProduct")) {
    toast.add({
      severity: "success",
      summary: "Thành công",
      detail: "Thêm sản phẩm thành công",
      life: 3000,
    });
  }
  sessionStorage.removeItem("addProduct");
  try {
    loading.value = true;
    await productStore.getProduct();
    productStore.products = [];
    await productStore.getCategory();
    await productStore.getProductToFilters(2, 1, "");
    length.value = productStore.productLength;
    productStore.getCategoryName();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  } finally {
    loading.value = false;
  }
});
const formatCurrency = (value) => {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};
const updateProduct = (id) => {
  router.push("/manager-products/update/" + id);
};
const confirmDelete = (id) => {
  confirm.require({
    message: "Bạn chắc chắn muốn xóa sản phẩm này?",
    header: "Xóa sản phẩm",
    icon: "pi pi-info-circle",
    rejectLabel: "Quay lại",
    rejectProps: {
      label: "Quay lại",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Xoá",
      severity: "danger",
    },
    accept: async () => {
      try {
        const result = await productStore.deleteProduct(id);
        if (result) {
          productStore.products = productStore.products.filter((p) => p.Id !== id);
        }
      } catch (error) {
        console.error(error);
        alert("Xóa thất bại!");
      }
      toast.add({
        severity: "success",
        summary: "Thành công",
        detail: "Xóa sản phẩm thành công",
        life: 3000,
      });
    },
  });
};

const addProduct = () => {
  router.push("/manager-products/add");
};
</script>
