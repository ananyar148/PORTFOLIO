/**
 * scripts/test-gemini.mjs
 * Tests which Vertex AI region + model combination works for this project.
 * Run: node scripts/test-gemini.mjs
 */
import { JWT }         from 'google-auth-library';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const creds = JSON.parse(readFileSync(resolve(__dirname, '../training.json'), 'utf-8'));

const jwt = new JWT({
  email:  creds.client_email,
  key:    creds.private_key,
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

const { token } = await jwt.getAccessToken();
console.log('✅ Auth OK\n');

const COMBOS = [
  { region: 'us-central1', model: 'gemini-1.5-flash'           },
  { region: 'us-central1', model: 'gemini-1.5-flash-001'       },
  { region: 'us-central1', model: 'gemini-1.5-pro'             },
  { region: 'us-central1', model: 'gemini-1.0-pro'             },
  { region: 'us-central1', model: 'gemini-2.0-flash'           },
  { region: 'us-central1', model: 'gemini-2.0-flash-lite'      },
  { region: 'us-east4',    model: 'gemini-1.5-flash'           },
  { region: 'us-east4',    model: 'gemini-1.5-flash-001'       },
  { region: 'us-east4',    model: 'gemini-2.0-flash'           },
  { region: 'global',      model: 'gemini-1.5-flash'           },
];

for (const { region, model } of COMBOS) {
  const url = `https://${region}-aiplatform.googleapis.com/v1/projects/${creds.project_id}/locations/${region}/publishers/google/models/${model}:generateContent`;

  try {
    const res = await fetch(url, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Say hello in one word' }] }],
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
      console.log(`❌  ${status}  →  region=${region}  model=${model}  — ${err?.error?.message?.slice(0, 80) ?? ''}`);
    }
  } catch (e) {
    console.log(`💥  ERROR  →  region=${region}  model=${model}  — ${e.message}`);
  }
}
