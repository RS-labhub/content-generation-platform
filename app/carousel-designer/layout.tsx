// Route-local layout removes default Header/Footer so the designer page is full-screen
export default function CarouselDesignerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
