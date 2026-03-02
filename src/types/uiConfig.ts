/**
 * Per-question UI behaviour configuration.
 * Controls features like edit-mode toggles, dropdown UX, warning banners, etc.
 * This is separate from `customStyles` (which controls visual appearance) and
 * `validation` (which controls error logic).
 */
export interface QuestionUIConfig {
  /**
   * Show a warning banner above the input.
   * Useful for communicating caveats or guidance without blocking the user.
   */
  warning?: {
    /** Show an alert icon (⚠) beside the message. @default false */
    showAlertIcon?: boolean;
    /** Primary warning message */
    message: string;
    /** Secondary / sub message shown below the main message */
    subMessage?: string;
  };

  /**
   * textbox / textarea specific UI config
   */
  textBox?: {
    /**
     * Renders the value as plain text with a pencil icon.
     * Clicking the icon switches to an editable input.
     * @default false
     */
    showEditIcon?: boolean;
  };

  /**
   * combo_select specific UI config.
   * Note: `searchable` and `clearable` can also be set directly on the question;
   * these options let you control additional dropdown UX behaviour.
   */
  dropdown?: {
    /**
     * Show a ✕ button to clear the current selection.
     * Overrides the question-level `clearable` flag when set.
     * @default false
     */
    showClear?: boolean;

    /**
     * Text shown inside the dropdown when there are no options to display.
     * @default "No options available"
     */
    noOptionText?: string;

    /**
     * Show a badge with the count of selected items (multi-select context).
     * @default false
     */
    showSelectedCount?: boolean;
  };

  /**
   * datetime specific UI config
   */
  date?: {
    /**
     * Override the display format for the date value (uses date-fns patterns).
     * Only applies when the input is rendered in read-only/display mode.
     *
     * @example "yyyy-MM-dd" → "2026-01-08"
     * @example "dd/MM/yyyy" → "08/01/2026"
     * @example "MMMM d, yyyy" → "January 8, 2026"
     */
    dateFormat?: string;
  };

  /**
   * array question specific UI config
   */
  array?: {
    /**
     * Custom label for the "Add item" button.
     * @default "Add item"
     */
    addLabel?: string;

    /**
     * Custom aria-label for the remove (✕) button.
     * @default "Remove item"
     */
    removeLabel?: string;
  };
}
