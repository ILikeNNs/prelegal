"use client";

import type { NdaFormData } from "@/lib/types";

interface NdaFormProps {
  data: NdaFormData;
  onChange: (data: NdaFormData) => void;
}

const inputClasses =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none";
const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
const fieldsetClasses = "space-y-4";

export default function NdaForm({ data, onChange }: NdaFormProps) {
  function update<K extends keyof NdaFormData>(key: K, value: NdaFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  function updateYears(key: "mndaTermYears" | "confidentialityTermYears", raw: string) {
    const parsed = Number(raw);
    update(key, Number.isNaN(parsed) || parsed < 1 ? 1 : parsed);
  }

  return (
    <form className={fieldsetClasses} onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className={labelClasses} htmlFor="party1Company">
          Party 1 company name
        </label>
        <input
          id="party1Company"
          type="text"
          className={inputClasses}
          value={data.party1Company}
          onChange={(e) => update("party1Company", e.target.value)}
          placeholder="Acme Inc."
        />
      </div>

      <div>
        <label className={labelClasses} htmlFor="party2Company">
          Party 2 company name
        </label>
        <input
          id="party2Company"
          type="text"
          className={inputClasses}
          value={data.party2Company}
          onChange={(e) => update("party2Company", e.target.value)}
          placeholder="Beta LLC"
        />
      </div>

      <div>
        <label className={labelClasses} htmlFor="purpose">
          Purpose
        </label>
        <textarea
          id="purpose"
          className={inputClasses}
          rows={3}
          value={data.purpose}
          onChange={(e) => update("purpose", e.target.value)}
        />
      </div>

      <div>
        <label className={labelClasses} htmlFor="effectiveDate">
          Effective date
        </label>
        <input
          id="effectiveDate"
          type="date"
          className={inputClasses}
          value={data.effectiveDate}
          onChange={(e) => update("effectiveDate", e.target.value)}
        />
      </div>

      <fieldset>
        <legend className={labelClasses}>MNDA term</legend>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="mndaTermOption"
              checked={data.mndaTermOption === "expires"}
              onChange={() => update("mndaTermOption", "expires")}
            />
            Expires
            <input
              type="number"
              min={1}
              className="w-16 rounded-md border border-gray-300 px-2 py-1 text-sm"
              value={data.mndaTermYears}
              onChange={(e) => updateYears("mndaTermYears", e.target.value)}
              disabled={data.mndaTermOption !== "expires"}
            />
            year(s) from effective date
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="mndaTermOption"
              checked={data.mndaTermOption === "untilTerminated"}
              onChange={() => update("mndaTermOption", "untilTerminated")}
            />
            Continues until terminated
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClasses}>Term of confidentiality</legend>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="confidentialityTermOption"
              checked={data.confidentialityTermOption === "years"}
              onChange={() => update("confidentialityTermOption", "years")}
            />
            <input
              type="number"
              min={1}
              className="w-16 rounded-md border border-gray-300 px-2 py-1 text-sm"
              value={data.confidentialityTermYears}
              onChange={(e) =>
                updateYears("confidentialityTermYears", e.target.value)
              }
              disabled={data.confidentialityTermOption !== "years"}
            />
            year(s) from effective date
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="confidentialityTermOption"
              checked={data.confidentialityTermOption === "perpetuity"}
              onChange={() => update("confidentialityTermOption", "perpetuity")}
            />
            In perpetuity
          </label>
        </div>
      </fieldset>

      <div>
        <label className={labelClasses} htmlFor="governingLaw">
          Governing law (state)
        </label>
        <input
          id="governingLaw"
          type="text"
          className={inputClasses}
          value={data.governingLaw}
          onChange={(e) => update("governingLaw", e.target.value)}
          placeholder="Delaware"
        />
      </div>

      <div>
        <label className={labelClasses} htmlFor="jurisdiction">
          Jurisdiction
        </label>
        <input
          id="jurisdiction"
          type="text"
          className={inputClasses}
          value={data.jurisdiction}
          onChange={(e) => update("jurisdiction", e.target.value)}
          placeholder="courts located in New Castle, DE"
        />
      </div>

      <div>
        <label className={labelClasses} htmlFor="modifications">
          MNDA modifications (optional)
        </label>
        <textarea
          id="modifications"
          className={inputClasses}
          rows={2}
          value={data.modifications}
          onChange={(e) => update("modifications", e.target.value)}
        />
      </div>
    </form>
  );
}
