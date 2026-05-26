import { createFileRoute, Navigate } from "@tanstack/react-router";
import { GameWrapper } from "#/components/GameWrapper";

export const Route = createFileRoute("/ongeki")({
    component: GameWrapper,
    notFoundComponent: () => <Navigate replace to="/ongeki/rating" />,
});
