import { TanStackDevtools } from "@tanstack/react-devtools";
import { hotkeysDevtoolsPlugin } from "@tanstack/react-hotkeys-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  // notFoundComponent: NotFound,
  // errorComponent: ErrorFallback,
  // pendingComponent: PageLoader,
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <main className="flex-1 min-h-0 overflow-y-auto p-0">
        <Outlet />
      </main>
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          hotkeysDevtoolsPlugin(),
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  );
}
