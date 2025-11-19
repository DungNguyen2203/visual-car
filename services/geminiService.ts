import { GoogleGenAI, Type, Schema } from "@google/genai";
import { VehicleAnalysis } from "../types";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the schema for the JSON output
const vehicleSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isVehicle: {
      type: Type.BOOLEAN,
      description: "True if the image contains a vehicle (car, truck, motorcycle, bus), false otherwise.",
    },
    make: {
      type: Type.STRING,
      description: "Manufacturer of the vehicle (e.g., Toyota, BMW, VinFast).",
    },
    model: {
      type: Type.STRING,
      description: "Model name of the vehicle (e.g., Camry, X5, VF8).",
    },
    yearRange: {
      type: Type.STRING,
      description: "Approximate generation or year range (e.g., 2020-2024).",
    },
    type: {
      type: Type.STRING,
      description: "Body type of the vehicle (e.g., Sedan, SUV, Coupe, Truck).",
    },
    color: {
      type: Type.STRING,
      description: "Visual color of the vehicle.",
    },
    estimatedPrice: {
      type: Type.STRING,
      description: "Estimated market price range in USD or VND.",
    },
    features: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of visible features (e.g., Sunroof, LED headlights, Alloy wheels).",
    },
    description: {
      type: Type.STRING,
      description: "A comprehensive summary of the vehicle in Vietnamese.",
    },
    performance: {
      type: Type.OBJECT,
      properties: {
        topSpeed: { type: Type.STRING, description: "Estimated top speed (km/h)." },
        acceleration: { type: Type.STRING, description: "0-100 km/h time." }
      }
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: "Confidence level of the identification from 0 to 100.",
    }
  },
  required: ["isVehicle", "make", "model", "yearRange", "type", "description", "confidenceScore"],
};

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<VehicleAnalysis> => {
  try {
    // Prepare the prompt and image data
    const prompt = "Hãy phân tích hình ảnh này. Nếu đó là một chiếc xe, hãy cung cấp thông tin chi tiết về hãng, mẫu xe, năm sản xuất, màu sắc và các tính năng. Trả lời bằng tiếng Việt.";
    
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: vehicleSchema,
      },
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("Không nhận được phản hồi từ AI.");
    }

    const data = JSON.parse(textResponse) as VehicleAnalysis;
    return data;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Đã xảy ra lỗi khi phân tích hình ảnh.");
  }
};