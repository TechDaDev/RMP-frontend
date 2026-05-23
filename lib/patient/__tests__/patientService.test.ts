import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/api/client", () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from "@/lib/api/client";
import { getSymptoms } from "@/lib/patient/patientService";

const apiRequestMock = vi.mocked(apiRequest);

describe("getSymptoms", () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
    apiRequestMock.mockResolvedValue([]);
  });

  it("does not include category query param for all categories", async () => {
    await getSymptoms({ categoryId: "all" });

    expect(apiRequestMock).toHaveBeenCalledWith("/api/consultations/symptoms/", { auth: true });
  });

  it("includes category query param for a specific category UUID", async () => {
    const categoryId = "11111111-1111-1111-1111-111111111111";

    await getSymptoms({ categoryId });

    expect(apiRequestMock).toHaveBeenCalledWith(
      `/api/consultations/symptoms/?category=${categoryId}`,
      { auth: true },
    );
  });
});
