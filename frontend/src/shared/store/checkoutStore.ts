import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CreateOrderResponse, CouponValidation } from '@/features/booking/types';

interface CheckoutState {
  orderResponse:    CreateOrderResponse | null;
  couponCode:       string | null;
  couponValidation: CouponValidation | null;
  contactMobile:    string;
  contactEmail:     string;
}

interface CheckoutActions {
  setOrder:     (order: CreateOrderResponse)                          => void;
  setCoupon:    (code: string, validation: CouponValidation)          => void;
  clearCoupon:  ()                                                    => void;
  setContact:   (mobile: string, email: string)                      => void;
  clearAll:     ()                                                    => void;
}

export const useCheckoutStore = create<CheckoutState & CheckoutActions>()(
  persist(
    (set) => ({
      orderResponse:    null,
      couponCode:       null,
      couponValidation: null,
      contactMobile:    '',
      contactEmail:     '',

      setOrder: (order)               => set({ orderResponse: order }),
      setCoupon: (code, validation)   => set({ couponCode: code, couponValidation: validation }),
      clearCoupon: ()                 => set({ couponCode: null, couponValidation: null }),
      setContact: (mobile, email)     => set({ contactMobile: mobile, contactEmail: email }),
      clearAll: ()                    => set({
        orderResponse:    null,
        couponCode:       null,
        couponValidation: null,
        contactMobile:    '',
        contactEmail:     '',
      }),
    }),
    {
      name:    'bk-checkout',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
