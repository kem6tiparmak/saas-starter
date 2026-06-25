import Anthropic from "@anthropic-ai/sdk";
import { parseModelJson } from "./json";

/**
 * Server-only Claude helpers. NEVER import these into a client component and
 * NEVER expose ANTHROPIC_API_KEY via NEXT_PUBLIC_*. The key is read from the
 * environment by the SDK.
 *
 * Cost control (see CLAUDE.md): set a workspace spend limit in the Anthropic
 * console FIRST. Use Haiku for cheap/high-volume extraction & classification,
 * Sonnet only for user-facing generated text. Keep max_tokens tight.
 */

/** Cheap, fast model — extraction, classification, summaries. */
export const HAIKU_MODEL = "claude-haiku-4-5-20251001";
/** Higher-quality model — user-facing generated text. Costs more; use sparingly. */
export const SONNET_MODEL = "claude-sonnet-4-6";

/** Lazy singleton Anthropic client. Returns null if no API key is configured. */
let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic();
  return client;
}

interface CompletionOptions {
  system: string;
  user: string;
  /** Defaults to HAIKU_MODEL — opt into Sonnet explicitly for quality-critical text. */
  model?: string;
  /** Keep this tight; it caps cost. */
  maxTokens?: number;
}

/**
 * Runs a single-turn completion and returns the raw text, or null if no API key
 * is set or the call fails (callers should degrade gracefully, never crash).
 */
export async function complete({
  system,
  user,
  model = HAIKU_MODEL,
  maxTokens = 512,
}: CompletionOptions): Promise<string | null> {
  const anthropic = getClient();
  if (!anthropic) return null;

  try {
    // Cap input length as a cost/abuse backstop, even on top of upstream limits.
    const capped = user.slice(0, 8000);
    const msg = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: capped }],
    });
    return msg.content[0]?.type === "text" ? msg.content[0].text : null;
  } catch (err) {
    console.error("[ai] completion failed:", err);
    return null;
  }
}

/**
 * Like {@link complete} but parses the result as JSON via {@link parseModelJson}
 * (handles Markdown fences). Returns null on any failure.
 */
export async function completeJson<T>(options: CompletionOptions): Promise<T | null> {
  const text = await complete(options);
  if (text === null) return null;
  try {
    return parseModelJson<T>(text);
  } catch (err) {
    console.error("[ai] JSON parse failed:", err);
    return null;
  }
}
