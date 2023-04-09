import { Button, Input, Row } from "@solsy/ui";

type Props = {
  onCommand?: (value: string) => void;
  onRefresh?: () => void;
  onSave?: () => void;
};

export const SqlControlPanel = (props: Props) => {
  function onCommand(value: string) {
    props.onCommand?.(value);
  }

  return (
    <Row items="center" class="flex-1 gap-1 py-1 max-w-[600px]">
      <Row items="center" class="gap-2 flex-1">
        <b>WHERE</b>{" "}
        <Input
          placeholder="SQL"
          size="xs"
          class="flex-1"
          onChange={(e) => onCommand(e.currentTarget.value)}
        />
      </Row>

      <Button size="sm" circle color="ghost" onClick={props.onRefresh}>
        <span class="material-icons text-xl">refresh</span>
      </Button>
      <Button size="sm" circle color="ghost" onClick={props.onSave}>
        <span class="material-icons text-xl">save</span>
      </Button>
    </Row>
  );
};
