import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a t-shirt design image using the Gemini API.
 * @param userPrompt The user's creative idea for the shirt.
 * @param previousPrompts An array of recent prompts to provide style context.
 * @returns A base64 encoded string of the generated PNG image with a transparent background.
 */
export const generateShirtImage = async (userPrompt: string, previousPrompts?: string[]): Promise<string> => {
  try {
    let fullPrompt = `Create a professional, high-resolution graphic for a t-shirt, suitable for e-commerce. The design should be clean, modern, and centered, featuring: "${userPrompt}".
    The background MUST be transparent. Only the core design elements should be present.
    Use vibrant colors and clean lines, ensuring the artwork is visually balanced and appealing for apparel. The style should be reminiscent of top-selling graphic tees.
    Avoid adding any text unless explicitly requested in the user's prompt.`;
    
    if (previousPrompts && previousPrompts.length > 0) {
      const history = previousPrompts.join('; ');
      fullPrompt += `\n\nFor additional context, the user has previously created designs with these themes: "${history}". Use this style history to inform the new design's aesthetic, but ensure the new prompt "${userPrompt}" is the primary focus.`;
    }
    
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      throw new Error("Image generation failed, no images returned.");
    }
  } catch (error) {
    console.error("Error generating image with Gemini API:", error);
    throw new Error("Failed to generate image. The model may have refused the prompt. Please try a different idea.");
  }
};

/**
 * Generates a photorealistic mockup of a model wearing a sweater with the given design.
 * @param designImageBase64 The base64 encoded string of the t-shirt graphic (PNG format with transparency).
 * @param designPrompt The original prompt for the design to give context to the model.
 * @returns A base64 encoded string of the generated JPEG mockup image.
 */
export const generateModelMockup = async (designImageBase64: string, designPrompt: string): Promise<string> => {
  try {
    const base64Data = designImageBase64.split(',')[1];

    const designPart = {
      inlineData: {
        data: base64Data,
        mimeType: 'image/png',
      },
    };

    const textPart = {
        text: `Create a hyper-realistic, professional e-commerce product photo.
      - **Model Selection:** Randomly select a stylish young adult model, who can be male or female.
      - **Female Model Styling:** If the model is female, she MUST be wearing a large, long-sleeved sweater and a fashionable hijab that complements the outfit.
      - **Male Model Styling:** If the model is male, he MUST be wearing a large, long-sleeved sweater in a fashionable, slightly oversized style.
      - **Design & Theme:** The sweater showcases the provided graphic. The design is based on the theme: "${designPrompt}". The model's expression and pose should subtly reflect this theme (e.g., playful for a cartoon, thoughtful for an abstract design).
      - **Integration:** The provided graphic has a transparent background. Integrate it onto the sweater so it looks like a high-quality screen print. It must NOT look like a square sticker. The design should conform to the fabric's natural folds, texture, and lighting for maximum realism.
      - **Positioning & Fit:** The model should be centered, shown from the chest up, with a natural, confident pose.
      - **Lighting & Scene:** Use soft, professional studio lighting that highlights the design. The background should be a clean, minimalist, and slightly blurred setting (e.g., a modern studio, an aesthetic cafe).
      - **Sweater Color:** Choose a sweater color (neutral black, white, or heather grey) that best complements the graphic, making it the focal point.
      - **Overall Vibe:** The final image must be high-fashion, clean, and ready for a premium online store. The entire graphic must be clearly visible.`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: [designPart, textPart] },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
      }
    }

    throw new Error("Image generation failed, no image part returned from the model.");

  } catch (error) {
    console.error("Error generating model mockup with Gemini API:", error);
    throw new Error("Failed to create a model mockup. The model may have had an issue with the design. Please try again.");
  }
};


/**
 * Generates a list of creative, related t-shirt prompts based on a user's initial idea.
 * @param basePrompt The user's initial prompt.
 * @returns An array of new prompt strings.
 */
export const generateInspirationPrompts = async (basePrompt: string): Promise<string[]> => {
  try {
    const prompt = `Based on the t-shirt idea "${basePrompt}", generate a list of 5 more unique, creative, and visually interesting t-shirt design concepts. The concepts should be related but distinct.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompts: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: 'A creative t-shirt design prompt.'
              }
            }
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && result.prompts && Array.isArray(result.prompts)) {
      return result.prompts;
    } else {
      console.warn("Could not parse prompts from Gemini response:", jsonString);
      return [];
    }
  } catch (error) {
    console.error("Error generating inspiration prompts:", error);
    // Return empty array on failure to not break the flow
    return [];
  }
};

/**
 * Generates a catchy product description for a t-shirt.
 * @param designPrompt The prompt used to generate the t-shirt design.
 * @returns A string containing the product description.
 */
export const generateProductDescription = async (designPrompt: string): Promise<string> => {
    try {
        const prompt = `Generate a short, catchy, and fun e-commerce product description for a t-shirt with the following design: "${designPrompt}". The description should be 2-3 sentences long. Be creative and engaging.`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        return response.text.trim();

    } catch (error) {
        console.error("Error generating product description:", error);
        return "A unique design that's sure to turn heads. Express your style with this one-of-a-kind tee, crafted just for you.";
    }
};