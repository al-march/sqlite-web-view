import { Database } from "sql.js";
import { SqlTable } from "./Table";
import { SqlPagination } from "./Pagination";
import { createSqlTable } from "../hooks/SqlTableState";
import { For } from "solid-js";
import { Button } from "@solsy/ui";

type Props = {
  db: Database;
};

export const SqlDB = (props: Props) => {
  const { state, table, ...sqlTable } = createSqlTable({
    db: props.db,
    pagination: {
      pageIndex: 0,
      pageSize: 50,
    },
  });

  return (
    <>
      <header class="flex gap-1 py-1 overflow-hidden overflow-x-auto">
        <For each={state.tables}>
          {(table) => (
            <Button
              class="lowercase"
              size="sm"
              color={state.selectedTable === table ? "primary" : "ghost"}
              onClick={() => sqlTable.selectTable(table)}
            >
              {table}
            </Button>
          )}
        </For>
      </header>

      <SqlTable table={table} />

      <SqlPagination
        pageIndex={state.pagination.pageIndex}
        pageSize={state.pagination.pageSize}
        pageCount={table.getPageCount()}
        onPageSize={(pageSize) =>
          sqlTable.setPagination({ ...state.pagination, pageSize })
        }
        onPageIndex={(pageIndex) =>
          sqlTable.setPagination({ ...state.pagination, pageIndex })
        }
      />
    </>
  );
};
