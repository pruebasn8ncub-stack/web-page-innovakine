import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL =
    process.env.N8N_WEBHOOK_URL ||
    "https://n8n-n8n.wfrhms.easypanel.host/webhook/68a44c4f-a484-41c4-9f9e-109785fac488";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, sessionId } = body;

        if (!message || !sessionId) {
            return NextResponse.json(
                { error: "Missing 'message' and/or 'sessionId'" },
                { status: 400 }
            );
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000); // 90s timeout

        const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chatInput: message,
                sessionId,
            }),
            signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!n8nResponse.ok) {
            const errorText = await n8nResponse.text();
            console.error("[Chat API] n8n error:", n8nResponse.status, errorText);
            return NextResponse.json(
                { error: "Error procesando tu mensaje. Intenta de nuevo." },
                { status: 502 }
            );
        }

        // The Respond to Webhook node returns the AI Agent's output
        const data = await n8nResponse.json();

        // Extract the bot's response text - the Respond to Webhook node
        // typically returns the last node's output
        const botResponse =
            data?.output ||
            data?.text ||
            data?.response ||
            data?.message ||
            (typeof data === "string" ? data : JSON.stringify(data));

        return NextResponse.json({ response: botResponse });
    } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
            console.error("[Chat API] Request timed out");
            return NextResponse.json(
                { error: "El asistente tardó demasiado en responder. Intenta de nuevo." },
                { status: 504 }
            );
        }

        console.error("[Chat API] Unexpected error:", error);
        return NextResponse.json(
            { error: "Error interno del servidor." },
            { status: 500 }
        );
    }
}
