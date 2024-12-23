"use client";

import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeftIcon } from "lucide-react";
import { signIn } from "next-auth/react"

const loginSchema = z.object({
  email: z.string().min(1, "El campo es obligatorio").email("Correo inválido"),
  password: z.string().min(1, "El campo es obligatorio"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  // const {formState:{errors}} =useForm();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    console.log("data login: ", data);

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      console.log(res)
      if (res && typeof res.error === "string" && res.error !== null) {
        setError(res.error)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className="w-[400px] max-h-[85vh] overflow-y-auto"
      style={{ clipPath: "inset(0 round 0.45rem)" }}
    >
      <CardHeader className="items-center">
        <Image src="/infologo.png" alt="Info Logo" width={166} height={56} />
        <CardTitle className="text-primary">Inicio de Sesión</CardTitle>
      </CardHeader>
      {forgotPassword ? (
        <>
          <CardContent>
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(() =>
                  setForgotPassword(false)
                )}
              >

                <div className="w-full space-y-4">
                  <FormField
                    name="email"
                    control={loginForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="w-full text-primary">
                          Correo:
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ingrese su correo electrónico"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className="w-full text-white bg-primary hover:bg-primary-dark"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando..." : "Enviar correo electrónico"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center items-center">
            <div
              className="flex items-center text-sm text-gray-600 hover:underline cursor-pointer"
              onClick={() => setForgotPassword(false)}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              {"Regresar"}
            </div>
          </CardFooter>
        </>
      ) : (
        <>
          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)}>

                <div className="w-full space-y-4">
                  {error && (
                    <p className="bg-red-500 text-lg text-white p-3 rounded mb-2">{error}</p>
                  )}
                  <FormField
                    name="email"
                    control={loginForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="w-full text-primary">
                          Correo:
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ingrese su correo electrónico"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="password"
                    control={loginForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="w-full text-primary">
                          Contraseña:
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Ingrese su contraseña"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div
                    className="text-sm hover:underline cursor-pointer"
                    onClick={() => setForgotPassword(true)}
                  >
                    ¿Has olvidado tu contraseña?
                  </div>
                  <Button
                    className="w-full text-white bg-primary hover:bg-primary-dark"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Ingresando..." : "Ingresar"}
                  </Button>
                </div>


              </form>
            </Form>
          </CardContent>
        </>
      )}
    </Card>
  );
}
