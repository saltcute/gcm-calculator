import { createFileRoute, Navigate } from "@tanstack/react-router";
import { GameWrapper } from "#/components/GameWrapper";

export const Route = createFileRoute("/chunithm")({
    component: GameWrapper,
    notFoundComponent: () => <Navigate replace to="/chunithm/rating" />,
});
