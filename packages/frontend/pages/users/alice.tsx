import * as React from 'react'
import { Image } from '@chakra-ui/react'

import Layout from '../../components/layout/Layout'
import { Post as PostType } from '../../components/types'
import Feed from '../../components/Feed'

const sampleFeed: PostType[] = [
  {
    id: 1,
    locked: true,
    title: 'Post Title',
    timestamp: 1650642297999,
  },
  {
    id: 2,
    locked: true,
    title: 'Post Title',
    timestamp: 1650642297999,
  },
  {
    id: 3,
    locked: false,
    title: 'Post Title',
    timestamp: 1650642297999,
    body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse luctus pharetra lorem vel commodo. Phasellus quis libero id nunc consequat pulvinar eget ut lectus. Curabitur hendrerit odio mollis nibh porta porta. Vestibulum sit amet nulla risus. Curabitur malesuada tempor massa, id commodo sem volutpat non. Praesent a egestas nunc. Fusce tristique nulla justo, non vestibulum sapien aliquet non. Cras eget auctor turpis. Vestibulum imperdiet dapibus mi, in vehicula dolor varius non. In nec vestibulum nibh, et mattis velit. Maecenas sit amet velit accumsan, condimentum dolor ac, viverra nibh. Sed hendrerit semper quam nec ullamcorper. Vestibulum risus mi, gravida eu ornare eu, suscipit vel lorem. Aliquam erat volutpat. Nulla facilisi. Morbi pulvinar, arcu at iaculis tristique, quam mauris iaculis ligula, ac lacinia lacus risus id velit.</p>
<p>Cras vitae maximus elit. Vestibulum ac mattis risus, suscipit dictum purus. Nullam quis nulla a metus porta cursus. Pellentesque auctor turpis quis purus rutrum finibus. Ut augue sem, dapibus at lorem ut, sagittis placerat metus. Sed nulla ligula, euismod in nibh sit amet, eleifend luctus risus. Praesent porta mauris et eros gravida, tincidunt ultricies mi varius. Nam aliquet sem elit, sed scelerisque velit convallis vel. In ultrices ante lobortis placerat blandit.</p>
<p>Sed pretium tellus sit amet nisl aliquam scelerisque. Proin ornare rhoncus massa, sed consectetur enim tempor suscipit. Etiam molestie malesuada est. Nunc laoreet eros lectus, in interdum elit porttitor sollicitudin. Nullam sit amet maximus justo. Integer tempus bibendum turpis nec porttitor. Vestibulum laoreet id massa eget imperdiet. Pellentesque in sodales lectus. Nulla vitae efficitur arcu, id pharetra ligula. Praesent sed lacus pellentesque, venenatis erat at, suscipit lacus. Donec dapibus nunc eros, non consectetur nunc efficitur in. Aenean sem massa, mollis vitae ullamcorper sit amet, porttitor vel tortor. Mauris sagittis magna vel ultricies molestie.</p>
<p>Nullam maximus mi vitae orci maximus, nec consequat lorem porta. Phasellus placerat vestibulum mi varius tincidunt. Nulla volutpat eros at ornare maximus. Ut consectetur vel ante suscipit varius. Donec felis nulla, feugiat a nunc eu, gravida ultrices elit. Ut feugiat lorem non magna euismod dictum gravida at quam. Sed imperdiet ex eu tortor lobortis facilisis. Proin eget efficitur augue.</p>
<p>Etiam nec egestas risus, eu aliquam libero. Nam consectetur sagittis massa. Mauris vitae maximus sem, auctor tincidunt leo. Curabitur sed tincidunt lorem. Ut condimentum libero vitae lorem accumsan, sed malesuada mauris elementum. Pellentesque volutpat pretium congue. Integer in fermentum nunc.</p>`,
  },
  {
    id: 4,
    locked: true,
    title: 'Post Title',
    timestamp: 1650642297999,
  },
]

function Alice(): JSX.Element {
  return (
    <Layout>
      <Image src="gibbresh.png" fallbackSrc="https://via.placeholder.com/150" />
      <Feed feed={sampleFeed} />
    </Layout>
  )
}

export default Alice
