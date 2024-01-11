import React from "react";

import { UserContext, useUser } from "@auth0/nextjs-auth0/client";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import SearchPage from "../../../src/app/search/page";
import { searchRestaurants } from "../../../src/lib/api/restaurantsInfo";
import { searchUsers } from "../../../src/lib/api/usersInfo";
import useLocation from "../../../src/lib/useLocation";

jest.mock("@auth0/nextjs-auth0/client", () => ({
  useUser: jest.fn(),
}));

jest.mock("../../../src/lib/useLocation", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../../src/lib/api/useAccessToken", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../../src/lib/api/restaurantsInfo", () => ({
  searchRestaurants: jest.fn(),
}));

jest.mock("../../../src/lib/api/usersInfo", () => ({
  searchUsers: jest.fn(),
}));

describe("SearchPage", () => {
  beforeEach(() => {
    const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
    mockUseUser.mockReturnValue({
      user: { sub: "user-sub" },
    } as UserContext);

    jest.mock("../../../src/lib/api/useAccessToken", () => ({
      __esModule: true,
      default: jest.fn(),
    }));
    (searchRestaurants as jest.Mock).mockResolvedValue([]);
    (searchUsers as jest.Mock).mockResolvedValue([]);
  });

  it("renders loading section when still loading", () => {
    (useLocation as jest.Mock).mockReturnValue({
      latitude: null,
      longitude: null,
    });
    render(<SearchPage />);
    expect(screen.getByTestId("loading-section")).toBeInTheDocument();
  });

  it("renders search bar and button container", () => {
    (useLocation as jest.Mock).mockReturnValue({
      latitude: 123,
      longitude: 456,
    });
    render(<SearchPage />);
    expect(screen.getByPlaceholderText("検索")).toBeInTheDocument();
    expect(screen.getByText("レストラン")).toBeInTheDocument();
    expect(screen.getByText("ユーザー")).toBeInTheDocument();
  });
});
