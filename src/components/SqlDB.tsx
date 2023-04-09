import { Database } from "sql.js";
import { SqlTable } from "./Table";
import { SqlPagination } from "./Pagination";
import { createSqlTable } from "../hooks/SqlTableState";
import { For, createSignal } from "solid-js";

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
      <header class="flex gap-2">
        <For each={state.tables}>
          {(table) => (
            <button
              class="font-bold p-1"
              classList={{
                "opacity-50": state.selectedTable !== table,
                "underline opacity-100": state.selectedTable === table,
              }}
              onClick={() => sqlTable.selectTable(table)}
            >
              {table}
            </button>
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
