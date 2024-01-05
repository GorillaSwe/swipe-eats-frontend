import React from "react";

import { useUser, UserContext } from "@auth0/nextjs-auth0/client";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/";

import ProfilePage from "../../../src/app/profile/page";

jest.mock("@auth0/nextjs-auth0/client", () => ({
  useUser: jest.fn(),
}));

describe("ProfilePage", () => {
  it("displays loading when user data is being fetched", () => {
    const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
    mockUseUser.mockReturnValue({
      isLoading: true,
    } as UserContext);
    render(<ProfilePage />);
    expect(screen.getByTestId("loading-section")).toBeInTheDocument();
  });

  it("displays login section when user is not logged in", () => {
    (useUser as jest.Mock).mockReturnValue({ user: null, isLoading: false });
    render(<ProfilePage />);
    expect(screen.getByText("ログインが必要です")).toBeInTheDocument();
  });
});
