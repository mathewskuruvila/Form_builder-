

import { ElementsType, FormElement, FormElementInstance } from "@/types/FormElements";

import { Label } from "../ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "@/hooks/useDesigner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { BsTextParagraph } from "react-icons/bs";
import { Textarea } from "../ui/textarea";

const fieldType: ElementsType = "ParagraphField";

const attributes = {
  text: "Text here",
};

const propertiesSchema = z.object({
  text: z.string().min(3).max(500),
});

export const ParagprahFieldFormElement: FormElement = {
  fieldType,
 construct: (id: string) => ({
    id,
    fieldType,
    attributes,
  }),
  designerBtnElement: {
    icon: BsTextParagraph,
    label: "Paragraph field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => true,
};

type CustomInstance = FormElementInstance & {
  attributes: typeof attributes;
};

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { text } = element.attributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">Paragraph field</Label>
      <p className="truncate">{text}</p>
    </div>
  );
}

function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;

  const { text } = element.attributes;
  return <p className="text-muted-foreground">{text}</p>;
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      text: element.attributes.text,
    },
  });

  useEffect(() => {
    form.register("text", { value: element.attributes.text });
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { text } = values;
    form.setValue("text", text);
    updateElement(element.id, {
      ...element,
      attributes: {
        text,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
