"use client";

import { Download, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useExportPoster } from "@/lib/useExportPoster";

export function DownloadBar() {
  const { exportPoster, status, errorMsg } = useExportPoster();

  return (
    <div className="border-t border-line bg-paper px-5 py-4">
      <button
        onClick={exportPoster}
        disabled={status === "exporting"}
        className="flex w-full items-center justify-center gap-2 rounded-sm bg-ink px-4 py-3.5 text-[13.5px] font-medium text-paper transition hover:bg-forest disabled:opacity-60"
      >
        {status === "exporting" ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Rendering poster…
          </>
        ) : status === "done" ? (
          <>
            <CheckCircle2 size={15} /> Downloaded
          </>
        ) : (
          <>
            <Download size={15} /> Download poster
          </>
        )}
      </button>

      {status === "error" && (
        <div className="mt-3 flex items-start gap-2 rounded-sm bg-brass/10 px-3 py-2.5 text-[12px] leading-relaxed text-ink-soft">
          <AlertCircle size={14} className="mt-0.5 shrink-0 text-brass" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
