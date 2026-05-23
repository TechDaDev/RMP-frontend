import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { Symptom, SymptomCategory } from "@/types/patient";

vi.mock("@/lib/patient/patientService", () => ({
  getSymptoms: vi.fn(),
}));

vi.mock("@/components/AppPreferencesProvider", () => ({
  useAppPreferences: () => ({
    locale: "en",
    t: {
      patient: {
        durationLabels: { less_than_24_hours: "<24h" },
        severityLabels: { mild: "Mild" },
        emergencyWarning: "Emergency warning",
        automaticSpecialtyRouting: "Automatic specialty routing",
        symptomsWillGuideSpecialty: "Symptoms guide specialty",
        duration: "Duration",
        severity: "Severity",
        fever: "Has fever",
        pain: "Has pain",
        breathingDifficulty: "Breathing difficulty",
        previousVisit: "Previous visit for same issue",
        additionalNotes: "Additional notes",
        selectSymptoms: "Select symptoms",
        symptomCategory: "Symptom category",
        allCategories: "All categories",
        searchSymptoms: "Search symptoms",
        selectedSymptoms: "Selected symptoms",
        clearSelection: "Clear selection",
        removeSymptom: "Remove symptom",
        safetyEmergencyNotice: "Emergency safety notice",
        noSymptomsAvailable: "No symptoms available",
        noSymptomsMatch: "No matching symptoms",
        loading: "Loading",
        atLeastOneSymptomRequired: "Select at least one symptom",
        submittingRequest: "Submitting",
        submitRequest: "Submit request",
        consultationCreateError: "Request failed",
        redFlagSymptom: "Red flag",
      },
    },
  }),
}));

import { ConsultationForm } from "@/components/patient/ConsultationForm";
import { getSymptoms } from "@/lib/patient/patientService";

const getSymptomsMock = vi.mocked(getSymptoms);

const categories: SymptomCategory[] = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Digestive" },
];

const symptoms: Symptom[] = [
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Abdominal pain",
    category: categories[0],
    is_red_flag: false,
  },
];

describe("ConsultationForm", () => {
  beforeEach(() => {
    getSymptomsMock.mockReset();
    getSymptomsMock.mockResolvedValue(symptoms);
  });

  it("shows symptoms when all categories is selected", async () => {
    const onSubmit = vi.fn(async () => {});

    render(
      <ConsultationForm
        categories={categories}
        submitting={false}
        error={null}
        onSubmit={onSubmit}
      />,
    );

    expect(getSymptomsMock).toHaveBeenCalledWith(undefined);
    expect(await screen.findByText("Abdominal pain")).toBeInTheDocument();
  });

  it("submits breathing and previous visit booleans", async () => {
    const onSubmit = vi.fn(async () => {});

    render(
      <ConsultationForm
        categories={categories}
        submitting={false}
        error={null}
        onSubmit={onSubmit}
      />,
    );

    await screen.findByText("Abdominal pain");

    const symptomButtons = screen.getAllByRole("button", { name: /Abdominal pain/i });
    symptomButtons.forEach((button) => {
      fireEvent.click(button);
    });

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[2]);
    fireEvent.click(checkboxes[3]);

    const submitButtons = screen.getAllByRole("button", { name: "Submit request" });
    const enabledSubmit = submitButtons.find((button) => !button.hasAttribute("disabled"));
    expect(enabledSubmit).toBeDefined();
    fireEvent.click(enabledSubmit!);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        has_breathing_difficulty: true,
        previous_visit_for_same_issue: true,
      }),
    );
  });
});
