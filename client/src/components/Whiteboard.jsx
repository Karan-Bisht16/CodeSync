import React from 'react'
import { Tldraw } from 'tldraw'
import { useSyncDemo } from '@tldraw/sync'
import { useParams } from 'react-router-dom'
function Whiteboard() {
    // padding: 10px;
    // width: 60%;
    // height: 100%;
    let param=useParams();
    const store = useSyncDemo({ roomId: param.roomId })
  return (
	<div style={{ position: 'fixed', inset: 0,backgroundColor:"black"}}>
			<Tldraw   store={store}/>
		</div>
  )
}

export default Whiteboard