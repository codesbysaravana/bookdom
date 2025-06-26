import React from 'react'
import { ReactNode } from 'react'

//@allowImportingTsExtensions
import Header from "@/components/Header";
import {auth } from "@/auth";
import { redirect } from "next/navigation";

const layout = async ({ children } : { children: ReactNode}) => {
    //to prevent routing from main to sign in page and to solidify that user logged in completely 
        const session = await auth()
        //wait for auth and proceed
        //get session and if theres one
        if(!session) redirect("/sign-in");

  return (

    //the root layout for the university library app
    //this is the main container for the app
    <main className="root-container">
      {/* main class name root containder to solidify that this is the main root containder */}
        <div className='mx-auto max-w-7xl'>
            <Header/>

            <div className='mt-20 pb-20'>
                {children}
            </div>

        </div>
    </main>
  )
}

//{ children } ----> are everything thats passed to the layout component...thats this is the entire content of the app next app!!!!!!!!

export default layout