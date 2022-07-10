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
          <h1 className="text-3xl text-white p-5">Dallas Carraher</h1>
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
