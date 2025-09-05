import type { NextPage } from 'next'
import Head from 'next/head'
import { useUser } from '@auth0/nextjs-auth0'
import { trpc } from '../utils/trpc'
import { Button } from 'ariakit/button'
import { useAtom } from 'jotai'

import github from '../../public/icons/github.svg'
import linkedIn from '../../public/icons/linkedin.svg'
import spotify from '../../public/icons/spotify.png'

import { Equalizer } from '../components/Equalizer/Equalizer'
import { SocialButton } from '../components/SocialButton'
import { LoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner'
import { Expand } from '../components/Expand/Expand'
import { AnchorTag } from '../components/AnchorTag'
import { SpotifyToken } from './_app'
import ProgressBar from '../components/ProgressBar'
import { msToMinsAndSecs } from '../utils/helpers'

const Index: NextPage = () => {
  const [spotifyToken] = useAtom(SpotifyToken)
  const { user, isLoading: loadingUser } = useUser()

  // const posts = trpc.useQuery(['posts.getAll'])
  const currentlyPlaying = trpc.useQuery(
    ['spotify.currentlyPlaying', spotifyToken],
    {
      refetchInterval: 5000,
    }
  )

  // spotify
  const artists = currentlyPlaying.data?.item?.artists
  const trackName = currentlyPlaying.data?.item?.name
  const albumImg = currentlyPlaying.data?.item?.album?.images[0]?.url
  const trackLink = currentlyPlaying.data?.item?.external_urls?.spotify
  const mediaType = currentlyPlaying.data?.currently_playing_type
  const progress = currentlyPlaying.data?.progress_ms
  const duration = currentlyPlaying.data?.item?.duration_ms

  const songProgress = progress && duration && (progress / duration) * 100
  const tsCurrent = progress && msToMinsAndSecs(progress)
  const tsTotal = duration && msToMinsAndSecs(duration)

  return (
    <>
      <Head>
        <title>DallasCarraher.dev</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header className="w-full lt-sm:h-80 bg-cover bg-center bg-no-repeat pt-6">
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
          {currentlyPlaying.data && (
            <div className="flex flex-col mt-8 text-center items-center">
              <div className="flex justify-center">
                {albumImg ? (
                  <a href={trackLink} target="_blank" rel="noreferrer">
                    <img
                      src={albumImg}
                      alt="album art"
                      className="h-10 m-0 rounded border-green-500 border-2"
                    />
                  </a>
                ) : (
                  <img
                    src={spotify.src}
                    alt="spotify"
                    className="h-7 m-0 pr-3"
                  />
                )}
                <Equalizer />
              </div>
              <div className="pt-2 pb-1 flex flex-col items-center">
                {mediaType === 'episode' && <div>Listening to a Podcast</div>}
                {mediaType === 'track' && (
                  <>
                    <div>
                      &quot;{trackName}&quot; -{' '}
                      {artists?.map((artist, idx) => {
                        return artists.length > 1
                          ? idx === artists.length - 1
                            ? artist.name
                            : artist.name + ', '
                          : artist.name
                      })}
                    </div>
                    <ProgressBar
                      bg="#1DB954"
                      percent={songProgress?.toString()}
                    />
                    <span className="pl-2">{`${tsCurrent} / ${tsTotal}`}</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-screen-sm px-6 mx-auto">
        <div className="pt-8 lt-sm:pt-12">
          {/* {posts.error && (
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
          )} */}
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
