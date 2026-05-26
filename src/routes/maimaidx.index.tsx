import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/maimaidx/")({
    beforeLoad: () => {
        throw redirect({
            to: "/maimaidx/rating",
            replace: true,
            viewTransition: false,
        });
    },
});
