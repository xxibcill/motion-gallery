"use client";

import { ChatBar } from "@/components/chat/ChatBar";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-8">Chat Bar</h1>
        <div data-testid="registry-chat-bar">
          <ChatBar />
        </div>
      </div>
    </div>
  );
}
