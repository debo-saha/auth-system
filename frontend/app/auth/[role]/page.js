import { redirect } from "next/navigation";

export default function BlockedSlugPage() {
  // Block all access to this dynamic route
  redirect("/auth"); // or "/"
}
