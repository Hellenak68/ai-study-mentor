import { NextRequest, NextResponse } from "next/server";

type ChatRequestBody = {
  messages: Array<{ role: "user" | "system" | "assistant"; content: string }>;
  context?: Record<string, unknown>;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequestBody;

    if (!body?.messages || body.messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.UPSTAGE_API_KEY;

    // If no API key provided, return a deterministic mock to unblock UI integration
    if (!apiKey) {
      const lastUserMessage = [...body.messages]
        .reverse()
        .find((m) => m.role === "user")?.content;

      return NextResponse.json({
        model: "solar-pro-2",
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
        message: {
          role: "assistant",
          content:
            `모의 응답입니다. Upstage API 키가 설정되면 실제 응답이 반환됩니다.\n\n` +
            (lastUserMessage
              ? `사용자 입력: "${lastUserMessage}"\n\n`
              : "") +
            "지금은 PRD 기능 구현을 위한 UI/흐름 검증 단계입니다.",
        },
      });
    }

    // Placeholder: real call to Upstage Solar Pro 2 API can be enabled later
    // Keeping a safe mock even when key is present until integration is verified end-to-end.
    return NextResponse.json({
      model: "solar-pro-2",
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      message: {
        role: "assistant",
        content:
          "임시 안전 모드 응답입니다. 실제 Upstage 연동은 활성화 전 사전 검증 후 전환됩니다.",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "failed to handle request" },
      { status: 500 }
    );
  }
}


