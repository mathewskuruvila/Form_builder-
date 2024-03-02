import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(4),
  description: z.string().optional(),
});

export type formSchemaType = z.infer<typeof formSchema>;

export const loginSchema = z.object({
  username: z.string().min(4),
  password: z.string().min(4),
});

export type loginSchemaType = z.infer<typeof loginSchema>;

// text, text area,number,
export const defaultSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
  minimum: z.coerce.number().int(),
  maximum: z.coerce.number().int(),
});

export const fieldValueVaidator = (condition: any, value: number) => {
  if (condition.required) return String(value).length > 0;
  if (!condition.negative) return value < 0;
  if (!condition.decimal) return value % 1 !== 0;
  console.log(condition.required)
  return true
};
