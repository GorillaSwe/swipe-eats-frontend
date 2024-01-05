import React from "react";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ResultPage from "../../../../src/app/swipe/result/page";

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

jest.mock("../../../../src/lib/api/useAccessToken", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@auth0/nextjs-auth0/client", () => ({
  useUser: jest
    .fn()
    .mockReturnValue({ user: { sub: "user-123" }, isLoading: false }),
}));

jest.mock("../../../../src/lib/api/restaurantsInfo", () => ({
  getRestaurants: jest.fn().mockResolvedValue({
    message: [{ id: 1, name: "Restaurant 1" }],
  }),
}));

jest.mock("../../../../src/contexts/RestaurantContext", () => ({
  useSetRestaurantData: jest.fn(),
}));

describe("ResultPage", () => {
  it("renders loading initially", () => {
    render(<ResultPage />);
    expect(screen.getByTestId("loading-section")).toBeInTheDocument();
  });
});
