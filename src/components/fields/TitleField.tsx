import { ElementsType, FormElement, FormElementInstance } from "@/types/FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "@/hooks/useDesigner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { LuHeading1 } from "react-icons/lu";
import { cn } from "@/lib/utils";

const fieldType: ElementsType = "TitleField";
const positions = [
  {
    value: "flex justify-center",
    label: "Center"
  },
  {
    value: "flex justify-end",
    label: "End"
  },
  {
    value: "flex justify-start",
    label: "Start"
  }

]
const textStyles = [
  {
    value: "underline",
    label: "Underline"
  },
  {
    value: "italic",
    label: "Italic"
  },
  {
    value: "not-italic",
    label: "None"
  }

]
const fontSizes = [
  {
    value: "font-thin",
    label: "small"
  },
  {
    value: "font-normal",
    label: "Medium"
  },
  {
    value: "font-bold",
    label: "Bold"
  }

]

const attributes = {
  title: "Title field",
  position: "flex justify-center",
  textStyle: "",
  fontSize: "font-normal"
};


const propertiesSchema = z.object({
  title: z.string().min(2).max(50),
  position: z.string(),
  textStyle: z.string(),
  fontSize: z.string()

})

export const TitleFieldFormElement: FormElement = {
  fieldType,
 construct: (id: string) => ({
    id,
    fieldType,
    attributes,
  }),
  designerBtnElement: {
    icon: LuHeading1,
    label: "Title field",
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
  const { title, position, textStyle, fontSize } = element.attributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">Title field</Label>
      <p className={`text-xl flex ${position} ${textStyle} ${fontSize}`}>{title}</p>
    </div>
  );
}

function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;

  const { title, position, textStyle, fontSize } = element.attributes;
  return <p className={`text-xl flex ${position} ${textStyle} ${fontSize}`}>{title}</p>
}


type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onChange",
    defaultValues: {
      title: element.attributes.title,
      position: element.attributes.position,
      fontSize: element.attributes.fontSize,
      textStyle: element.attributes.textStyle

    },
  });

  useEffect(() => {
    form.reset(element.attributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { title, position, fontSize, textStyle } = values;
    updateElement(element.id, {
      ...element,
      attributes: {
        title,
        position,
        fontSize,
        textStyle,


      },
    })
  }

  return (
    <Form {...form}>
      <form
        onChange={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
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

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={(value:string) => form.setValue('position', value)}
                >
                  <SelectTrigger className={cn("w-full")}>
                    <SelectValue placeholder="placeholder" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}

                  </SelectContent>
                </Select>

              </FormControl>
              {/* <FormDescription>
                The type of the field. <br /> will determine how it should be typed.
              </FormDescription> */} 
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="textStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text Style</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={(value:string) => form.setValue('textStyle', value)}
                >
                  <SelectTrigger className={cn("w-full")}>
                    <SelectValue placeholder="placeholder" />
                  </SelectTrigger>
                  <SelectContent>
                    {textStyles.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}

                  </SelectContent>
                </Select>

              </FormControl>
              {/* <FormDescription>
                The type of the field. <br /> will determine how it should be typed.
              </FormDescription> */} 
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fontSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font Size</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={(value:string) => form.setValue('fontSize', value)}
                >
                  <SelectTrigger className={cn("w-full")}>
                    <SelectValue placeholder="placeholder" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}

                  </SelectContent>
                </Select>

              </FormControl>
              {/* <FormDescription>
                The type of the field. <br /> will determine how it should be typed.
              </FormDescription> */} 
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
