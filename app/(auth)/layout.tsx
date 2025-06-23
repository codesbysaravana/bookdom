import React from 'react'
import { ReactNode } from 'react'
import Image from 'next/image'
import {auth } from "@/auth";
import { redirect } from "next/navigation";
import { users } from "../../database/schema";
import { db } from "../../database/drizzle";
import { eq } from "drizzle-orm";

const layout = async ({ children } : { children : ReactNode }) => {
    //to prevent routing from main to sign in page and to solidify that user logged in completely 
    const session = await auth()
    //wait for auth and proceed
    //get session and if theres one
    if(!session) redirect("/sign-in");

    if (session?.user?.id) {
        const user = await db
        .select()
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1)

        const today = new Date().toISOString().slice(0, 10)

        if (user.length && user[0].lastActivityDate !== today) {
        await db
            .update(users)
            .set({ lastActivityDate: today })
            .where(eq(users.id, session.user.id))
        }
    }

  return (
    <main className='auth-container'>
        {/* className='auth-container'> is the background appearing one class!!! */}
        <section className='auth-form'>
            <div className='auth-box'>
                    <div className='flex flex-row gap-3'>
                         <Image src="/icons/logo.svg" alt="logo" width={37} height={37} />
                        <h1 className='text-2xl font-semibold text-white'>BookDom</h1>
                    </div>

                    <div>
                        {children}

                        {/* the children here are the page.tsx in the (auth) folder inside the sign in and sign up forms */}
                        {/* ------------------------------------------------------------------------------------------------------- */}
                        {/* Thus uses the same styles backgroubd and the same logo and title in this layout for both sign in and sign up pages */}
                        {/* ------------------------------------------------------------------------------------------------------- */}
                        {/* Routes to the sign in and sign up pages will be rendered here */}
                    </div>
            </div>
        </section>

        <section className='auth-illustration'>

            {/* this image appears on the right side of the auth form BIIIGG ONE 
            and appears tiny at the top in the mobile view on Auth pages */}
            {/* Look for auth illustration in gloabals */}
            <Image
                src="/images/auth-illustration.png"
                alt="auth illustration"
                width={1000}
                height={1000}
                className='size-full object-cover'
            />

        </section>
    </main>
  )
}

export default layout