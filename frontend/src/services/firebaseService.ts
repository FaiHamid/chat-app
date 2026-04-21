import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage();

const handleSave = async (file: File) => {
  if (!file) return;

  try {
    const storageRef = ref(storage, `avatars/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("URL завантаження:", downloadURL);

    return downloadURL;

  } catch (error) {
    console.error("Помилка під час завантаження файлу:", error);
  }
};

const handleDelete = async (fileName: string) => {
  
  const storageRef = ref(storage, `avatars/${fileName}`);

  try {
    await deleteObject(storageRef); 
    console.log("Файл успішно видалено:", fileName);
  } catch (error) {
    console.error("Помилка під час видалення файлу:", error);
  }
}

export const firebaseService = { handleSave, handleDelete };