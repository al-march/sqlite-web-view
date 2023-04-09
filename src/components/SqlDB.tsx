import { Database } from "sql.js";
import { SqlTable } from "./Table";
import { SqlPagination } from "./Pagination";
import { createSqlTable } from "../hooks/SqlTableState";
import { Row } from "@solsy/ui";
import { SqlTables } from "./SqlTables";
import { SqlControlPanel } from "./ControlPanel";

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

  return (
    <Row class="gap-4 flex-1 overflow-hidden">
      <SqlTables
        selected={state.selectedTable}
        tables={state.tables}
        orientation="col"
        onSelect={sqlTable.selectTable}
      />

      <Row orientation="col" class="flex-1 gap-2 overflow-hidden">
        <SqlControlPanel onCommand={setSearchCommand} />

        <SqlTable table={table} />

        <SqlPagination
          pagination={state.pagination}
          pageCount={table.getPageCount()}
          onPageSize={setPageSize}
          onPageIndex={setPageIndex}
        />
      </Row>
    </Row>
  );
};
