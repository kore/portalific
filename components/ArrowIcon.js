export default function ArrowIcon ({ className, color = 'text-primary' }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      fill='none'
      viewBox='0 0 24 24'
      className={className}
    >
      <path
        className={`stroke-current ${color}`}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M5 12h14M12 19l7-7-7-7'
      />
    </svg>
  )
}
