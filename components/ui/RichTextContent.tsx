import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@/types";

export type RichTextValue = PortableTextBlock[] | string | null | undefined;

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed text-gray-600">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 mt-6 text-2xl font-bold text-sage-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-5 text-xl font-semibold text-sage-800">
        {children}
      </h3>
    ),
    left: ({ children }) => (
      <p className="mb-4 text-left leading-relaxed text-gray-600">
        {children}
      </p>
    ),
    center: ({ children }) => (
      <p className="mb-4 text-center leading-relaxed text-gray-600">
        {children}
      </p>
    ),
    right: ({ children }) => (
      <p className="mb-4 text-right leading-relaxed text-gray-600">
        {children}
      </p>
    ),
    justify: ({ children }) => (
      <p className="mb-4 text-justify leading-relaxed text-gray-600">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc space-y-2 pl-5 text-gray-600">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal space-y-2 pl-5 text-gray-600">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    underline: ({ children }) => <span className="underline">{children}</span>,
  },
};

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
    .map((block) => {
      if (block?._type !== "block" || !Array.isArray(block.children)) {
        return "";
      }

      return block.children
        .map((child: { _type?: string; text?: string }) =>
          child?._type === "span" ? child.text ?? "" : ""
        )
        .join("");
    })
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeRichText(value: RichTextValue): PortableTextBlock[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    return [];
  }

  return [
    {
      _type: "block",
      _key: "legacy-description",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "legacy-description-span",
          marks: [],
          text: value,
        },
      ],
    },
  ];
}

interface RichTextContentProps {
  value: RichTextValue;
  className?: string;
}

export default function RichTextContent({
  value,
  className,
}: RichTextContentProps) {
  const blocks = normalizeRichText(value);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className={["prose-content", className].filter(Boolean).join(" ")}>
      <PortableText value={blocks} components={portableTextComponents} />
    </div>
  );
}
