// src/utils/imageAPI.ts
import axios from "axios";
import FormData from "form-data";

const GenerateImage = async (prompt: string) => {
  try {
    const form = new FormData();
    form.append("prompt", prompt);

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      form,
      {
        headers: {
          "x-api-key": process.env.ImageAPi,
          ...form.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );

    return response.data; // Buffer
  } catch (error: any) {
    console.error(
      "Error while generating Image:",
      error?.response?.data?.toString() || error.message
    );
    return null;
  }
};

const removeBackgroundImage = async (photoBuffer: Buffer) => {
  try {
    const form = new FormData();
    form.append("image_file", photoBuffer, {
      filename: "image.png",
      contentType: "image/png",
    });

    const response = await axios.post(
      "https://clipdrop-api.co/remove-background/v1",
      form,
      {
        headers: {
          "x-api-key": process.env.ImageAPi,
          ...form.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error while removing background:",
      error?.response?.data?.toString() || error.message
    );
    return null;
  }
};

export { GenerateImage, removeBackgroundImage };
