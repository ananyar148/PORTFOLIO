import { GoogleGenAI } from '@google/genai';
import { JWT } from 'google-auth-library';
import { readFileSync } from 'fs';

const SA = JSON.parse(readFileSync('./training.json', 'utf-8'));
console.log('Project:', SA.project_id);

const jwt = new JWT({
  email: SA.client_email,
  key: SA.private_key,
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

const LOCATIONS = ['us-central1', 'us-east4', 'europe-west4', 'asia-southeast1', 'global'];
const MODELS    = ['gemini-2.5-flash', 'gemini-2.5-flash-preview-05-20', 'gemini-2.5-flash-001'];

for (const location of LOCATIONS) {
  for (const model of MODELS) {
    try {
      const ai = new GoogleGenAI({
        vertexai: true,
        project: SA.project_id,
        location,
        googleAuthOptions: { authClient: jwt },
      });
      const chat = ai.chats.create({ model, config: { maxOutputTokens: 20 }, history: [] });
      const res = await chat.sendMessage({ message: 'hi' });
      const text = res.text ?? res.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log(`✅ WORKS — location: ${location}  model: ${model}`);
      console.log('   reply:', text?.slice(0, 60) ?? '(no text property — check res keys: ' + Object.keys(res) + ')');
      process.exit(0);
    } catch (e) {
      console.log(`❌ ${location} / ${model}: ${e.message.slice(0, 80)}`);
    }
  }
}
