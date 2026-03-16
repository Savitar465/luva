import { supabase } from "@/lib/supabase/client"
import { Profile } from "@/lib/types/profile"
import { User } from "@supabase/supabase-js"

export async function login(email: string, password: string) {

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error

  return data
}

export async function logout(): Promise<void> {

  const { error } = await supabase.auth.signOut()

  if (error) throw error
}

export async function getCurrentUser(): Promise<User | null> {

  const { data } = await supabase.auth.getUser()

  return data.user
}

export async function getProfile(userId: string): Promise<Profile> {

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) throw error

  return data as Profile
}