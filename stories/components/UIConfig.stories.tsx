import type { Meta, StoryObj } from "@storybook/react";
import { FormRenderer } from "../../src";
import type { FormSchema } from "../../src";
import "../../src/styles.css";

const meta: Meta<typeof FormRenderer> = {
  title: "Components/UI Config",
  component: FormRenderer,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: 480, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof FormRenderer>;

// ─── Warning banners ──────────────────────────────────────────────────────────

const warningSchema: FormSchema = {
  id: "warning-demo",
  title: "Warning Banners",
  questions: [
    {
      key: "email",
      type: "textbox",
      label: "Email (with icon + sub-message)",
      placeholder: "you@example.com",
      uiConfig: {
        warning: {
          showAlertIcon: true,
          message: "Changing your email will require re-verification.",
          subMessage: "You will be signed out after saving.",
        },
      },
    },
    {
      key: "phone",
      type: "textbox",
      label: "Phone (message only)",
      placeholder: "+91 00000 00000",
      uiConfig: {
        warning: {
          showAlertIcon: false,
          message: "International numbers must include the country code.",
        },
      },
    },
  ],
};

export const WarningBanners: Story = { args: { schema: warningSchema } };

// ─── Edit-icon mode ───────────────────────────────────────────────────────────

const editIconSchema: FormSchema = {
  id: "edit-icon-demo",
  title: "Edit-Icon Mode",
  description: "Fields render as display text. Click ✏ to enter edit mode.",
  questions: [
    {
      key: "company",
      type: "textbox",
      label: "Company Name",
      defaultValue: "Acme Corporation",
      uiConfig: { textBox: { showEditIcon: true } },
    },
    {
      key: "website",
      type: "textbox",
      label: "Website",
      prefix: "https://",
      defaultValue: "acme.com",
      uiConfig: { textBox: { showEditIcon: true } },
    },
    {
      key: "empty_field",
      type: "textbox",
      label: "Empty field (click to fill)",
      placeholder: "Not set",
      uiConfig: { textBox: { showEditIcon: true } },
    },
  ],
};

export const EditIconMode: Story = { args: { schema: editIconSchema } };

// ─── Dropdown uiConfig ────────────────────────────────────────────────────────

const dropdownConfigSchema: FormSchema = {
  id: "dropdown-config-demo",
  title: "Dropdown UI Config",
  questions: [
    {
      key: "country",
      type: "combo_select",
      label: "Country (showClear)",
      placeholder: "Select…",
      options: [
        { label: "India", value: "in" },
        { label: "United States", value: "us" },
        { label: "Germany", value: "de" },
      ],
      defaultValue: "in",
      uiConfig: { dropdown: { showClear: true } },
    },
    {
      key: "empty",
      type: "combo_select",
      label: "Empty options (custom noOptionText)",
      placeholder: "Nothing here",
      options: [],
      uiConfig: { dropdown: { noOptionText: "No options loaded — check your connection" } },
    },
  ],
};

export const DropdownConfig: Story = { args: { schema: dropdownConfigSchema } };

// ─── Custom styles showcase ───────────────────────────────────────────────────

const stylesSchema: FormSchema = {
  id: "custom-styles-demo",
  title: "Custom Styles",
  description: "Every part of a question can be styled via customStyles.",
  questions: [
    {
      key: "styled_input",
      type: "textbox",
      label: "Styled Input",
      placeholder: "Custom border + font",
      customStyles: {
        container: { marginBottom: 24, padding: 16, background: "#f8fafc", borderRadius: 12 },
        label: { color: "#6366f1", fontWeight: 700, fontSize: 15 },
        input: { borderRadius: 12, border: "2px solid #6366f1", fontSize: 15 },
      },
    },
    {
      key: "styled_radio",
      type: "radio",
      label: "Styled Radio Options",
      options: [
        { label: "Option A", value: "a" },
        { label: "Option B", value: "b" },
        { label: "Option C", value: "c" },
      ],
      layout: "horizontal",
      customStyles: {
        options: {
          option: { background: "#f1f5f9", padding: "6px 14px", borderRadius: 20 },
          optionLabel: { color: "#334155", fontWeight: 500 },
        },
      },
    },
  ],
};

export const CustomStyles: Story = { args: { schema: stylesSchema } };
