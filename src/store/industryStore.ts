import { create } from "zustand";

type IndustryStore = {
  selectedIndustry: string | null;
  setSelectedIndustry: (industry: string | null) => void;
};

export const useIndustryStore = create<IndustryStore>((set) => ({
  selectedIndustry: null,
  setSelectedIndustry: (industry) => set({ selectedIndustry: industry }),
}));
