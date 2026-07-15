//src\app\providers\index.js
import AppInitializer from "./AppInitializer";
import ReactQueryProvider from "./ReactQueryProvider";
import SocketEvents from "./SocketEvents";
import SocketProvider from "./SocketProvider";
import StoreProvider from "./StoreProvider";

export default function Providers({ children }) {
  return (
    <StoreProvider>
      <AppInitializer>
        <SocketProvider>
          <SocketEvents>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </SocketEvents>
        </SocketProvider>
      </AppInitializer>
    </StoreProvider>
  );
}
