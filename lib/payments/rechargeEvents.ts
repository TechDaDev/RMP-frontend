export const RECHARGE_PENDING_COUNT_REFRESH_EVENT = "payments:recharge-pending-count-refresh";

export function requestRechargePendingCountRefresh() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(RECHARGE_PENDING_COUNT_REFRESH_EVENT));
}
