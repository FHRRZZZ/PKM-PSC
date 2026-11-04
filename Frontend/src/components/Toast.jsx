// tone: 'red' | 'blue' | 'green' | 'gray'
export default function StatusBadge({ tone = 'gray', children }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}
