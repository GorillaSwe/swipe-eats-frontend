import React from "react";

import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import CategoryPage from "../../src/app/page";
import { CATEGORIES } from "../../src/const/categories";

describe("CategoryPage", () => {
  it("renders the component", () => {
    render(<CategoryPage />);
    expect(screen.getByText("カテゴリを選択してください")).toBeInTheDocument();
  });

  it("renders all category items", () => {
    render(<CategoryPage />);
    CATEGORIES.forEach((category) => {
      expect(screen.getByText(category.value)).toBeInTheDocument();
    });
  });
});
