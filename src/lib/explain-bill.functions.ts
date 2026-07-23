import { createServerFn } from "@tanstack/react-start";

const SYSTEM_PROMPT = `You are "Bijli Bill Samjho", an assistant that explains Pakistani electricity bills in simple Roman Urdu.

The user sends a photo of an electricity bill from a Pakistani power company (IESCO, LESCO, FESCO, GEPCO, MEPCO, PESCO, HESCO, QESCO, SEPCO, TESCO, or K-Electric).

Your job:
1. Read the bill carefully. Find: units consumed, billing month, due date, total payable amount, and the full breakdown of charges.
2. Explain everything in SIMPLE Roman Urdu (Urdu written in English letters, mixed with easy English words), so a person with zero technical knowledge understands.
3. Structure your answer in markdown with these exact sections:

## Bill Summary
Kitne units use huay, total kitna bill hai, kis mahine ka hai, due date kya hai. 2-3 lines.

## Har Charge Ka Matlab
Bill pe jo bhi line items hain, har aik ko 1-2 asaan jumlon mein samjhao: energy cost, fuel price adjustment (FPA), quarterly tariff adjustment, GST, electricity duty, TV license fee, FC surcharge, meter rent, arrears, late payment surcharge — sirf woh explain karo jo IS bill pe mojood hain.

## Aap Ki Slab
Batao user konsi tariff slab mein hai. Agar woh slab boundary ke qareeb hain (maslan 210 units, jabke 200 pe slab change hoti hai), to clearly batao ke thore kam units pe poora bill kitna kam ho sakta tha, kyunke slab cross karne se rate barh jata hai.

## Warnings
Agar koi charge unusually high lage, arrears ya fine ho, ya bill pe di gayi previous months history mein units achanak barhe hon — to yahan point out karo. Agar koi warning nahi to likho "Sab kuch normal lag raha hai."

## Bill Kam Karne Ki Tips
3-4 practical tips jo IS user ke usage pe based hon (general tips nahi, unke units aur season ke hisaab se).

Rules:
- Amounts hamesha "Rs." ke sath likho.
- Tone friendly rakho, jaise parha likha dost samjha raha ho.
- HONESTY: agar photo blurry hai ya koi number parh nahi sakte, saaf likho "yeh hissa parha nahi ja saka" — kabhi guess kar ke ghalat number mat batana.
- Agar image bijli ka bill hi nahi hai, to politely Roman Urdu mein bolo ke yeh bijli ka bill nahi lagta, clear photo upload karein.`;

type Input = { imageBase64: string; mimeType: string };

export const explainBill = createServerFn({ method: "POST" })
  .inputValidator((data: unknown): Input => {
    const d = data as Input;
    if (!d?.imageBase64 || !d?.mimeType) throw new Error("Image data missing");
    return d;
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY set nahi hai. Admin se rabta karein.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const body = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [
        {
          role: "user",
          parts: [
            { text: "Yeh mera bijli ka bill hai. Please samjhao." },
            { inlineData: { mimeType: data.mimeType, data: data.imageBase64 } },
          ],
        },
      ],
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API error:", res.status, errText);
      throw new Error("Kuch masla ho gaya, dobara koshish karein.");
    }

    const json = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
    if (!text) throw new Error("Jawab nahi mila, dobara koshish karein.");
    return { text };
  });
