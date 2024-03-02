

import { ElementsType, FormElement, FormElementInstance } from "@/types/FormElements";
import { Label } from "../ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "@/hooks/useDesigner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { LuSeparatorHorizontal } from "react-icons/lu";
import { Slider } from "../ui/slider";

const fieldType: ElementsType = "SpacerField";

const attributes = {
  height: 20, // px
};

const propertiesSchema = z.object({
  height: z.number().min(5).max(200),
});

export const SpacerFieldFormElement: FormElement = {
  fieldType,
 construct: (id: string) => ({
    id,
    fieldType,
    attributes,
  }),
  designerBtnElement: {
    icon: LuSeparatorHorizontal,
    label: "Spacer field",
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
  const { height } = element.attributes;
  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <Label className="text-muted-foreground">Spacer field: {height}px</Label>
      <LuSeparatorHorizontal className="h-8 w-8" />
    </div>
  );
}

function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;

  const { height } = element.attributes;
  return <div style={{ height, width: "100%" }}></div>;
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      height: element.attributes.height,
    },
  });

  useEffect(() => {
    form.reset(element.attributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { height } = values;
    updateElement(element.id, {
      ...element,
      attributes: {
        height,
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
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (px): {form.watch("height")}</FormLabel>
              <FormControl className="pt-2">
                <Slider
                  defaultValue={[field.value]}
                  min={5}
                  max={200}
                  step={1}
                  onValueChange={(value:any) => {
                    field.onChange(value[0]);
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
