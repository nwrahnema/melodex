import { usePosts } from '../hooks/usePosts'

export default function Posts() {
  const { data, isSuccess } = usePosts()

  if (!isSuccess) {
    return <>Fetching...</>
  }

  return (
    <ul>
      {data.map((item) => (
        <li>{item.title}</li>
      ))}
    </ul>
  )
}
