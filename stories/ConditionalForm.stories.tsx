import type { Meta, StoryObj } from "@storybook/react";
import { FormRenderer } from "../src";
import type { FormSchema } from "../src";
import "../src/styles.css";

const meta: Meta<typeof FormRenderer> = {
  title: "FormRenderer/ConditionalForm",
  component: FormRenderer,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: 520, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FormRenderer>;

const conditionalSchema: FormSchema = {
  id: "conditional-form",
  title: "Company Signup",
  questions: [
    {
      key: "company_size",
      type: "combo_select",
      label: "Company Size",
      options: [
        { label: "1–10 employees", value: "small" },
        { label: "11–50 employees", value: "medium" },
        { label: "51–200 employees", value: "large" },
        { label: "200+ employees", value: "enterprise" },
      ],
      validation: { required: true },
    },
    {
      key: "team_name",
      type: "textbox",
      label: "Team Name",
      placeholder: "e.g. Engineering",
      // Only show when medium or large
      condition: {
        or: [
          { when: "company_size", operator: "equals", value: "medium" },
          { when: "company_size", operator: "equals", value: "large" },
        ],
      },
    },
    {
      key: "enterprise_contact",
      type: "textbox",
      label: "Enterprise Contact Email",
      placeholder: "enterprise@company.com",
      // Only show for enterprise
      condition: { when: "company_size", operator: "equals", value: "enterprise" },
      validation: { required: true },
    },
    {
      key: "services",
      type: "checkbox",
      label: "Services Needed",
      options: [
        { label: "Lead Generation", value: "lead_gen" },
        { label: "Email Outreach", value: "email" },
        { label: "Data Enrichment", value: "enrichment" },
        { label: "Analytics", value: "analytics" },
      ],
      validation: { required: true, minSelected: 1 },
    },
    {
      key: "analytics_tool",
      type: "combo_select",
      label: "Preferred Analytics Tool",
      options: [
        { label: "Google Analytics", value: "ga" },
        { label: "Mixpanel", value: "mixpanel" },
        { label: "Amplitude", value: "amplitude" },
      ],
      // Show only when analytics is in services (uses "includes" operator)
      condition: { when: "services", operator: "includes", value: "analytics" },
    },
  ],
};

export const Default: Story = {
  args: {
    schema: conditionalSchema,
    onSubmit: (values) => alert(JSON.stringify(values, null, 2)),
    onChange: (key, value, all) => console.log("onChange", key, value, all),
  },
};
