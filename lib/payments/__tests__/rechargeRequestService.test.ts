import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/api/client", () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from "@/lib/api/client";
import {
  createRechargeRequest,
  getRechargeRequests,
  getRechargeRequestDetail,
  approveRechargeRequest,
  rejectRechargeRequest,
} from "@/lib/payments/paymentsService";

const apiRequestMock = vi.mocked(apiRequest);

describe("createRechargeRequest", () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
    apiRequestMock.mockResolvedValue({ id: "rr-1", amount: "100.00", status: "pending_review" });
  });

  it("sends a POST with FormData containing amount and receipt_file", async () => {
    const file = new File(["dummy"], "receipt.jpg", { type: "image/jpeg" });
    await createRechargeRequest({ amount: "100.00", receipt_file: file });

    expect(apiRequestMock).toHaveBeenCalledOnce();
    const [url, options] = apiRequestMock.mock.calls[0];
    expect(url).toBe("/api/payments/wallet/recharge-requests/");
    expect(options?.body).toBeInstanceOf(FormData);

    const fd = options?.body as FormData;
    expect(fd.get("amount")).toBe("100.00");
    expect(fd.get("receipt_file")).toBe(file);
    expect(fd.get("note")).toBeNull();
  });

  it("includes note in FormData when provided", async () => {
    const file = new File(["dummy"], "receipt.pdf", { type: "application/pdf" });
    await createRechargeRequest({ amount: "50.00", note: "test note", receipt_file: file });

    const fd = apiRequestMock.mock.calls[0][1]?.body as FormData;
    expect(fd.get("note")).toBe("test note");
  });

  it("omits note when note is empty string", async () => {
    const file = new File(["dummy"], "receipt.png", { type: "image/png" });
    await createRechargeRequest({ amount: "50.00", note: "", receipt_file: file });

    const fd = apiRequestMock.mock.calls[0][1]?.body as FormData;
    expect(fd.get("note")).toBeNull();
  });
});

describe("getRechargeRequests", () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
    apiRequestMock.mockResolvedValue([]);
  });

  it("calls recharge-requests endpoint without query when no params", async () => {
    await getRechargeRequests();
    expect(apiRequestMock).toHaveBeenCalledWith(
      "/api/payments/wallet/recharge-requests/",
      { auth: true },
    );
  });

  it("includes status query param when provided", async () => {
    await getRechargeRequests({ status: "pending_review" });
    expect(apiRequestMock).toHaveBeenCalledWith(
      "/api/payments/wallet/recharge-requests/?status=pending_review",
      { auth: true },
    );
  });
});

describe("getRechargeRequestDetail", () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
    apiRequestMock.mockResolvedValue({ id: "rr-42", amount: "200.00", status: "approved" });
  });

  it("calls the detail endpoint with the given id", async () => {
    await getRechargeRequestDetail("rr-42");
    expect(apiRequestMock).toHaveBeenCalledWith(
      "/api/payments/wallet/recharge-requests/rr-42/",
      { auth: true },
    );
  });
});

describe("approveRechargeRequest", () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
    apiRequestMock.mockResolvedValue({ id: "rr-1", status: "approved" });
  });

  it("calls the approve endpoint with review_note when provided", async () => {
    await approveRechargeRequest("rr-1", { review_note: "looks good" });
    expect(apiRequestMock).toHaveBeenCalledWith(
      "/api/payments/wallet/recharge-requests/rr-1/approve/",
      { auth: true, body: { review_note: "looks good" } },
    );
  });

  it("calls the approve endpoint with empty body when no payload", async () => {
    await approveRechargeRequest("rr-1");
    expect(apiRequestMock).toHaveBeenCalledWith(
      "/api/payments/wallet/recharge-requests/rr-1/approve/",
      { auth: true, body: {} },
    );
  });
});

describe("rejectRechargeRequest", () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
    apiRequestMock.mockResolvedValue({ id: "rr-1", status: "rejected" });
  });

  it("calls the reject endpoint", async () => {
    await rejectRechargeRequest("rr-1", { review_note: "invalid receipt" });
    expect(apiRequestMock).toHaveBeenCalledWith(
      "/api/payments/wallet/recharge-requests/rr-1/reject/",
      { auth: true, body: { review_note: "invalid receipt" } },
    );
  });
});
