/**
 * Compresses an image file to reduce its size while maintaining quality
 * @param file - The original image file
 * @param maxSizeMB - Maximum size in megabytes (default 4MB)
 * @param maxWidthOrHeight - Maximum width or height in pixels (default 2048)
 * @returns Promise that resolves to compressed File
 */
export async function compressImage(
  file: File,
  maxSizeMB: number = 4,
  maxWidthOrHeight: number = 2048
): Promise<File> {
  // If file is already small enough, return it as-is
  if (file.size <= maxSizeMB * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidthOrHeight) {
            height = (height * maxWidthOrHeight) / width;
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width = (width * maxWidthOrHeight) / height;
            height = maxWidthOrHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Start with high quality and reduce if needed
        let quality = 0.9;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to compress image"));
                return;
              }

              // If still too large and quality can be reduced, try again
              if (blob.size > maxSizeMB * 1024 * 1024 && quality > 0.5) {
                quality -= 0.1;
                tryCompress();
                return;
              }

              // Create new File from blob
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg", // Always convert to JPEG for better compression
                lastModified: Date.now(),
              });

              console.log(
                `[Image Compression] Original: ${(file.size / 1024 / 1024).toFixed(2)}MB, Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB, Quality: ${quality}`
              );

              resolve(compressedFile);
            },
            "image/jpeg",
            quality
          );
        };

        tryCompress();
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}
