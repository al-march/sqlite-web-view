import { Button, Row, RowOrientation } from "@solsy/ui";
import { For } from "solid-js";

type Props = {
  tables: string[];
  selected?: string;
  orientation?: RowOrientation;

  onSelect: (table: string) => void;
};

export const SqlTables = (props: Props) => {
  return (
    <Row
      orientation={props.orientation}
      class="gap-1 p-1 overflow-hidden overflow-y-auto"
    >
      <For each={props.tables}>
        {(table) => (
          <Button
            class="lowercase justify-start"
            size="sm"
            color={props.selected === table ? "primary" : "ghost"}
            onClick={() => props.onSelect(table)}
          >
            {table}
          </Button>
        )}
      </For>
    </Row>
  );
};
