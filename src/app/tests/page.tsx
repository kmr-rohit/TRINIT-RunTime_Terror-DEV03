"use client"
import { useState, useEffect } from 'react';
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { supabase } from "@/lib/supabase";

export default function TestsList() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    let { data: tests, error } = await supabase
      .from('tests')
      .select('*')

    if (error) console.log("Error: ", error);
    else setTests(tests);
  };

  return (
    <main className="w-full h-full p-4 ">
      <Header />
      <div className="grid gap-4 mx-auto">
      {tests.map((test, i) => (
      <div className="border rounded-lg flex" key={i}>
      <div className="p-4 w-[20%]">
        <h3 className="font-semibold text-lg">{test.test_title}</h3>
      </div>
      <div className="p-4 w-[20%]">
        <h3 className=" text-lg">Test Duration : {test.test_duration}</h3>
      </div>
      <div className="p-4 w-[20%]">
        <h3 className=" text-lg">No of Ques: {test.test_question_no}</h3>
      </div>
      <div className="p-4 w-[20%]">
        <h3 className=" text-lg">Author : {test.test_author}</h3>
      </div>
      <div className="border-t p-4 flex items-center justify-end gap-2 w-[20%]">
        <Button asChild className="bg-blue-400" variant="outline">
        <Link href={`/test/${test.id}`}>Attempt</Link>
        </Button>
      </div>
    </div>
    ))}
      
      
    </div>
    </main>
    
  )
}

