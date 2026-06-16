import type { PortableTextBlock } from "@/types";

export type RichTextValue = PortableTextBlock[] | string | null | undefined;

export function hasRichTextContent(value: RichTextValue): boolean {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return Array.isArray(value) && value.length > 0;
}

export function richTextToPlainText(value: RichTextValue): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .flatMap((block) => {
      if (block?._type !== "block" || !Array.isArray(block.children)) {
        return [];
      }

      const text = block.children
        .map((child: { _type?: string; text?: string }) =>
          child?._type === "span" ? child.text ?? "" : ""
        )
        .join("");

      return text ? [text] : [];
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
