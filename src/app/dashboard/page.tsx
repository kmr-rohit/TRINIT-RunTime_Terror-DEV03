"use client";
import { supabase } from "@/lib/supabase"
import Link from "next/link";
import { useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";

import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { JSX, SVGProps } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js'
import Header from "@/components/header";
const supabaseUrl = "https://wlhdpckpkokniseuyqnr.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsaGRwY2twa29rbmlzZXV5cW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MzEwOTEsImV4cCI6MjAyNTUwNzA5MX0.IeHjYA11qgM_dfCYCCXTkNYpVwDI6tbl9XqXVT-yjSY"
// const spbs = createClient(supabaseUrl, supabaseKey)


export default function Dashboard() {
  const [session, setSession] = useState<Session|null>(null);
  const router = useRouter();
  const [user, setUser] = useState(null)
  const [attempted_tests , setAttemptedTests] = useState([])
  const [published_tests, setPublishedTests] = useState([])
  const [attempted_tests_data, setAttemptedTestsData] = useState([])
  const [published_tests_data, setPublishedTestsData] = useState([])
  useEffect(() => {
      supabase.auth.getSession()
      .then(session => {
        if(session.data.session) {
          console.log("SESSION: ", session.data.session)
          setSession(session.data.session)
        } else {
          router.push('/');
        }
      })  
      .catch(err => { 
        console.log("ERROR GET SESSION: ", err) 
        router.push('/');
      })
  },[])


  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const fetchAttemptedTestsData = async () => {
    let { data: tests, error } = await supabase
      .from('tests')
      .select('*')
      .in('id', attempted_tests)
  
    if (error) {
      console.error("Error fetching attempted tests: ", error);
    } else {
      setAttemptedTestsData(tests);
    }
  }
  
  const fetchPublishedTestsData = async () => {
    let { data: tests, error } = await supabase
      .from('tests')
      .select('*')
      .in('id', published_tests)
  
    if (error) {
      console.error("Error fetching published tests: ", error);
    } else {
      setPublishedTestsData(tests);
    }
  }
  
  

  const fetchUserData = async () => {
    // console.log(session?.user.email)
    
    let { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', session?.user.email)
    // console.log("USERS: ", users)

    users?.map(user => {
      setUser(user)
      setAttemptedTests(user.attempted_tests)
      setPublishedTests(user.published_tests)
    })
    
  }
  
  useEffect(() => {
    if (user) {
      fetchAttemptedTestsData();
      fetchPublishedTestsData();
    }
  }, [user])


  useEffect(() => {
    fetchUserData()
  }
  , [session])



  return (
    
    <div className="w-full flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-2">
          <Avatar className="border w-10 h-10" />
          <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-0">
            <div className="flex flex-col gap-1">
              <h1 className="font-semibold text-lg">{user?.user_name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Attempted</CardTitle>
              <CardDescription className="text-2xl font-bold">{user?.attempted_tests.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500 dark:text-gray-400">You have attempted {user?.attempted_tests.length} tests</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <CardDescription className="text-2xl font-bold">{user?.published_tests.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500 dark:text-gray-400">You have published {user?.published_tests.length} tests</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <h2 className="font-semibold text-lg">Attempted Tests</h2>
          <div className="grid gap-4">
            {attempted_tests_data.map((test, index) => (
              <Card key={index}>
                <CardContent className="flex items-center gap-4 p-4">
                  <BookIcon className="h-6 w-6" />
                  <div className="flex-1">
                    <CardTitle className="font-medium">{test.test_title}</CardTitle>
                    <CardDescription>Attempted on {test.created_at}</CardDescription>
                  </div>
                  <Button size="sm">
                    <Link href={`/test`}>Analysis</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
            {/* <Card>
              <CardContent className="flex items-center gap-4 p-4 ">
                <BookIcon className="h-6 w-6" />
                <div className="flex-1">
                  <CardTitle className="font-medium">Physics Quiz</CardTitle>
                  <CardDescription>Attempted on 12th March 2023</CardDescription>
                </div>
                <Button size="sm">Analysis</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center  gap-4 p-4">
                <BookIcon className="h-6 w-6" />
                <div className="flex-1">
                  <CardTitle className="font-medium">Mathematics Test</CardTitle>
                  <CardDescription>Attempted on 5th April 2023</CardDescription>
                </div>
                <Button size="sm">Analysis</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <BookIcon className="h-6 w-6" />
                <div className="flex-1">
                  <CardTitle className="font-medium">General Knowledge Quiz</CardTitle>
                  <CardDescription>Attempted on 25th March 2023</CardDescription>
                </div>
                <Button size="sm">Analysis</Button>
              </CardContent>
            </Card> */}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="font-semibold text-lg">Published Tests</h2>
          <div className="grid gap-4">
            {published_tests_data.map((test, index) => (
              <Card key={index}>
                <CardContent className="flex items-center gap-4 p-4">
                  <Package2Icon className="h-6 w-6" />
                  <div className="flex-1">
                    <CardTitle className="font-medium">{test.test_title}</CardTitle>
                    <CardDescription>Published on {test.created_at}</CardDescription>
                  </div>
                  <Button size="sm">
                    <Link href={`/test/`}>View</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
            {/* <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <BookIcon className="h-6 w-6" />
                <div className="flex-1">
                  <CardTitle className="font-medium">History Quiz</CardTitle>
                  <CardDescription>Published on 12th March 2023</CardDescription>
                </div>
                <Button asChild size="sm">
                  <Link href="/test"> View</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <BookIcon className="h-6 w-6" />
                <div className="flex-1">
                  <CardTitle className="font-medium">Science and Technology Test</CardTitle>
                  <CardDescription>Published on 5th April 2023</CardDescription>
                </div>
                <Button size="sm">View</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <BookIcon className="h-6 w-6" />
                <div className="flex-1">
                  <CardTitle className="font-medium">Sports and Entertainment Quiz</CardTitle>
                  <CardDescription>Published on 25th March 2023</CardDescription>
                </div>
                <Button size="sm">View</Button>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </main>
    </div>
  )
}

function BookIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  )
}


function Package2Icon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  )
}
