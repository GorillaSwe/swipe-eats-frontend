import React from "react";

import { useUser, UserContext } from "@auth0/nextjs-auth0/client";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import UserProfilePage from "../../../../src/app/user/[userSub]/page";

jest.mock("@auth0/nextjs-auth0/client", () => ({
  useUser: jest.fn(),
}));

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("ProfilePage", () => {
  it("displays loading when user data is being fetched", () => {
    const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
    mockUseUser.mockReturnValue({
      isLoading: true,
    } as UserContext);
    render(<UserProfilePage params={{ userSub: "test-user-sub" }} />);
    expect(screen.getByTestId("loading-section")).toBeInTheDocument();
  });
});
