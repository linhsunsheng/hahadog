import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

const ALLOWED = new Set(["image/png","image/jpeg","image/webp"]);

export async function uploadDogPhoto(uid: string, dogId: string, file: File) {
  if (!ALLOWED.has(file.type)) {
    throw new Error("Please upload a PNG or JPG photo (WEBP also OK). SVG is not supported.");
  }
  const ext =
    file.type === "image/png" ? "png" :
    file.type === "image/webp" ? "webp" : "jpg";

  const r = ref(storage, `dog_photos/${uid}/${dogId}.${ext}`);
  const snap = await uploadBytes(r, file, { contentType: file.type });
  const url = await getDownloadURL(snap.ref);
  return { path: r.fullPath, url };
}
