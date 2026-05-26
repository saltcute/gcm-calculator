import { createFileRoute, Navigate } from "@tanstack/react-router";
import { GameWrapper } from "#/components/GameWrapper";

export const Route = createFileRoute("/maimai")({
    component: GameWrapper,
    notFoundComponent: () => <Navigate replace to="/maimai/rating" />,
});
