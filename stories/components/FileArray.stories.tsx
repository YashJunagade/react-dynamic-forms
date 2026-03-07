import type { Meta, StoryObj } from "@storybook/react";
import { FormRenderer } from "../../src";
import type { FormSchema } from "../../src";
import "../../src/styles.css";

const meta: Meta<typeof FormRenderer> = {
  title: "Components/File & Array",
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

// ─── file_upload ──────────────────────────────────────────────────────────────

const fileSchema: FormSchema = {
  id: "file-demo",
  title: "File Upload",
  questions: [
    {
      key: "avatar",
      type: "file_upload",
      label: "Profile picture (images only, max 2 MB)",
      accept: "image/*",
      maxSizeMB: 2,
      validation: { required: true },
    },
    {
      key: "documents",
      type: "file_upload",
      label: "Attachments (multiple files, PDF or Word)",
      accept: ".pdf,.doc,.docx",
      multiple: true,
      maxSizeMB: 10,
    },
  ],
};

export const FileUpload: Story = { args: { schema: fileSchema } };

// ─── array ────────────────────────────────────────────────────────────────────

const arraySchema: FormSchema = {
  id: "array-demo",
  title: "Array Question",
  questions: [
    {
      key: "emails",
      type: "array",
      label: "CC Email Addresses",
      itemLabel: "email",
      minItems: 1,
      maxItems: 5,
      validation: { required: true, minItems: 1 },
      uiConfig: {
        array: {
          addLabel: "Add email address",
          removeLabel: "Remove this email",
        },
      },
    },
    {
      key: "tags",
      type: "array",
      label: "Tags",
      itemLabel: "tag",
      maxItems: 10,
    },
  ],
};

export const ArrayInput: Story = { args: { schema: arraySchema } };

// ─── datetime ────────────────────────────────────────────────────────────────

const datetimeSchema: FormSchema = {
  id: "datetime-demo",
  title: "Date & Time",
  questions: [
    {
      key: "birthday",
      type: "datetime",
      label: "Date of Birth",
      mode: "date",
      maxDate: new Date().toISOString().split("T")[0],
      validation: { required: true },
    },
    {
      key: "meeting",
      type: "datetime",
      label: "Meeting Date & Time",
      mode: "datetime",
      minDate: new Date().toISOString().split("T")[0],
    },
    {
      key: "alarm",
      type: "datetime",
      label: "Alarm Time",
      mode: "time",
    },
  ],
};

export const DateTime: Story = { args: { schema: datetimeSchema } };
