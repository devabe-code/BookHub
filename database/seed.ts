import fetch from "node-fetch"; 
import ImageKit from "imagekit";
import { books } from "@/database/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import { Vibrant } from "node-vibrant/node";
import { getIdFromKey } from "@/lib/utils";


config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

const uploadToImageKit = async (
  url: string,
  fileName: string,
  folder: string,
) => {
  try {
    const response = await imagekit.upload({
      file: url,
      fileName,
      folder,
    });

    return response.filePath;
  } catch (error) {
    console.error("Error uploading image to ImageKit:", error);
    return null;
  }
};

const fetchBookDetails = async (workKey: string) => {
  try {
    const response = await fetch(`https://openlibrary.org/works/${workKey}.json`);
    const data : any = await response.json();
    return {
      description:
        data.description?.value || data.description || "No description available."
    };
  } catch (error) {
    console.error(`Error fetching details for ${workKey}:`, error);
    return {
      description: "No description available."
    };
  }
};

const fetchBookRating = async (workKey: string) => {
    try {
      const response = await fetch(`https://openlibrary.org/works/${workKey}/ratings.json`);
      const data : any = await response.json();
      return {
        rating:
          Math.round(data.summary?.average)
      };
    } catch (error) {
      console.error(`Error fetching rating for ${workKey}:`, error);
      return {
        rating: "No rating available."
      };
    }
  };

const fetchBooksFromOpenLibrary = async () => {
  try {
    const response = await fetch("https://openlibrary.org/subjects/fiction.json?limit=15");
    const data : any= await response.json();

    const books = [];
    for (const work of data.works) {
      const details = await fetchBookDetails(getIdFromKey(work.key));
      const rating = await fetchBookRating(getIdFromKey(work.key));

      books.push({
        title: work.title,
        author: work.authors[0]?.name || "Unknown Author",
        genre: work.subject?.slice(0, 3).join(", "),
        rating: rating.rating,
        description: details.description,
        authorPhotoUrl: work.authors[0]?.key ?
          `https://covers.openlibrary.org/a/olid/${getIdFromKey(work.authors[0]?.key)}-L.jpg`
          : null,
        coverUrl: work.cover_id
          ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`
          : null,
        videoUrl: "",
      });
    }

    return books;
  } catch (error) {
    console.error("Error fetching books from Open Library:", error);
    return [];
  }
};

const IMAGEKIT_BASE_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

/**
 * Derive a best-guess cover color from the given image URL.
 * @param {string} coverUrl - URL or relative path of the book cover image.
 * @returns {Promise<string>} - A hex color code representing the dominant color.
 */
const getCoverColor = async (coverUrl: string): Promise<string> => {
  try {
    if (!coverUrl) {
      throw new Error("No cover URL provided.");
    }

    // Ensure the cover URL is absolute
    const fullCoverUrl = coverUrl.startsWith("http")
      ? coverUrl
      : `${IMAGEKIT_BASE_URL}${coverUrl}`;

    const response = await fetch(fullCoverUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const dominantColor = await Vibrant
                                .from(fullCoverUrl)
                                .getPalette()
                                .then((palette) => {
                                    return palette.Vibrant?.hex || palette.DarkVibrant?.hex || "#FFFFFF";});

    return dominantColor;
  } catch (error) {
    console.error("Error deriving cover color:", error);
    return "#FFFFFF"; // Default fallback color
  }
};

const seed = async () => {
    console.log("Seeding data...");

    try {
      const booksFromAPI = await fetchBooksFromOpenLibrary();
  
      for (const book of booksFromAPI) {
        const coverUrl = book.coverUrl
          ? await uploadToImageKit(book.coverUrl, `${book.title}.jpg`, "/books/covers")
          : null;
  
        const coverColor = coverUrl ? await getCoverColor(coverUrl) : "#FFFFFF";

        // Explicitly define the book object
        const newBook: BookInsert = {
            title: book.title,
            author: book.author,
            genre: book.genre,
            rating: Number(book.rating) || 0, // Ensure rating is a number
            description: book.description || "No description available.",
            coverColor: coverColor || "#FFFFFF",
            coverUrl: coverUrl || "", // Use a default value for missing cover URLs
            authorPhotoUrl: book.authorPhotoUrl || "",
            videoUrl: "",
        };

        await db.insert(books).values(newBook);
      }
  
      console.log("Data seeded successfully!");
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  };

seed();