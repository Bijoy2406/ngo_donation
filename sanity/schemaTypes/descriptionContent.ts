import { defineArrayMember } from "sanity";
import {
  AlignCenterStyle,
  AlignJustifyStyle,
  AlignLeftStyle,
  AlignRightStyle,
} from "../components/alignmentStyles";

export const descriptionBlock = defineArrayMember({
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "Heading", value: "h2" },
    { title: "Subheading", value: "h3" },
    { title: "Align Left", value: "left", component: AlignLeftStyle },
    { title: "Align Center", value: "center", component: AlignCenterStyle },
    { title: "Align Right", value: "right", component: AlignRightStyle },
    { title: "Justify", value: "justify", component: AlignJustifyStyle },
  ],
  lists: [
    { title: "Bullet", value: "bullet" },
    { title: "Numbered", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Bold", value: "strong" },
      { title: "Italic", value: "em" },
      { title: "Underline", value: "underline" },
    ],
  },
});
