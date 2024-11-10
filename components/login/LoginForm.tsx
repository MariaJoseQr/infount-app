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
/* import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"; */



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

  /* const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [forgotEmail, setForgotEmail] = useState<string>(""); */
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [registerMode, setRegisterMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isValid: isLoginValid },  
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", 
  });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isValid: isRegisterValid},  
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange", 
  });

/*   const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
 */
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
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                  <Label htmlFor="email">Correo:</Label>
                  <Input
                    id="email"
                    type="email"
                    {...loginRegister("email")}
                    placeholder="Ingrese su correo"
                    className="mt-2"
                  />
                  {loginErrors.email && <p className="text-red-500 text-sm">{loginErrors.email.message}</p>}
                </div>
                <Button  
                    className="w-full  text-white bg-primary hover:bg-primary-dark" 
                    onClick={() => setForgotPassword(false)} 
                    disabled={isLoading}>
                    {isLoading ? "Enviando..." : "Enviar correo electrónico"}
                  </Button>
            </form>
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
                <form onSubmit={handleRegisterSubmit(handleRegister)}>
                  <div className="mb-4">
                      <Label htmlFor="fullName">Nombres y Apellidos:</Label>
                      <Input 
                          id="fullName" {...registerRegister("fullName")} 
                          className=" mt-2 w-full text-gray-600" 
                          placeholder="Ingrese su nombre completo"
                          /* {...field} */
                          />
                      {registerErrors.fullName && <p className="text-red-500 text-sm">{registerErrors.fullName.message}</p>}
                  </div>
                  <div className="mb-4">
                      <Label htmlFor="code">Código:</Label>
                      <Input 
                          id="code" {...registerRegister("code")} 
                          className=" mt-2 w-full text-gray-600" 
                          placeholder="Ingrese su codigo de usuario"
                          /* {...field} */
                      />
                      {registerErrors.code && <p className="text-red-500 text-sm">{registerErrors.code.message}</p>}
                  </div>
                  <div className="mb-4">
                      <Label htmlFor="email">Correo:</Label>
                      <Input
                          id="email" 
                          type="email" {...registerRegister("email")}
                          className=" mt-2 w-full text-gray-600" 
                          placeholder="Ingrese su correo electronico"
                          /* {...field} */
                      />
                      {registerErrors.email && <p className="text-red-500 text-sm">{registerErrors.email.message}</p>}
                  </div>
                  <div className="mb-4">
                      <Label htmlFor="password">Contraseña:</Label>
                      <Input 
                          id="password" 
                          type="password" {...registerRegister("password")} 
                          className=" mt-2 w-full text-gray-600" 
                          placeholder="Ingrese su contraseña"
                          /* {...field} */
                        />
                      {registerErrors.password && <p className="text-red-500 text-sm">{registerErrors.password.message}</p>}
                  </div>
                  <div className="mb-4">
                      <Label htmlFor="researchArea">Área de Investigación:</Label>
                      <Input 
                          id="researchArea" {...registerRegister("researchArea")} 
                          className=" mt-2 w-full text-gray-600" 
                          placeholder="Ingrese su área de investigación"
                          /* {...field} */
                        />
                  </div>
                  <div className="mb-4">
                      <Label htmlFor="office">Oficina:</Label>
                      <Input 
                          id="office" {...registerRegister("office")} 
                          className=" mt-2 w-full text-gray-600" 
                          placeholder="Ingrese su oficina"
                          /* {...field} */
                        />
                  </div>
                  <Button 
                      onClick={handleRegisterSubmit(handleRegister)} 
                      disabled={isLoading || !isRegisterValid}
                      className="w-full  text-white bg-primary hover:bg-primary-dark"
                      >
                      {isLoading ? "Registrando..." : "Registrarse"}
                  </Button>
              </form>
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
            <form onSubmit={handleLoginSubmit(handleLogin)}>
              <div className="mb-4">
                <Label htmlFor="email">{"Correo"}:</Label>
                <Input
                    id="email"
                    type="email"
                    {...loginRegister("email")}
                    placeholder="Ingrese su correo"
                    className="mt-2"
                  />
                  {loginErrors.email && <p className="text-red-500 text-sm">{loginErrors.email.message}</p>}
              </div>
              <div className="mb-6">
                <Label htmlFor="password">Contraseña:</Label>
                <Input
                  id="password"
                  type="password"
                  {...loginRegister("password")}
                  placeholder="Ingrese su contraseña"
                  className="mt-2"
                />
                {loginErrors.password && <p className="text-red-500 text-sm">{loginErrors.password.message}</p>}
                <a
                  className="text-sm text-gray-600 hover:underline cursor-pointer"
                  onClick={() => setForgotPassword(true)}
                >
                  Has olvidado tu contraseña
                </a>
              </div>

              <Button
                  onClick={handleLoginSubmit(handleLogin)}
                  disabled={isLoading || !isLoginValid}
                  className="w-full text-white bg-primary hover:bg-primary-dark"
                >
                  {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>
            </form>
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
