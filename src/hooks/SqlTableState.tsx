import { createStore } from "solid-js/store";
import { ISqlPagination } from "../models/SqlTable.model";
import {
  ColumnDef,
  createSolidTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/solid-table";
import { Database } from "sql.js";

export type SqlTableState = {
  pagination: ISqlPagination;
  data: unknown[];
  columns: ColumnDef<unknown, any>[];

  tables: string[];
  selectedTable: string;
};

export type SqlTableStateProps = {
  db: Database;
  pagination: ISqlPagination;

  onPaginationChange?: () => void;
};

export const createSqlTable = (props: SqlTableStateProps) => {
  const [state, setState] = createStore<SqlTableState>({
    ...props,
    data: [],
    columns: [],
    tables: [],
    selectedTable: "",
  });

  init();

  const table = createSolidTable({
    columnResizeMode: "onChange",
    get data() {
      return state.data;
    },
    get columns() {
      return state.columns;
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: true,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  table.setPageSize(state.pagination.pageSize);

  function setPagination(pag: ISqlPagination) {
    setState("pagination", pag);
    table.setPageSize(pag.pageSize);
    table.setPageIndex(pag.pageIndex);

    props.onPaginationChange?.();
  }

  function setData(data: SqlTableState["data"]) {
    setState("data", data);
  }

  function setColumns(columns: SqlTableState["columns"]) {
    setState("columns", columns);
  }

  function selectTable(table: string) {
    setState("selectedTable", table);
    const { data, columns } = getTableData(table);
    setPagination({ ...state.pagination, pageIndex: 0 });
    setData(data);
    setColumns(columns);
  }

  function getTableData(table: string) {
    const [sqlExec] = props.db.exec(`SELECT * FROM ${table};`);
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

  function init() {
    const tables = getTables(props.db);
    setState("tables", tables);
  }

  return {
    state,
    table,
    setPagination,
    setData,
    setColumns,
    selectTable,
  };
};

function getTables(db: Database) {
  const [data] = db.exec(/*sql*/ `
      SELECT 
        name 
      FROM 
        sqlite_schema 
      WHERE
        type ='table' AND 
        name NOT LIKE 'sqlite_%';
    `);
  return data.values.flat() as string[];
}
