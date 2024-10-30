import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "055-2017-EAPInf",
    totalAmount: "$250.00",
    paymentMethod: "TRABAJO DE GRADUACIÓN",
  },
  {
    invoice: "INV002",
    paymentStatus: "088-2016-EAPInf",
    totalAmount: "$150.00",
    paymentMethod: "PROYECTO DE TESIS",
  },
  {
    invoice: "INV003",
    paymentStatus: "088-2016-EAPInf",
    totalAmount: "$350.00",
    paymentMethod: "TRABAJO DE GRADUACIÓN",
  },
  {
    invoice: "INV004",
    paymentStatus: "088-2016-EAPInf",
    totalAmount: "$450.00",
    paymentMethod: "PROYECTO DE TESIS",
  },
  {
    invoice: "INV005",
    paymentStatus: "088-2016-EAPInf",
    totalAmount: "$550.00",
    paymentMethod: "TRABAJO DE GRADUACIÓN",
  },
  {
    invoice: "INV006",
    paymentStatus: "088-2016-EAPInf",
    totalAmount: "$200.00",
    paymentMethod: "PROYECTO DEL TRABAJO DE GRADUACIÓN",
  },
];

export function TableDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Código</TableHead>
          <TableHead>Número de Resolución</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right"></TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="text-right">
            Total de registros
          </TableCell>
          <TableCell className="text-right">6</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
