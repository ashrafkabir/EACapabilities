import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import DiagramGenerator from "@/pages/diagram-generator";
import AdrGenerator from "@/pages/adr-generator";
import DiagramsPage from "@/pages/diagrams";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/map" component={Dashboard} />
      <Route path="/model" component={Dashboard} />
      <Route path="/monitor" component={Dashboard} />
      <Route path="/admin" component={Dashboard} />
      <Route path="/diagram-generator" component={DiagramGenerator} />
      <Route path="/adr-generator" component={AdrGenerator} />
      <Route path="/diagrams" component={DiagramsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
