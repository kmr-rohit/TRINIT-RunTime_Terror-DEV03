import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"

export default function getUser() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const session = supabase.auth.session()

    setUser(session?.user ?? null)

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user
        setUser(currentUser)
      }
    )
    console.log(user)

    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  return user
}
