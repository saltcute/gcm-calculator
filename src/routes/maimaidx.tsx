import { createFileRoute, Navigate } from "@tanstack/react-router";
import { GameWrapper } from "#/components/GameWrapper";

export const Route = createFileRoute("/maimaidx")({
    component: GameWrapper,
    notFoundComponent: () => <Navigate replace to="/maimaidx/rating" />,
});
