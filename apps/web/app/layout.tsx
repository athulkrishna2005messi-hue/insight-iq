import "./globals.css";

export const metadata = {
  title: "Insight iQ",
  description: "InsightHub MVP"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="px-4 py-4">
            <h1 className="text-xl font-bold text-gray-900">Insight iQ</h1>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}


