import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory rate limiting store for API Security
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimits = new Map<string, RateLimitRecord>();

function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimits.get(key);
  if (!record || now > record.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) {
    return false;
  }
  record.count++;
  return true;
}

// Periodic cleanup of expired rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimits.entries()) {
    if (now > record.resetAt) {
      rateLimits.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Cryptographic hash for admin verification (Plaintext is never stored)
const ADMIN_SERVER_SALT = 'smartstudy_admin_salt_sec_2026';
const ADMIN_SERVER_HASH = '4fbab923fba1a9e733800b42545d22e22264bc45bae21e82365aef68cdeedf1f';

// Comprehensive Knowledge Generator for SmartStudy Platform
function generateSmartStudyKnowledgeReply(message: string): string {
  const q = message.toLowerCase().trim();

  // 0. Short greetings & small talk: strictly around 50-60 characters (৬০ অক্ষরের মেসেজ)
  if (
    q === 'হ্যালো' || q === 'হাই' || q === 'hello' || q === 'hi' || q === 'hey' ||
    q.includes('কেমন আছো') || q.includes('কেমন আছেন') || q.includes('ki koro') || 
    q.includes('কি খবর') || q.includes('সালাম') || q.includes('salam') || 
    q.includes('ধন্যবাদ') || q.includes('thanks') || q.length < 10
  ) {
    if (q.includes('কেমন')) {
      return 'আলহামদুলিল্লাহ ভালো আছি! পড়াশোনায় কী সাহায্য লাগবে বলুন?';
    }
    if (q.includes('ধন্যবাদ') || q.includes('thanks')) {
      return 'আপনাকেও অনেক ধন্যবাদ! শুভকামনা রইল আপনার পড়ালেখায়।';
    }
    return 'হ্যালো! আমি SmartStudy AI। কীভাবে সাহায্য করতে পারি?';
  }

  // 1. Rewards & Mega Scholarship Test 2026
  if (q.includes('পুরস্কার') || q.includes('স্কলারশিপ') || q.includes('reward') || q.includes('prize') || q.includes('কয়েন') || q.includes('টাকা') || q.includes('টেস্ট')) {
    return `🏆 **SmartStudy মেগা স্কলারশিপ ও পুরস্কার ২০২৬:**\n\n` +
      `১. **এইচএসসি ও এসএসসি মেগা স্কলারশিপ টেস্ট ২০২৬:**\n` +
      `   - **১ম পুরস্কার:** ল্যাপটপ + ৫০,০০০ টাকা নগদ বৃত্তি ও গোল্ড মেডেল।\n` +
      `   - **২য়-৫ম পুরস্কার:** ব্র্যান্ড ট্যাবলেট + ২৫,০০০ টাকা শিক্ষা অনুদান।\n` +
      `   - **শীর্ষ ১০০ জন:** জাতীয় মেধা সার্টিফিকেট ও এক বছরের ফ্রি ফুল-কোর্স অ্যাক্সেস।\n\n` +
      `২. **দৈনিক স্টাডি রিওয়ার্ড:**\n` +
      `   - প্রতিদিন অধ্যায়ের ভিডিও ক্লাস সম্পূর্ণ দেখলে **২০ কয়েন** জমা হয়।\n` +
      `   - কুইজ প্র্যাকটিসে প্রতিটি সঠিক উত্তরের জন্য **১০ কয়েন**।\n` +
      `   - কয়েন জমিয়ে বই, স্টাডি কিট ও প্রিমিয়াম কোর্স রিডিম করা যায়।\n\n` +
      `📌 *নিয়মিত ক্লাস করতে নিচের **'হোম'** বাটনে ট্যাপ করে আপনার শ্রেণির অধ্যায় নির্বাচন করুন!*`;
  }

  // 2. Bangla - অপরিচিতা (রবীন্দ্রনাথ ঠাকুর) & Literature
  if (q.includes('অপরিচিতা') || q.includes('কল্যাণী') || q.includes('অনুপম') || q.includes('শম্ভুনাথ') || q.includes('রবীন্দ্রনাথ') || q.includes('বাংলা')) {
    return `📚 **বাংলা ১ম পত্র: 'অপরিচিতা' (রবীন্দ্রনাথ ঠাকুর):**\n\n` +
      `• **উৎস ও প্রেক্ষাপট:** ১৩২১ বঙ্গাব্দে প্রমথ চৌধুরী সম্পাদিত 'সবুজ পত্র' পত্রিকায় প্রকাশিত হয়। যৌতুক প্রথার নির্মমতা ও তার বিরুদ্ধে নারীর আত্মমর্যাদাবোধ এই গল্পের মূল প্রতিপাদ্য।\n` +
      `• **প্রধান চরিত্রসমূহ:**\n` +
      `  - **কল্যাণী:** বলিষ্ঠ, আত্মমর্যাদাসম্পন্ন ও দেশব্রতে নিবেদিত নারী চরিত্র।\n` +
      `  - **অনুপম:** গল্পের কথক; এম.এ. পাস করেও মামাতন্ত্রের অধীন ও দুর্বল ব্যক্তিত্বের যুবক।\n` +
      `  - **শম্ভুনাথ সেন:** কল্যাণীর পিতা; আত্মমর্যাদাসম্পন্ন ও নির্ভীক ব্যক্তিত্ব।\n` +
      `  - **মামা:** অনুপমের অভিভাবক ও লোভী মানসিকতার প্রতীক।\n\n` +
      `• **মূল শিক্ষা:** বিয়েতে পণ দেওয়া ও নেওয়া দুটোই গর্হিত অপরাধ। কল্যাণী দেখিয়েছে কীভাবে আত্মমর্যাদা নিয়ে মাথা উঁচু করে দেশ ও সমাজের কল্যাণে বাঁচা যায়।`;
  }

  // 3. ICT - C Programming, HTML, Database
  if (q.includes('ict') || q.includes('আইসিটি') || q.includes('প্রোগ্রামিং') || q.includes('c ') || q.includes('কোড') || q.includes('লুপ') || q.includes('html')) {
    return `💻 **এইচএসসি আইসিটি (অধ্যায় ৫: সি প্রোগ্রামিং):**\n\n` +
      `**১ থেকে N পর্যন্ত সংখ্যার যোগফল নির্ণয়ের সি প্রোগ্রাম:**\n` +
      `\`\`\`c\n` +
      `#include <stdio.h>\n\n` +
      `int main() {\n` +
      `    int n, sum = 0;\n` +
      `    printf("n এর মান দিন: ");\n` +
      `    scanf("%d", &n);\n\n` +
      `    for (int i = 1; i <= n; i++) {\n` +
      `        sum += i;\n` +
      `    }\n\n` +
      `    printf("১ থেকে %d পর্যন্ত যোগফল: %d\\n", n, sum);\n` +
      `    return 0;\n` +
      `}\n` +
      `\`\`\`\n` +
      `💡 **গুরুত্বপূর্ণ টিপস:**\n` +
      `- \`for\` লুপে ৩টি অংশ: Initialization, Condition, Increment/Decrement।\n` +
      `- \`printf()\` আউটপুট প্রদর্শনের জন্য এবং \`scanf()\` ইনপুট গ্রহণের জন্য ব্যবহৃত হয়।\n` +
      `কোনো নির্দিষ্ট অ্যালগরিদম বা ফ্লোচার্ট বুঝতে চাইলে লিখুন!`;
  }

  // 4. Mathematics - Trigonometry, Algebra, Shortcuts
  if (q.includes('গণিত') || q.includes('অংক') || q.includes('math') || q.includes('ত্রিকোণমিতি') || q.includes('সূত্র') || q.includes('শর্টকাট')) {
    return `📐 **গণিতের জরুরি সূত্রাবলি ও টেকনিক:**\n\n` +
      `১. **ত্রিকোণমিতির মৌলিক সূত্র:**\n` +
      `   - $\\sin^2\\theta + \\cos^2\\theta = 1$\n` +
      `   - $\\sec^2\\theta - \\tan^2\\theta = 1$\n` +
      `   - $\\csc^2\\theta - \\cot^2\\theta = 1$\n\n` +
      `২. **বীজগণিতের বর্গ সূত্র:**\n` +
      `   - $(a + b)^2 = a^2 + 2ab + b^2$\n` +
      `   - $(a - b)^2 = a^2 - 2ab + b^2$\n` +
      `   - $a^2 - b^2 = (a + b)(a - b)$\n\n` +
      `⚡ **দ্রুত হিসাবের শর্টকাট:**\n` +
      `শেষে ৫ থাকা যেকোনো সংখ্যার বর্গ: যেমন $35^2 = (3 \\times 4) \\text{ এবং } 25 = 1225$।`;
  }

  // 5. English Grammar
  if (q.includes('english') || q.includes('ইংরেজি') || q.includes('tense') || q.includes('grammar') || q.includes('voice')) {
    return `📝 **English Grammar: Tense ও সহজ নিয়মাবলী:**\n\n` +
      `• **Present Indefinite:** Subject + $V_1$ (s/es if 3rd person singular) + Object.\n` +
      `  *Example:* She reads a book every morning.\n` +
      `• **Past Indefinite:** Subject + $V_2$ (Past form) + Object.\n` +
      `  *Example:* They won the tournament yesterday.\n` +
      `• **Future Indefinite:** Subject + will/shall + $V_1$ + Object.\n` +
      `  *Example:* We will attend the SmartStudy seminar.\n\n` +
      `যেকোনো Sentence এর Voice Change বা Narration সমাধান করতে বাক্যটি লিখে পাঠান!`;
  }

  // 6. General Greeting or Course Guidance
  return `👋 হ্যালো! আমি **SmartStudy AI** — আপনার সার্বক্ষণিক শিক্ষা সহায়ক।\n\n` +
    `আপনার প্রশ্ন: *"${message}"*\n\n` +
    `আমি নিচের বিষয়গুলোতে আপনাকে শতভাগ নির্ভুল তথ্য ও ব্যাখ্যা দিতে পারি:\n` +
    `• 🏆 **মেগা স্কলারশিপ টেস্ট ২০২৬ ও পুরস্কারের নিয়মাবলী**\n` +
    `• 📚 **৯ম-১০ম ও ১১শ-১২শ শ্রেণির বাংলা ১ম ও ২য় পত্র (অপরিচিতা সহ)**\n` +
    `• 💻 **এইচএসসি আইসিটি (সি প্রোগ্রামিং, এইচটিএমএল, ডাটাবেস)**\n` +
    `• 📐 **সাধারণ ও উচ্চতর গণিত সূত্র এবং শর্টকাট সমাধান**\n\n` +
    `আপনার নির্দিষ্ট কোনো পড়ালেখার প্রশ্ন থাকলে নিচে লিখে পাঠান, আমি এখনই বুঝিয়ে দেব!`;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '1mb' }));

  // Security headers middleware
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // Allow iframe embedding only for the dedicated ad-frame route
    if (!req.path.startsWith('/api/ad-frame') && !req.path.startsWith('/ad-frame.html')) {
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    }
    next();
  });

  const apiKey = (process.env.GEMINI_API_KEY || '').trim();

  // Initialize Gemini client with telemetry header if key is provided
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.warn('Could not initialize GoogleGenAI client:', e);
    }
  }

  const SYSTEM_INSTRUCTION = `You are SmartStudy AI (স্মার্টস্টাডি এআই), the official intelligent, polite and helpful AI tutor for the SmartStudy learning platform in Bangladesh.

CRITICAL LENGTH & FORMATTING RULES (YOU MUST STRICTLY FOLLOW THESE):
1. SHORT QUESTIONS & CASUAL CHAT (টুকটাক ছোট মেসেজ যেমন: হ্যালো, হাই, কেমন আছেন, কি করছ, ধন্যবাদ, সালাম):
   - Answer MUST be very short and sweet, strictly around 50 to 60 characters (৬০ অক্ষরের মেসেজ).
   - Example: "হ্যালো! আমি SmartStudy AI। কীভাবে সাহায্য করতে পারি?" (৫০-৬০ অক্ষর)
   - Do NOT write long paragraphs for small talk or short greetings.

2. LEARNING & ACADEMIC TOPICS (পড়াশোনা, কোনো বিষয় জানতে চাইলে বা বড় প্রশ্ন):
   - Answer MUST be between 150 to 200 words (দেড়শ থেকে ২০০ ওয়ার্ডের মধ্যে).
   - Keep it well-structured, beautiful, clear, with bullet points or code blocks if needed.
   - Do NOT exceed 220 words; keep it visually pleasant and easy to read on mobile.

3. FULL SMARTSTUDY APP KNOWLEDGE:
   - You know everything inside our SmartStudy application:
     * ৯-১০ম ও ১১-১২শ শ্রেণির ক্লাস ও বিষয়সমূহ (বাংলা, ইংরেজি, গণিত, উচ্চতর গণিত, আইসিটি)
     * প্রতিটি বিষয়ের অধ্যায়ভিত্তিক ভিডিও লেকচার ও প্লেলিস্ট
     * প্রতিটি অধ্যায়ের ৩০টি বোর্ড স্ট্যান্ডার্ড নৈর্ব্যক্তিক (MCQ) পরীক্ষা এবং ইনস্ট্যান্ট অটো-রেজাল্ট মূল্যায়ন
     * প্রোফাইল পেজে থাকা Casio fx-570MS সাইন্টিফিক ক্যালকুলেটর (ক্যালকুলেটরটি শুধুমাত্র প্রোফাইল ট্যাবের নির্দিষ্ট ঘরে রয়েছে)
     * প্রোফাইলের স্টাডি টুলস: বয়স ক্যালকুলেটর (Age Calc), জিপিএ ক্যালকুলেটর (GPA Calc), ইউনিট কনভার্টার (Converter), আইসিটি সংখ্যা রূপান্তর (Number Converter - Binary/Hex), সূত্রাবলী (Formulas), স্টাডি নোটবুক, টু-ডু লিস্ট, রুটিন, পোমোডোরো টাইমার ও পরীক্ষা চেকলিস্ট
     * মেগা স্কলারশিপ টেস্ট ২০২৬ ও পুরস্কারের নিয়মাবলী

Reply primarily in clear, polished Bengali (বাংলা) or clean bilingual Bengali-English where necessary.`;

  // Server-side Admin Verification Endpoint (Rate Limited & Cryptographically Salted)
  app.post('/api/admin/verify', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const clientKey = `admin_auth_${ip}`;

    // Rate limiting: Maximum 5 attempts per 15 minutes per IP
    const allowed = checkRateLimit(clientKey, 5, 15 * 60 * 1000);
    if (!allowed) {
      return res.status(429).json({
        error: 'অতিরিক্ত ব্যর্থ চেষ্টার কারণে সাময়িকভাবে প্রবেশ বন্ধ করা হয়েছে। ১৫ মিনিট পর আবার চেষ্টা করুন।'
      });
    }

    const { password } = req.body;
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'পাসওয়ার্ড প্রদান করা আবশ্যক' });
    }

    const hashedInput = crypto
      .createHash('sha256')
      .update(`${ADMIN_SERVER_SALT}:${password.trim()}`)
      .digest('hex');

    if (hashedInput === ADMIN_SERVER_HASH) {
      rateLimits.delete(clientKey);
      const sessionToken = crypto.randomBytes(32).toString('hex');
      return res.json({ success: true, authorized: true, token: sessionToken });
    }

    return res.status(401).json({ error: 'ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।' });
  });

  // API Route for SmartStudy AI Assistant (Protected with Rate Limiting & Ultra-Fast Response)
  app.post('/api/chat', async (req, res) => {
    try {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      if (!checkRateLimit(`chat_${ip}`, 60, 60 * 1000)) {
        return res.status(429).json({ error: 'অনুগ্রহ করে একটু অপেক্ষা করুন। একসাথে অনেকগুলো অনুরোধ করা হয়েছে।' });
      }

      const { message, history } = req.body;
      if (!message || typeof message !== 'string' || message.length > 2500) {
        return res.status(400).json({ error: 'বৈধ মেসেজ প্রদান করুন (সর্বোচ্চ ২৫০০ অক্ষর)' });
      }

      const trimmed = message.trim().toLowerCase();

      // FAST PATH 1: Small talk, greetings, thanks & short inquiries (Instant < 5ms response)
      const isQuickGreeting = 
        trimmed === 'হাই' || trimmed === 'হ্যালো' || trimmed === 'হেই' || 
        trimmed === 'hi' || trimmed === 'hello' || trimmed === 'hey' ||
        trimmed.includes('কেমন আছো') || trimmed.includes('কেমন আছেন') ||
        trimmed.includes('কি করছ') || trimmed.includes('কি করো') || trimmed.includes('ki koro') ||
        trimmed.includes('কি খবর') || trimmed.includes('সালাম') || trimmed.includes('salam') ||
        trimmed.includes('ধন্যবাদ') || trimmed.includes('thanks') || trimmed.includes('thank you') ||
        trimmed.length < 8;

      if (isQuickGreeting) {
        const instantReply = generateSmartStudyKnowledgeReply(message);
        return res.json({ reply: instantReply });
      }

      // FAST PATH 2: Use Gemini if a valid Google AI Studio API key (starts with AIza) is present
      const isValidGoogleApiKey = apiKey && apiKey.startsWith('AIza');
      if (ai && isValidGoogleApiKey) {
        try {
          const contents = [];
          if (Array.isArray(history)) {
            for (const item of history.slice(-6)) {
              contents.push({
                role: item.role === 'user' ? 'user' : 'model',
                parts: [{ text: item.text }],
              });
            }
          }
          contents.push({
            role: 'user',
            parts: [{ text: message }],
          });

          // Race Gemini call with 1800ms timeout for instant fast response
          const geminiPromise = ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.7,
              maxOutputTokens: 600,
            },
          });

          const timeoutPromise = new Promise<null>((resolve) => 
            setTimeout(() => resolve(null), 1800)
          );

          const result = await Promise.race([geminiPromise, timeoutPromise]);

          if (result && 'text' in result && result.text && result.text.trim().length > 0) {
            return res.json({ reply: result.text.trim() });
          }
        } catch (apiErr: any) {
          console.warn('Gemini API call timed out or failed, using SmartStudy engine:', apiErr?.message || apiErr);
        }
      }

      // High quality educational response engine with full SmartStudy context
      const fallbackReply = generateSmartStudyKnowledgeReply(message);
      return res.json({ reply: fallbackReply });
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackReply = generateSmartStudyKnowledgeReply(req.body?.message || '');
      return res.json({ reply: fallbackReply });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', hasApiKey: !!apiKey });
  });

  // Dedicated Ad Iframe Document Route (Allows third-party ad networks to run synchronously with real origin/referrer)
  app.get(['/api/ad-frame', '/ad-frame.html'], (req, res) => {
    const key = (req.query.key as string) || '5febadcb47e71b73b1202fd206a76c5c';
    const isSquare = (req.query.height as string) === '250' || (req.query.width as string) === '300' || key === '911ee250303f0d466e6e2cab58b077e0';
    // Adsterra zone dimensions: 468x60 for banner, 300x250 for square
    const width = isSquare ? '300' : '468';
    const height = isSquare ? '250' : '60';
    const format = (req.query.format as string) || 'iframe';
    const scriptUrl = (req.query.scriptUrl as string) || `https://bauval.org/22/${key}`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      background: transparent;
      width: 100%;
      height: 100%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #ad-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      position: relative;
    }
    #fallback-banner {
      display: none;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      color: #334155;
      text-decoration: none;
      box-sizing: border-box;
      cursor: pointer;
    }
    .fb-title {
      font-weight: 700;
      font-size: 13px;
      color: #0f172a;
      line-height: 1.2;
    }
    .fb-sub {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    .fb-btn {
      background: #b45309;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
    }
  </style>
</head>
<body>
  <div id="ad-wrapper">
    <script type="text/javascript">
      atOptions = {
        'key' : '${key}',
        'format' : '${format}',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="${scriptUrl}"></script>

    <div id="fallback-banner">
      <div>
        <div class="fb-title">SmartStudy • অনলাইন লার্নিং প্ল্যাটফর্ম</div>
        <div class="fb-sub">এইচএসসি ও এসএসসি ফ্রি ক্লাস এবং কুইজ প্রস্তুতি</div>
      </div>
      <div class="fb-btn">শুরু করুন</div>
    </div>
  </div>

  <script type="text/javascript">
    setTimeout(function() {
      try {
        var wrapper = document.getElementById('ad-wrapper');
        var hasAd = wrapper.querySelector('iframe') || wrapper.querySelector('img') || wrapper.querySelector('a');
        if (!hasAd) {
          var fb = document.getElementById('fallback-banner');
          if (fb) fb.style.display = 'flex';
        }
      } catch(e) {}
    }, 1800);
  </script>
</body>
</html>`);
  });

  // Mount Vite or static dist
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartStudy server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
