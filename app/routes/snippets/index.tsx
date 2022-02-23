import Box, { links as boxLinks } from '~/components/Box/Box'
import styles from '~/styles/snippets.css'

export function links() {
  return [...boxLinks(), { rel: 'stylesheet', href: styles }]
}

export default function Snippets() {
  return (
    <main>
      <h2>
        I'm still working on this page but here is a sneak peek of the layout
      </h2>
      <div className="snippets-grid">
        <Box
          link="/snippets/${snippetId}"
          title="Snippet Example"
          text="lorem ipsum dolor det lorem ipsum dolor det lorem ipsum dolor det "
          img="https://img.search.brave.com/2lzCOsl0nmXepoyd1Hu-zfMqlH669NHVsl3VLQPsvvM/rs:fit:480:360:1/g:ce/aHR0cHM6Ly9tZWRp/YS5jbnRyYXZlbGVy/LmNvbS9waG90b3Mv/NWJiN2ExNzY2NDc3/ZWIzNThmMTQyZDg1/LzQ6My93XzQ4MCxj/X2xpbWl0L0dldHR5/SW1hZ2VzLTExODk5/NTkxOS5qcGc"
        />
        <Box
          // link="#"
          title="Snippet Not Available"
          text="lorem ipsum dolor det lorem ipsum dolor det lorem ipsum dolor det "
          img="https://img.search.brave.com/2lzCOsl0nmXepoyd1Hu-zfMqlH669NHVsl3VLQPsvvM/rs:fit:480:360:1/g:ce/aHR0cHM6Ly9tZWRp/YS5jbnRyYXZlbGVy/LmNvbS9waG90b3Mv/NWJiN2ExNzY2NDc3/ZWIzNThmMTQyZDg1/LzQ6My93XzQ4MCxj/X2xpbWl0L0dldHR5/SW1hZ2VzLTExODk5/NTkxOS5qcGc"
        />
        <Box
          link="#"
          title="Snippet Example"
          text="lorem ipsum dolor det lorem ipsum dolor det lorem ipsum dolor det "
          img="https://img.search.brave.com/2lzCOsl0nmXepoyd1Hu-zfMqlH669NHVsl3VLQPsvvM/rs:fit:480:360:1/g:ce/aHR0cHM6Ly9tZWRp/YS5jbnRyYXZlbGVy/LmNvbS9waG90b3Mv/NWJiN2ExNzY2NDc3/ZWIzNThmMTQyZDg1/LzQ6My93XzQ4MCxj/X2xpbWl0L0dldHR5/SW1hZ2VzLTExODk5/NTkxOS5qcGc"
        />
        <Box
          link="#"
          title="Snippet Example"
          text="lorem ipsum dolor det lorem ipsum dolor det lorem ipsum dolor det "
          img="https://img.search.brave.com/2lzCOsl0nmXepoyd1Hu-zfMqlH669NHVsl3VLQPsvvM/rs:fit:480:360:1/g:ce/aHR0cHM6Ly9tZWRp/YS5jbnRyYXZlbGVy/LmNvbS9waG90b3Mv/NWJiN2ExNzY2NDc3/ZWIzNThmMTQyZDg1/LzQ6My93XzQ4MCxj/X2xpbWl0L0dldHR5/SW1hZ2VzLTExODk5/NTkxOS5qcGc"
        />
        <Box
          link="#"
          title="Snippet Example"
          text="lorem ipsum dolor det lorem ipsum dolor det lorem ipsum dolor det "
          img="https://img.search.brave.com/2lzCOsl0nmXepoyd1Hu-zfMqlH669NHVsl3VLQPsvvM/rs:fit:480:360:1/g:ce/aHR0cHM6Ly9tZWRp/YS5jbnRyYXZlbGVy/LmNvbS9waG90b3Mv/NWJiN2ExNzY2NDc3/ZWIzNThmMTQyZDg1/LzQ6My93XzQ4MCxj/X2xpbWl0L0dldHR5/SW1hZ2VzLTExODk5/NTkxOS5qcGc"
        />
      </div>
    </main>
  )
}
