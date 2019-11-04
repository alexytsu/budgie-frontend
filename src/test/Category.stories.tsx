import * as React from "react";
import CreateCategory from "../ui/components/category/CreateCategory";
import ViewAllCategories from "../ui/components/category/ViewAllCategories";
import CategoryScene from "../ui/scenes/CategoryScene";

export default { title: "Categories" };

export const createCategory = () => (
  <CreateCategory></CreateCategory>
)

export const viewAllCategories = () => (
  <ViewAllCategories></ViewAllCategories>
)

export const categoryScene = () => (
  <div className="container mx-auto">
    <CategoryScene></CategoryScene>
  </div>
)