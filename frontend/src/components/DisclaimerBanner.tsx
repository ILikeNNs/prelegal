import { DISCLAIMER_TEXT } from "@/lib/disclaimer";

export default function DisclaimerBanner() {
  return (
    <div className="no-print bg-brand-yellow/20 px-6 py-2 text-center text-xs text-brand-navy">
      {DISCLAIMER_TEXT}
    </div>
  );
}
