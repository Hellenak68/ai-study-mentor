"use client";

import { useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: input }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      if (!res.ok) {
        throw new Error("요청 처리 중 오류가 발생했습니다.");
      }
      const data = await res.json();
      const content: string = data?.message?.content ?? "응답이 비어 있습니다.";
      setMessages((prev) => [...prev, { role: "assistant", content }]);
    } catch (e) {
      setError("네트워크 또는 서버 오류입니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-100">
      <div className="mx-auto max-w-5xl p-6">
        <header className="flex items-center justify-between py-4">
          <h1 className="text-xl font-semibold tracking-tight">AI 스터디 멘토</h1>
          <span className="text-xs text-gray-400">PRD v2.0 Mock</span>
        </header>

        <main className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
            <h2 className="mb-3 text-sm font-medium text-gray-300">대화</h2>
            <div className="h-[420px] overflow-y-auto rounded-lg bg-black/20 p-3">
              {messages.length === 0 ? (
                <div className="text-sm text-gray-400">질문을 입력해 시작해 보세요.</div>
              ) : (
                <ul className="space-y-3">
                  {messages.map((m, idx) => (
                    <li key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
                      <span
                        className={
                          "inline-block max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm " +
                          (m.role === "user"
                            ? "bg-blue-500/20 text-blue-100"
                            : "bg-white/10 text-gray-100")
                        }
                      >
                        {m.content}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder="무엇을 도와드릴까요?"
                className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none placeholder:text-gray-500"
              />
              <button
                disabled={loading}
                onClick={sendMessage}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {loading ? "전송 중" : "전송"}
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          </section>

          <aside className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
            <h2 className="mb-3 text-sm font-medium text-gray-300">컨텍스트</h2>
            <ul className="text-xs text-gray-400 space-y-2">
              <li>페이지: 대시보드(예시)</li>
              <li>진행도: 0%</li>
              <li>모드: Mock (API 키 미설정 시)</li>
            </ul>
          </aside>
        </main>
      </div>
    </div>
  );
}
