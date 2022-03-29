// import * as React from 'react'
import CodeSnippet, {
  links as codeSnippetLinks,
} from '~/components/CodeSnippet/CodeSnippet'
import Codesandbox from '~/components/Codesandbox/Codesandbox'
import useWindowSize from '~/hooks/useWindowSize'
import snippetStyles from '~/styles/snippets.css'

export function links() {
  return [...codeSnippetLinks(), { rel: 'stylesheet', href: snippetStyles }]
}

export default function convertLinks() {
  const { width } = useWindowSize()
  return (
    <main className="wrapper">
      <h1 className="center">Converting Links in Plain Text</h1>
      <p className="center subtitle">
        a short post on how to convert links in strings to anchor tags safely
      </p>
      <img
        alt="by Lucas Sankey"
        title="Photo by Lucas Sankey"
        className="header-img full-bleed"
        src="https://unsplash.com/photos/1i7RLrsEcZo/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjQ4NTIxMTM4&force=true"
      />
      <p>
        There might come a time in your career when you'll be tasked with
        converting links in plain text dynamically to anchor tags. At first
        glance it seems like it shouldn't be very difficult and to be honest, it
        really isn't. The problem with converting links dynamically from plain
        text has more to do with security than actually doing the computation.
      </p>
      <p>
        Below is an example of such a thing in action. But there's an issue
        here. As I mentioned before, security problems can arise when user-based
        input is used for rendering content to the DOM. See for yourself. Go
        ahead and try editing the preview window on the right. Enter some custom
        html into the input element <br />
        {'(i.e.'}
        <code>{' <h1>hello</h1>)'}</code>.
      </p>
      {width < 960 ? (
        <div className="paragraphs center margin-it">
          <a
            className="link"
            href="https://codesandbox.io/s/convert-links-in-plain-text-to-anchors-no-xss-protection-t3toco?file=/src/index.ts"
            target="_blank"
          >
            CodeSandbox Link
          </a>
        </div>
      ) : (
        <Codesandbox
          src="https://codesandbox.io/embed/convert-links-in-plain-text-to-anchors-no-xss-protection-t3toco?fontsize=14&hidenavigation=1&theme=dark"
          title="convertLinks"
          className="full-bleed codesandbox"
        />
      )}
      <p>
        Okay. So you probably see the issue here. If not, I'll be brief: <br />{' '}
        What this demonstrates is that you can add any html or even JavaScript
        using the <code>{'<script>'}</code> tag and it will likely be rendered
        into the DOM. This is a well-known issue for decades now that most web
        developers are aware of and know to be wary of. It's called Cross-Site
        Scripting (or XSS). If you've never heard of it, you'll definitely want
        to check out this link:{' '}
        <a href="https://owasp.org/www-community/attacks/xss/" target="_blank">
          owasp.org/www-community/attacks/xss/
        </a>
      </p>
      <p>
        There's a common quick fix for this problem: <br />
        <i>
          Sanitizing the string value before it's assigned to the innerHTML of
          an element.
        </i>
      </p>
      <p>
        Here's a function I snagged from{' '}
        <a
          href="https://stackoverflow.com/questions/59495766/convert-text-link-to-multiple-html-format-in-javascript-with-xss-filter"
          target="_blank"
        >
          Stack Overflow
        </a>
      </p>
      <CodeSnippet
        code={`function sanitize(text: string) {
  const patterns = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '\`': '&grave;',
  }
  // regex -> & < > " '
  const reg = /[&<>"']/gi
  return text.replace(reg, (match) => patterns[match as keyof typeof patterns])
}`}
      />
      <p>
        You can see it in action below. Now try doing the same as you did
        before, but now you should see a different result.
      </p>
      {width < 960 ? (
        <div className="paragraphs center margin-it">
          <a
            className="link"
            href="https://codesandbox.io/s/convert-links-in-plain-text-to-anchor-tags-f6025p"
            target="_blank"
          >
            CodeSandbox Link
          </a>
        </div>
      ) : (
        <Codesandbox
          src="https://codesandbox.io/embed/convert-links-in-plain-text-to-anchor-tags-f6025p?fontsize=14&hidenavigation=1&theme=dark"
          title="convertLinks"
          className="full-bleed codesandbox"
        />
      )}
      <p>
        Pretty neat. If you check the console you can see the logged strings
        with the replacements in place.
      </p>
      <p>
        This was a fun little exercise to demonstrate the fundamentals, but I
        don't recommend using this function in production code. As mentioned in
        the stack overlow post I linked above, instead of attempting to
        hand-roll your own sanitization you really ought to use something
        maintained. Here are some useful links for learning more:
      </p>
      <ul>
        <li>
          <a
            href="https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.md"
            target="_blank"
          >
            Cross Site Scripting Prevention Cheat Sheet
          </a>
        </li>
        <li>
          <a href="https://github.com/cure53/DOMPurify" target="_blank">
            DOM Purify
          </a>
        </li>
      </ul>
      <footer></footer>
    </main>
  )
}
