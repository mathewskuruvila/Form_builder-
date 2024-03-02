import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "@/types/FormElements";
import useDesigner from "@/hooks/useDesigner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { cn } from "@/lib/utils";
import { BiCustomize } from "react-icons/bi";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

const fieldType: ElementsType = "CustomField";

const attributes = {
  label: "Custom field",
  helperText: "Helper text",
  required: false,
  type: "password"
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  type: z.string()
});
const options = [
  {
    value: "password",
    label: "Passoword"
  },
  {
    value: "url",
    label: "Link"
  },
  {
    value: "color",
    label: "Color"
  },
  {
    value: "range",
    label: "Range"
  },
  {
    value: "time",
    label: "Time"
  }
  ,
  {
    value: "week",
    label: "Week"
  },
  {
    value: "month",
    label: "Month"
  }
  ,
  {
    value: "datetime-local",
    label: "Datetime Local"
  }

]

export const CustomFieldFormElement: FormElement = {
  fieldType,
  construct: (id: string) => ({
    id,
    fieldType,
    attributes,
  }),
  designerBtnElement: {
    icon: BiCustomize,
    label: "Custom Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: (formElement: FormElementInstance, currentValue: string): boolean => {
    const element = formElement as CustomInstance;
    if (element.attributes.required) {
      return currentValue.length > 0;
    }

    return true;
  },
};

type CustomInstance = FormElementInstance & {
  attributes: typeof attributes;
};
// TODO color,range,time,week,datetime-local
function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { label, required, placeHolder, helperText, type } = element.attributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Input readOnly disabled type={type} placeholder={placeHolder} />
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

  const { label, required, placeHolder, helperText, type } = element.attributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Input
        type={type}
        className={cn(error && "border-red-500")}
        placeholder={placeHolder}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          if (!submitValue) return;
          const valid = CustomFieldFormElement.validate(element, e.target.value);
          setError(!valid);
          if (!valid) return;
          submitValue(element.id, e.target.value);
        }}
        value={value}
      />
      {/* {helperText && <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>{helperText}</p>} */}
    </div>
  );
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",//TODO refer select field update submit btn will be add
    defaultValues: {
      label: element.attributes.label,
      helperText: element.attributes.helperText,
      required: element.attributes.required,
      type: element.attributes.type
    },
  });

  useEffect(() => {
    form.reset(element.attributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { label, helperText, required, type } = values;
    updateElement(element.id, {
      ...element,
      attributes: {
        label,
        helperText,
        required,
        type
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
              <FormMessage />
            </FormItem>
          )}
        />

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Validations</AccordionTrigger>
            <AccordionContent>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(value: string) => form.setValue('type', value)}
                      >
                        <SelectTrigger className={cn("w-full")}>
                          <SelectValue placeholder="placeholder" />
                        </SelectTrigger>
                        <SelectContent>
                          {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}

                        </SelectContent>
                      </Select>


                    </FormControl>
                    <FormMessage />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form >
  );
}
