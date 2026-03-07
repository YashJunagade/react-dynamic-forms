import type { Meta, StoryObj } from "@storybook/react";
import { FormRenderer } from "../src";
import type { FormSchema } from "../src";
import "../src/styles.css";

const meta: Meta<typeof FormRenderer> = {
  title: "FormRenderer/NestedGroups",
  component: FormRenderer,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: 560, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FormRenderer>;

const nestedSchema: FormSchema = {
  id: "nested-groups-form",
  title: "Lead Qualification",
  questions: [
    {
      key: "company_name",
      type: "textbox",
      label: "Company Name",
      validation: { required: true },
    },
    {
      key: "contact_info",
      type: "group",
      label: "Contact Information",
      collapsible: true,
      questions: [
        {
          key: "contact_name",
          type: "textbox",
          label: "Contact Name",
          validation: { required: true },
        },
        {
          key: "contact_email",
          type: "textbox",
          label: "Contact Email",
          validation: { required: true },
        },
        {
          key: "contact_phone",
          type: "textbox",
          label: "Phone Number",
          placeholder: "+1 (555) 000-0000",
        },
      ],
    },
    {
      key: "company_type",
      type: "radio",
      label: "Company Type",
      layout: "horizontal",
      options: [
        { label: "SaaS", value: "saas" },
        { label: "Agency", value: "agency" },
        { label: "E-commerce", value: "ecommerce" },
        { label: "Other", value: "other" },
      ],
      validation: { required: true },
    },
    {
      key: "saas_details",
      type: "group",
      label: "SaaS Details",
      collapsible: false,
      condition: { when: "company_type", operator: "equals", value: "saas" },
      questions: [
        {
          key: "mrr",
          type: "number",
          label: "Monthly Recurring Revenue ($)",
          prefix: "$",
          validation: { min: 0 },
        },
        {
          key: "plan_tier",
          type: "combo_select",
          label: "Current Plan Tier",
          options: [
            { label: "Starter", value: "starter" },
            { label: "Growth", value: "growth" },
            { label: "Enterprise", value: "enterprise" },
          ],
        },
      ],
    },
    {
      key: "tags",
      type: "array",
      label: "Tags",
      itemLabel: "Tag",
      maxItems: 5,
    },
    {
      key: "start_date",
      type: "datetime",
      label: "Expected Start Date",
      mode: "date",
    },
  ],
};

export const Default: Story = {
  args: {
    schema: nestedSchema,
    onSubmit: (values) => alert(JSON.stringify(values, null, 2)),
    showReset: true,
  },
};
