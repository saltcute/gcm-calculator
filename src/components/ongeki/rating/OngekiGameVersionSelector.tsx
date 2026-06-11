import GameVersionSelector from "#/components/GameVersionSelector";

export const GAME_VERSIONS = ["origin", "refresh"] as const;

export type GameVersions = (typeof GAME_VERSIONS)[number];

export default function OngekiGameVersionSelector({
    value,
    onChange,
}: {
    value: GameVersions;
    onChange: (value: GameVersions) => void;
}) {
    return (
        <GameVersionSelector
            value={value}
            versions={[...GAME_VERSIONS]}
            onChange={onChange}
            game={"ongeki"}
        ></GameVersionSelector>
    );
}
