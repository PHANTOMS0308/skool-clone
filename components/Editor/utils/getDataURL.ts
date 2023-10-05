export default function getDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (typeof fileReader.result === "string") {
        resolve(fileReader.result);
      } else {
        reject(new Error("File reading failed"));
      }
    };
    fileReader.onerror = () => reject(new Error("File reading failed"));
    fileReader.readAsDataURL(file);
  });
}
