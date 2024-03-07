/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { ApiPost, ApiPut } from "../../../../../helpers/API/ApiData";
import { ErrorToast, SuccessToast } from "../../../../../helpers/Toast";
import clsx from "clsx";
import { Dropdown, Form, Modal } from "react-bootstrap";
import { useLang, setLanguage } from "../../../../i18n";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";
import { useLanguage } from '../../../../i18n/LanguageContext';
import * as userUtil from "../../../../../utils/user.util";

export function LanguageSelectorDropdown() {
  const { language, switchLanguage } = useLanguage();
  const [passModal, setPassModal] = useState(false);
  const [newData, setNewData] = useState({
    currentPass: "",
    newPass: "",
    confirmPass: "",
  });
  console.log("newData", newData);
  const signOut = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  const handleChange = (e) => {
    const { value, name } = e.target;
    setNewData({ ...newData, [name]: value });
  };
  const handleSubmitPass = async () => {
    if (newData.newPass === newData.confirmPass) {
      let body = {
        currentPassword: newData?.currentPass,
        password: newData?.confirmPass,
      };
      await ApiPut("/change_password", body)
        .then((res) => {
          SuccessToast(res?.data?.message);
          setPassModal(false);
          setNewData({ currentPass: "", newPass: "", confirmPass: "" });
        })
        .catch((err) => ErrorToast(err?.message));
    } else {
      ErrorToast("Confirm Password Not Match");
    }
  };
  return (
    <>
      <Dropdown alignRight>
        <Dropdown.Toggle
          as={DropdownTopbarItemToggler}
          id="dropdown-toggle-my-cart"
        >
          <div className="btn btn-icon btn-clean btn-dropdown btn-lg mr-1">
            <img
              className="rounded"
              src="https://preview.keenthemes.com/metronic/theme/html/demo1/dist/assets/media/users/300_21.jpg"
              alt="name"
              style={{ height: "30px", width: "30px" }}
            />
            {/* <img
              src="https://preview.keenthemes.com/metronic/theme/html/demo1/dist/assets/media/users/300_21.jpg"
              alt="user"
              className="h-100 w-100 rounded"
            /> */}
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu
          className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround"
          style={{ width: "unset" }}
        >
          <ul className="navi navi-hover p-4">
            <li className="d-flex align-items-center mb-3 pb-5 border-bottom">
              <img
                src="https://preview.keenthemes.com/metronic/theme/html/demo1/dist/assets/media/users/300_21.jpg"
                alt="user"
                className="userDropdownImg"
              />
              <div className="ms-3">
                <h5 className="fw-bold">Admin</h5>
                <div className="">admin@gmail.com</div>
              </div>
            </li>
            <li className="navi-item" onClick={() => setPassModal(true)}>
              <a className="navi-link">
                <span className="navi-text">Change Password</span>
              </a>
            </li>
            <li className="navi-item" onClick={() => {switchLanguage('gj')
              userUtil.setLng('gj');
            }}>
              <a className="navi-link">
                <span className="navi-text">Gujarati</span>
              </a>
            </li>
            <li className="navi-item" onClick={() => {switchLanguage('en')
              userUtil.setLng('en');
            }}>
              <a className="navi-link">
                <span className="navi-text">English</span>
              </a>
            </li>
            <li className="navi-item" onClick={signOut}>
              <a className="navi-link">
                <span className="navi-text">Sign Out</span>
              </a>
            </li>
          </ul>
        </Dropdown.Menu>
      </Dropdown>
      <Modal
        show={passModal}
        onHide={() => setPassModal(false)}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <Form.Group md="12">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Current Password"
                label="currentPass"
                id="currentPass"
                required
                name="currentPass"
                onChange={handleChange}
                value={newData.currentPass}
              />
              <span className="errorInput">
                {/* {newData.currentPass?.length > 0 ? "" : errors["currentPass"]} */}
              </span>
            </Form.Group>
            <Form.Group md="12">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Title"
                label="newPass"
                id="title"
                required
                name="newPass"
                onChange={handleChange}
                value={newData.newPass}
              />
              <span className="errorInput">
                {/* {newData.newPass?.length > 0 ? "" : errors["newPass"]} */}
              </span>
            </Form.Group>
            <Form.Group md="12">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Title"
                label="confirmPass"
                id="confirmPass"
                required
                name="confirmPass"
                onChange={handleChange}
                value={newData.confirmPass}
              />
              <span className="errorInput">
                {/* {newData.confirmPass?.length > 0 ? "" : errors["confirmPass"]} */}
              </span>
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-color" onClick={handleSubmitPass}>
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
