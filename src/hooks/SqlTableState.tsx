import { createStore } from "solid-js/store";
import { ISqlPagination } from "../models/SqlTable.model";
import {
  ColumnDef,
  createSolidTable,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { Database, QueryExecResult } from "sql.js";

export type SqlTableState = {
  pagination: ISqlPagination;
  data: unknown[];
  columns: ColumnDef<unknown, any>[];

  tables: string[];
  selectedTable: string;
  searchCommand: string;

  rowsCount: number;
  pageCount: number;
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
    searchCommand: "",

    rowsCount: 0,
    get pageCount() {
      return calculatePageCount();
    },
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
    autoResetPageIndex: true,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  function setPagination(pag: ISqlPagination) {
    const pageCount = calculatePageCount(state.rowsCount, pag.pageSize);

    if (pag.pageIndex * pag.pageSize > state.rowsCount) {
      pag.pageIndex = pageCount - 1;
    }

    setState("pagination", pag);
    updateTableData();
    props.onPaginationChange?.();
  }

  function selectTable(table: string) {
    setState("selectedTable", table);
    resetPagination();
    resetSearchCommand();
    updateTableData();
  }

  function updateTableData(
    table = state.selectedTable,
    searchCommand = state.searchCommand
  ) {
    if (searchCommand) {
      searchCommand = "WHERE " + searchCommand;
    }

    const [sqlCount] = props.db.exec(
      `SELECT COUNT(*) FROM ${table} ${searchCommand}`
    );
    const [[count]] = sqlCount.values;
    setState("rowsCount", count as number);

    const from = state.pagination.pageSize * state.pagination.pageIndex;
    const [sqlExec] = props.db.exec(
      `SELECT * FROM ${table} ${searchCommand} limit ${from}, ${state.pagination.pageSize};`
    );

    const { data, columns } = getRows(sqlExec);
    setData(data);
    setColumns(columns);
  }

  function setData(data: SqlTableState["data"]) {
    setState("data", data);
  }

  function setColumns(columns: SqlTableState["columns"]) {
    setState("columns", columns);
  }

  function getRows(sqlExec?: QueryExecResult) {
    try {
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
    } catch (e) {
      console.error(e);
      return { data: [], columns: [] };
    }
  }

  function init() {
    const tables = getTables(props.db);
    setState("tables", tables);

    const [firstTable] = tables;
    if (firstTable) {
      setTimeout(() => selectTable(firstTable));
    }
  }

  function setSearchCommand(command: string) {
    setState("searchCommand", command);
    resetPagination();
    updateTableData();
  }

  function resetPagination() {
    setPagination({ ...state.pagination, pageIndex: 0 });
  }

  function resetSearchCommand() {
    setState("searchCommand", "");
  }

  function calculatePageCount(
    rowsCount = state.rowsCount,
    pageSize = state.pagination.pageSize
  ): number {
    return Math.ceil(rowsCount / pageSize);
  }

  return {
    state,
    table,
    selectTable,
    setPagination,
    setData,
    setColumns,
    setSearchCommand,
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
