import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

const queryClient = new QueryClient();

function CompFlow() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
      </Router>
    </QueryClientProvider>
  );
}

export default CompFlow;
