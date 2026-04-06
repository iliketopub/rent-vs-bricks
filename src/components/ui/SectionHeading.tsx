interface SectionHeadingProps {
  children: React.ReactNode
}

export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
      {children}
    </h2>
  )
}
