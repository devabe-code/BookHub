"use client"

// Types
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from 'react-hook-form'
import { z, ZodType } from 'zod'
import { useRouter } from 'next/navigation'

// Components
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { FIELD_NAMES, FIELD_TYPES } from '@/constants'
import ProfilePicture from './ProfilePicture'
import { toast } from '@/hooks/use-toast'

interface Props<T extends FieldValues> {
    schema: ZodType<T>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<{success: boolean, error?: string}>;
    type: 'SIGN_IN' | 'SIGN_UP';
}

const AuthForm = <T extends FieldValues>(
    { type, 
      schema, 
      defaultValues, 
      onSubmit }: Props<T>) => {

   const router = useRouter();
   const isSignIn = type === 'SIGN_IN';

   // Define form
   const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
   });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);
    if (result.success) {
        toast({
            title: "Success",
            description: isSignIn ? "You are now signed in" : "Account created successfully",
            variant: "default",
        })
        router.push('/');
    } else {
        toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
        })
    }
  };
  return (
    <div className='flex flex-col gap-4'>
        <h1 className="text-2xl font-semibold text-white">
            {isSignIn ? "Welcome back to BookHub!" : "Create your BookHub account"}
        </h1>
        <p className="text-light-100">
            {isSignIn ? "Access the ultimate online library" : "Join the community and start reading today!"}
        </p>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
            {Object.keys(defaultValues).map((field) => (
                <FormField
                key={field}
                control={form.control}
                name={field as Path<T>}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className='capitalize'>{FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}</FormLabel>
                    <FormControl>
                        {field.name === 'profilePicture' ? (
                            <ProfilePicture
                                onFileChange={field.onChange}
                             />
                        ) : (
                            <Input 
                                required 
                                type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]} 
                                {...field}
                                className='form-input'
                            />
                        )}
                    </FormControl>
                    <FormDescription>
                        {field.name === 'password' ? "Must be at least 8 characters long" : ""}
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            ))}
            <Button type="submit" className='form-btn'>
                {isSignIn ? "Sign in" : "Sign up"}
            </Button>
        </form>
        </Form>
        <p className="text-center text-base font-medium">
            {isSignIn ? "New to BookHub?" : "Already have an account?"}
            <Link href={isSignIn ? "/sign-up" : "/sign-in"} className='font-bold text-primary'>
                {isSignIn ? "Create an account" : "Sign in"}
            </Link>
        </p>
    </div>
  )
}

export default AuthForm