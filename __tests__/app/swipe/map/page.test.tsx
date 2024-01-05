import React from "react";

import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import MapPage from "../../../../src/app/swipe/map/page";
import { useRestaurantData } from "../../../../src/contexts/RestaurantContext";

jest.mock("@react-google-maps/api", () => ({
  GoogleMap: () => <div data-testid="google-map" />,
  LoadScript: ({ children }) => <>{children}</>,
}));

jest.mock("../../../../src/contexts/RestaurantContext");

describe("MapPage", () => {
  it("renders correctly when there are restaurants", async () => {
    const mockUseRestaurantData = useRestaurantData as jest.MockedFunction<
      typeof useRestaurantData
    >;
    mockUseRestaurantData.mockReturnValue({
      latitude: 35.5649221,
      longitude: 139.6559956,
      radius: 500,
      restaurants: [{}],
    });

    render(<MapPage />);
    expect(screen.getByTestId("google-map")).toBeInTheDocument();
    expect(
      screen.queryByText("表示するレストランがありません")
    ).not.toBeInTheDocument();
  });

  it("displays error section when there are no restaurants", async () => {
    const mockUseRestaurantData = useRestaurantData as jest.MockedFunction<
      typeof useRestaurantData
    >;
    mockUseRestaurantData.mockReturnValue({
      latitude: 35.5649221,
      longitude: 139.6559956,
      radius: 500,
      restaurants: [],
    });

    render(<MapPage />);
    expect(
      screen.getByText("表示するレストランがありません")
    ).toBeInTheDocument();
  });
});
