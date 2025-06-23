'use server';
//only renders on server

import { eq } from "drizzle-orm"
import { db } from "../../database/drizzle";
import { users } from "../../database/schema"
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";
import config from "../config"
import { workflowClient } from "../workflow";

//functiion for signing in automatic after signing up
//picks what parameter to want as inputs
export const signInWithCredentials = async (params: Pick<AuthCredentials, 'email' | "password">,) => {
    //extract params
    const { email, password } = params;

    //getting the current users ip address or show a default one 
    const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
    const { success } = await ratelimit.limit(ip);

    if(!success) return redirect("/too-fast");
    //new route well create redirect if theres too many requests

    try {
        //signin func from @/auth coming from root auth.ts passing email, pass to login after auth is successfull
        const result = await signIn("credentials", {
            email, password, redirect: false,
        })

        if(result?.error) {
            return { success: false, error: result.error };
        }

        return { success: true };

    } catch(error) {
        console.log(error, "Signin error");
        return { success: false, error: "Signin error" };
    }
}



//signUP gets paramters of pnly type Authredentials...creted in types.d.ts
export const signUp = async (params: AuthCredentials) => {
    const { fullName, email, universityId, password, universityCard } = params;

    
    //getting the current users ip address or show a default one 
    const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
    const { success } = await ratelimit.limit(ip);

    if(!success) return redirect("/too-fast");
    //new route well create


    //checking if user exists already
    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        //checking if email is there in database
        .limit(1);

        if(existingUser.length > 0) {
            return { success: false, error: "user already exists" }
        }
        //chechking if a new signed UP user already exists

        //excrypting password
        const hashedPassword = await hash(password, 10);

        try {
            //try create a new user
            //new auth for a new user
            await db.insert(users).values({
                fullName,
                email,
                universityId,
                password: hashedPassword,
                universityCard,
            });

            await workflowClient.trigger({
                url: `${config.env.prodAPIEndpoint}/api/workflows/onboarding`,
                body: {
                    email,
                    fullName,
                },
            });

            //automatic sign in after signUP
            //a function getting values
            await signInWithCredentials({ email, password });
            return { success: true };

             
        } catch (error) {
            console.log(error, 'Signup error');
            return { success: false, error: 'Signup error' };
        }
};


//this contains the signup and sign in credentials at auth for actions