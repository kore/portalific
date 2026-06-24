// A native checkbox styled as a toggle switch. The visual switch and its
// sliding handle are drawn entirely in CSS (.switch / .switch::before).
export default function Switch ({ checked, onChange, label, description, children, ...rest }) {
  return (
    <li className='toggle-item' {...rest}>
      <div className='toggle-text'>
        {label && <p className='toggle-label'>{label}</p>}
        {description && <p className='toggle-description'>{description}</p>}
        {children}
      </div>
      <input
        type='checkbox'
        role='switch'
        className='switch'
        checked={!!checked}
        aria-label={typeof label === 'string' ? label : undefined}
        onChange={(event) => onChange(event.target.checked)}
      />
    </li>
  )
}
