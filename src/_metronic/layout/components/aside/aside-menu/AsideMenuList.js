/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import Button from "reactstrap/es/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { ApiPostInce } from "../../../../../helpers/API/ApiData";
import { useLanguage } from '../../../../i18n/LanguageContext';
import { Col, FormGroup, Label, Input, Row } from "reactstrap";
export function AsideMenuList({ layoutProps }) {
  const { language } = useLanguage();
  const lan = require(`../../../../i18n/messages/${language}.json`);
  const [accountData, setaccountData] = useState({});
  const [type, setType] = useState();
  const [open1, setOpen1] = useState(false);
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };
  const handleonChange = (e) => {
    console.log(e);
    let { name, value } = e.target;
    if (name === "canShareWithDifferent") {
      accountData[name] = e.target.checked;
      setaccountData({ ...accountData });
    } else if (name === "canShareWithSame") {
      accountData[name] = e.target.checked;
      setaccountData({ ...accountData });
    } else if (name === "requestSignature") {
      accountData[name] = e.target.checked;
      setaccountData({ ...accountData });
    } else {
      setaccountData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleClickOpen1 = () => {
    console.log("jjjjjjjjj");
    setOpen1(true);
  };
  const submitfeed = () => {
    if (accountData.message) {
      console.log(accountData);
      const Id3 = JSON.parse(localStorage.getItem("token"));
      let body = {
        message: accountData.message,
      };
      ApiPostInce("feedBack", Id3, body)
        // ApiPost("get-user-details-by-id",data)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            console.log(res);
            alert(res.message);
            handleClose1();
          } else {
          }
        });
    } else {
      alert("please enter Message");
    }
  };
  const handleClose1 = () => {
    setOpen1(false);
  };
  const signout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  useEffect(() => {
    const Id = JSON.parse(localStorage.getItem("userinfo"));
    console.log();
    setType(Id?.role);
  }, []);
  console.log("type", 2);
  return (
    <>
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">{lan.sidelist_dashboard}</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/school_list", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/school_list">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/General/User.svg")} />
            </span>
            <span className="menu-text">{lan.sidelist_school}</span>
          </NavLink>
        </li>
       
        
        <li
          className={`menu-item ${getMenuItemActive("", false)}`}
          aria-haspopup="true"
        >
          <div className="menu-link" onClick={() => signout()}>
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Navigation/Sign-out.svg")}
              />
            </span>
            <span className="menu-text">Sign Out</span>
          </div>
        </li>
      </ul>
    </>
  );
}
