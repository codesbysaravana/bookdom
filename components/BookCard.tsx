import React from "react";
import Link from "next/link";
import Image from "next/image";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Define Book type if not already imported
interface Book {
  id: string;
  title: string;
  genre: string;
  coverColor: string;
  coverUrl: string;
}

const BookCard = ({ id, title, genre, coverColor, coverUrl }: Book) => (
  <li className={cn("xs:w-52 w-full")}>
    <Link href={`/books/${id}`} className={cn("w-full flex flex-col items-center")}>
      <BookCover coverColor={coverColor} coverImage={coverUrl} />

      <div className={cn("mt-4", "xs:max-w-40 max-w-28 text-center")}>
        <p className="book-title">{title}</p>
        <p className="book-genre">{genre}</p>
      </div>

      <div className="mt-3 w-full flex flex-col items-center gap-2">
        <div className="book-loaned flex items-center gap-2">
          <Image
            src="/icons/calendar.svg"
            alt="calendar"
            width={18}
            height={18}
            className="object-contain"
          />
          <p className="text-light-100">11 days left to return</p>
        </div>

        {/* <Button className="book-btn w-full">Download receipt</Button> */}
      </div>
    </Link>
  </li>
);

export default BookCard;
