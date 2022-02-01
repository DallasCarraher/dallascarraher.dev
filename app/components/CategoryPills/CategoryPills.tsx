import './styles.css'

type Props = {
  filters: string[]
}

export const CategoryPills: React.FC<Props> = ({ filters }) => {
  return (
    <>
      {filters.map((filter) => (
        <a key={filter} href={`/posts/${filter}`}>
          <div className="pill-component__filter">{filter}</div>
        </a>
      ))}
    </>
  )
}
