import { Link } from 'remix'
import './styles.css'

type Props = {
  filter: string
}

export const CategoryPill: React.FC<Props> = ({ filter }) => {
  return (
    <Link to={`/posts/${filter}`} className="pill-link">
      {filter}
    </Link>
  )
}
