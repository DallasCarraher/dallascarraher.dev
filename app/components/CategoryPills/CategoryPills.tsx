import useWindowSize from '~/hooks/useWindowSize'
import styles from './styles.css'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

type Props = {
  filterNames: string[]
  active: string[]
  setChoices: React.Dispatch<React.SetStateAction<string[]>>
}

export default function CategoryPills({
  filterNames,
  active,
  setChoices,
}: Props) {
  const { width } = useWindowSize()

  const updateChoices = (newChoice: string, all?: boolean) => {
    // create a localized copy of active to mutate freely before updating the reactive parent
    let updated = new Array(...active)

    // if newChoice === '' clear the active filters array
    if (newChoice === '') {
      setChoices(new Array(''))
      return
    }
    // if newChoice isn't an already active filter, add it
    if (!active.includes(newChoice)) {
      // if filters still contains the blank entry, remove it
      if (active.includes('')) {
        updated = updated.remove('')
      }
      setChoices([...updated, newChoice])
      return
    }
    // if newChoice IS an already active filter, remove it
    else {
      updated = active.remove(newChoice)
      if (updated.length === 0) {
        updated.push('')
      }
      setChoices(updated)
      return
    }
  }

  return (
    <>
      <div className="filters-container">
        {width > 760 && (
          <>
            <div
              onClick={() => setChoices([...filterNames])}
              className="control"
            >
              show all
            </div>
            <div onClick={() => updateChoices('')} className="control">
              clear
            </div>
          </>
        )}
        {filterNames.map((filter, ix) => (
          <div
            key={`${filter}.filter-group.${ix}`}
            onClick={() => updateChoices(filter)}
            className={
              active.includes(filter) ? 'filter selected' : 'filter unselected'
            }
          >
            {filter}
          </div>
        ))}
      </div>
    </>
  )
}
