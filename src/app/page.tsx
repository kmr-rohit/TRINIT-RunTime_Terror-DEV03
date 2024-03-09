import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Linden_Hill } from "next/font/google";
import Link from "next/link";

export default function Home() {
  return (
    <main >
      {/* <Login /> */}
      {/* <Dashboard /> */}
      {/* <TestView /> */}
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Image src="/logo.svg" alt="My Test App" width={100} height={100} />
        <h1 className="text-4xl font-semibold mt-4">Welcome to My Test App</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">The best platform to create and attempt tests</p>
        <div className="mt-8">
          <Button asChild className="mr-4" variant="outline">
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="default">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
