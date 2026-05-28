import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ongeki/achievement/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="font-(family-name:--locale-based-font-sans-block-family) text-4xl">
            (Hopefully) Coming soon!
        </div>
    );
}
