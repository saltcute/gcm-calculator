import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ongeki/")({
    beforeLoad: () => {
        throw redirect({
            to: "/ongeki/rating",
            replace: true,
            viewTransition: false,
        });
    },
});
