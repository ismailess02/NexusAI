
import { GoogleGenAI } from "@google/genai";

export const geminiService = {
  async mergeImages(img1Base64: string, img2Base64: string, prompt: string, apiKey: string) {
    const ai = new GoogleGenAI({ apiKey });
    const cleanImg1 = img1Base64.split(',')[1] || img1Base64;
    const cleanImg2 = img2Base64.split(',')[1] || img2Base64;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: cleanImg1, mimeType: 'image/png' } },
          { inlineData: { data: cleanImg2, mimeType: 'image/png' } },
          { text: `Create a single, high-quality composite image that merges these two visuals. ${prompt}. Ensure artistic coherence and professional finish.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    let resultImage = '';
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        resultImage = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
    return resultImage;
  },

  async generateImage(prompt: string, resolution: "1K" | "2K" | "4K", apiKey: string) {
    const isHighRes = resolution === "2K" || resolution === "4K";
    const ai = new GoogleGenAI({ apiKey });
    
    // Instructions say: Upgrade to gemini-3-pro-image-preview for 2K/4K
    const modelName = isHighRes ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          ...(isHighRes ? { imageSize: resolution } : {})
        }
      }
    });

    let resultImage = '';
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        resultImage = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
    return resultImage;
  }
};
