export const ProgressBar = ({
  bg,
  percent,
}: {
  bg: string
  percent?: string
}) => {
  const containerStyles = {
    height: 8,
    width: '30vh',
    backgroundColor: '#e0e0de',
    borderRadius: 50,
  }

  const fillerStyles = {
    height: '100%',
    width: `${percent}%`,
    transition: 'width 1s ease-in-out',
    backgroundColor: bg,
    borderRadius: 'inherit',
    textAlign: 'right',
  }

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}></div>
    </div>
  )
}

export default ProgressBar
