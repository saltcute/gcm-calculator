import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/maimaidx/achievement/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="text-4xl font-(family-name:--locale-based-font-sans-block-family)">
            (Hopefully) Coming soon!
        </div>
    );
}
