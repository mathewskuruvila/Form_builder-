import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "@/types/FormElements";
import useDesigner from "@/hooks/useDesigner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { fileTypeOptions, fileSizeOptions } from "@/types/file";
import { cn } from "@/lib/utils";
import { GoFileDirectoryFill } from "react-icons/go";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

const fieldType: ElementsType = "FileField";

const attributes = {
  label: "File field",
  helperText: "Helper text",
  required: false,
  placeHolder: "file",
  fileSize: "small",
  fileType: "pdf"
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
  fileSize: z.string().min(2).max(50),
  fieldType: z.string().min(2).max(50),
});

export const FileFieldFormElement: FormElement = {
  fieldType,
  construct: (id: string) => ({
    id,
    fieldType,
    attributes,
  }),
  designerBtnElement: {
    icon: GoFileDirectoryFill,
    label: "File Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: (formElement: FormElementInstance, currentValue: any): any => {
    const element = formElement as CustomInstance;
    const valueType = currentValue.files[0].type
    const fileType = element.attributes.fileType
    // const fileSize = Number(element.attributes.fileSize)
    const valueSize = Number(currentValue.files[0].size)
    console.log(valueType, fileType)
    // console.log(fileSize ,valueSize)

    if (!valueType.includes(fileType)) {
      return false;
    }
    // if (fileSize > valueSize) {
    //   return false;
    // }
    console.log(element.attributes.fileType)
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
      <Input readOnly disabled type="file" placeholder={placeHolder} />
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

  const { label, required, placeHolder, helperText, fileType, fileSize } = element.attributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Input
        type="file"
        className={cn(error && "border-red-500")}
        placeholder={placeHolder}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          if (!submitValue) return;
          const valid = FileFieldFormElement.validate(element, e.target);
          setError(!valid);
          if (!valid) return;
          submitValue(element.id, e.target.value);
        }}
        value={value}
      />
      {helperText && <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>{helperText}</p>}
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
      fileSize: element.attributes.fileSize,
      fieldType: element.attributes.fileType,
    },
  });

  useEffect(() => {
    form.reset(element.attributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { label, helperText, placeHolder, required, fieldType, fileSize } = values;
    updateElement(element.id, {
      ...element,
      attributes: {
        label,
        helperText,
        placeHolder,
        required,
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
              <FormDescription>
                The label of the field. <br /> It will be displayed above the field
              </FormDescription>
              <FormMessage />
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
              <FormDescription>The placeholder of the field.</FormDescription>
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
                name="fieldType"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>File Type</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(value: string) => form.setValue('fieldType', value)}
                      >
                        <SelectTrigger className={cn("w-full")}>
                          <SelectValue placeholder="placeholder" />
                        </SelectTrigger>
                        <SelectContent>
                          {fileTypeOptions.map((option) => (
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
                name="fileSize"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>File Size</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(value: string) => form.setValue('fileSize', value)}
                      >
                        <SelectTrigger className={cn("w-full")}>
                          <SelectValue placeholder="placeholder" />
                        </SelectTrigger>
                        <SelectContent>
                          {fileSizeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />



              <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm ">
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
    </Form>
  );
}
