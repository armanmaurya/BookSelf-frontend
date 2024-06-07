export default function Articlelayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
        <div className="h-full">
            {children}
        </div>
        
    )
}