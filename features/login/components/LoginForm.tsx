"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/lib/services/authService"

export default function LoginForm() {

  const router = useRouter()

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault()

    try {

      await login(email, password)

      router.push("/pedidos")

    } catch (err) {

      setError("Credenciales incorrectas")

    }

  }

  return (

    <div>

      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          Ingresar
        </button>

      </form>

      {error && <p>{error}</p>}

    </div>

  )

}