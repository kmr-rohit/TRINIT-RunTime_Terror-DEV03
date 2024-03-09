
import { CardTitle, CardDescription, CardHeader, CardContent, Card, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
export default function ScoreCard() {
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-col items-center space-y-1 text-center">
        <CardTitle>Test results</CardTitle>
        <CardDescription>You've completed the test. Here are your results.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2">
        <div className="flex justify-between">
          <div>Attempted</div>
          <div>20</div>
        </div>
        <div className="flex justify-between">
          <div>Score</div>
          <div>80%</div>
        </div>
        <div className="flex justify-between">
          <div>Correct</div>
          <div>16</div>
        </div>
        <div className="flex justify-between">
          <div>Incorrect</div>
          <div>4</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild className="bg-blue-500 text-white hover:bg-blue-600" variant="outline">
          <Link href='/dashboard'> Go to Dashboard</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

