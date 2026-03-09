export { metadata, viewport } from "next-sanity/studio";
export const dynamic = "force-static";

import StudioClient from "./StudioClient";

export default function StudioPage() {
  return <StudioClient />;
}
