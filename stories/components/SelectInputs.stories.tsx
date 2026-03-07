import type { Meta, StoryObj } from "@storybook/react";
import { FormRenderer } from "../../src";
import type { FormSchema } from "../../src";
import "../../src/styles.css";

const meta: Meta<typeof FormRenderer> = {
  title: "Components/Select Inputs",
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

const COUNTRIES = [
  { label: "India", value: "in" },
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "gb" },
  { label: "Germany", value: "de" },
  { label: "Japan", value: "jp" },
  { label: "Australia", value: "au" },
];

const SIZES = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
  { label: "Extra Large", value: "xl" },
];

// ─── combo_select ─────────────────────────────────────────────────────────────

const comboSchema: FormSchema = {
  id: "combo-demo",
  title: "Combo Select",
  questions: [
    {
      key: "country",
      type: "combo_select",
      label: "Country",
      placeholder: "Pick a country",
      options: COUNTRIES,
      clearable: true,
      validation: { required: true },
    },
    {
      key: "size",
      type: "combo_select",
      label: "Size (with clear button via uiConfig)",
      placeholder: "Pick a size",
      options: SIZES,
      uiConfig: { dropdown: { showClear: true } },
    },
    {
      key: "empty_demo",
      type: "combo_select",
      label: "Empty options (custom noOptionText)",
      placeholder: "Nothing here",
      options: [],
      uiConfig: { dropdown: { noOptionText: "No countries loaded yet" } },
    },
  ],
};

export const ComboSelect: Story = { args: { schema: comboSchema } };

// ─── list_select ──────────────────────────────────────────────────────────────

const listSchema: FormSchema = {
  id: "list-demo",
  title: "List Select",
  questions: [
    {
      key: "features",
      type: "list_select",
      label: "Features (searchable)",
      options: [
        { label: "Analytics", value: "analytics" },
        { label: "Automation", value: "automation" },
        { label: "CRM Integration", value: "crm" },
        { label: "Custom Reports", value: "reports" },
        { label: "Live Chat", value: "livechat" },
        { label: "Multi-language", value: "i18n" },
        { label: "SSO Login", value: "sso" },
      ],
      searchable: true,
      maxHeight: 220,
      validation: { required: true, minSelected: 1 },
    },
    {
      key: "tags",
      type: "list_select",
      label: "Tags (non-searchable)",
      options: COUNTRIES,
      maxHeight: 150,
    },
  ],
};

export const ListSelect: Story = { args: { schema: listSchema } };

// ─── radio ────────────────────────────────────────────────────────────────────

const radioSchema: FormSchema = {
  id: "radio-demo",
  title: "Radio Buttons",
  questions: [
    {
      key: "plan",
      type: "radio",
      label: "Billing Plan (vertical)",
      options: [
        { label: "Starter — Free", value: "free" },
        { label: "Pro — $29/mo", value: "pro" },
        { label: "Enterprise — Custom", value: "enterprise" },
      ],
      layout: "vertical",
      validation: { required: true },
    },
    {
      key: "size",
      type: "radio",
      label: "Size (horizontal)",
      options: SIZES,
      layout: "horizontal",
    },
  ],
};

export const Radio: Story = { args: { schema: radioSchema } };

// ─── checkbox ─────────────────────────────────────────────────────────────────

const checkboxSchema: FormSchema = {
  id: "checkbox-demo",
  title: "Checkboxes",
  questions: [
    {
      key: "services",
      type: "checkbox",
      label: "Services (vertical, minSelected: 1)",
      layout: "vertical",
      options: [
        { label: "Email support", value: "email" },
        { label: "Live chat", value: "chat" },
        { label: "Phone support", value: "phone" },
        { label: "On-site visits", value: "onsite" },
      ],
      validation: { required: true, minSelected: 1, maxSelected: 3 },
    },
    {
      key: "days",
      type: "checkbox",
      label: "Working days (horizontal)",
      layout: "horizontal",
      options: [
        { label: "Mon", value: "mon" },
        { label: "Tue", value: "tue" },
        { label: "Wed", value: "wed" },
        { label: "Thu", value: "thu" },
        { label: "Fri", value: "fri" },
      ],
    },
  ],
};

export const Checkbox: Story = { args: { schema: checkboxSchema } };
