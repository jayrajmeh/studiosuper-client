/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useMemo } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import objectPath from "object-path";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { UserProfileDropdown } from "./dropdowns/UserProfileDropdown";
import {
  ApiPost,
  ApiGet,
  ApiPut,
  ApiGetInce,
  ApiPostInce,
} from "../../../../helpers/API/ApiData";

export function QuickUserToggler() {
  const { user } = useSelector((state) => state?.auth);
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      offcanvas:
        objectPath.get(uiService.config, "extras.user.layout") === "offcanvas",
    };
  }, [uiService]);
  const [category, setCategory] = useState([]);
  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     const Id2 = localStorage.getItem("token");
  //     console.log(Id2);
  //     // let productValue = ApiGetInce("user/getprofile" , Id2);
  //     ApiGetInce("admin/getprofile", Id2)
  //       // ApiPost("get-user-details-by-id",data)
  //       .then((res) => {
  //         console.log(res.data);
  //         setCategory(res?.data);
  //         // setaccountData(res.data)

  //         // setAddButton(res.data.data[0].storeDetails);
  //       })
  //       .catch((err) => {
  //         console.log("Error");
  //       });
  //   }

  // console.log("productValue", productValue.data);
  // productValue = productValue.data.data;
  // if (productValue.data) {
  //     setaccountData(productValue.data[0]);
  // } else {
  //     setaccountData(null);
  // }
  // }, []);

  return (
    <>
      {/* {layoutProps.offcanvas && (
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="quick-user-tooltip">View user</Tooltip>}
        >
          <div className="topbar-item">
            <div
              className="btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2"
              id="kt_quick_user_toggle"
            >
              <>
                <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">
                  {category.name}
                </span>
                <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">
                  {user.f_name}
                </span>
                <span className="symbol symbol-35 symbol-light-success">
                  
                </span>
              </>
            </div>
          </div>
        </OverlayTrigger>
      )} */}

      {!layoutProps.offcanvas && <UserProfileDropdown />}
    </>
  );
}
