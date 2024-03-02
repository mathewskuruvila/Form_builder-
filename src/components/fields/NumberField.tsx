import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { number, z } from "zod";
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "@/types/FormElements";
import useDesigner from "@/hooks/useDesigner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { cn } from "@/lib/utils";
import { Bs123 } from "react-icons/bs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Switch } from "../ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

const fieldType: ElementsType = "NumberField";

const attributes = {
  label: "Number field",
  helperText: "Helper text",
  required: false,
  placeHolder: "Value here...",
  minimum: 1,
  maximum: 30,
  negative: false,// TODO choose best name change to positive
  decimal: false

};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
  minimum: z.coerce.number().int(),
  maximum: z.coerce.number().int(),
  negative: z.boolean().default(false),
  decimal: z.boolean().default(false),

});

export const NumberFieldFormElement: FormElement = {
  fieldType,
  construct: (id: string) => ({
    id,
    fieldType,
    attributes,
  }),
  designerBtnElement: {
    icon: Bs123,
    label: "Number Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: (formElement: FormElementInstance, currentValue: string): boolean => {
    const element = formElement as CustomInstance;
    if (element.attributes.required) {
      if (currentValue.length === 0) {
        console.log("required condition failed");
        return false;
      }
    }
    if (!element.attributes.negative) {
      if (Number(currentValue) < 0) {
        console.log("negative condition failed");
        return false;
      }
    }

    if (!element.attributes.decimal) {
      if (Number(currentValue) % 1 !== 0) {
        // value % 1 !== 0
        console.log("decimal condition failed", Number(currentValue) % 1);
        return false;
      }
    }

    if (currentValue.length < Number(element.attributes.minimum)) {
      console.log("minimum condition failed", Number(element.attributes.minimum));
      return false;
    }
    if (currentValue.length > Number(element.attributes.maximum)) {
      console.log("maximum condition failed", Number(element.attributes.maximum));
      return false;
    }
    return true;
  },
};

type CustomInstance = FormElementInstance & {
  attributes: typeof attributes;
};

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { label, required, placeHolder, helperText } = element.attributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Input readOnly disabled type="number" placeholder={placeHolder} />
      {/* {helperText && <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>{helperText}</p>} */}
    </div>
  );
}

function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
  defaultValue?: string;
}) {
  const element = elementInstance as CustomInstance;

  const [value, setValue] = useState(defaultValue || "");
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  const { label, required, placeHolder, helperText } = element.attributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Input
        type="number"
        className={cn(error && "border-red-500")}
        placeholder={placeHolder}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          if (!submitValue) return;
          const valid = NumberFieldFormElement.validate(element, e.target.value);
          setError(!valid);
          if (!valid) return;
          submitValue(element.id, e.target.value);
        }}
        value={value}
      />
      {/* {console.log(error)} */}
      {error && <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>{helperText}</p>}
    </div>
  );
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      label: element.attributes.label,
      helperText: element.attributes.helperText,
      required: element.attributes.required,
      placeHolder: element.attributes.placeHolder,
      minimum: element.attributes.minimum,
      maximum: element.attributes.maximum,
      negative: element.attributes.negative,
      decimal: element.attributes.decimal,
    },
  });

  useEffect(() => {
    form.reset(element.attributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { label, helperText, placeHolder, required, minimum, maximum, decimal, negative } = values;
    updateElement(element.id, {
      ...element,
      attributes: {
        label,
        helperText,
        placeHolder,
        required,
        minimum,
        maximum,
        negative,
        decimal
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
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PlaceHolder</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Validations</AccordionTrigger>
            <AccordionContent>
              <FormField
                control={form.control}
                name="minimum"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Minimum</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.currentTarget.blur();
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maximum"
                render={({ field }) => (
                  <FormItem  className="mb-4">
                    <FormLabel>Maximum</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.currentTarget.blur();
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="negative"
                render={({ field }) => (
                  <FormItem className="mb-4 flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Negative</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="decimal"
                render={({ field }) => (
                  <FormItem className="mb-4 flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Decimal</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Required</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
}
