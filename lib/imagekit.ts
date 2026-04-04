import ImageKit from "imagekit";

export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function uploadImage(file: Buffer, fileName: string, folder: string = '/blogs') {
    try {
        const response = await imagekit.upload({
            file: file,
            fileName: fileName,
            folder: folder,
        });
        return response.url;
    } catch (error) {
        console.error("ImageKit upload error:", error);
        throw error;
    }
}
