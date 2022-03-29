import * as React from 'react'
import Codesandbox from '~/components/Codesandbox/Codesandbox'
import useWindowSize from '~/hooks/useWindowSize'
import snippetStyles from '~/styles/snippets.css'

export function links() {
  return [{ rel: 'stylesheet', href: snippetStyles }]
}

export default function convertLinks() {
  const { width } = useWindowSize()
  return (
    <main className="wrapper">
      <h1 className="center">convertLinks</h1>
      <p className="center subtitle">
        a clean snippet for converting links in strings dynamically
      </p>
      <img
        className="header-img full-bleed"
        alt="frog on chain link fence"
        src="https://unsplash.com/photos/1i7RLrsEcZo/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjQ4NTIxMTM4&force=true"
      />
      <p className="paragraphs">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem non
        laudantium eum, laborum magnam eaque culpa quae est accusantium omnis
        nesciunt tenetur! Commodi eos sapiente blanditiis omnis labore, animi
        consequatur!
      </p>
      {width < 960 ? (
        <div className="paragraphs center margin-it">
          <a
            className="link"
            href="https://codesandbox.io/embed/convert-links-in-plain-text-to-anchors-5sy6s?fontsize=14&hidenavigation=1&theme=dark"
            target="_blank"
          >
            CodeSandbox Link
          </a>
        </div>
      ) : (
        <Codesandbox
          src="https://codesandbox.io/embed/convert-links-in-plain-text-to-anchors-5sy6s?fontsize=14&hidenavigation=1&theme=dark"
          title="convertLinks"
          className="full-bleed codesandbox"
        />
      )}
    </main>
  )
}
