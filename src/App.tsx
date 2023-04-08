import {
  Table,
  createSolidTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/solid-table";
import { For, createSignal, onMount } from "solid-js";
import initSqlJs from "sql.js";
import { Database } from "sql.js";
import { SqlTable } from "./components/Table";
import { createSqlTableState } from "./hooks/SqlTableState";
import { SqlPagination } from "./components/Pagination";
import "./App.css";

export const App = () => {
  const [db, setDb] = createSignal<Database>();
  const [tables, setTables] = createSignal<string[]>([]);

  const { state, table, ...sqlTable } = createSqlTableState({
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  });

  onMount(async () => {
    setDb(await initDB("/assets/db/dict.db"));
    getTables();
  });

  function getTables() {
    const [data] = db()!.exec(/*sql*/ `
        SELECT 
          name 
        FROM 
          sqlite_schema 
        WHERE
          type ='table' AND 
          name NOT LIKE 'sqlite_%';
      `);
    const tables = data.values.flat();
    setTables(tables as string[]);
  }

  function selectTable(table: string) {
    const { data, columns } = getTableData(table);
    sqlTable.setData(data);
    sqlTable.setColumns(columns);
  }

  function getTableData(table: string) {
    const [sqlExec] = db()!.exec(`SELECT * FROM ${table};`);
    const sqlColumns = sqlExec.columns;

    const data = sqlExec.values.map((row) => {
      return row.reduce((acc, cell, i) => {
        acc[sqlColumns[i]] = cell;
        return acc;
      }, {});
    });

    const columns = sqlColumns.map((col) => {
      return {
        accessorKey: col,
        header: () => col,
        footer: (info) => info.column.id,
      };
    });

    return { data, columns };
  }

  return (
    <main style="overflow-x: auto">
      <header>
        <For each={tables()}>
          {(table) => (
            <button onClick={() => selectTable(table)}>{table}</button>
          )}
        </For>
      </header>
      
      <SqlTable data={table} />

      <SqlPagination
        pageIndex={state.pagination.pageIndex}
        pageSize={state.pagination.pageSize}
        onPageSize={(pageSize) =>
          sqlTable.setPagination({ ...state.pagination, pageSize })
        }
        onPageIndex={(pageIndex) =>
          sqlTable.setPagination({ ...state.pagination, pageIndex })
        }
      />
    </main>
  );
};

async function initDB(dbUrl: string) {
  const dbFile = await fetchFile(dbUrl)
    .then((data) => data.blob())
    .then((blob) => blob.arrayBuffer());
  const buffer = new Uint8Array(dbFile);

  const sql = await initSqlJs({
    locateFile: () => `/assets/sql-wasm.wasm`,
  });
  return new sql.Database(buffer);
}

async function fetchFile(file: string) {
  return fetch(file);
}
