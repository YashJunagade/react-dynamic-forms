import type { Meta, StoryObj } from "@storybook/react";
import { FormRenderer } from "../src";
import type { FormSchema, AnyQuestion } from "../src";
import "../src/styles.css";

const meta: Meta<typeof FormRenderer> = {
  title: "FormRenderer/BasicForm",
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

const basicSchema: FormSchema = {
  id: "basic-form",
  title: "Contact Form",
  description: "Fill in your details below.",
  questions: [
    {
      key: "full_name",
      type: "textbox",
      label: "Full Name",
      placeholder: "John Doe",
      validation: { required: true, minLength: 2 },
    },
    {
      key: "email",
      type: "textbox",
      label: "Email Address",
      placeholder: "john@example.com",
      validation: {
        required: true,
        pattern: "^[^@]+@[^@]+\\.[^@]+$",
      },
    },
    {
      key: "age",
      type: "number",
      label: "Age",
      min: 18,
      max: 100,
      validation: { required: true, min: 18 },
    },
    {
      key: "message",
      type: "textarea",
      label: "Message",
      placeholder: "Write your message...",
      maxRows: 6,
      validation: { required: true, minLength: 10 },
    },
  ],
};

export const Default: Story = {
  args: {
    schema: basicSchema,
    onSubmit: (values) => alert(JSON.stringify(values, null, 2)),
    showReset: true,
  },
};

export const ReadOnly: Story = {
  args: {
    schema: {
      ...basicSchema,
      questions: basicSchema.questions.map((q) => ({
        ...q,
        defaultValue:
          q.key === "full_name"
            ? "Jane Doe"
            : q.key === "email"
              ? "jane@example.com"
              : undefined,
      })) as AnyQuestion[],
    },
    readOnly: true,
  },
};

export const CustomTheme: Story = {
  args: {
    schema: basicSchema,
    onSubmit: (values) => alert(JSON.stringify(values, null, 2)),
    theme: {
      primaryColor: "#8b5cf6",
      borderRadius: "12px",
      fontFamily: "Georgia, serif",
    },
  },
};
