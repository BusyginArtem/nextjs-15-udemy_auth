import { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Next Auth",
  description: "Next.js Authentication",
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
