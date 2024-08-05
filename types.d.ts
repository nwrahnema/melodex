/// <reference types="vite/client" />

declare module '__STATIC_CONTENT_MANIFEST' {
  const manifestJson: Record<string, string>;
  export default manifestJson;
}
