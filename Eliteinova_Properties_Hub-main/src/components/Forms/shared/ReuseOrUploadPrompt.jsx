// src/components/Forms/shared/ReuseOrUploadPrompt.jsx
//
// One-time, form-level question that replaces asking "use existing?" field by
// field: is this listing for the poster themselves, or for someone else?
// Shown when the poster has at least one verified reusable document/media
// item, a usable profile to prefill contact details from, or both - either
// one alone is reason enough to offer this, so the copy below stays generic
// rather than naming just one of the two.
import React from "react";

export default function ReuseOrUploadPrompt({ onChoice }) {
  return (
    <div className="mb-3 p-3 rounded-xl border-2 border-dashed border-teal-300 bg-green-50">
      <p className="text-[12px] font-semibold text-[#00695C] mb-1.5">
        Is this listing for yourself, or for someone else?
      </p>
      <p className="text-[10px] text-gray-500 mb-2">
        We found verified details already on your profile. Reuse your contact info, documents
        and photos instead of re-entering them, or start fresh if this listing is for someone else.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChoice("self")}
          className="flex-1 py-2 rounded-lg bg-[#00695C] text-white text-[11px] font-bold"
        >
          It's me — reuse my verified details
        </button>
        <button
          type="button"
          onClick={() => onChoice("other")}
          className="flex-1 py-2 rounded-lg border-2 border-[#00695C] text-[#00695C] text-[11px] font-bold"
        >
          Someone else — upload new
        </button>
      </div>
    </div>
  );
}
