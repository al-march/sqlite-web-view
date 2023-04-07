import {
  Table,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { For, Show, createSignal, onMount } from "solid-js";
import initSqlJs from "sql.js";
import { Database } from "sql.js";
import "./App.css";

export const App = () => {
  const [db, setDb] = createSignal<Database>();
  const [table, setTable] = createSignal<Table<any>>();
  const [tableData, setTableData] = createSignal<any>();
  const [tableCols, setTableCols] = createSignal<any>();

  onMount(async () => {
    setDb(await initDB("/assets/db/dict.db"));
    getWords();
    setTimeout(() => {
      initTable();
    });
  });

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

  function getWords() {
    const [data] = db()!.exec("SELECT * FROM words;");
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

  return (
    <div style="overflow-x: auto">
      <Show when={table()}>
        {(table) => (
          <div class="overflow-x-auto">
            <div
              {...{
                class: "divTable",
                style: {
                  width: table().getTotalSize() + "px",
                },
              }}
            >
              <div class="thead">
                <For each={table().getHeaderGroups()}>
                  {(headerGroup) => (
                    <div
                      {...{
                        key: headerGroup.id,
                        class: "tr",
                      }}
                    >
                      {headerGroup.headers.map((header) => (
                        <div
                          class="th"
                          style={{
                            width: header.getSize() + "px",
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          <div
                            {...{
                              onMouseDown: header.getResizeHandler(),
                              onTouchStart: header.getResizeHandler(),
                              class: `resizer ${
                                header.column.getIsResizing()
                                  ? "isResizing"
                                  : ""
                              }`,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </For>
              </div>
              <div
                {...{
                  class: "tbody",
                }}
              >
                <For each={table().getRowModel().rows}>
                  {(row) => (
                    <div class="tr">
                      <For each={row.getVisibleCells()}>
                        {(cell) => (
                          <div
                            class="td"
                            style={{
                              width: cell.column.getSize() + "px",
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        )}
                      </For>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
};

async function initDB(dbUrl: string) {
  // const worker = new Worker('/assets/sql-wasm.wasm');
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
