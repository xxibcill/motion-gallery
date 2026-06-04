"use client";

import { ChatDemo } from "@/components/chat/ChatDemo";

export default function ChatDemoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-8">
      <div data-testid="registry-chat-page" className="w-full max-w-3xl">
        <ChatDemo />
      </div>
    </div>
  );
}
