import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Info, RefreshCw } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import { useGetSalesItemsByShopQuery } from "../../services/sales.service";
import {
  PaymentMethodOptions,
  type SaleHistoryItem,
} from "../../types/general";

interface TicketRow {
  id: string;
  ticketNumber: string;
  totalAmount: number;
  soldByName?: string;
  paymentMethod: string;
  date: string;
  customerName?: string;
}

const formatCurrency = (amount: number) =>
  `₦${(amount || 0).toLocaleString()}`;

const getTimeAgo = (date: string) => {
  const now = new Date();
  const saleDate = new Date(date);
  const diffMs = now.getTime() - saleDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

const ticketColumnHelper = createColumnHelper<TicketRow>();

const PaymentBadge = ({ method }: { method: string }) => {
  const isCredit =
    method?.toLowerCase() === PaymentMethodOptions.credit.toLowerCase();

  return (
    <span
      className={`text-sm font-semibold ${
        isCredit ? "text-red-600" : "text-gray-700"
      }`}
    >
      {method ? method.charAt(0).toUpperCase() + method.slice(1) : "Cash"}
    </span>
  );
};

interface TableProps {
  data: TicketRow[];
  isLoading: boolean;
  emptyState: {
    title: string;
    description: string;
  };
  columns: ColumnDef<TicketRow, any>[];
}

const TableCard: React.FC<TableProps> = ({
  data,
  isLoading,
  emptyState,
  columns,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Icon icon="mdi:loading" className="animate-spin" width="24" />
          <span>Loading data...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-12 text-center space-y-2">
        <p className="text-gray-800 font-semibold">{emptyState.title}</p>
        <p className="text-gray-500 text-sm">{emptyState.description}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide uppercase"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-sm text-gray-900">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden divide-y divide-gray-100">
        {table.getRowModel().rows.map((row) => {
          const ticket = row.original;
          return (
            <div key={row.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-gray-500">Ticket</p>
                  <p className="font-semibold text-gray-900">
                    {ticket.ticketNumber}
                  </p>
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <Info size={18} className="text-gray-500" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Price</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(ticket.totalAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Sold By</span>
                <span className="font-medium text-gray-900">
                  {ticket.soldByName || "You"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Date</span>
                <span className="text-gray-900">{getTimeAgo(ticket.date)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Payment</span>
                <PaymentBadge method={ticket.paymentMethod} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const debtorColumns: ColumnDef<TicketRow, any>[] = [
  ticketColumnHelper.accessor("customerName", {
    header: "Name",
    cell: (info) => (
      <div className="font-semibold text-gray-900">
        {info.getValue() || "Walk-in Customer"}
      </div>
    ),
  }),
  ticketColumnHelper.accessor("totalAmount", {
    header: ({ column }) => (
      <button
        className="flex items-center gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        {column.getIsSorted() === "asc" ? (
          <ArrowUp size={14} />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown size={14} />
        ) : (
          <ArrowUpDown size={14} className="text-gray-400" />
        )}
      </button>
    ),
    cell: (info) => (
      <div className="font-semibold text-gray-900">
        {formatCurrency(info.getValue())}
      </div>
    ),
  }),
  ticketColumnHelper.accessor("soldByName", {
    header: "Sold By",
    cell: (info) => (
      <div className="text-gray-700">
         {info.getValue() || "You"}
      </div>
    ),
  }),
  ticketColumnHelper.accessor("date", {
    header: "Date",
    cell: (info) => (
      <div className="text-gray-700">{getTimeAgo(info.getValue())}</div>
    ),
  }),
  ticketColumnHelper.accessor("paymentMethod", {
    header: "Payment",
    cell: (info) => <PaymentBadge method={info.getValue()} />,
  }),
  ticketColumnHelper.display({
    id: "debtorActions",
    header: "",
    cell: () => (
      <button className="p-2 rounded-lg hover:bg-gray-100">
        <Info size={16} className="text-gray-500" />
      </button>
    ),
  }),
];

const ticketColumns: ColumnDef<TicketRow, any>[] = [
  ticketColumnHelper.accessor("ticketNumber", {
    header: ({ column }) => (
      <button
        className="flex items-center gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID
        {column.getIsSorted() === "asc" ? (
          <ArrowUp size={14} />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown size={14} />
        ) : (
          <ArrowUpDown size={14} className="text-gray-400" />
        )}
      </button>
    ),
    cell: (info) => (
      <div className="font-semibold text-gray-900">{info.getValue()}</div>
    ),
  }),
  ticketColumnHelper.accessor("totalAmount", {
    header: ({ column }) => (
      <button
        className="flex items-center gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        {column.getIsSorted() === "asc" ? (
          <ArrowUp size={14} />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown size={14} />
        ) : (
          <ArrowUpDown size={14} className="text-gray-400" />
        )}
      </button>
    ),
    cell: (info) => (
      <div className="font-semibold text-gray-900">
        {formatCurrency(info.getValue())}
      </div>
    ),
  }),
  ticketColumnHelper.accessor("soldByName", {
    header: "Sold By",
    cell: (info) => (
      <div className="text-gray-700">
      {info.getValue() || "You"}
      </div>
    ),
  }),
  ticketColumnHelper.accessor("date", {
    header: "Date",
    cell: (info) => (
      <div className="text-gray-700">{getTimeAgo(info.getValue())}</div>
    ),
  }),
  ticketColumnHelper.accessor("paymentMethod", {
    header: "Payment",
    cell: (info) => <PaymentBadge method={info.getValue()} />,
  }),
  ticketColumnHelper.display({
    id: "ticketActions",
    header: "",
    cell: () => (
      <button className="p-2 rounded-lg hover:bg-gray-100">
        <Info size={16} className="text-gray-500" />
      </button>
    ),
  }),
];

export const HistoryPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    data: salesItemsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetSalesItemsByShopQuery(user?.shopId || "", {
    skip: !user?.shopId,
  });

  const tickets = useMemo<TicketRow[]>(() => {
    const items = salesItemsData?.data.items || [];
    if (!items.length) return [];

    const ticketMap = new Map<string, TicketRow>();

    items.forEach((item: SaleHistoryItem) => {
      const key = item.ticketNumber || item.ticketId || item._id;
      if (!key) return;

      const lineTotal = Number(item.lineTotal || 0);
      const existing = ticketMap.get(key);

      if (existing) {
        existing.totalAmount += lineTotal;
        if (new Date(item.date).getTime() > new Date(existing.date).getTime()) {
          existing.date = item.date;
        }
      } else {
        ticketMap.set(key, {
          id: item.ticketId || item._id,
          ticketNumber: item.ticketNumber || key,
          totalAmount: lineTotal,
          soldByName: item.soldByName,
          paymentMethod: item.paymentMethod,
          date: item.date,
          customerName: item.customerName,
        });
      }
    });

    return Array.from(ticketMap.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [salesItemsData]);

  const debtorTickets = useMemo(
    () =>
      tickets.filter(
        (ticket) =>
          ticket.paymentMethod?.toLowerCase() ===
          PaymentMethodOptions.credit.toLowerCase()
      ),
    [tickets]
  );

  const isBusy = isLoading || isFetching;

  return (
    <section className="py-6 space-y-8">
      <article className="space-y-4">
        <header>
          <h1 className="h4 md:text-2xl text-secondary">
            Debtors
          </h1>
          <h2 className="text-sm text-gray-900">The people that are owing you.</h2>
          {/* <p className="text-gray-500 text-sm">
            Track every credit sale and stay on top of repayments.
          </p> */}
        </header>

        <TableCard
          data={debtorTickets}
          isLoading={isBusy}
          emptyState={{
            title: "No debtors yet",
            description: "Credit sales will appear here once recorded.",
          }}
          columns={debtorColumns}
        />
      </article>

      <article className="space-y-4">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="h4 md:text-2xl text-secondary">Sales History</h1>
            <p className="text-sm text-gray-900">See what you have sold.</p>
            {/* <p className="text-gray-500 text-sm">
              Every ticket recorded in your shop appears here.
            </p> */}
          </div>

          <button
            onClick={() => refetch()}
            disabled={isBusy}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={16} className={isBusy ? "animate-spin" : ""} />
            Refresh
          </button>
        </header>

        <TableCard
          data={tickets}
          isLoading={isBusy}
          emptyState={{
            title: "No sales yet",
            description: "Once you record sales, they will show up here.",
          }}
          columns={ticketColumns}
        />
      </article>
    </section>
  );
};
