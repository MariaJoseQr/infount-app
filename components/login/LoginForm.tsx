"use client";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
  });

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleForgotEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForgotEmail(e.target.value);
  };

  const handleForgotPassword = (e: FormEvent) => {
    e.preventDefault();
    // TODO: forgot email logic
    console.log("Forgot email:", forgotEmail);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      console.log("data: ", e);
    } catch {
    } finally {
      router.push("/dashboard");
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center">
        <Image
          src="/bildin-logo-black-text.svg"
          alt="Bildin logo"
          width={166}
          height={56}
        />
      </CardHeader>
      {forgotPassword ? (
        <>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <Label htmlFor="email">Correo:</Label>
                <Input
                  id="email"
                  type="email"
                  value={forgotEmail}
                  onChange={handleForgotEmailChange}
                  required
                  placeholder={"enterEmail"}
                  className="mt-2"
                />
              </div>
              <Button type="submit" className="w-full">
                {"sendEmail"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center items-center">
            <a
              className="text-sm text-gray-600 hover:underline cursor-pointer"
              onClick={() => setForgotPassword(false)}
            >
              {"alreadyUser"}
            </a>
          </CardFooter>
        </>
      ) : (
        <>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <Label htmlFor="email">{"email"}:</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  placeholder={"enterEmail"}
                  className="mt-2"
                />
              </div>
              <div className="mb-6">
                <Label htmlFor="password">{"password"}:</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  placeholder={"enterPassword"}
                  className="mt-2"
                />
              </div>
              <Button type="submit" className="w-full">
                {"login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center items-center">
            <a
              className="text-sm text-gray-600 hover:underline cursor-pointer"
              onClick={() => setForgotPassword(true)}
            >
              {"forgotPassword"}
            </a>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
