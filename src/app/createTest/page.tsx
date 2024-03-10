"use client"
import React, { useState, useEffect } from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase";
import Header from '@/components/header';
import Link from 'next/link';
import axios from 'axios';


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
  const [userEmail, setuserEmail] = useState([]);
  const [inputMethod, setInputMethod] = useState('manual');

  const handleMethodChange = (e) => {
    setInputMethod(e.target.value);
  };

  useEffect(() => {
    async function fetchUserAndTests() {
      const { data } = await supabase.auth.getUser();
      console.log(data.user);
      if (data.user) {
        setuserEmail(data.user.email);
        
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

    if(inputMethod === 'upload') {
      
    const fileInput = document.getElementById('file');
    const myHeaders = new Headers();
    myHeaders.append("apikey", "K81162509088957");

    const formdata = new FormData();
    formdata.append("language", "eng");
    formdata.append("isOverlayRequired", "true");
    formdata.append("filetype", fileInput.files[0], "/G:/testimage.png");
    formdata.append("OCREngine" , "2")

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow"
    };

    const extracteddata = await fetch("https://api.ocr.space/parse/image", requestOptions)
      .then((response) => {
        // console.log(response);
        return response.json();
      })

    console.log(extracteddata.ParsedResults[0].TextOverlay.Lines);
    const data = extracteddata.ParsedResults[0].TextOverlay.Lines;
    const ques_corr = [];
    for(let i = 0; i < data.length; i++) {
      if(/^\d+\./.test(data[i].LineText)) {
        ques_corr.push(data[i].MinTop);
      }
    }
    console.log(ques_corr);
    let questions = [];
    let currentQuestion = "";

    // for(let i = 0; i < data.length; i++) {
    //   let Words = data[i].Words;
    //   if(Words.length > 1) {
    //   for(let j = 0; j < Words.length; j++) {
    //     // If the word starts with "Q" and a number, skip to the next LineText
    //     if(/^(Q\d+)/.test(Words[j].WordText)) {
    //       break
    //     }
    //     if(/^(\d+)/.test(Words[j].WordText)) {
    //       continue;
    //     }
    //     // Add the word to the current question
    //     currentQuestion += Words[j].WordText + " ";

    //     // If the word is a ".", it's the end of the current question
    //     if(Words[j].WordText === "." || Words[j].WordText === "?") {
    //       // Add the current question to the list of questions
    //       questions.push(currentQuestion.trim());
    //       // Reset the current question
    //       currentQuestion = "";
    //       break; // Move to the next LineText
    //     }
    //   }
    // }
    // }
    // console.log(questions);
    // const updatedTestDetails = { ...testDetails, test_questions: [] , test_questions_no: questions.length , test_author: userEmail , test_sections: 1 , test_total_marks: 100 , test_duration: 1 };
    // // console.log(updatedTestDetails);

    
    // // Create a new test entry
    // const { data: testData, error: testError } = await supabase
    //   .from('tests')
    //   .insert([
    //     { 
    //       test_title: updatedTestDetails.test_title, 
    //       test_duration: updatedTestDetails.test_duration, 
    //       test_questions: updatedTestDetails.test_questions, 
    //       test_total_marks: updatedTestDetails.test_total_marks, 
    //       test_sections: updatedTestDetails.test_sections, 
    //       test_question_no: updatedTestDetails.test_questions_no, 
    //       test_author: updatedTestDetails.test_author 
    //     }
    //   ])
    //   .select()

    // if (testError) {
    //   console.log(testError);
    //   return;
    // }

    // const testId = testData[0].id;

    // // Create a new question entry for each question
    // for (let i = 0; i < questions.length; i++) {
    //   const { error: questionError } = await supabase
    //     .from('questions')
    //     .insert([
    //       { 
    //         description: questions[i], 
    //         test_id: testId, 
    //         question_type: 'subjective' ,
    //         question_mark : testDetails.test_total_marks/testDetails.test_questions_no
    //       }
    //     ])
        

    //   if (questionError) {
    //     console.log(questionError);
    //     return;
    //   }
    // }

    // // Update the test setdetails with the test id
    // const temp = { ...testDetails, testId: testId };
    // setTestDetails(temp);
    // setTestArr([...testArr, testDetails]);

  
    }

    else{
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
  }
  };



  async function publishTest(testId) {
    // Fetch test_id 
    const user_email = userEmail;
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('published_tests')
      .eq('email', user_email);
    
    if (userError) {
      console.log(userError);
      return;
    }

    console.log(userData);
  
    // Update the test details to published
    const { data, error } = await supabase
      .from('tests')
      .update({ published: true })
      .eq('id', testId);
  
    if (error) {
      console.log(error);
      return;
    }

    // also update the published_tests array in the user table
    

    const published_tests = userData[0].published_tests;
    const updated_published_tests = [...published_tests, testId];

    const { error: updateError } = await supabase
      .from('users')
      .update({ published_tests: updated_published_tests })
      .eq('email', user_email);
    
    alert("Test Published Successfully");
  }



  

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
          <div className="space-y-2 flex">
            <Label htmlFor="inputMethod">Input Method</Label>
            <select id="inputMethod" className = "m-auto bg-gray-400" value={inputMethod} onChange={handleMethodChange}>
              <option value="manual">Manual Input</option>
              <option value="upload">Upload File</option>
            </select>
          </div>
          {inputMethod === 'manual' && (
            <>
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
          </>
          )}

          {inputMethod === 'upload' && (
            <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <Input id="file" type="file" />
          </div>
          )
          }
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
            <div className="border-t p-4 flex:row items-center justify-end gap-2 w-[20%]">
              <Button asChild className="bg-blue-400" variant="outline">
              <Link href={`/addQuestion/${test.id}`}>
                Add Questions
              </Link>
              </Button>
              {/* <Button asChild className="bg-blue-400" variant="outline">
              <Link href={`/test/${test.id}`}>
                Review Test
              </Link>
              </Button> */}
              <Button onClick={() => publishTest(test.id)} className="bg-blue-400" variant="outline">
                  Publish Test
                </Button>
            </div>
          </div>
      ))}

      </div>
      </div>
        
    
  );
}

export default CreateTestForm;
