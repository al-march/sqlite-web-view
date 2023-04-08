import {
  Table,
  createSolidTable,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { For, createSignal, onMount } from "solid-js";
import initSqlJs from "sql.js";
import { Database } from "sql.js";
import "./App.css";
import { SqlTable } from "./components/Table";

export const App = () => {
  const [db, setDb] = createSignal<Database>();
  const [tables, setTables] = createSignal<string[]>([]);
  const [table, setTable] = createSignal<Table<any>>();
  const [tableData, setTableData] = createSignal<any>();
  const [tableCols, setTableCols] = createSignal<any>();

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
    getTableData(table);
    initTable();
  }

  function getTableData(table: string) {
    const [data] = db()!.exec(`SELECT * FROM ${table};`);
    const columns = data.columns;

    const tableData = data.values.map((row) => {
      return row.reduce((acc, cell, i) => {
        acc[columns[i]] = cell;
        return acc;
      }, {});
    });
    const tableColumns = columns.map((col) => {
      return {
        accessorKey: col,
        header: () => col,
        footer: (info) => info.column.id,
      };
    });

    setTableData(tableData);
    setTableCols(tableColumns);
  }

  function initTable() {
    const table = createSolidTable({
      columnResizeMode: "onChange",
      get data() {
        return tableData();
      },
      columns: tableCols(),
      getCoreRowModel: getCoreRowModel(),
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
    });
    setTable(table);
  }

  return (
    <div style="overflow-x: auto">
      <header>
        <For each={tables()}>
          {(table) => (
            <button onClick={() => selectTable(table)}>{table}</button>
          )}
        </For>
      </header>
      <SqlTable data={table()} />
    </div>
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
