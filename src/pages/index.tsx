import type { NextPage } from 'next'
import { useUser } from '@auth0/nextjs-auth0'
import { trpc } from '../utils/trpc'
import { Button } from 'ariakit/button'

import github from '../../public/icons/github.svg'
import linkedIn from '../../public/icons/linkedin.svg'

import { SocialButton } from '../components/SocialButton'
import { LoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner'
import { Expand } from '../components/Expand/Expand'
import { AnchorTag } from '../components/AnchorTag'

const Index: NextPage = () => {
  const posts = trpc.useQuery(['posts.getAll'])
  const { user, isLoading: loadingUser } = useUser()
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
            <SocialButton
              src={github.src}
              alt="github logo"
              link="https://github.com/DallasCarraher"
            />
            <SocialButton
              src={linkedIn.src}
              alt="linkedIn logo"
              link="https://linkedin.com/in/dallascarraher"
            />
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
                  {post.timestamp.toLocaleDateString()}
                </p>
                <p className="mt-3 text-gray-600 overflow-ellipsis">
                  {`${post.body.substring(0, 220)}  ...`}
                </p>
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
      <footer className="flex justify-between max-w-screen-sm px-6 mx-auto mt-20 pb-16 lt-sm:pb-8 lt-sm:mt-16">
        <div className="text-gray-400 text-sm">
          <span>
            © 2022 Dallas Carraher, Powered by{' '}
            <Expand
              heading="MyStack"
              description={
                <>
                  My Stack consists mostly of{' '}
                  <AnchorTag href="https://init.tips/">Create T3 App</AnchorTag>{' '}
                  right now, with some exceptions.
                  <br /> <br />
                  I&apos;m giving{' '}
                  <AnchorTag href="https://trpc.io/">trpc</AnchorTag> a try. If
                  I don&apos;t like it, I&apos;ll probably go back to{' '}
                  <AnchorTag href="https://react-query-v3.tanstack.com/">
                    React Query
                  </AnchorTag>
                  .
                  <br /> <br />I chose to do away with Prisma in favor of
                  writing my queries, typing my queries, and managing my
                  database (migrations, etc.) myself. Nothing against ORMs, but
                  I think they are generally overkill in most scenarios
                  (especially my blog 😅).
                </>
              }
            >
              MyStack
            </Expand>
          </span>
        </div>
        <Button
          as="a"
          className="hover:underline text-blue-500"
          href={user ? '/api/auth/logout' : '/api/auth/login'}
        >
          {loadingUser ? 'Loading...' : user ? 'Logout' : 'Login'}
        </Button>
      </footer>
    </>
  )
}

export default Index
