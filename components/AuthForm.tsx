"use client"

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues, SubmitHandler, useForm, UseFormReturn, FieldValues, Path } from "react-hook-form"
import { ZodType } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FIELD_NAMES, FIELD_TYPES } from "@/constants"
import FileUpload from "./FileUpload" // Assuming this is the correct path to your ImageUpload component
import { toast } from "sonner";

/* pulling FieldNames and FieldTypes from manual created constants file Not shadCn */

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}




/* Now this Props Type is of <T> type, which means it can be any type, and we can use it to define the type of the schema, defaultValues, and onSubmit function. */


const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const isSignIn = type === "SIGN_IN";
  const router = useRouter();

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    // TODO: Add submit logic here final step in auth 
    //awaits the passed data from form 
    const result = await onSubmit(data);

    if(result.success) {
    toast.success(isSignIn ? 'You have signed in successfully.' : 'You have signed up successfully.');
    //finally after all signs and ins going to the next/ main page
    router.push('/');
    } else  {
        toast.error('Error Signing In');
    }
  };

  return (
    <div className='flex flex-col gap-4'>
        <h1 className="text-2xl font-semibold text-white">
            {isSignIn ? "Welcome Back to BookDom" : "Create your new library account"}
        </h1>

        <p className='text-light-100'>
            {isSignIn ? 
                "Access the vast collection of resources and stay updated" 
                : "Please complete the form below to create your account"}
        </p>
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-6 w-full"
                >

                    {Object.keys(defaultValues).map((field) => (
                        <FormField
                            key={field}
                            control={form.control}
                            name={field as Path<T>}
                            render={({ field: fieldProps }) => (
                                <FormItem>
                                    <FormLabel className='capitalize'>
                                        {FIELD_NAMES[fieldProps.name as keyof typeof FIELD_NAMES]}
                                    </FormLabel>
                                    <FormControl>
                                    {/* all and most will be inputs in form except univresity card its a image */}
                                        {fieldProps.name === "universityCard" ? (
                                            <FileUpload
                                                type='image'
                                                accept='image/*'
                                                placeholder='Upload your ID'
                                                folder='ids'
                                                variant='dark'
                                                onFileChange={fieldProps.onChange}
                                            /> ) : (
                                            /* mentioning the input types from constants file */
                                            <Input 
                                                required 
                                                type={FIELD_TYPES[fieldProps.name as keyof typeof FIELD_TYPES]}
                                                placeholder="Enter value" {...fieldProps}
                                                className="form-input"
                                             />
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                
                                </FormItem>
                            )}
                        />
                    ))}

                    <Button type="submit" className='form-btn'>{isSignIn ? "Sign In" : "Sign  Up"}</Button>
                </form>
            </Form>

            <p className='text-center text-base font-medium'>
                {isSignIn ? "New to BookDom?" : "Already have an account?"}

                    {/* linking to the different pages  */}
                <Link 
                    href={isSignIn ? "/sign-up" : "/sign-in"}
                    className='font-bold text-primary'
                >
                    {isSignIn ? "Create a account" : "Sign in"}
                </Link>

            </p>

    </div>
  )
}

export default AuthForm
/* 
for actually uploading images use IMAGEKIT SERVICE */


//atlast we create the handleSubmit button after all the auth functionality routes and folders at the end