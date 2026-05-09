using BookKaroo.Application.DTOs.Pricing;
using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Application.Interfaces.Services;
using BookKaroo.Domain.Entities;
using BookKaroo.Domain.Enums;

namespace BookKaroo.Application.Services;

public class PricingService : IPricingService
{
    private readonly ISettingRepository _settings;

    public PricingService(ISettingRepository settings)
    {
        _settings = settings;
    }

    public async Task<PricingBreakdown> CalculateAsync(
        int qty,
        decimal seatPrice,
        string customerStateCode,
        Coupon? coupon,
        CancellationToken ct = default)
    {
        var allSettings = await _settings.GetAllAsync(ct);

        decimal convFeePerTicket = decimal.Parse(allSettings.GetValueOrDefault("convenience_fee_per_ticket", "59.00"));
        decimal offerFeeBase = decimal.Parse(allSettings.GetValueOrDefault("offer_processing_fee", "15.00"));
        string companyStateCode = allSettings.GetValueOrDefault("company_state_code", "24");

        bool isIntraState = customerStateCode == companyStateCode;

        decimal ticketAmount = Round(qty * seatPrice);
        decimal convFee = Round(qty * convFeePerTicket);

        decimal discount = 0m;
        if (coupon != null)
        {
            discount = coupon.Type switch
            {
                CouponType.Flat    => coupon.Value,
                CouponType.Percent => coupon.MaxDiscount.HasValue
                    ? Math.Min(coupon.MaxDiscount.Value, Round(ticketAmount * coupon.Value / 100m))
                    : Round(ticketAmount * coupon.Value / 100m),
                _ => 0m
            };
            discount = Round(discount);
        }

        decimal offerFee = coupon != null ? offerFeeBase : 0m;
        decimal taxableAmount = Round(convFee + offerFee);

        decimal cgst = 0m, sgst = 0m, igst = 0m;
        if (isIntraState)
        {
            cgst = Round(taxableAmount * 0.09m);
            sgst = Round(taxableAmount * 0.09m);
        }
        else
        {
            igst = Round(taxableAmount * 0.18m);
        }

        decimal convFeeGst = isIntraState ? Round(convFee * 0.18m) : Round(convFee * 0.18m);
        decimal offerFeeGst = offerFee > 0 ? Round(offerFee * 0.18m) : 0m;

        decimal amountPaid = Round(ticketAmount + convFee + offerFee + cgst + sgst + igst - discount);

        return new PricingBreakdown(
            TicketAmount: ticketAmount,
            ConvenienceFee: convFee,
            ConvenienceFeeGst: convFeeGst,
            OfferProcessingFee: offerFee,
            OfferProcessingFeeGst: offerFeeGst,
            TaxableAmount: taxableAmount,
            Cgst: cgst,
            Sgst: sgst,
            Igst: igst,
            Discount: discount,
            AmountPaid: amountPaid,
            IsIntraState: isIntraState
        );
    }

    private static decimal Round(decimal value) =>
        Math.Round(value, 2, MidpointRounding.AwayFromZero);
}
