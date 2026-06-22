/**
 * Quick test to find ANY working Vertex AI model in your project.
 * Run: node scripts/test-vertex-basic.mjs
 */
import { JWT } from 'google-auth-library';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const creds = JSON.parse(readFileSync(resolve(__dirname, '../training.json'), 'utf-8'));

const jwt = new JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

const { token } = await jwt.getAccessToken();
console.log('✅ Auth OK\n');

// Try a simpler set of common models
const COMBOS = [
  { region: 'us-central1', model: 'text-bison' },
  { region: 'us-central1', model: 'text-bison@001' },
  { region: 'us-central1', model: 'textembedding-gecko' },
  { region: 'us-east4', model: 'text-bison' },
  { region: 'us-east4', model: 'gemini-pro' },
];

for (const { region, model } of COMBOS) {
  const url = `https://${region}-aiplatform.googleapis.com/v1/projects/${creds.project_id}/locations/${region}/publishers/google/models/${model}:generateContent`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Say hello' }] }],
        generationConfig: { maxOutputTokens: 20 },
      }),
    });

    const status = res.status;
    if (status === 200) {
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '(no text)';
      console.log(`✅  WORKS  →  region=${region}  model=${model}`);
      console.log(`   Reply: "${text.trim()}"\n`);
    } else {
      const err = await res.json().catch(() => ({}));
      console.log(`❌  ${status}  →  region=${region}  model=${model}`);
    }
  } catch (e) {
    console.log(`💥  ERROR  →  region=${region}  model=${model}  — ${e.message}`);
  }
}
