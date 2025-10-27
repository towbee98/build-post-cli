import clipboard from "clipboardy";

export async function copyToClipboard(text: string) {
  await clipboard.write(text);
}
