import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";
import RootRoutes from "./routes/RootRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 import { ToastContainer } from "react-toastify";
import moment from "moment";
import "moment/locale/vi";

const queryClient = new QueryClient();

moment.locale("vi");

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <RootRoutes />
        <ToastContainer />
      </div>
    </QueryClientProvider>
  );
}

export default App;
