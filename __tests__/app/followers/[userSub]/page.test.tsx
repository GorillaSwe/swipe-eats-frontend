import React from "react";

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import FollowersPage from "../../../../src/app/followers/[userSub]/page";
import { getFollowers } from "../../../../src/lib/api/followRelationshipsInfo";
import { getUserProfile } from "../../../../src/lib/api/usersInfo";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("../../../../src/lib/api/usersInfo", () => ({
  getUserProfile: jest.fn(),
}));

jest.mock("../../../../src/lib/api/followRelationshipsInfo", () => ({
  getFollowers: jest.fn(),
}));

describe("FollowersPage", () => {
  const mockUserProfile = {
    name: "Test User",
    picture: "/images/header/guest.png",
  };

  const mockFollowers = [
    {
      sub: "follower1",
      name: "Follower 1",
      picture: "/images/header/guest.png",
    },
  ];

  beforeEach(() => {
    (getUserProfile as jest.Mock).mockResolvedValue(mockUserProfile);
  });

  it("fetches and displays user profile and followers", async () => {
    (getFollowers as jest.Mock).mockResolvedValue(mockFollowers);
    render(<FollowersPage params={{ userSub: "test-user-sub" }} />);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
      expect(screen.getByAltText("Test User")).toBeInTheDocument();
    });

    mockFollowers.forEach((follower) => {
      expect(screen.getByText(follower.name)).toBeInTheDocument();
    });
  });

  it("displays a message when no followers are found", async () => {
    (getFollowers as jest.Mock).mockResolvedValue([]);
    render(<FollowersPage params={{ userSub: "test-user-sub" }} />);

    await waitFor(() => {
      expect(screen.getByText("フォロワーが")).toBeInTheDocument();
      expect(screen.getByText("見つかりません。")).toBeInTheDocument();
    });
  });
});
