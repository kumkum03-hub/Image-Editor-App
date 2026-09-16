import { FabricImage } from "fabric";

export const createFabricImageFromFile = async (
  file: File
): Promise<FabricImage> => {
  const imageURL = URL.createObjectURL(file);

  try {
    const image = await FabricImage.fromURL(imageURL);

    return image;
  } finally {
    URL.revokeObjectURL(imageURL);
  }
};

export const getImageDimensions = (
  image: FabricImage
) => {
  return {
    width: image.width || 800,
    height: image.height || 600,
  };
};