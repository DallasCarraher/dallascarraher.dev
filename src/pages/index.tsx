import type { NextPage } from 'next'
import { trpc } from '../utils/trpc'

import github from '../../public/icons/github.svg'
import linkedIn from '../../public/icons/linkedin.svg'
import { SocialButton } from '../components/SocialButton'
import { Tooltip } from '../components/Tooltip'

const Home: NextPage = () => {
  const hello = trpc.useQuery(['posts.getAll'])
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
          <h1 className="text-3xl p-3">Dallas Carraher</h1>
          <div className="flex space-x-2">
            <Tooltip content="GitHub" placement="bottom">
              <SocialButton
                src={github.src}
                alt="github logo"
                link="https://github.com/DallasCarraher"
              />
            </Tooltip>
            <Tooltip content="LinkedIn" placement="bottom">
              <SocialButton
                src={linkedIn.src}
                alt="linkedIn logo"
                link="https://linkedin.com/in/dallascarraher"
              />
            </Tooltip>
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

export default Home
