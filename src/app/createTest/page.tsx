"use client"
import React, { useState, useEffect } from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase";
import Header from '@/components/header';
import Link from 'next/link';


function CreateTestForm() {
  const [testArr, setTestArr] = useState([]);
  const [testDetails, setTestDetails] = useState({
    test_title: '',
    test_duration: '',
    test_questions_no: '',
    test_total_marks: '',
    test_sections: '',
    test_questions: [],
    test_author: ''
  });

  useEffect(() => {
    async function fetchUserAndTests() {
      const { data } = await supabase.auth.getUser();
      console.log(data.user);
      if (data.user) {
        setTestDetails(prevState => ({
          ...prevState,
          test_author: data?.user?.email
        }));
  
        const { data: testData, error } = await supabase
          .from('tests')
          .select('*')
          .eq('test_author', data?.user?.email);
  
        if (error) {
          console.log(error);
          return;
        }
        console.log(testData);
        setTestArr(testData);
      }
    }
    fetchUserAndTests();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setTestDetails(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  async function handleSubmit() {
    // Push Test Details to Supabase 

    // create a empty array of questions for the test
    const { data, error } = await supabase
      .from('tests')
      .insert([
        { test_title: testDetails.test_title, test_duration: testDetails.test_duration, test_questions: testDetails.test_questions, test_total_marks: testDetails.test_total_marks, test_sections: testDetails.test_sections, test_question_no: testDetails.test_questions_no , test_author: testDetails.test_author }
      ])
      .select()

    if (error) {
      console.log(error);
      return;
    }
    console.log(data);

    // get id of the test and push it to the questions table
    const testId = data[0].id;

    // update the test setdetails with the test id
    const updatedTestDetails = { ...testDetails, testId: testId };
    setTestDetails(updatedTestDetails);
    setTestArr([...testArr, testDetails]);

  };

  return (
    <div>
      <Header />
      <Card className='w-[70%] mx-auto'>
        <CardHeader>
          <CardTitle>Create Mock Test</CardTitle>
          <CardDescription>Enter the details below to create a new mock test.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="test_title" placeholder="Title" value={testDetails.test_title} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (Hours)</Label>
              <Input id="test_duration" placeholder="30" type="number" value={testDetails.test_duration} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="questions">Number of Questions</Label>
              <Input id="test_questions_no" placeholder="10" type="number" value={testDetails.test_questions_no} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="marks">Total Marks</Label>
            <Input id="test_total_marks" placeholder="100" type="number" value={testDetails.test_total_marks} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sections">Total Number of Sections</Label>
            <Input id="test_sections" placeholder="3" type="number" value={testDetails.test_sections} onChange={handleChange} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit}>Submit</Button>
        </CardFooter>
      </Card>

      
      <div className="w-[70%] mx-auto p-4 border border-gray-200 rounded-lg flex:row mt-6">
        <h2 className="font-semibold text-2xl">Your Tests</h2>
        {testArr.map((test, index) => (
          <div key={index} className="w-full border rounded-lg flex mt-2">
            <div className="p-4 w-[20%]">
              <h3 className="font-semibold text-lg">Title : {test.test_title}</h3>
            </div>
            <div className="p-4 w-[20%]">
              <h3 className=" text-lg">Duration : {test.test_duration}</h3>
            </div>
            <div className="p-4 w-[20%]">
              <h3 className=" text-lg">Total Marks : {test.test_total_marks}</h3>
            </div>
            <div className="p-4 w-[20%]">
              <h3 className=" text-lg">No of Sections : {test.test_sections}</h3>
            </div>
            <div className="border-t p-4 flex items-center justify-end gap-2 w-[20%]">
              <Button asChild className="bg-blue-400" variant="outline">
              <Link href={`/addQuestion/${test.id}`}>
                Add Questions
              </Link>
              </Button>
            </div>
          </div>
      ))}

      </div>
      </div>
        
    
  );
}

export default CreateTestForm;
