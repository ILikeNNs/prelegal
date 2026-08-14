import type { NdaFormData } from "./types";

/**
 * Escapes characters that would otherwise be interpreted as Markdown syntax
 * or break out of the table cells this template embeds user input into.
 */
function escapeMarkdown(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/[<>&*_`[\]|]/g, (char) => `\\${char}`)
    .replace(/\r?\n/g, " ")
    .replace(/^([#>+-])/, "\\$1");
}

function formatDate(isoDate: string): string {
  if (!isoDate) return "[Fill in effective date]";
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Renders as a static glyph rather than GFM task-list syntax ("- [x]"), which
 * react-markdown turns into a real <input type="checkbox"> element. Because
 * that input only receives an explicit `checked` prop when true, flipping an
 * option from checked to unchecked leaves the previous DOM checkbox stuck
 * showing checked - producing a document with two contradictory boxes
 * checked. This is a read-only preview of a printed document, not an
 * interactive control, so a plain glyph avoids that class of bug entirely.
 */
function checkbox(checked: boolean): string {
  return checked ? "☒" : "☐";
}

export function buildCoverPage(data: NdaFormData): string {
  const purpose = escapeMarkdown(data.purpose) || "[Fill in purpose]";
  const governingLaw = escapeMarkdown(data.governingLaw) || "[Fill in state]";
  const jurisdiction =
    escapeMarkdown(data.jurisdiction) || "[Fill in city or county and state]";
  const party1Company = escapeMarkdown(data.party1Company);
  const party2Company = escapeMarkdown(data.party2Company);
  const modifications = escapeMarkdown(data.modifications) || "None.";

  return `# Mutual Non-Disclosure Agreement

## USING THIS MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement (the "MNDA") consists of: (1) this Cover Page ("**Cover Page**") and (2) the Common Paper Mutual NDA Standard Terms Version 1.0 ("**Standard Terms**") identical to those posted at [commonpaper.com/standards/mutual-nda/1.0](https://commonpaper.com/standards/mutual-nda/1.0). Any modifications of the Standard Terms should be made on the Cover Page, which will control over conflicts with the Standard Terms.

### Purpose
<label>How Confidential Information may be used</label>

${purpose}

### Effective Date
${formatDate(data.effectiveDate)}

### MNDA Term
<label>The length of this MNDA</label>
- ${checkbox(data.mndaTermOption === "expires")}     Expires ${data.mndaTermYears} year(s) from Effective Date.
- ${checkbox(data.mndaTermOption === "untilTerminated")}     Continues until terminated in accordance with the terms of the MNDA.

### Term of Confidentiality
<label>How long Confidential Information is protected</label>
- ${checkbox(data.confidentialityTermOption === "years")}     ${data.confidentialityTermYears} year(s) from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.
- ${checkbox(data.confidentialityTermOption === "perpetuity")}     In perpetuity.

### Governing Law & Jurisdiction
Governing Law: ${governingLaw}

Jurisdiction: ${jurisdiction}

### MNDA Modifications
List any modifications to the MNDA

${modifications}

By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.

|| PARTY 1 | PARTY 2 |
|:--- | :----: | :----: |
| Signature | | |
| Print Name | | |
| Title | | |
| Company | ${party1Company} | ${party2Company} |
| Notice Address <label>Use either email or postal address</label> | | |
| Date | | |

Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
`;
}
