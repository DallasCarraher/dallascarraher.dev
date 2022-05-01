interface ICodesandbox {
  src: string
  title: string
  className: string
}

const allow =
  'accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking'
const sandbox =
  'allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts'

export default function Codesandbox({ src, title, className }: ICodesandbox) {
  return (
    <iframe
      src={src}
      title={title}
      className={className}
      allow={allow}
      sandbox={sandbox}
    ></iframe>
  )
}
