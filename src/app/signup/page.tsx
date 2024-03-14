"use client";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from "@/lib/supabase";
// import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = "https://wlhdpckpkokniseuyqnr.supabase.co"
// const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsaGRwY2twa29rbmlzZXV5cW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MzEwOTEsImV4cCI6MjAyNTUwNzA5MX0.IeHjYA11qgM_dfCYCCXTkNYpVwDI6tbl9XqXVT-yjSY"
// const supabase = createClient(supabaseUrl, supabaseKey)

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
// const alert = (type:string , message:string) => {
//   return (
//     <Alert>
//       <AlertTitle>Error!</AlertTitle>
//       <AlertDescription>
//         Password did not match
//       </AlertDescription>
//     </Alert>
//   )
// }
export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState<AlertProps>()
  const router = useRouter();

  const handleNameChange = (event) => setName(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleConfirmPasswordChange = (event) => setConfirmPassword(event.target.value);
  
  const handleSignUp = async () => {
    if(password !== confirmPassword) {
      setAlert({ msg: "Password did not match", type:"error" });
      return;
    }
  
    const { data: user, error } = await supabase.auth.signUp({email, password});
    
    console.log(user);
    if(error) {
      setAlert({ msg: error.message, type:"error" });
      return;
    }

    // Add user to supabase database 
    
    console.log(name);
    console.log(email);
    const { data: userData , error: error2 } = await supabase
    .from('users')
    .insert([
      {
        id : user.user?.id,
        user_name : name,
        email : email,
        attempted_tests : [],
        published_tests : []
      }
    ])
    .select()

    console.log(userData);

    if(error2){
      setAlert({ msg: error2.message, type:"error" })
    }

        
  
    router.push('/login');
    setAlert({ msg: "Account Created Successfully", type:"info" });
    return;
  }
  

  return (
    <div className="w-full py-12 grid gap-6 md:gap-12">
      
      <div className="mx-auto max-w-2xl px-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-gray-500 dark:text-gray-400">Enter your information to create an account</p>
        </div>
        <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter your name" required onChange={handleNameChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="Enter your email" required onChange={handleEmailChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" required type="password" onChange={handlePasswordChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input id="confirm-password" required type="password" onChange={handleConfirmPasswordChange} />
        </div>
          <Button onClick={handleSignUp} className="w-full">Sign Up</Button>
          
        </div>
        {alert && <Alert msg={alert.msg} type={alert.type}/>}
        <Separator className="my-8" />
        <div className="space-y-2 text-center text-sm">
          Already have an account?
          <Link  href='/login' className="underline  text-blue-800"  >
            Login
          </Link>
        </div>
        
      </div>
    </div>
  )
}

