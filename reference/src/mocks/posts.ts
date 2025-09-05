interface IPost {
  id: string
  title: string
  date: string
  content: string
}

/**
 * A mock response of a post object
 */
export const posts: IPost[] = [
  {
    id: '1',
    title: 'Some title',
    date: '2022/05/04',
    content: '<div>hello world</div>',
  },
  {
    id: '2',
    title: 'a very interesting title!',
    date: '2022/05/16',
    content:
      '<div><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae dolorum neque sapiente deleniti suscipit labore quibusdam ab nisi placeat quas?</p></div>',
  },
  {
    id: '1',
    title: 'A longer post?',
    date: '2022/06/19',
    content:
      '<div><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi quo ratione, magni quidem temporibus, vel sint, nisi placeat fugit non iusto iste repellat molestiae ex aut sit a at! Quis!</p></div>',
  },
]
