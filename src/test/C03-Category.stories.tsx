import * as React from "react";
import CreateCategory from "../ui/components/category/CreateCategory";
import ViewAllCategories from "../ui/components/category/ViewAllCategories";

export default { title: "Categories" };

export const createCategory = () => (
  <CreateCategory></CreateCategory>
)

export const viewAllCategories = () => (
  <ViewAllCategories></ViewAllCategories>
)