import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    message: {
      title: "DSVN - Order Food On Train",
      subTitle: "Order on train SE1 - Car 1",
      buttonAdd: "Add",
      orderInfoTitle: "Order Information",
      orderInfoSubTitle: "Order on train",
      yourOrderTitle: "Your Order",
      orderUnit: "item",
      totalPrice: "Total",
      titleCartEmpty: "Cart is empty",
      subTitleCartEmpty:"Add your favorite food to cart!",
      titleForm: "Customer Information",
      nameInputName: "Full Name",
      nameInputPhone: "Phone Number",
      placeholderInputName: "Enter full name",
      placeholderInputPhone: "Enter phone number",
      requiredNameTitle: "Please enter your full name",
      requiredPhoneTitle: "Please enter your phone number",
       formatPhoneTitle: "Invalid phone number"
    }
  },
  vi: {
    message: {
      title: "DSVN - Đặt Đồ Ăn Trên Tàu",
      subTitle: "Đặt đồ trên tàu SE1 - Toa 1",
      buttonAdd: "Thêm",
      orderInfoTitle: "Thông tin đơn hàng",
      orderInfoSubTitle: "Đặt đồ trên tàu",
       yourOrderTitle: "Đơn hàng của bạn",
       orderUnit: "món",
       totalPrice: "Tổng cộng",
       titleCartEmpty: "Giỏ hàng trống",
       subTitleCartEmpty: "Thêm món ăn yêu thích vào giỏ hàng nhé!",
       titleForm: "Thông tin khách hàng",
       nameInputName: "Họ Tên",
       nameInputPhone: "Số điện thoại",
       placeholderInputName: "Nhập họ tên",
      placeholderInputPhone: "Nhập số điện thoại",
      requiredNameTitle: "Vui lòng nhập tên",
      requiredPhoneTitle: "Vui lòng nhập số điện thoại",
       formatPhoneTitle: "Số điện thoại không hợp lệ"
    }
  }
}

const i18n = createI18n({
  locale: 'vi',       // ngôn ngữ mặc định
  fallbackLocale: 'en',
  messages
})

export default i18n
