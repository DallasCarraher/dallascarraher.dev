import { Button } from 'ariakit/button'
import github from '../assets/icons/github.svg'
import linkedIn from '../assets/icons/linkedin.svg'

/**
 * This serves as my landing page for my website
 */
export function Index() {
  return (
    <>
      <header className="w-full h-96 lt-sm:h-80 bg-cover bg-center bg-no-repeat">
        <div className="max-w-screen-sm h-full mx-auto flex flex-col items-center justify-center">
          <div className="h-56">
            <img
              src="https://github.com/DallasCarraher.png"
              alt="A picture of me"
              className="h-56 select-none rounded-full"
            />
          </div>
          <h1 className="text-3xl text-white p-3">Dallas Carraher</h1>
          <div className="flex space-x-2">
            <Button
              as="a"
              href="https://github.com/DallasCarraher"
              rel="no-referrer"
              target="_blank"
            >
              <img
                src={github}
                alt="github logo"
                className="h-10 bg-slate-400 rounded-full p-1"
              />
            </Button>
            <Button
              as="a"
              href="https://linkedin.com/in/dallascarraher"
              rel="no-referrer"
              target="_blank"
            >
              <img
                src={linkedIn}
                alt="linkedIn logo"
                className="h-10 bg-slate-400 rounded-full p-1"
              />
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-screen-sm px-6 mx-auto"></main>
      <footer className="max-w-screen-sm px-6 mx-auto mt-20 pb-16 lt-sm:pb-8 lt-sm:mt-16">
        <p className="flex items-center gap-2.5 text-gray-400 text-sm">
          <span>© 2022 Dallas Carraher, Powered by MyStack</span>
        </p>
      </footer>
    </>
  )
}
