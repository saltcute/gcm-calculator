import GameVersionSelector from "#/components/GameVersionSelector";

const GAME_VERSIONS = ["dx", "circle"] as const;

export type GameVersions = (typeof GAME_VERSIONS)[number];

export default function MaimaiDXGameVersionSelector({
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
            game={"maimaidx"}
        ></GameVersionSelector>
    );
}
