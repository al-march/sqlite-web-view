import { createMemo } from "solid-js";
import { ISqlPagination } from "../models/SqlTable.model";

export interface SqlPaginationProps extends ISqlPagination {
  pageCount?: number;

  onPageSize?: (value: number) => void;
  onPageIndex?: (value: number) => void;
}

export const SqlPagination = (props: SqlPaginationProps) => {
  const isPrevDisabled = createMemo(() => {
    return props.pageIndex === 0;
  });

  const isNextDisabled = createMemo(() => {
    return (props.pageIndex + 1) === props.pageCount;
  });

  function onPageSize(value: number) {
    props.onPageSize?.(value);
  }

  function onPageIndex(value: number) {
    props.onPageIndex?.(value);
  }

  function onPrev() {
    const count = props.pageIndex;
    onPageIndex(count - 1);
  }

  function onNext() {
    const count = props.pageIndex;
    onPageIndex(count + 1);
  }

  return (
    <section style="display: flex; gap: 10px">
      <button
        class="border rounded p-1"
        onClick={onPrev}
        disabled={isPrevDisabled()}
      >
        {"<"}
      </button>
      <button
        class="border rounded p-1"
        onClick={onNext}
        disabled={isNextDisabled()}
      >
        {">"}
      </button>

      <span>
        Page {props.pageIndex + 1} of {props.pageCount || 0}
      </span>

      <select
        value={props.pageSize}
        onChange={(e) => onPageSize(Number(e.currentTarget.value))}
      >
        <option value={10}>10</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </section>
  );
};
