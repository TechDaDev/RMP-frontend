export function canLaboratoryScan(isApproved: boolean): boolean {
  return isApproved;
}

export function isLabOrderLocked(status: string): boolean {
  return status === "fully_completed" || status === "expired" || status === "cancelled";
}

export function canCompleteLabOrder(status: string): boolean {
  return !isLabOrderLocked(status);
}

export function canCreateResultForItem(itemStatus: string, orderStatus?: string): boolean {
  if (itemStatus !== "completed") {
    return false;
  }

  if (!orderStatus) {
    return true;
  }

  return !isLabOrderLocked(orderStatus);
}

export function canCorrectResult(status: string): boolean {
  return status === "submitted" || status === "corrected";
}

export function canViewResult(status: string): boolean {
  return (
    status === "submitted" ||
    status === "corrected" ||
    status === "reviewed" ||
    status === "released"
  );
}

export function getLabOrderStatusTone(status: string): "neutral" | "primary" | "success" {
  switch (status) {
    case "issued":
      return "primary";
    case "partially_completed":
      return "primary";
    case "fully_completed":
      return "success";
    case "expired":
    case "cancelled":
      return "neutral";
    default:
      return "neutral";
  }
}

export function getLabResultStatusTone(status: string): "neutral" | "info" | "success" | "warning" | "danger" {
  switch (status) {
    case "submitted":
      return "info";
    case "corrected":
      return "warning";
    case "reviewed":
      return "neutral";
    case "released":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "neutral";
  }
}
