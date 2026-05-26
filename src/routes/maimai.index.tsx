import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/maimai/")({
    beforeLoad: () => {
        throw redirect({
            to: "/maimai/rating",
            replace: true,
            viewTransition: false,
        });
    },
});
