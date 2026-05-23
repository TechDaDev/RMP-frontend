import { describe, expect, it } from "vitest";
import { resolveAttachmentUrl } from "@/lib/chat/attachmentUrl";

describe("resolveAttachmentUrl", () => {
  it("uses absolute file_url directly when present", () => {
    const result = resolveAttachmentUrl({
      file_url: "https://cdn.example.com/messages/a.jpg",
      file: "messages/a.jpg",
    });

    expect(result).toBe("https://cdn.example.com/messages/a.jpg");
  });

  it("prefixes API origin for relative file_url", () => {
    const result = resolveAttachmentUrl({
      file_url: "/media/messages/b.jpg",
      file: "messages/b.jpg",
    });

    expect(result).toBe("http://localhost:8000/media/messages/b.jpg");
  });

  it("falls back to /media/{file} when file_url is missing", () => {
    const result = resolveAttachmentUrl({
      file: "messages/c.jpg",
    });

    expect(result).toBe("http://localhost:8000/media/messages/c.jpg");
  });

  it("returns empty string when both file_url and file are missing", () => {
    const result = resolveAttachmentUrl({});

    expect(result).toBe("");
  });
});
