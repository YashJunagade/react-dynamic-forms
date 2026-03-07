import type { Meta, StoryObj } from "@storybook/react";
import { FormRenderer } from "../../src";
import type { FormSchema } from "../../src";
import "../../src/styles.css";

const meta: Meta<typeof FormRenderer> = {
  title: "Components/Text Inputs",
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

// ─── Textbox ──────────────────────────────────────────────────────────────────

const textboxSchema: FormSchema = {
  id: "textbox-demo",
  title: "Textbox Variants",
  questions: [
    {
      key: "plain",
      type: "textbox",
      label: "Plain textbox",
      placeholder: "Type something…",
    },
    {
      key: "with_prefix_suffix",
      type: "textbox",
      label: "With prefix & suffix",
      prefix: "https://",
      suffix: ".com",
      placeholder: "yoursite",
    },
    {
      key: "required",
      type: "textbox",
      label: "Required with minLength",
      placeholder: "At least 3 characters",
      validation: { required: true, minLength: 3 },
    },
    {
      key: "edit_icon",
      type: "textbox",
      label: "Edit-icon mode",
      placeholder: "Click ✏ to edit",
      defaultValue: "Click the pencil to edit me",
      uiConfig: { textBox: { showEditIcon: true } },
    },
  ],
};

export const Textbox: Story = { args: { schema: textboxSchema } };

// ─── Textarea ─────────────────────────────────────────────────────────────────

const textareaSchema: FormSchema = {
  id: "textarea-demo",
  title: "Textarea",
  questions: [
    {
      key: "notes",
      type: "textarea",
      label: "Notes",
      placeholder: "Write your notes…",
      minRows: 3,
      maxRows: 8,
      validation: { required: true, minLength: 10 },
    },
  ],
};

export const Textarea: Story = { args: { schema: textareaSchema } };

// ─── Number ───────────────────────────────────────────────────────────────────

const numberSchema: FormSchema = {
  id: "number-demo",
  title: "Number Input",
  questions: [
    {
      key: "age",
      type: "number",
      label: "Age",
      min: 0,
      max: 120,
      step: 1,
      validation: { required: true, min: 18, max: 99 },
    },
    {
      key: "price",
      type: "number",
      label: "Price",
      prefix: "$",
      suffix: "USD",
      step: 0.01,
      min: 0,
    },
  ],
};

export const Number: Story = { args: { schema: numberSchema } };

// ─── Warning banner ───────────────────────────────────────────────────────────

const warningSchema: FormSchema = {
  id: "warning-demo",
  title: "Warning Banner",
  questions: [
    {
      key: "email",
      type: "textbox",
      label: "Email",
      placeholder: "you@example.com",
      uiConfig: {
        warning: {
          showAlertIcon: true,
          message: "Changing your email will require re-verification.",
          subMessage: "You will be signed out after saving.",
        },
      },
    },
  ],
};

export const WarningBanner: Story = { args: { schema: warningSchema } };
