"use client";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";
import {useState} from "react";

// import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = "https://wlhdpckpkokniseuyqnr.supabase.co"
// const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsaGRwY2twa29rbmlzZXV5cW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MzEwOTEsImV4cCI6MjAyNTUwNzA5MX0.IeHjYA11qgM_dfCYCCXTkNYpVwDI6tbl9XqXVT-yjSY"
// const supabase = createClient(supabaseUrl, supabaseKey)
import { supabase } from "@/lib/supabase";

type AlertProps = {
  type: "info" | "error",
  msg: string
}

const Alert: React.FC<AlertProps> = ({ type, msg }) => {
  let style = ""

  switch (type) {
    case "info":
    default:
      style = "bg-blue-100 border-blue-300 text-blue-600"
      break;
    case "error":
      style = "bg-red-100 border-red-300 text-red-600 "
      break;
  }

  return (<div className={`text-xs py-2 px-2 flex gap-2 mt-2 w-full border rounded-md ${style}`}>
    <strong>{type}: </strong>
    <span>{msg}</span>
  </div>)

}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<AlertProps>()
  const handleEmailChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setEmail(e.target.value);
    // console.log(e.target.value);
  }

  const handlePasswordChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setPassword(e.target.value);
    // console.log(e.target.value);
  }
  const router = useRouter();
  
  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({email, password});

    if(error) {
      // <Alert>
      //   <AlertTitle>Error!</AlertTitle>
      //   <AlertDescription>
      //     {error.message}
      //   </AlertDescription>
      // </Alert>
      setAlert({ msg: error.message, type:"error" });
      return;
    }
    setAlert({ msg: "Logged In", type:"info" });
    if(data.session) {
      router.push("/dashboard");
    }

  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Email" required type="email" onChange={handleEmailChange} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link className="ml-auto inline-block text-sm underline" href="#">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" placeholder="Password" required type="password" onChange={handlePasswordChange} />
          </div>
          <Button  onClick={handleSignIn} type="submit" className="w-full ">
            Login
          </Button>  
        </div>
      </CardContent>
    </Card>
    </main>
  );
}
