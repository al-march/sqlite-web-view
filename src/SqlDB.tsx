import { Database } from "sql.js";
import { SqlTable } from "./components/Table";
import { SqlPagination } from "./components/Pagination";
import { createSqlTable } from "./hooks/SqlTableState";
import { For, createSignal } from "solid-js";

type Props = {
  db: Database;
};

export const SqlDB = (props: Props) => {
  const [tableRef, setTableRef] = createSignal<HTMLElement>();
  const { state, table, ...sqlTable } = createSqlTable({
    db: props.db,
    onPaginationChange,
    pagination: {
      pageIndex: 0,
      pageSize: 50,
    },
  });

  function onPaginationChange() {   
    tableRef()!.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      <header>
        <For each={state.tables}>
          {(table) => (
            <button onClick={() => sqlTable.selectTable(table)}>{table}</button>
          )}
        </For>
      </header>

      <SqlTable containerRef={setTableRef} data={table} />

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
