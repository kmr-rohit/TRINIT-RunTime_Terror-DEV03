"use client"
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";

import { 
  Card, 
  CardTitle, 
  CardDescription, 
  CardHeader, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";

import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger 
} from "@/components/ui/drawer";
import { Session } from "@supabase/auth-helpers-nextjs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import ScoreCard from "@/components/ScoreCard";

export default function TestView() {  
  let [test_id , setTestId] = useState(0);
  const [tests, setTests] = useState([]);
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [session, setSession] = useState<Session|null>(null);
  useEffect(() => {
    
    supabase.auth.getSession()
    .then(session => {
      if(session.data.session) {
        console.log("SESSION: ", session.data.session)
        setSession(session.data.session)
      } else {
      }
    })  
    .catch(err => { 
      console.log("ERROR GET SESSION: ", err) 

    })

    // Test Id EXtract
    const path = window.location.pathname;
    test_id = path.split('/')[2];
    setTestId(test_id);
},[])


  const checkAttempted = async () => {
    const user = session?.user;
    const user_email = user?.email;
    const {data }  = await supabase.from('users').select('attempted_tests').eq('email', user_email);
    console.log("DATA: ", data);
    if(data.length == 0){
      return;
    }
    const attempted_test_data = data[0].attempted_tests;
    if(attempted_test_data.includes(test_id)){
      setIsSubmitted(true);
    }
  }
  checkAttempted();

  useEffect(() => {
    async function fetchTest() {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .eq('id', test_id);
      if (error) {
        console.error('Error fetching test:', error.message);
        return;
      }
      setTest(data);
    }

    async function fetchQuestions() {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('test_id', test_id);
      if (error) {
        console.error('Error fetching questions:', error.message);
        return;
      }
      setQuestions(data);
    }

    fetchTest();
    fetchQuestions();
  }, []);

  const handlePreviousQuestion = () => {
    setCurrentQuestion(prev => Math.max(prev - 1, 0));
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(prev => Math.min(prev + 1, questions.length - 1));
  };

  const handleSubmitTest = async () => {

    // Update Attempted Test Arrat in User Table
    const user = session?.user;
    const user_email = user?.email;
    // console.log("USER EMAIL: ", user_email);
    const {data }  = await supabase.from('users').select('attempted_tests').eq('email', user_email);
    
    console.log("DATA: ", data);
    const attempted_test_data = data[0].attempted_tests;

    const updated_attempted_tests = [...attempted_test_data, test_id];

    const { error } = await supabase.from('users').update({attempted_tests: updated_attempted_tests}).eq('email', user_email);

    setIsSubmitted(true);
    const score = 0; // Compute score here
    setScore(score);
  };

  return (
    <div className="m-4 p-4 flex-row md:flex">
      {isSubmitted ? (
        <ScoreCard />
      ) : (
        <>
          <Card className="w-[90%] md:w-[70%] mb-4 ml-4 ">
            <CardHeader className="pb-0">
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                variant="outline"
                onClick={handlePreviousQuestion}
              >
                Previous
              </Button>
              <Button
                className="bg-green-500 text-white hover:bg-green-600"
                variant="default"
                onClick={handleNextQuestion}
              >
                Next
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Question {currentQuestion + 1}</h2>
                <p>Question Type : {questions[currentQuestion]?.question_type}</p>
                <br></br>
                <p className="text-lg font-semibold" >Problem Statement : {questions[currentQuestion]?.description}</p>
                

                {questions[currentQuestion]?.question_type == "objective" && questions[currentQuestion]?.options.map((option, index) => (
                  <div className="flex flex-row items-center space-x-2" key={index}>
                    <Input
                      className="h-[30px] w-4"
                      id={`question-${currentQuestion}-answer-${index}`}
                      name={`question-${currentQuestion}`}
                      type="radio"
                      value={index}
                    />
                    <Label className="text-sm" htmlFor={`question-${currentQuestion}-answer-${index}`}>
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-4 m-3"></CardFooter>
          </Card>
          <Card className="w-[90%] md:w-[30%] mb-4 ml-4">
            <CardHeader className="pb-0">
              <h2 className="text-2xl font-semibold">Navigate through Question Paper</h2>
            </CardHeader>
            <CardContent className="flex flex-wrap">
              {[...Array(questions.length)].map((_, i) => (
                <Button key={i} className="p-2 m-2 bg-gray-800 hover:bg-blue-500 w-1/5" onClick={() => setCurrentQuestion(i)}>
                  {i + 1}
                </Button>
              ))}
            </CardContent>
            <CardFooter className="gap-4 m-3">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button className="bg-blue-500 text-white hover:bg-blue-600" variant="outline">
                    Submit Test
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Are you sure you want to submit the test?</DrawerTitle>
                    <DrawerDescription>Once you submit, you can't change your answers.</DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>
                    <DrawerClose>Cancel</DrawerClose>
                    <Button onClick={handleSubmitTest}>Submit</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
}
