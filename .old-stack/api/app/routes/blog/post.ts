export type Post = {
  id: string
  title: string
  content: string
}

export function getPosts() {
  const posts: Post[] = [
    {
      id: '1',
      title: 'My First Post',
      content:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. A molestiae est deleniti assumenda at magni, nesciunt pariatur quo fuga libero, repellendus aperiam, accusamus rerum velit itaque! Sunt laudantium nulla dolore perferendis esse, quae ratione corrupti non commodi deserunt beatae distinctio, cumque earum dolorum neque dolor inventore doloremque debitis quos. Nostrum tempore explicabo alias numquam cum, laboriosam consectetur iure ipsum a incidunt voluptatibus necessitatibus? Eos, temporibus similique. Porro beatae quidem culpa facilis, reprehenderit quia laboriosam, voluptates temporibus minima vero ullam assumenda? Eaque, provident. Illo quis distinctio quasi iusto voluptate perferendis debitis?',
    },
    {
      id: '2',
      title: 'A Mixtape I Made Just For You',
      content:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. A molestiae est deleniti assumenda at magni, nesciunt pariatur quo fuga libero, repellendus aperiam, accusamus rerum velit itaque! Sunt laudantium nulla dolore perferendis esse, quae ratione corrupti non commodi deserunt beatae distinctio, cumque earum dolorum neque dolor inventore doloremque debitis quos. Nostrum tempore explicabo alias numquam cum, laboriosam consectetur iure ipsum a incidunt voluptatibus necessitatibus? Eos, temporibus similique. Porro beatae quidem culpa facilis, reprehenderit quia laboriosam, voluptates temporibus minima vero ullam assumenda? Eaque, provident. Illo quis distinctio quasi iusto voluptate perferendis debitis?',
    },
    {
      id: '3',
      title: 'My First Post',
      content:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. A molestiae est deleniti assumenda at magni, nesciunt pariatur quo fuga libero, repellendus aperiam, accusamus rerum velit itaque! Sunt laudantium nulla dolore perferendis esse, quae ratione corrupti non commodi deserunt beatae distinctio, cumque earum dolorum neque dolor inventore doloremque debitis quos. Nostrum tempore explicabo alias numquam cum, laboriosam consectetur iure ipsum a incidunt voluptatibus necessitatibus? Eos, temporibus similique. Porro beatae quidem culpa facilis, reprehenderit quia laboriosam, voluptates temporibus minima vero ullam assumenda? Eaque, provident. Illo quis distinctio quasi iusto voluptate perferendis debitis?',
    },
    {
      id: '4',
      title: 'A Mixtape I Made Just For You',
      content:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. A molestiae est deleniti assumenda at magni, nesciunt pariatur quo fuga libero, repellendus aperiam, accusamus rerum velit itaque! Sunt laudantium nulla dolore perferendis esse, quae ratione corrupti non commodi deserunt beatae distinctio, cumque earum dolorum neque dolor inventore doloremque debitis quos. Nostrum tempore explicabo alias numquam cum, laboriosam consectetur iure ipsum a incidunt voluptatibus necessitatibus? Eos, temporibus similique. Porro beatae quidem culpa facilis, reprehenderit quia laboriosam, voluptates temporibus minima vero ullam assumenda? Eaque, provident. Illo quis distinctio quasi iusto voluptate perferendis debitis?',
    },
    {
      id: '5',
      title: 'My First Post',
      content:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. A molestiae est deleniti assumenda at magni, nesciunt pariatur quo fuga libero, repellendus aperiam, accusamus rerum velit itaque! Sunt laudantium nulla dolore perferendis esse, quae ratione corrupti non commodi deserunt beatae distinctio, cumque earum dolorum neque dolor inventore doloremque debitis quos. Nostrum tempore explicabo alias numquam cum, laboriosam consectetur iure ipsum a incidunt voluptatibus necessitatibus? Eos, temporibus similique. Porro beatae quidem culpa facilis, reprehenderit quia laboriosam, voluptates temporibus minima vero ullam assumenda? Eaque, provident. Illo quis distinctio quasi iusto voluptate perferendis debitis?',
    },
    {
      id: '6',
      title: 'A Mixtape I Made Just For You',
      content:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. A molestiae est deleniti assumenda at magni, nesciunt pariatur quo fuga libero, repellendus aperiam, accusamus rerum velit itaque! Sunt laudantium nulla dolore perferendis esse, quae ratione corrupti non commodi deserunt beatae distinctio, cumque earum dolorum neque dolor inventore doloremque debitis quos. Nostrum tempore explicabo alias numquam cum, laboriosam consectetur iure ipsum a incidunt voluptatibus necessitatibus? Eos, temporibus similique. Porro beatae quidem culpa facilis, reprehenderit quia laboriosam, voluptates temporibus minima vero ullam assumenda? Eaque, provident. Illo quis distinctio quasi iusto voluptate perferendis debitis?',
    },
    {
      id: '7',
      title: 'My First Post',
      content:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. A molestiae est deleniti assumenda at magni, nesciunt pariatur quo fuga libero, repellendus aperiam, accusamus rerum velit itaque! Sunt laudantium nulla dolore perferendis esse, quae ratione corrupti non commodi deserunt beatae distinctio, cumque earum dolorum neque dolor inventore doloremque debitis quos. Nostrum tempore explicabo alias numquam cum, laboriosam consectetur iure ipsum a incidunt voluptatibus necessitatibus? Eos, temporibus similique. Porro beatae quidem culpa facilis, reprehenderit quia laboriosam, voluptates temporibus minima vero ullam assumenda? Eaque, provident. Illo quis distinctio quasi iusto voluptate perferendis debitis?',
    },
    {
      id: '8',
      title: 'A Mixtape I Made Just For You',
      content:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. A molestiae est deleniti assumenda at magni, nesciunt pariatur quo fuga libero, repellendus aperiam, accusamus rerum velit itaque! Sunt laudantium nulla dolore perferendis esse, quae ratione corrupti non commodi deserunt beatae distinctio, cumque earum dolorum neque dolor inventore doloremque debitis quos. Nostrum tempore explicabo alias numquam cum, laboriosam consectetur iure ipsum a incidunt voluptatibus necessitatibus? Eos, temporibus similique. Porro beatae quidem culpa facilis, reprehenderit quia laboriosam, voluptates temporibus minima vero ullam assumenda? Eaque, provident. Illo quis distinctio quasi iusto voluptate perferendis debitis?',
    },
  ]
  return posts
}
