import { create } from "zustand";

interface IBookingFilter {
  search: string;
  setSearch: (value: string) => void;
  deliveryType: string;
  setDeliveryType: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
}

const initialStates = {
  search: "",
  deliveryType: "",
  status: "",
  date: "",
};

export const useBookingsFilter = create<IBookingFilter>((set) => ({
  ...initialStates,
  setSearch: (value: string) => set({ search: value }),
  setDeliveryType: (value: string) => set({ deliveryType: value }),
  setStatus: (value: string) => set({ status: value }),
  setDate: (value: string) => set({ date: value }),
}));
