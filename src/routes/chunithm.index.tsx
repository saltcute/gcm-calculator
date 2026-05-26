import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/chunithm/")({
    beforeLoad: () => {
        throw redirect({
            to: "/chunithm/rating",
            replace: true,
            viewTransition: false,
        });
    },
});
