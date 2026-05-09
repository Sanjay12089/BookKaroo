using BookKaroo.Application.DTOs.Invoice;
using BookKaroo.Application.Interfaces.Services;
using BookKaroo.Infrastructure.Common;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace BookKaroo.Infrastructure.Pdf;

public class QuestPdfInvoiceGenerator : IInvoicePdfGenerator
{
    static QuestPdfInvoiceGenerator()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public byte[] Generate(InvoiceModel model)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(30, Unit.Millimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(9).FontFamily(Fonts.Arial));

                page.Content().Column(col =>
                {
                    col.Spacing(12);
                    HeaderSection(col, model);
                    CustomerAndCompanyBlock(col, model);
                    LineItemsTable(col, model);
                    TaxSummarySection(col, model);
                    AmountInWordsSection(col, model);
                    NoteAndPaymentSection(col, model);
                    SignatureSection(col);
                });

                page.Footer().AlignCenter().Text(t =>
                {
                    t.Span("Page ").FontSize(7).FontColor(Colors.Grey.Medium);
                    t.CurrentPageNumber().FontSize(7).FontColor(Colors.Grey.Medium);
                    t.Span(" / ").FontSize(7).FontColor(Colors.Grey.Medium);
                    t.TotalPages().FontSize(7).FontColor(Colors.Grey.Medium);
                });
            });
        }).GeneratePdf();
    }

    private static void HeaderSection(ColumnDescriptor col, InvoiceModel m)
    {
        col.Item().Row(row =>
        {
            row.RelativeItem().Text("Invoice").FontSize(18).Bold();
            row.RelativeItem().AlignRight().Text(t =>
            {
                t.Span("Book").Bold().FontSize(14);
                t.Span("Karoo").Bold().FontSize(14).FontColor("#E50914");
            });
        });
    }

    private static void CustomerAndCompanyBlock(ColumnDescriptor col, InvoiceModel m)
    {
        col.Item().Row(row =>
        {
            // Left: Invoice / customer meta
            row.RelativeItem().Column(c =>
            {
                c.Item().Text($"Invoice Number: {m.InvoiceNumber}").Bold();
                c.Item().Text($"Date of Issue: {m.IssuedAt:dd MMM yyyy}");
                c.Item().Text($"Place of Supply: {m.PlaceOfSupply}");
                c.Item().Text($"Booking ID: {m.BookingRef}");
                c.Item().Text($"Customer GSTIN: {m.CustomerGstin ?? "-"}");
                c.Item().Text($"State Code: {m.CustomerStateCode}");
                c.Item().Text($"Customer Name: {m.CustomerName}");
                c.Item().Text($"Customer Email: {m.CustomerEmail}");
            });

            // Right: Company details
            row.RelativeItem().Column(c =>
            {
                c.Item().Text("Invoice Issued By:").Bold();
                c.Item().Text("BookKaroo Pvt Ltd");
                c.Item().Text("GSTIN: 24XXXXX0000X1Z5");
                c.Item().Text("PAN: XXXXX0000X");
                c.Item().Text("State: Gujarat | Code: 24");
                c.Item().Text("701, Demo Tower, SG Highway");
                c.Item().Text("Bodakdev, Ahmedabad 380054");
            });
        });
    }

    private static void LineItemsTable(ColumnDescriptor col, InvoiceModel m)
    {
        col.Item().Table(table =>
        {
            table.ColumnsDefinition(cols =>
            {
                cols.RelativeColumn(18); // Description
                cols.RelativeColumn(8);  // SAC
                cols.RelativeColumn(5);  // Qty
                cols.RelativeColumn(8);  // Price
                cols.RelativeColumn(8);  // Discount
                cols.RelativeColumn(10); // Taxable
                cols.RelativeColumn(5);  // CGST%
                cols.RelativeColumn(7);  // CGST amt
                cols.RelativeColumn(5);  // SGST%
                cols.RelativeColumn(7);  // SGST amt
                cols.RelativeColumn(5);  // IGST%
                cols.RelativeColumn(7);  // IGST amt
                cols.RelativeColumn(4);  // Cess%
                cols.RelativeColumn(5);  // Cess amt
                cols.RelativeColumn(8);  // Total
            });

            // Header
            string[] headers = ["Description", "SAC", "Qty", "Price", "Discount",
                "Taxable", "CGST%", "CGST", "SGST%", "SGST",
                "IGST%", "IGST", "Cess%", "Cess", "Total"];

            foreach (var h in headers)
                table.Header(th => th.Cell().Background(Colors.Grey.Lighten2).Padding(3).Text(h).Bold().FontSize(8));

            // Rows
            foreach (var line in m.Lines)
            {
                IContainer Cell() => table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten1).Padding(3);
                Cell().Text(line.Description).FontSize(8);
                Cell().Text(line.SacCode).FontSize(8);
                Cell().AlignCenter().Text(line.Qty.ToString()).FontSize(8);
                Cell().AlignRight().Text(line.Price.ToString("F2")).FontSize(8);
                Cell().AlignRight().Text(line.Discount.ToString("F2")).FontSize(8);
                Cell().AlignRight().Text(line.TaxableAmount.ToString("F2")).FontSize(8);
                Cell().AlignCenter().Text(line.CgstRate.ToString("F0")).FontSize(8);
                Cell().AlignRight().Text(line.CgstAmount.ToString("F2")).FontSize(8);
                Cell().AlignCenter().Text(line.SgstRate.ToString("F0")).FontSize(8);
                Cell().AlignRight().Text(line.SgstAmount.ToString("F2")).FontSize(8);
                Cell().AlignCenter().Text(line.IgstRate.ToString("F0")).FontSize(8);
                Cell().AlignRight().Text(line.IgstAmount.ToString("F2")).FontSize(8);
                Cell().AlignCenter().Text("0").FontSize(8);
                Cell().AlignRight().Text("0.00").FontSize(8);
                Cell().AlignRight().Text(line.Total.ToString("F2")).FontSize(8).Bold();
            }
        });
    }

    private static void TaxSummarySection(ColumnDescriptor col, InvoiceModel m)
    {
        col.Item().AlignRight().Column(c =>
        {
            void SummaryRow(string label, decimal value) =>
                c.Item().Row(r =>
                {
                    r.ConstantItem(180).AlignRight().Text(label).FontSize(9);
                    r.ConstantItem(70).AlignRight().Text(value.ToString("F2")).FontSize(9);
                });

            SummaryRow("Total Amount before Tax:", m.Gst.TotalBeforeTax);
            SummaryRow("Add. CGST:", m.Gst.Cgst);
            SummaryRow("Add. SGST:", m.Gst.Sgst);
            SummaryRow("Add. IGST:", m.Gst.Igst);
            SummaryRow("Add. UGST or Cess:", m.Gst.UgstCess);
            c.Item().LineHorizontal(0.5f).LineColor(Colors.Grey.Medium);
            SummaryRow("Total Amount GST:", m.Gst.TotalGst);
            c.Item().Row(r =>
            {
                r.ConstantItem(180).AlignRight().Text("Total Amount after Tax:").Bold().FontSize(9);
                r.ConstantItem(70).AlignRight().Text(m.Gst.TotalAfterTax.ToString("F2")).Bold().FontSize(9);
            });
        });
    }

    private static void AmountInWordsSection(ColumnDescriptor col, InvoiceModel m)
    {
        col.Item().Text(AmountInWordsConverter.Convert(m.PaymentTotal)).Italic().FontSize(9);
    }

    private static void NoteAndPaymentSection(ColumnDescriptor col, InvoiceModel m)
    {
        col.Item().Column(c =>
        {
            c.Item().Text("Note:").Bold().FontSize(9);
            c.Item().Text(m.VenueNoteText).FontSize(9);
            c.Item().Text("RCM: No").FontSize(9);
            c.Item().PaddingTop(8).Text("Payment Reference").Bold().FontSize(9);
            c.Item().Text($"Transaction ID & Amount: {m.PaymentTransactionId}, Rs. {m.PaymentTotal:F2}/-").FontSize(9);
            c.Item().Text($"Date & Time: {m.PaymentDateTime:dd MMM yyyy hh:mm tt}").FontSize(9);
            c.Item().Text($"Mode of Payment: {m.PaymentMethod}").FontSize(9);
        });
    }

    private static void SignatureSection(ColumnDescriptor col)
    {
        col.Item().PaddingTop(16).Column(c =>
        {
            c.Item().Text("Certified that the particulars given above are true and correct.").FontSize(9);
            c.Item().Text("For BookKaroo Pvt Ltd.").Bold().FontSize(9);
            c.Item().PaddingTop(24).Text("________________________").FontSize(9);
            c.Item().Text("Authorised Signatory").FontSize(9);
        });
    }
}
