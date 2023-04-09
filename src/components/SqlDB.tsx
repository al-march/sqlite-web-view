import { Database } from "sql.js";
import { SqlTable } from "./Table";
import { SqlPagination } from "./Pagination";
import { createSqlTable } from "../hooks/SqlTableState";
import { For } from "solid-js";
import { Button, Row } from "@solsy/ui";
import { SqlTables } from "./SqlTables";

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
    <Row class="gap-4 flex-1 overflow-hidden">
      <SqlTables
        selected={state.selectedTable}
        tables={state.tables}
        orientation="col"
        onSelect={sqlTable.selectTable}
      />

      <Row orientation="col" class="flex-1 gap-2 overflow-hidden h-full">
        <SqlTable table={table} />

        <SqlPagination
          pagination={state.pagination}
          pageCount={table.getPageCount()}
          onPageSize={(pageSize) =>
            sqlTable.setPagination({ ...state.pagination, pageSize })
          }
          onPageIndex={(pageIndex) =>
            sqlTable.setPagination({ ...state.pagination, pageIndex })
          }
        />
      </Row>
    </Row>
  );
};
