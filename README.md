# @yashjunagade/react-dynamic-forms

Render complex, fully-typed dynamic forms from a JSON schema.  
Supports 12+ question types, AND/OR conditional logic, nested groups, pluggable validation, CSS variable theming, and a custom question plugin system — with zero runtime dependencies beyond React.

---

## Install

```bash
npm install @yashjunagade/react-dynamic-forms
```

**Peer dependencies** (already in your project):
```bash
npm install react react-dom
```

**Optional** — Zod integration for schema validation:
```bash
npm install zod
```

---

## Quick Start

```tsx
import { FormRenderer } from "@yashjunagade/react-dynamic-forms";
import "@yashjunagade/react-dynamic-forms/dist/index.css";

const schema = {
  id: "contact",
  title: "Contact Us",
  questions: [
    { key: "name",    type: "textbox",  label: "Full Name",     validation: { required: true } },
    { key: "email",   type: "textbox",  label: "Email",         validation: { required: true, pattern: "^[^@]+@[^@]+\\.[^@]+$" } },
    { key: "message", type: "textarea", label: "Message",       validation: { required: true, minLength: 10 } },
  ],
};

export default function App() {
  return (
    <FormRenderer
      schema={schema}
      onSubmit={(values) => console.log(values)}
    />
  );
}
```

---

## Question Types

| Type | Description |
|---|---|
| `textbox` | Single-line text input. Supports `prefix`, `suffix`. |
| `textarea` | Multi-line text. Supports `minRows`, `maxRows`. |
| `number` | Numeric input. Supports `min`, `max`, `step`, `prefix`, `suffix`. |
| `checkbox` | Multi-select checkboxes. Supports `layout`: `vertical` / `horizontal` / `grid`. |
| `radio` | Single-select radio buttons. Supports `layout`: `vertical` / `horizontal`. |
| `combo_select` | Native `<select>` dropdown. Supports `searchable`, `clearable`. |
| `list_select` | Scrollable checkbox list with optional search filter. |
| `multi_string` | Multiple labeled text inputs that produce a `Record<string, string>`. |
| `file_upload` | File drop zone. Supports `accept`, `maxSizeMB`, `multiple`. |
| `datetime` | Date / time / datetime picker. Supports `mode`, `minDate`, `maxDate`. |
| `array` | Repeatable text items. Supports `minItems`, `maxItems`, `itemLabel`. |
| `group` | Nested container for other questions. Supports `collapsible`. |
| `config_only` | Display-only HTML content (no input). |
| `custom` | Your own component via the plugin system. |

---

## Schema Reference

### `FormSchema`

```ts
{
  id: string;
  title?: string;
  description?: string;
  questions: AnyQuestion[];
  submitLabel?: string;   // default: "Submit"
  resetLabel?: string;    // default: "Reset"
}
```

### `BaseQuestion` (on every question type)

```ts
{
  key: string;
  type: QuestionType;
  label: string;
  description?: string;
  placeholder?: string;
  defaultValue?: unknown;
  disabled?: boolean;
  hidden?: boolean;
  validation?: ValidationRules;
  condition?: Condition;
  conditionBehavior?: "hide" | "disable";   // default: "hide"
  customStyles?: QuestionStyles;
  uiConfig?: QuestionUIConfig;
}
```

---

## Validation

```ts
validation: {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  minSelected?: number;   // for checkbox / list_select
  maxSelected?: number;
  minItems?: number;      // for array
  maxItems?: number;
  pattern?: string;       // regex string
  custom?: CustomValidator | CustomValidator[];
}

// CustomValidator signature
type CustomValidator = (value: unknown, allValues: Record<string, unknown>) => string | null;
```

### Example — cross-field validation

```ts
{
  key: "confirm_password",
  type: "textbox",
  label: "Confirm Password",
  validation: {
    required: true,
    custom: (val, all) =>
      val !== all.password ? "Passwords do not match" : null,
  },
}
```

---

## Conditional Logic

### Single condition

```ts
{
  key: "reason",
  type: "textarea",
  label: "Reason for cancellation",
  condition: { when: "action", operator: "equals", value: "cancel" },
}
```

### AND condition — all must pass

```ts
condition: {
  and: [
    { when: "role",   operator: "equals",    value: "admin" },
    { when: "active", operator: "not_equals", value: false   },
  ],
}
```

### OR condition — any can pass

```ts
condition: {
  or: [
    { when: "plan", operator: "equals", value: "pro" },
    { when: "plan", operator: "equals", value: "enterprise" },
  ],
}
```

### Available operators

| Operator | Works on |
|---|---|
| `equals` | any |
| `not_equals` | any |
| `contains` | string |
| `not_contains` | string |
| `greater_than` | number |
| `less_than` | number |
| `is_empty` | string / array |
| `is_not_empty` | string / array |
| `includes` | array |
| `not_includes` | array |

### Disable instead of hide

```ts
conditionBehavior: "disable"  // question stays visible but is disabled
```

---

## Theming

Pass a `theme` prop to customise colours, radius, and font — no CSS overrides needed.

```tsx
<FormRenderer
  schema={schema}
  theme={{
    primaryColor: "#8b5cf6",
    errorColor: "#dc2626",
    borderRadius: "10px",
    fontFamily: "Inter, sans-serif",
    fontSize: "15px",
  }}
/>
```

All values are applied as CSS variables on the `<form>` element, so you can also override them in CSS:

```css
.my-form {
  --rdf-primary: #8b5cf6;
  --rdf-radius: 10px;
}
```

---

## Custom Styles

Every question accepts a `customStyles` object to target individual DOM elements:

```ts
{
  key: "email",
  type: "textbox",
  label: "Email",
  customStyles: {
    container:    { marginBottom: 24 },
    label:        { fontWeight: 700, color: "#1e293b" },
    input:        { borderRadius: 10, fontSize: 15 },
    description:  { fontStyle: "italic" },
    error:        { color: "#dc2626", fontSize: 12 },
    inputWrapper: { gap: 8 },
    prefix:       { color: "#64748b" },
    suffix:       { color: "#64748b" },
    // For checkbox / radio / list_select:
    options: {
      option:       { padding: "6px 12px", borderRadius: 8 },
      optionLabel:  { fontWeight: 500 },
      optionInput:  { accentColor: "#6366f1" },
    },
    // For combo_select:
    dropdown: {
      wrapper: {},
      select:  { borderRadius: 10 },
    },
    // For array questions:
    addButton:    { background: "#6366f1", color: "#fff" },
    removeButton: { color: "#ef4444" },
  },
}
```

---

## UI Config

Per-question behaviour that goes beyond styling:

```ts
uiConfig: {
  // Warning banner above the input
  warning: {
    showAlertIcon: true,
    message: "This will notify all admins.",
    subMessage: "Changes take effect immediately.",
  },

  // textbox: click-to-edit mode
  textBox: {
    showEditIcon: true,  // renders as text, ✏ to edit
  },

  // combo_select extras
  dropdown: {
    showClear: true,                           // show ✕ clear button
    noOptionText: "No options available",      // empty state message
  },

  // array question button labels
  array: {
    addLabel:    "Add email address",
    removeLabel: "Remove this email",
  },
}
```

---

## Custom Question Types

Register your own components via the `customQuestions` prop:

```tsx
import { FormRenderer } from "@yashjunagade/react-dynamic-forms";
import type { QuestionComponentProps } from "@yashjunagade/react-dynamic-forms";

function StarRating({ value, onChange }: QuestionComponentProps) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)}>
          {n <= (value as number) ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}

const schema = {
  id: "feedback",
  questions: [
    { key: "rating", type: "custom", customType: "star_rating", label: "Rate us" },
  ],
};

<FormRenderer
  schema={schema}
  customQuestions={{ star_rating: StarRating }}
/>
```

---

## FormRenderer Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `schema` | `FormSchema` | required | The form schema |
| `onSubmit` | `(values) => void` | — | Called with flat values when form is valid |
| `onChange` | `(key, value, allValues) => void` | — | Called on every field change |
| `theme` | `FormTheme` | `{}` | CSS variable overrides |
| `readOnly` | `boolean` | `false` | Disables all inputs, hides submit |
| `customQuestions` | `QuestionRegistry` | `{}` | Custom question type components |
| `submitLabel` | `string` | `"Submit"` | Submit button label |
| `resetLabel` | `string` | `"Reset"` | Reset button label |
| `showReset` | `boolean` | `false` | Show the reset button |
| `className` | `string` | — | Extra class on the `<form>` element |

---

## Advanced Hooks

For headless / fully custom rendering:

```ts
import {
  useFormState,
  useConditionalLogic,
  useValidation,
  useFormContext,
} from "@yashjunagade/react-dynamic-forms";
```

- `useFormState(schema)` — reducer-based values/touched/showErrors state
- `useConditionalLogic(questions, values)` — returns `{ visibleKeys, disabledKeys }`
- `useValidation(questions, values, visibleKeys)` — returns `{ errors, isValid }`
- `useFormContext()` — access context from inside a custom question component

---

## License

MIT © Yash Junagade
