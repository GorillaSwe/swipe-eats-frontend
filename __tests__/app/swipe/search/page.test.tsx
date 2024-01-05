import React from "react";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/";

import SearchPage from "../../../../src/app/swipe/search/page";
import useLocation from "../../../../src/lib/useLocation";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn((param) => {
      if (param === "category") return "food";
      return null;
    }),
  }),
}));

jest.mock("../../../../src/lib/useLocation", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("SearchPage", () => {
  beforeEach(() => {
    (useLocation as jest.Mock).mockReturnValue({
      latitude: 123,
      longitude: 456,
    });
  });

  it("displays loading when location data is being fetched", () => {
    (useLocation as jest.Mock).mockReturnValue({
      latitude: null,
      longitude: null,
    });
    render(<SearchPage />);
    expect(screen.getByTestId("loading-section")).toBeInTheDocument();
  });

  it("displays search form when location data is available", async () => {
    render(<SearchPage />);
    expect(screen.getByText("検索条件を設定してください")).toBeInTheDocument();
  });
});
