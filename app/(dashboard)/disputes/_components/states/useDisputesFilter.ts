import { create } from "zustand";

interface IBookingFilter {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
}

const initialStates = {
  search: "",
  status: "All",
};

export const useDisputesFilter = create<IBookingFilter>((set) => ({
  ...initialStates,
  setSearch: (value: string) => set({ search: value }),
  setStatus: (value: string) => set({ status: value }),
}));
