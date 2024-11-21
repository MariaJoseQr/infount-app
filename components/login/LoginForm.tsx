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
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";



const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const registrationSchema = z.object({
  fullName: z.string().min(1, "Nombres y apellidos son requeridos"),
  code: z.string().min(1, "Código es requerido"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  researchArea: z.string().optional(),
  office: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [registerMode, setRegisterMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const registerForm = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      console.log("Iniciando sesión con:", data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegistrationFormData) => {
    setIsLoading(true);
    try {
      console.log("Registrando usuario:", data);
    } catch (error) {
      console.error("Error registrando usuario:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card 
        className="w-[500px] max-h-[85vh] overflow-y-auto"
        style={{ clipPath: 'inset(0 round 0.45rem)' }}>
      <CardHeader className="items-center">
        <Image
          src="/infologo.png"
          alt="Info Logo"
          width={166}
          height={56}
        />
        <CardTitle className="text-primary">
            {registerMode ? "Registro de Usuario" : "Ingreso de Usuario"}
          </CardTitle>
      </CardHeader>
      {forgotPassword ? (
        <>
          <CardContent>
            <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(() => setForgotPassword(false))}>
                  <FormField
                    name="email"
                    control={loginForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo:</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ingrese su correo" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className="mt-4 w-full text-white bg-primary hover:bg-primary-dark"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando..." : "Enviar correo electrónico"}
                  </Button>
                </form>
              </Form>
          </CardContent>
          <CardFooter className="justify-center items-center">
            <a
              className="text-sm text-gray-600 hover:underline cursor-pointer"
              onClick={() => setForgotPassword(false)}
            >
              {"Regresar"}
            </a>
          </CardFooter>
        </>
      ) : registerMode ? (
          <CardContent >
                <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(handleRegister)}>
                      <FormField
                        name="fullName"
                        control={registerForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombres y Apellidos:</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ingrese su nombre completo" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="code"
                        control={registerForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código:</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ingrese su código" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="email"
                        control={registerForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo:</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ingrese su correo" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="password"
                        control={registerForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contraseña:</FormLabel>
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
                      <FormField
                        name="researchArea"
                        control={registerForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Área de Investigación:</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ingrese su área de investigación" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="office"
                        control={registerForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Oficina:</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ingrese su oficina" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        className=" mt-4 w-full text-white bg-primary hover:bg-primary-dark"
                        type="submit"
                        disabled={isLoading || !registerForm.formState.isValid}
                      >
                        {isLoading ? "Registrando..." : "Registrarse"}
                      </Button>
                    </form>
                  </Form>
              <CardFooter className="justify-center items-center">
                <a
                  className=" text-sm text-gray-600 hover:underline cursor-pointer"
                  onClick={() => setRegisterMode(false)}
                >
                  ¿Ya tienes una cuenta? Iniciar sesión
                </a>
              </CardFooter>
          </CardContent>
      ) : (
        <>
          <CardContent>
              <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                    <FormField
                      name="email"
                      control={loginForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo:</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ingrese su correo" />
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
                          <FormLabel>Contraseña:</FormLabel>
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
                    <a
                      className="text-sm text-gray-600 hover:underline cursor-pointer"
                      onClick={() => setForgotPassword(true)}
                    >
                      Has olvidado tu contraseña
                    </a>
                    <Button
                      className="mt-4 w-full text-white bg-primary hover:bg-primary-dark"
                      type="submit"
                      disabled={isLoading || !loginForm.formState.isValid}
                    >
                      {isLoading ? "Ingresando..." : "Ingresar"}
                    </Button>
                  </form>
                </Form>
          </CardContent>
          <CardFooter className="justify-center items-center">
              <a
                  className="text-sm text-gray-600 hover:underline cursor-pointer"
                  onClick={() => setRegisterMode(true)}
                >
                  ¿No tienes una cuenta? Registrarse
                </a>

          </CardFooter>
        </>
      )}
    </Card>
  );
}
