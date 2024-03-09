"use client"; 
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { supabase } from "@/lib/supabase"
import { useRouter } from 'next/navigation'


function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="w-full border-2 flex items-center h-16 px-4 mb-4 ">
        <nav className="w-[90%] flex  gap-4 text-lg font-semibold">
          <Button size="sm" asChild>
            <Link href='/tests'>Tests</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href='/dashboard'>Dashboard</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href='/createTest'>CreateTest</Link>
          </Button>
          
        </nav>
        <Button onClick= {handleLogout} size="sm" className="w-[10%]">Logout</Button>
    </div>
  )
}

export default Header












// "use client"
// import React, { useState, useEffect } from 'react';
// import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { supabase } from "@/lib/supabase";
// import test from 'node:test';

// function CreateTestForm() {
//   const [testArr, setTestArr] = useState([]);
//   const [testDetails, setTestDetails] = useState({
//     title: '',
//     duration: '',
//     questions_no: '',
//     marks: '',
//     sections: '',
//     questions: [],
//     author: ''
//   });

//   const [showTile, setShowTile] = useState(false);

//   useEffect(() => {
//     async function fetchUser() {
//       const { data } = await supabase.auth.getUser();
//       console.log(data.user);
//       if (data.user) {
//         setTestDetails(prevState => ({
//           ...prevState,
//           author: data?.user?.email
//         }));
//       }
//     }
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     async function fetchUserAndTests() {
//       const { data } = await supabase.auth.getUser();
//       console.log(data.user);
//       if (data.user) {
//         setTestDetails(prevState => ({
//           ...prevState,
//           author: data?.user?.email
//         }));
  
//         const { data: testData, error } = await supabase
//           .from('tests')
//           .select('*')
//           .eq('test_author', data?.user?.email);
  
//         if (error) {
//           console.log(error);
//           return;
//         }
//         console.log(testData);
//         setTestArr(testData);
//       }
//     }
//     fetchUserAndTests();
//   }, []);
  

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setTestDetails(prevState => ({
//       ...prevState,
//       [id]: value
//     }));
//   };

//   async function handleSubmit() {
//     // Push Test Details to Supabase 

//     // create a empty array of questions for the test
//     const { data, error } = await supabase
//       .from('tests')
//       .insert([
//         { test_title: testDetails.title, test_duration: testDetails.duration, test_questions: testDetails.questions, test_total_marks: testDetails.marks, test_sections: testDetails.sections, test_question_no: testDetails.questions_no }
//       ])
//       .select()

//     if (error) {
//       console.log(error);
//       return;
//     }
//     console.log(data);

//     // get id of the test and push it to the questions table
//     const testId = data[0].id;

//     // update the test setdetails with the test id
//     const updatedTestDetails = { ...testDetails, testId: testId };
//     setTestDetails(updatedTestDetails);
//     // setTestArr([...testArr, testDetails]);

//   };

//   return (
//     <div>
//       <Card>
//         <CardHeader>
//           <CardTitle>Create Mock Test</CardTitle>
//           <CardDescription>Enter the details below to create a new mock test.</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="title">Title</Label>
//             <Input id="title" placeholder="Title" value={testDetails.title} onChange={handleChange} />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="duration">Duration (Hours)</Label>
//               <Input id="duration" placeholder="30" type="number" value={testDetails.duration} onChange={handleChange} />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="questions">Number of Questions</Label>
//               <Input id="questions_no" placeholder="10" type="number" value={testDetails.questions_no} onChange={handleChange} />
//             </div>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="marks">Total Marks</Label>
//             <Input id="marks" placeholder="100" type="number" value={testDetails.marks} onChange={handleChange} />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="sections">Total Number of Sections</Label>
//             <Input id="sections" placeholder="3" type="number" value={testDetails.sections} onChange={handleChange} />
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button onClick={handleSubmit}>Submit</Button>
//         </CardFooter>
//       </Card>

// { testArr.map((testDetails, index) => {
//   return <TestTile key={index} testDetails={testDetails} />;
// })}

//     </div>
//   );
// }


// function TestTile({ testDetails }) {
//   // You can use testDetails to display the tile content
//   return (
    
//   );
// }


// export default function CreateTest() {
//   return (
//     <div className="p-4">
//       <CreateTestForm />
//     </div>
//   );
// }
