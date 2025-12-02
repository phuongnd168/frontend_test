import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadImage(file) {
  if (!file) return null;

  // Tạo đường dẫn cho file
  const imageRef = ref(storage, `images/${Date.now()}-${file.name}`);

  // Upload file
  const snapshot = await uploadBytes(imageRef, file);

  // Lấy URL để lưu vào DB
  const url = await getDownloadURL(snapshot.ref);

  return url;
}
