/**
 * scripts/test-chat-api.mjs
 * Tests the /api/chat endpoint directly.
 * Run with server running: node scripts/test-chat-api.mjs
 */
const res = await fetch('http://localhost:3000/api/chat', {
  method:  'POST',
  headers: { 'Content-Type': 'application/json' },
  body:    JSON.stringify({ message: 'Tell me about Ananya', history: [] }),
});
const data = await res.json();
console.log('Status:', res.status);
console.log('Reply:', data.reply);
console.log('Navigate:', data.navigate);
console.log('Error flag:', data.error);
