import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import {
  ApiPostNoAuth,
} from "../../../../helpers/API/ApiData";
import * as userUtil from "../../../../utils/user.util";
import * as authUtil from "../../../../utils/auth.util";
import { ErrorToast, SuccessToast } from "../../../../helpers/Toast";

const initialValues = {
  email: "",
  password: "",
};

function Login(props) {
  const { intl } = props;
  const History = useHistory();
  const [loading, setLoading] = useState(false);
  const [button, setbutton] = useState(false);
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      setbutton(true);
      setTimeout(() => {
        var accountData1 = {
          email: values.email,
          password: values.password,
        };
        ApiPostNoAuth("user/login", accountData1)
          .then((res) => {
            console.log("res", res);
            if (res.data.status === 200) {
              SuccessToast(res && res.data && res.data.message);
              let rok = res.data.data.role;
              userUtil.setUserInfo(res.data.data);
              authUtil.setToken(res.data.data.token);
              // authUtil.setRToken(res.data.data.refresh_token);
              console.log(res.data.data.token);
              disableLoading();
              props.login({
                token: res.data.data.token,
                user: accountData1,
              });
              History.push("/dashboard");
            } else if (res.data.status === 401) {
              console.log(res);
              ErrorToast(res.data.message);
              window.location.reload();
            }
          })
          .catch((err) => {
            console.log(err);
            ErrorToast(err.message);
            setbutton(false);
            disableLoading();
          });
      }, 1000);
    },
  });

  return (
    <div className="login-form login-signin" id="kt_login_signin_form">
      <ToastContainer />
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">
          <FormattedMessage id="AUTH.LOGIN.TITLE" />
        </h3>
        <p className="text-muted font-weight-bold">
          Enter your email and password
        </p>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="form fv-plugins-bootstrap fv-plugins-framework"
      >
        {formik.status ? (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        ) : null}

        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Email"
            type="email"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "email"
            )}`}
            name="email"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.email}</div>
            </div>
          ) : null}
        </div>
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Password"
            type="password"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "password"
            )}`}
            name="password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.password}</div>
            </div>
          ) : null}
        </div>
        <div className="form-group d-flex flex-wrap justify-content-center align-items-center">
          <Link
            to="/auth/forgot-password"
            className="text-dark-50 text-hover-primary my-3 mr-2"
            id="kt_login_forgot"
          >
            {/* <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" /> */}
          </Link>
          <div style={{ display: "grid" }}>
            <button
              id="kt_login_signin_submit"
              type="submit"
              disabled={button}
              className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
            >
              <span>Login</span>
              {loading && <span className="ml-3 spinner spinner-white"></span>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Login));
