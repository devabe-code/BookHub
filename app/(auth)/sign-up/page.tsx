"use client"
import AuthForm from '@/components/AuthForm'
import { signUp } from '@/lib/actions/auth'
import { signUpSchema } from '@/lib/validations'
import React from 'react'
import { z } from 'zod'

const Page = () => {
  return (
    <AuthForm
      type="SIGN_UP"
      schema={signUpSchema as z.ZodType<AuthCredentials>}
      defaultValues={{
        email: '',
        password: '',
        fullName: '',
        profilePicture: '',
      }}
      onSubmit={signUp}
    />
  )
}

export default Page