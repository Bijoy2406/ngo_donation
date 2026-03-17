import type { ReactNode } from "react";
import type { BlockStyleProps } from "sanity";

function AlignedParagraph({
  children,
  textAlign,
}: {
  children: ReactNode;
  textAlign: "left" | "center" | "right" | "justify";
}) {
  return (
    <p style={{ margin: 0, textAlign, lineHeight: 1.5 }}>
      {children}
    </p>
  );
}

export function AlignLeftStyle(props: BlockStyleProps) {
  return <AlignedParagraph textAlign="left">{props.children}</AlignedParagraph>;
}

export function AlignCenterStyle(props: BlockStyleProps) {
  return <AlignedParagraph textAlign="center">{props.children}</AlignedParagraph>;
}

export function AlignRightStyle(props: BlockStyleProps) {
  return <AlignedParagraph textAlign="right">{props.children}</AlignedParagraph>;
}

export function AlignJustifyStyle(props: BlockStyleProps) {
  return <AlignedParagraph textAlign="justify">{props.children}</AlignedParagraph>;
}
