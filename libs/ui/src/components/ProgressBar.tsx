

export interface ProgressBarProps {
  bg: string;
  percent?: string;
}

export const ProgressBar = ({ bg, percent }: ProgressBarProps) => (
  <div
    style={{
      height: 8,
      width: '30vh',
      backgroundColor: '#e0e0de',
      borderRadius: 50,
    }}
  >
    <div
      style={{
        height: '100%',
        width: `${percent}%`,
        transition: 'width 1s ease-in-out',
        backgroundColor: bg,
        borderRadius: 'inherit',
        textAlign: 'right',
      }}
    ></div>
  </div>
);
