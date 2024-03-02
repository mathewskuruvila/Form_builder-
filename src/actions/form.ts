import { formSchema, formSchemaType } from "@/Validators/form";
import { AXIOS } from "@/App";
import { FormElementInstance } from "@/types/FormElements";
import { idGenerator } from "@/lib/idGenerator";

export async function CreateForm(data: formSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("form not valid");
  }
  const { name, description } = data;
  const form = {
    form_id: idGenerator(),
    name,
    description,
  };
  const response = await AXIOS.post(`/form`, form);
  if (!response) {
    throw new Error("something went wrong");
  }
  return response.data.id;
}

export async function GetFormById(id: number) {
  const response = await AXIOS.get("/form/" + id);
  if (!response) {
    throw new Error("something went wrong");
  }
  return response.data;
}

export async function GetForms() {
  const response = await AXIOS.get("/form/");
  if (!response) {
    throw new Error("something went wrong");
  }
  return response.data;
}
export async function PublishForm(content:any,id:number) {

  const data = {
    published: true,
    content
  }
   const response = await AXIOS.patch("/form/" + id, data);
  return response.data;
}

export async function UpdateFormContent(id: number, content:any) {
  const data = {
    published: false,
    content
  }
   const response = await AXIOS.patch("/form/" + id, data);
   return response.data
  // const user = await currentUser();
  // if (!user) {
  //   throw new UserNotFoundErr();
  // }

  // return await prisma.form.update({
  //   where: {
  //     userId: user.id,
  //     id,
  //   },
  //   data: {
  //     content: jsonContent,
  //   },
  // });
}
