import { create } from "zustand";

interface IBookingFilter {
  search: string;
  setSearch: (value: string) => void;
}

const initialStates = {
  search: "",
};

export const useDisputesFilter = create<IBookingFilter>((set) => ({
  ...initialStates,
  setSearch: (value: string) => set({ search: value }),
}));
