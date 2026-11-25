export default function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={down ? "icon icon-down" : "icon"}
      viewBox="0 0 20 20"
    >
      <path d="M3 10h13M11 4l6 6-6 6" />
    </svg>
  )
}
