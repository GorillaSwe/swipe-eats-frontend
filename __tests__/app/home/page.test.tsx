import React from "react";

import { UserContext, useUser } from "@auth0/nextjs-auth0/client";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import HomePage from "../../../src/app/home/page";

jest.mock("@auth0/nextjs-auth0/client", () => ({
  useUser: jest.fn(),
}));

describe("HomePage", () => {
  it("displays loading when user data is being fetched", () => {
    const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
    mockUseUser.mockReturnValue({
      isLoading: true,
    } as UserContext);
    render(<HomePage />);
    expect(screen.getByTestId("loading-section")).toBeInTheDocument();
  });

  it("displays login section when user is not logged in", () => {
    (useUser as jest.Mock).mockReturnValue({ user: null, isLoading: false });
    render(<HomePage />);
    expect(screen.getByText("ログインが必要です")).toBeInTheDocument();
  });
});
