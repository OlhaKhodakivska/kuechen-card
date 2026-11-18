import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Küchen nach Maß | Räume für das Leben",
  description: "Kompakt, charaktervoll oder exklusiv: Entdecken Sie individuelle Küchenideen und fragen Sie einen persönlichen Beratungstermin an.",
  metadataBase: new URL("https://kuechen-nach-mass-olha.dci-digital-7789.chatgpt.site"),
  openGraph: { title: "Küchen nach Maß", description: "Ihre Küche. Ihr Leben. Nach Maß.", locale: "de_DE", type: "website", url: "/" },
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body>{children}</body></html>;
}
