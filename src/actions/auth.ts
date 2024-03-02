import { AXIOS } from "@/App";
import { loginSchema, loginSchemaType } from "@/Validators/form";

export async function LoginForm(data:loginSchemaType){
    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
        throw new Error("form not valid");
      }
      let response = false
      const { username, password } = data;
      if (username==="admin" && password === "admin"){
        response=true
      }else[
        response=false
      ]
    //   const response= await  AXIOS.post(`/form`,form)
      if (!response) {
        throw new Error("something went wrong");
      }
      return response
}
