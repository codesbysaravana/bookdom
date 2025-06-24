import React from 'react'
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <section className='w-full rounded-2xl bg-white p-7'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
            <h2 className='text-xl font-semibold'>All Books</h2>
                <Button className="bg-primary-admin" asChild>
                    <Link href="/admin/books/new" className='text-white'>
                        + Create a New Book
                    </Link>
                </Button>
        </div>

        <div>
            <p className='mt-7 w-full overflow-hidden'>Table</p>
        </div>
    </section>
  )
}

export default page

/*
    Note: The `asChild` prop in the `Button` component is typically used to render the button as a different element, such as a link. 
    When you use `asChild`, you should wrap the button's children with the desired element, for example:

    <Button asChild>
        <a href="/admin/books/create" className="bg-primary-admin">+ Create a New Book</a>
    </Button>

    This will render the button as an anchor tag, preserving the button's styles and behavior.
*/