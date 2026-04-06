interface TrafficLightProps {
  band: 'green' | 'amber' | 'red'
  label: string
}

const styles = {
  green: 'bg-green-100 text-green-800',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-800',
}

export function TrafficLight({ band, label }: TrafficLightProps) {
  return (
    <span role="status" aria-label={`Budget status: ${label}`} className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold ${styles[band]}`}>
      {label}
    </span>
  )
}
