import { NextRequest, NextResponse } from "next/server";

// 서버 측 환경 변수 접근
const API_URL = process.env.BACKEND_API;
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT || "30000", 10);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 타임아웃 설정
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    // 실제 백엔드 API 호출
    const response = await fetch(`${API_URL}/Sseus/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`백엔드 API 요청 실패: ${response.status}`);
    }

    // 백엔드 응답을 그대로 클라이언트에 전달
    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("API 라우트 오류:", error);

    if (error instanceof DOMException && error.name === "AbortError") {
      return NextResponse.json(
        { error: "요청 시간이 초과되었습니다." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "알 수 없는 오류" },
      { status: 500 }
    );
  }
}
