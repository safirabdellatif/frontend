import type { Metadata } from "next";
import { RedirectAdminClient } from "@/app/redirecmysanad/RedirectAdminClient";

export const metadata: Metadata = {
  title: "Redirect Manager",
  robots: { index: false, follow: false },
};

export default function RedirectAdminPage() {
  return <RedirectAdminClient />;
}
