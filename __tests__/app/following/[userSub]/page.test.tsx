import React from "react";

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import FollowingPage from "../../../../src/app/following/[userSub]/page";
import { getFollowing } from "../../../../src/lib/api/followRelationshipsInfo";
import { getUserProfile } from "../../../../src/lib/api/usersInfo";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("../../../../src/lib/api/followRelationshipsInfo", () => ({
  getFollowing: jest.fn(),
}));

jest.mock("../../../../src/lib/api/usersInfo", () => ({
  getUserProfile: jest.fn(),
}));

describe("FollowingPage", () => {
  const mockUserProfile = {
    name: "Test User",
    picture: "/images/header/guest.png",
  };

  const mockFollowing = [
    {
      sub: "following1",
      name: "Following 1",
      picture: "/images/header/guest.png",
    },
  ];

  beforeEach(() => {
    (getUserProfile as jest.Mock).mockResolvedValue(mockUserProfile);
  });

  it("fetches and displays user profile and following", async () => {
    (getFollowing as jest.Mock).mockResolvedValue(mockFollowing);
    render(<FollowingPage params={{ userSub: "test-user-sub" }} />);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
      expect(screen.getByAltText("Test User")).toBeInTheDocument();
    });

    mockFollowing.forEach((following) => {
      expect(screen.getByText(following.name)).toBeInTheDocument();
    });
  });

  it("displays a message when no following are found", async () => {
    (getFollowing as jest.Mock).mockResolvedValue([]);
    render(<FollowingPage params={{ userSub: "test-user-sub" }} />);

    await waitFor(() => {
      expect(screen.getByText("フォロー中のユーザーが")).toBeInTheDocument();
      expect(screen.getByText("見つかりません。")).toBeInTheDocument();
    });
  });
});
