import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DoctorMessagesPanel } from "@/components/doctor/DoctorMessagesPanel";
import type { DoctorMessage } from "@/types/doctor";

vi.mock("@/components/AppPreferencesProvider", () => ({
  useAppPreferences: () => ({
    t: {
      doctor: {
        doctorMessages: "Messages",
        messagesUnavailablePermission: "Messaging unavailable",
        messagesReadOnly: "Read only",
        messagesUnavailableUntilAccepted: "Accept first",
        retryMessages: "Retry",
        noMessagesYet: "No messages",
        messagePlaceholder: "Type",
        sendingDoctorResponse: "Sending",
        sendMessage: "Send",
      },
      patient: {
        loading: "Loading",
        noDataDescription: "Error",
      },
      common: {
        cancel: "Close",
      },
    },
  }),
}));

describe("DoctorMessagesPanel attachments", () => {
  const onSend = vi.fn(async () => {});

  function renderPanel(messages: DoctorMessage[]) {
    return render(
      <DoctorMessagesPanel
        status="accepted"
        isApproved
        loading={false}
        error={null}
        messages={messages}
        onRetry={() => {}}
        onSend={onSend}
      />,
    );
  }

  it("renders image thumbnail and popup using file_url when present", () => {
    renderPanel([
      {
        id: "m1",
        body: "",
        attachments: [
          {
            id: "a1",
            file: "messages/legacy.jpg",
            file_url: "https://cdn.example.com/messages/new.jpg",
            original_name: "new.jpg",
          },
        ],
      },
    ]);

    const thumbnail = screen.getByRole("img", { name: "new.jpg" }) as HTMLImageElement;
    expect(thumbnail.src).toBe("https://cdn.example.com/messages/new.jpg");

    fireEvent.click(screen.getByRole("button", { name: "new.jpg" }));

    const popupImage = screen.getAllByRole("img", { name: "new.jpg" })[1] as HTMLImageElement;
    expect(popupImage.src).toBe("https://cdn.example.com/messages/new.jpg");
  });

  it("prefixes API origin for relative file_url and falls back when only storage path exists", () => {
    renderPanel([
      {
        id: "m2",
        body: "",
        attachments: [
          {
            id: "a2",
            file_url: "/media/messages/relative.jpg",
            original_name: "relative.jpg",
          },
          {
            id: "a3",
            file: "messages/fallback.jpg",
            original_name: "fallback.jpg",
          },
        ],
      },
    ]);

    const relativeImage = screen.getByRole("img", { name: "relative.jpg" }) as HTMLImageElement;
    expect(relativeImage.src).toBe("http://localhost:8000/media/messages/relative.jpg");

    const fallbackImage = screen.getByRole("img", { name: "fallback.jpg" }) as HTMLImageElement;
    expect(fallbackImage.src).toBe("http://localhost:8000/media/messages/fallback.jpg");
    expect(fallbackImage.src.includes("messages/fallback.jpg")).toBe(true);
  });
});
