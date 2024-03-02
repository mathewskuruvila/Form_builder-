import { FC } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginSchema, loginSchemaType } from "@/Validators/form"
import { LoginForm } from "@/actions/auth"
import { toast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImSpinner2 } from "react-icons/im";

const SignIn: FC = () => {
  const navigate = useNavigate()

  const form = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
  });
  async function onSubmit(values: loginSchemaType) {
    try {
      const formId = await LoginForm(values);
      toast({
        title: "Success",
        description: "Form created successfully",
      });
      navigate(`/`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    }

  }
  return (
    <Card className="w-[450px] h-[350px] m-auto">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>to continue to gernic-form.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full mt-4">
          {!form.formState.isSubmitting && <span>Save</span>}
          {form.formState.isSubmitting && <ImSpinner2 className="animate-spin" />}
        </Button>
      </CardFooter>
    </Card>

  )
}

export default SignIn;