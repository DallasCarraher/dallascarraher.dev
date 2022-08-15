import type { NextPage } from 'next'
import { trpc } from '../utils/trpc'

import github from '../../public/icons/github.svg'
import linkedIn from '../../public/icons/linkedin.svg'

import { SocialButton } from '../components/SocialButton'
import { Tooltip } from '../components/Tooltip'
import { LoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner'

const Index: NextPage = () => {
  const posts = trpc.useQuery(['posts.getAll'])
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
      <main className="max-w-screen-sm px-6 mx-auto">
        <div className="pt-16 lt-sm:pt-12 border-t-black">
          {posts.error && (
            <div className="text-red-500 text-md text-center">
              There was an error loading posts
            </div>
          )}
          {posts.isLoading ? (
            <div className="text-center">
              <LoadingSpinner />
            </div>
          ) : (
            posts.data?.map((post) => (
              <div
                key={`post-${post._id || Math.floor(Math.random() * 100)}`}
                className="pt-12 first:pt-0"
              >
                <h3 className="text-2xl font-bold">{post.title}</h3>
                <p className="text-gray-500/80">
                  {/* {post.createdAt.toLocaleDateString()} */}
                </p>
                <p className="mt-3 text-gray-600">{post.body}</p>
                <p className="mt-3">
                  <a href="#" className="underline underline-offset-2">
                    Read More
                  </a>
                </p>
              </div>
            ))
          )}
        </div>
      </main>
      <footer className="max-w-screen-sm px-6 mx-auto mt-20 pb-16 lt-sm:pb-8 lt-sm:mt-16">
        <p className="text-gray-400 text-sm">
          <span>© 2022 Dallas Carraher, Powered by MyStack</span>
        </p>
      </footer>
    </>
  )
}

export default Index
