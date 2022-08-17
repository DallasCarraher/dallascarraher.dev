import { createRouter } from './context'
import { z } from 'zod'
import { ObjectId } from 'mongodb'

interface IPost {
  _id: ObjectId
  title: string
  body: string
}

export const postsRouter = createRouter()
  .query('hello', {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? 'world'}`,
      }
    },
  })
  .query('getAll', {
    async resolve({ ctx }) {
      const posts = (await ctx.client
        .db('blog')
        .collection('posts')
        .find()
        .toArray()) as IPost[]
      // return with a timestamp attribute
      return posts.map((post) => ({
        ...post,
        timestamp: post._id.getTimestamp(),
      }))
    },
  })
