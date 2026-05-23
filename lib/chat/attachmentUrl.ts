import { API_BASE_URL } from "@/lib/api/config";

interface AttachmentLike {
  file?: string;
  file_url?: string;
}

function getApiBaseOrigin(): string {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return API_BASE_URL.replace(/\/$/, "");
  }
}

const API_BASE_ORIGIN = getApiBaseOrigin();

export function resolveAttachmentUrl(attachment: AttachmentLike): string {
  if (attachment.file_url) {
    if (/^https?:\/\//i.test(attachment.file_url)) {
      return attachment.file_url;
    }

    if (attachment.file_url.startsWith("/")) {
      return `${API_BASE_ORIGIN}${attachment.file_url}`;
    }
  }

  if (attachment.file) {
    const normalizedPath = attachment.file.startsWith("/")
      ? attachment.file
      : `/media/${attachment.file}`;
    return `${API_BASE_ORIGIN}${normalizedPath}`;
  }

  return "";
}

export function isImageAttachmentUrl(url: string): boolean {
  if (!url) {
    return false;
  }

  const withoutQuery = url.split("?")[0].split("#")[0];
  return /\.(png|jpe?g|gif|webp|bmp|svg|avif)$/i.test(withoutQuery);
}
