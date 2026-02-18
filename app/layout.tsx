export const metadata = {
  title: "ContourAI",
  description: "Evidence-Based Contouring Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
