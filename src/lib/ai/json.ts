/**
 * Parses JSON returned by an LLM. Models (especially Haiku) frequently wrap
 * their JSON in Markdown code fences (```json … ```) or add stray prose even
 * when instructed not to — a plain JSON.parse then throws. This strips fences
 * and, as a fallback, extracts the outermost {…} object.
 *
 * Always use this for LLM output; never call JSON.parse on it directly.
 *
 * @throws if no parseable JSON object can be recovered.
 */
export function parseModelJson<T>(text: string): T {
  const trimmed = text.trim();

  // Strip a leading ```json / ``` fence and a trailing ``` fence, if present.
  const unfenced = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    return JSON.parse(unfenced) as T;
  } catch {
    // Fallback: grab the outermost object in case of surrounding prose.
    const start = unfenced.indexOf("{");
    const end = unfenced.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(unfenced.slice(start, end + 1)) as T;
    }
    throw new Error("No JSON object found in model response");
  }
}
