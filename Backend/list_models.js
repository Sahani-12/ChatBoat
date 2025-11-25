// 1. Dotenv ko sabse upar load karo
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// 2. API key ko environment variables se nikalo
const apiKey = process.env.GEMINI_API_KEY;

// Check karo ki key load hui ya nahi
if (!apiKey) {
  console.error("Galti: .env file se API Key nahi mili!");
  process.exit(1);
}

// 3. Google AI client ko initialize karo
const genAI = new GoogleGenerativeAI(apiKey);

async function runDemo() {
  try {
    // Model select karo (Flash model free tier ke liye best hai)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = "koi joke batao computer science ke baare mein englis mein";

    console.log("Jawab ka intezaar kar raha hoon...");

    // API ko request bhejo
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Jawab print karo
    console.log("\n--- Gemini ka Jawab ---");
    console.log(text);
    console.log("-----------------------");
  } catch (error) {
    console.error("\nKoi gadbad ho gayi:");
    console.error(error.message); // Sirf main error message dikhayega
  }
}

runDemo();
