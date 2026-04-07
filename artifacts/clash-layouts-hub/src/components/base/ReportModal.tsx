import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useCreateReport } from "@workspace/api-client-react";
import { useTranslation } from "@/contexts/LanguageContext";

interface ReportModalProps {
  baseId: string;
  open: boolean;
  onClose: () => void;
}

const reasons = ["broken_link", "outdated", "wrong_th", "spam", "other"] as const;

export function ReportModal({ baseId, open, onClose }: ReportModalProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState<typeof reasons[number]>("broken_link");
  const [submitted, setSubmitted] = useState(false);
  const createReport = useCreateReport();

  function handleSubmit() {
    createReport.mutate(
      { data: { base_id: baseId, reason } },
      {
        onSuccess: () => setSubmitted(true),
      }
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <h2 className="font-bold text-lg">{t.reportModal.title}</h2>
        </div>

        {submitted ? (
          <div className="text-center py-6">
            <p className="text-green-600 font-semibold mb-2">Thank you for your report!</p>
            <p className="text-sm text-muted-foreground">Our team will review this base shortly.</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">{t.reportModal.reason}</label>
              <div className="grid grid-cols-1 gap-2">
                {reasons.map(r => (
                  <button
                    key={r}
                    onClick={() => setReason(r)}
                    className={`text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                      reason === r
                        ? "border-primary bg-primary/5 text-primary font-medium"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {t.reportModal[r]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                {t.reportModal.cancel}
              </button>
              <button
                onClick={handleSubmit}
                disabled={createReport.isPending}
                className="flex-1 px-4 py-2 bg-destructive text-white rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                {createReport.isPending ? "Submitting..." : t.reportModal.submit}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
