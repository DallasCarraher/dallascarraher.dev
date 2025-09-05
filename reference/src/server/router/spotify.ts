import { z } from 'zod'
import { ICurrentlyPlaying } from '../types/spotify/currentlyPlaying'
import { createRouter } from './context'

const SPOTIFY_TOKEN_API = 'https://accounts.spotify.com/api/token'
const SPOTIFY_API_ROOT = 'https://api.spotify.com/v1'

const SPOTIFY_API = {
  currentlyPlaying: `${SPOTIFY_API_ROOT}/me/player/currently-playing`,
}

const client_id = process.env.SPOTIFY_CLIENT_ID!
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN!
// const redirect_uri = process.env.SPOTIFY_REDIRECT_URI!
// const authCode = process.env.SPOTIFY_AUTHCODE!

export interface IAccessCode {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
}

export const spotifyRouter = createRouter()
  /**
   * This route is only necessary if my refresh token expires.
   */
  // .query('getTokens', {
  //   async resolve() {
  //     const auth = await fetch(
  //       'https://accounts.spotify.com/api/token?' +
  //         new URLSearchParams({
  //           grant_type: 'authorization_code',
  //           code: authCode,
  //           redirect_uri,
  //           client_id,
  //           client_secret,
  //         }),
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/x-www-form-urlencoded',
  //           Authorization:
  //             'Basic ' +
  //             Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
  //         },
  //       }
  //     ).then((res) => res.json())
  //     return auth
  //   },
  // })
  .query('getNewToken', {
    async resolve() {
      if (!refresh_token) {
        console.error('No refresh token found')
        return null
      }

      const params = new URLSearchParams({
        client_id,
        client_secret,
        grant_type: 'refresh_token',
        refresh_token,
      })

      const newAccessToken = await fetch(
        `${SPOTIFY_TOKEN_API}?${params.toString()}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        }
      ).then((res) => res.json())

      return newAccessToken as IAccessCode
    },
  })
  .query('currentlyPlaying', {
    input: z.string(),
    async resolve({ input: access_token }) {
      const nowPlayingRequest = new Request(SPOTIFY_API.currentlyPlaying, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      })

      return (await fetch(nowPlayingRequest)
        .then((res) => res.json())
        .catch((err) => err)) as ICurrentlyPlaying
    },
  })
