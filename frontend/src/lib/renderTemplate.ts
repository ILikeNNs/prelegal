/**
 * Escapes characters that would otherwise be interpreted as Markdown syntax
 * or break out of the table cells templates embed user input into.
 */
function escapeMarkdown(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/[<>&*_`[\]|]/g, (char) => `\\${char}`)
    .replace(/\r?\n/g, " ")
    .replace(/^([#>+-])/, "\\$1");
}

const TOKEN_PATTERN = /\{\{([a-zA-Z0-9]+)(?:=([a-zA-Z0-9]+))?\}\}/g;

/**
 * Fills in a cover page template's `{{fieldName}}` (text) and
 * `{{fieldName=optionKey}}` (checkbox) tokens with the given field values.
 * One generic renderer drives every document type's cover page, since they
 * all share this same token convention (see backend/document_data/*.json).
 */
export function renderCoverPage(
  template: string,
  fields: Record<string, string | null>,
  fieldLabels: Record<string, string>
): string {
  return template.replace(TOKEN_PATTERN, (_match, fieldName: string, optionKey?: string) => {
    if (optionKey !== undefined) {
      return fields[fieldName] === optionKey ? "☒" : "☐";
    }
    const value = fields[fieldName];
    if (value && value.trim()) {
      return escapeMarkdown(value);
    }
    return `[Fill in ${fieldLabels[fieldName] ?? fieldName}]`;
  });
}
