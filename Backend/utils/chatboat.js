// file: /utils/chatboat.js
import "dotenv/config";

// Is function ko sirf message se matlab hai
const getchatbotResponse = async (message) => {
  try {
    // 1. 'req.body.message' ki zaroorat nahi, 'message' seedha aa raha hai
    // const userMessage = req.body.message; // <-- YEH LINE HATA DEIN

    const apiKey = process.env.GEMINI_API_KEY;
    const model = "gemini-2.0-flash"; 

    // 2. Google ko request bhej di
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // ... (Bonus Tip neeche dekhein, yeh body galat ho sakti hai)
          // Yeh Gemini API ke liye sahi format hai:
          "contents": [
            {"role": "user", "parts": [{"text": message}]}
          ]
        }),
      }
    );

    const data = await response.json();

    // 3. Jawab seedha return kar diya
    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    // 4. Error ko console par dikhao aur 'throw' karo
    console.error("Gemini API Error:", error.message);
    // 'res.status' yahan use na karein. Error ko wapas route par bhej dein.
    throw new Error("Error fetching response from Gemini");
  }
};

export default getchatbotResponse;