//src\app\providers\index.js
import ReactQueryProvider from "./ReactQueryProvider";
import StoreProvider from "./StoreProvider";

export default function Providers({ children }) {
  return (
    <StoreProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </StoreProvider>
  );
}
