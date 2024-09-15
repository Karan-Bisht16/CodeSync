import { Tldraw } from "tldraw";
import { useSyncDemo } from "@tldraw/sync";
import { useParams } from "react-router-dom";

const Whiteboard = () => {
    let { roomID } = useParams();
    const store = useSyncDemo({ roomId: roomID });

    return (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "black" }}>
            <Tldraw store={store} />
        </div>
    );
}

export default Whiteboard;