export default function PrismGraphic() {
  return (
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center" aria-hidden="true">
      <div
        className="h-10 w-10 bg-gradient-to-br from-yellow-200 via-yellow-400 to-amber-500"
        style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
      />
      <span className="absolute right-0 top-1 h-2 w-2 rounded-full bg-sky-400" />
      <span className="absolute right-1 top-6 h-1.5 w-1.5 rounded-full bg-pink-400" />
      <span className="absolute right-3 top-11 h-2 w-2 rounded-full bg-emerald-400" />
    </div>
  )
}
