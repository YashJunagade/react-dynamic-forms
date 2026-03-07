import type { Meta, StoryObj } from "@storybook/react";
import { FormRenderer } from "../../src";
import type { FormSchema } from "../../src";
import "../../src/styles.css";

const meta: Meta<typeof FormRenderer> = {
  title: "Components/Multi String",
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

const addressSchema: FormSchema = {
  id: "address-demo",
  title: "Multi-String: Shipping Address",
  description: "Each field is a named input row inside one question.",
  questions: [
    {
      key: "address",
      type: "multi_string",
      label: "Shipping Address",
      fields: [
        { key: "line1", label: "Address Line 1", placeholder: "123 Main St" },
        { key: "line2", label: "Address Line 2", placeholder: "Suite 4B (optional)" },
        { key: "city", label: "City", placeholder: "Mumbai" },
        { key: "state", label: "State / Province", placeholder: "Maharashtra" },
        { key: "zip", label: "Postal Code", placeholder: "400001" },
        { key: "country", label: "Country", placeholder: "India" },
      ],
      validation: { required: true },
    },
  ],
};

export const Address: Story = { args: { schema: addressSchema } };

const socialSchema: FormSchema = {
  id: "social-demo",
  title: "Multi-String: Social Links",
  questions: [
    {
      key: "socials",
      type: "multi_string",
      label: "Social Media Profiles",
      fields: [
        { key: "twitter", label: "Twitter / X", placeholder: "@handle" },
        { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/you" },
        { key: "github", label: "GitHub", placeholder: "github.com/you" },
        { key: "website", label: "Website", placeholder: "https://yoursite.com" },
      ],
    },
  ],
};

export const SocialLinks: Story = { args: { schema: socialSchema } };
