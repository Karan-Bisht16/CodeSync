import Client from "./Client";

const Clients = ({ clients, me }) => {
    const length = clients.length;

    if (length > 0) {
        switch (length) {
            case 1:
                return (
                    <Client me={clients[0].username} username={clients[0].username} userColor={clients[0].userColor} />
                );
            case 2:
                return (
                    <>
                        <Client me={me} username={clients[0].username} userColor={clients[0].userColor} styling="relative left-8" />
                        <Client me={me} username={clients[1].username} userColor={clients[1].userColor} />
                    </>
                );
            case 3:
                return (
                    <>
                        <Client me={me} username={clients[0].username} userColor={clients[0].userColor} styling="relative left-16" />
                        <Client me={me} username={clients[1].username} userColor={clients[1].userColor} styling="relative left-8" />
                        <Client me={me} username={clients[2].username} userColor={clients[2].userColor} />
                    </>
                );
            default:
                return (
                    <>
                        <Client me={me} username={clients[0].username} userColor={clients[0].userColor} styling="relative left-24" />
                        <Client me={me} username={clients[1].username} userColor={clients[1].userColor} styling="relative left-16" />
                        <Client me={me} username={clients[2].username} userColor={clients[2].userColor} styling="relative left-8" />
                        <Client me={false} username="+" userColor="#d3d3d3" styling="relative left-0" />
                    </>
                );
        }
    }
};

export default Clients;