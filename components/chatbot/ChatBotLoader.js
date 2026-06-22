'use client';
/**
 * ChatBotLoader.js
 *
 * Thin Client Component wrapper that lazy-loads ChatBot with ssr:false.
 * next/dynamic with ssr:false is only allowed inside Client Components,
 * so we isolate it here and import this from the Server Component layout.
 */
import dynamic from 'next/dynamic';

const ChatBot = dynamic(
  () => import('./ChatBot'),
  {
    ssr:     false,
    loading: () => null,   // render nothing until JS loads
  }
);

export default function ChatBotLoader() {
  return <ChatBot />;
}
