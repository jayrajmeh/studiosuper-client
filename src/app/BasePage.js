import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { DashboardPage } from "./Dashboard/DashboardPage";
import SchoolList from "./pages/School/School_List";
import ClassList from "./pages/Class/Class_List";
import StudentList from "./pages/Student/Student_List";


import ExpenseList from "./pages/Expense/Expense_List";

import CategoryList from "./pages/Category/Category_List";
import SubCategoryList from "./pages/Sub Category/SubCategory_List";
import BlogList from "./pages/Blog/Blog_list";
import InventoryList from "./pages/Inventory/Inventory_List";
import BalancebookList from "./pages/Balancebook/Balancebook_List";
import KapanList from "./pages/Kapan/Kapan_List";




export default function BasePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
        }
        <ContentRoute path="/dashboard" component={DashboardPage} />
        <ContentRoute path="/school_list" component={SchoolList} />
        <ContentRoute path="/class_list" component={ClassList} />
        <ContentRoute path="/student_list" component={StudentList} />
        <ContentRoute path="/expense_list" component={ExpenseList} />
        <ContentRoute path="/inventory_list" component={InventoryList} />
        <ContentRoute path="/balancebook_list" component={BalancebookList} />
        <ContentRoute path="/kapan_list" component={KapanList} />




        <ContentRoute path="/category_list" component={CategoryList} />
        <ContentRoute path="/subcategory_list" component={SubCategoryList} />
        <ContentRoute path="/blog_list" component={BlogList} />


        

        <Redirect to="/error/error-v1" />
      </Switch>
    </Suspense>
  );
}
