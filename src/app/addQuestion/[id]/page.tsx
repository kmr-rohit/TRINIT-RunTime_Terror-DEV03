"use client"
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CardContent, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase";


export default function Component() {
  const [questionType, setQuestionType] = useState('objective');
  const [description, setDescription] = useState('');
  const [marks, setMarks] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);

  const handleQuestionTypeChange = (value) => {
    setQuestionType(value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleMarksChange = (event) => {
    setMarks(event.target.value);
  };

  const handleOptionChange = (index, event) => {
    const newOptions = [...options];
    newOptions[index] = event.target.value;
    setOptions(newOptions);
  };

   const pushDataToSupabase = async (questionData) => {
    const { data, error } = await supabase.from('questions').insert([questionData]);
    if (error) {
      console.log(error);
      return;
    }
    console.log(data);
    alert('Question Added Successfully');
  }


  const handleSubmit = async () => {
    console.log('Submitted');
    console.log('Description: ', description);
    console.log('Question Type: ', questionType);
    console.log('Marks: ', marks);
    console.log('Options: ', options);
    console.log('Test ID: ', window.location.pathname.split('/')[2]);

    const testId = window.location.pathname.split('/')[2];
    // Create a question data object 
    const questionData = {
      description,
      question_type : questionType,
      question_mark : marks,
      options,
      test_id : testId
    };

    await pushDataToSupabase(questionData);
  };

  return (
    <Card className="w-[60%] mx-auto mt-10">
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Question Description</Label>
          <Input id="description" value={description} onChange={handleDescriptionChange} placeholder="Enter the question description." />
        </div>
        <div className="space-y-2">
          <Label>Question Type</Label>
          <div className="space-y-2.5">
            <Select value={questionType} onValueChange={handleQuestionTypeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Question Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Question Type</SelectLabel>
                  <SelectItem value="objective">Objective</SelectItem>
                  <SelectItem value="subjective">Subjective</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="marks">Question Marks</Label>
          <Input id="marks" value={marks} onChange={handleMarksChange} placeholder="Enter the question marks." type="number" />
        </div>
        {questionType === 'objective' && (
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <Input key={index} value={option} onChange={(event) => handleOptionChange(index, event)} placeholder={`Option ${index + 1}`} />
              ))}
            </div>
          </div>
        )}
        <Button onClick={handleSubmit}>Submit</Button>
      </CardContent>
    </Card>
  )
}
