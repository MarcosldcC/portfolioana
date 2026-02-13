import { getPosts, Post } from "@/app/actions/calendar";
import CalendarioClient from "./client";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CalendarioPage({ searchParams }: PageProps) {
  const { month, year } = await searchParams;
  const now = new Date();

  // Parse month and year from searchParams or default to current
  const monthParam = month;
  const yearParam = year;

  let currentMonth = now.getMonth();
  let currentYear = now.getFullYear();

  if (monthParam && typeof monthParam === 'string') {
    const parsedMonth = parseInt(monthParam);
    if (!isNaN(parsedMonth) && parsedMonth >= 0 && parsedMonth <= 11) {
      currentMonth = parsedMonth;
    }
  }

  if (yearParam && typeof yearParam === 'string') {
    const parsedYear = parseInt(yearParam);
    if (!isNaN(parsedYear)) {
      currentYear = parsedYear;
    }
  }

  const postsData = await getPosts(currentYear, currentMonth);

  // Ensure data matches Post type
  const posts: Post[] = postsData.map((p: any) => ({
    id: p.id,
    client: p.client,
    type: p.type,
    status: p.status,
    date: p.date, // This is ISO string from DB
    caption: p.caption,
    created_at: p.created_at
  }));

  return (
    <CalendarioClient
      initialPosts={posts}
      currentMonth={currentMonth}
      currentYear={currentYear}
    />
  );
}
