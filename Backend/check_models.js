import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("Checking available models...");

async function listModels() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    console.log("\n--- AAPKE LIYE AVAILABLE MODELS ---");
    if (data.models) {
        // Sirf wahi models dikhayenge jo text generate kar sakte hain
        data.models.forEach(model => {
            if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes("generateContent")) {
                // Model ka poora naam (jaise 'models/gemini-1.5-flash') se 'models/' hata kar dikhate hain
                console.log(`✅ ${model.name.replace('models/', '')}`);
            }
        });
    } else {
        console.log("Koi model nahi mila. Shayad API Key mein dikkat hai.");
    }
    console.log("-----------------------------------\n");
    
  } catch (error) {
    console.error("Error aagaya:", error.message);
  }
}

listModels();