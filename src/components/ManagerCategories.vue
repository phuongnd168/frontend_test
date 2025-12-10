<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <Dialog
    v-model:visible="visible"
    modal
    :header="useCategory.getDialogTitle(mode)"
    :style="{ width: '30rem' }"
  >
    <Form @submit="onSubmit">
      <div class="p-2">
        <label for="username" class="text-lg">Tên danh mục VN</label>
        <InputText class="w-full" v-model="nameVi" v-bind="nameViAttrs" />
        <span class="text-red-500 text-sm"> {{ errors.nameVi }}</span>
      </div>
      <div class="p-2">
        <label for="email" class="text-lg">Tên danh mục EN</label>
        <InputText class="w-full" v-model="nameEn" v-bind="nameEnAttrs" />
        <span class="text-red-500 text-sm"> {{ errors.nameEn }}</span>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          label="Hủy"
          severity="secondary"
          @click="visible = false"
          variant="outlined"
        ></Button>
        <Button
          variant="outlined"
          type="submit"
          :label="mode === 'add' ? 'Thêm' : 'Cập nhật'"
          :loading="loading"
        ></Button>
      </div>
    </Form>
  </Dialog>

  <div class="card">
    <DataTable :value="useProduct.categories" tableStyle="min-width: 50rem">
      <template #header>
        <div class="flex justify-content-between">
          <label class="text-3xl font-bold text-blue-500">Danh sách danh mục </label>
          <Button
            label="Thêm"
            icon="pi pi-plus"
            severity="info"
            class="p-button-success p-button-sm"
            rounded
            @click="addCategory()"
          />
        </div>
      </template>
      <Column field="NameVi" header="Tên danh mục VN"></Column>
      <Column field="NameEn" header="Tên danh mục EN"></Column>
      <Column header="Thao tác">
        <template #body="{ data }">
          <div class="flex gap-2">
            <!-- Nút sửa -->
            <Button
              icon="pi pi-pencil"
              @click="updateCategory(data.Id)"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useProductStore } from "@/store/productStore";
import { useToast } from "primevue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import { useForm } from "vee-validate";
import { Form } from "vee-validate";
import { useCategoryStore } from "@/store/categoryStore";
import * as yup from "yup";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";

const mode = ref("add");
const confirm = useConfirm();
const toast = useToast();
const loading = ref(false);
const useProduct = useProductStore();
const useCategory = useCategoryStore();
const visible = ref(false);
const categoryId = ref(0);
onMounted(async () => {
  try {
    await useProduct.getCategory();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
});

const { defineField, errors, handleSubmit, resetForm } = useForm({
  validationSchema: yup.object({
    nameVi: yup.string().required(() => "Tên tiếng Việt không được để trống"),
    nameEn: yup.string().required(() => "Tên tiếng Anh không được để trống"),
  }),
});
const [nameVi, nameViAttrs] = defineField("nameVi");
const [nameEn, nameEnAttrs] = defineField("nameEn");

const addCategory = () => {
  mode.value = "add";
  resetForm();
  visible.value = true;
};

const updateCategory = async (id) => {
  await useCategory.getCategory(id);
  mode.value = "update";
  categoryId.value = id;
  nameEn.value = useCategory.category.NameEn;
  nameVi.value = useCategory.category.NameVi;
  visible.value = true;
};
const onSubmit = () => {
  handleSubmit(
    async (values) => {
      loading.value = true;

      const body = { nameEn: values.nameEn, nameVi: values.nameVi };
      try {
        if (mode.value === "add") {
          const result = await useCategory.addCategory(body);

          if (result) {
            toast.add({
              severity: "success",
              summary: "Thành công",
              detail: "Thêm danh mục thành công",
              life: 3000,
            });
            await useProduct.getCategory();
            visible.value = false;
          }
        } else {
          const result = await useCategory.updateCategory(categoryId.value, body);

          if (result) {
            toast.add({
              severity: "success",
              summary: "Thành công",
              detail: "Sửa danh mục thành công",
              life: 3000,
            });
            await useProduct.getCategory();
            visible.value = false;
          }
        }
      } catch (error) {
        console.error("Error fetching:", error);
        throw error;
      } finally {
        loading.value = false;
      }
    },
    (errs) => console.log("Errors:", errs)
  )();
};
const confirmDelete = (id) => {
  confirm.require({
    message: "Bạn chắc chắn muốn xóa danh mục này?",
    header: "Xóa danh mục",
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
        const result = await useCategory.deleteCategory(id);
        if (result) {
          toast.add({
            severity: "success",
            summary: "Thành công",
            detail: "Xóa danh mục thành công",
            life: 3000,
          });
          await useProduct.getCategory();
        }
      } catch (error) {
        console.error(error);
      }
    },
  });
};
</script>
