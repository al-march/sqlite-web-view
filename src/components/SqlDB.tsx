import { Database } from "sql.js";
import { SqlTable } from "./Table";
import { SqlPagination } from "./Pagination";
import { createSqlTable } from "../hooks/SqlTableState";
import { Row } from "@solsy/ui";
import { SqlTables } from "./SqlTables";
import { SqlControlPanel } from "./ControlPanel";
import { Show } from "solid-js";

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

  function setPageSize(pageSize: number) {
    sqlTable.setPagination({ ...state.pagination, pageSize });
  }

  function setPageIndex(pageIndex: number) {
    sqlTable.setPagination({ ...state.pagination, pageIndex });
  }

  function setSearchCommand(value: string) {
    sqlTable.setSearchCommand(value);
  }

  function exportDB() {
    const data = sqlTable.exportDB();
  }

  return (
    <Row class="gap-4 flex-1 overflow-hidden">
      <div class="pt-6">
        <SqlTables
          selected={state.selectedTable}
          tables={state.tables}
          orientation="col"
          onSelect={sqlTable.selectTable}
        />
      </div>

      <Row orientation="col" class="flex-1 gap-2 overflow-hidden">
        <Row items="center" class="gap-2">
          <SqlControlPanel
            command={state.searchCommand}
            onCommand={setSearchCommand}
            onSave={exportDB}
          />
          <Show when={state.rowsCount}>
            {(length) => (
              <>
                | <p>All: {length()}</p>
              </>
            )}
          </Show>
        </Row>

        <SqlTable table={table} onRowUpdate={sqlTable.updateRow} />

        <SqlPagination
          pagination={state.pagination}
          pageCount={state.pageCount}
          onPageSize={setPageSize}
          onPageIndex={setPageIndex}
        />
      </Row>
    </Row>
  );
};
