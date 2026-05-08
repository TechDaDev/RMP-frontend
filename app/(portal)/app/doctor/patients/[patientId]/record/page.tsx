import { DoctorPatientRecordPage } from "./DoctorPatientRecordPage";

interface PageProps {
  params: Promise<{ patientId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { patientId } = await params;
  return <DoctorPatientRecordPage patientId={patientId} />;
}
