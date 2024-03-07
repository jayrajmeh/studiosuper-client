import React, { useMemo, useEffect, useState } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { useHistory } from "react-router-dom";
import { useHtmlClassService } from "../../../layout";
import { ApiGet } from "../../../../helpers/API/ApiData";
import { ErrorToast, SuccessToast } from "../../../../helpers/Toast";
import { ToastContainer } from "react-toastify";

export function MixedWidget1({ className }) {
  const history = useHistory();
  const [accountdata, setaccountdata] = useState({});

  const fetchData = async () => {
    await ApiGet("/count")
      .then((res) => {
        console.log("resasd", res);
        setaccountdata(res?.data?.data);
      })
      .catch(async (err) => {
        ErrorToast(err?.message);
      });
  };
  console.log("accountdata", accountdata);
  useEffect(() => {
    // fetchData();
  }, []);
  return (
    <>
      {/* <BreadCrumbs items={dashbord} /> */}
      <div className="d-flex justify-content-between mb-4">
        <div className="title">
          <div className="fs-20px fw-bolder">Dashboard</div>
          <div>
            <span
              role="button"
              onClick={() => history.push("/dashboard")}
              className="text-hover-info text-muted"
            >
              Home
            </span>{" "}
            -{" "}
            <span className="text-muted" role="button">
              {" "}
              Dashboard
            </span>
          </div>
        </div>
      </div>

      {/* <div className="row">
        <div className={` ${className} col-xxl-4 col-lg-6 col-md-8 col-sm-12`}>
          <div className="card card-custom bg-gray-100">
            <div className="card-header bg-danger border-0 py-5">
              <div className="card-toolbar"></div>
            </div>
            <div className="card-body p-0 position-relative overflow-hidden">
              <div
                id="kt_mixed_widget_1_chart"
                className="card-rounded-bottom bg-danger"
                style={{
                  height: "200px",
                }}
              ></div>

              <div className="card-spacer mt-n25">
                <div className="row m-0">
                  <div className="col bg-light-primary px-6 py-8 rounded-xl mb-7">
                    <span className="svg-icon svg-icon-3x svg-icon-primary d-block my-2">
                      <a className="text-primary font-weight-bold font-size-h6 mt-2">
                        {accountdata.video || 0}
                      </a>
                    </span>
                    <a
                      className="text-primary font-weight-bold font-size-h6 mt-2"
                      onClick={() => history.push("/video_list")}
                    >
                      Videos
                    </a>
                  </div>
                  <div className="col bg-light-success px-6 py-8 rounded-xl ms-7 mb-7">
                    <span className="svg-icon svg-icon-3x svg-icon-success d-block my-2">
                      <a className="text-success font-weight-bold font-size-h6 mt-2">
                        {accountdata.video_playlist || 0}
                      </a>
                    </span>
                    <a
                      className="text-success font-weight-bold font-size-h6 mt-2"
                      onClick={() => history.push("/video_playlist")}
                    >
                      Video Playlist
                    </a>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col bg-light-danger px-6 py-8 rounded-xl">
                    <span className="svg-icon svg-icon-3x svg-icon-danger d-block my-2">
                      <a className="text-danger font-weight-bold font-size-h6 mt-2">
                        {accountdata.user || 0}
                      </a>
                    </span>
                    <a
                      className="text-danger font-weight-bold font-size-h6 mt-2"
                      onClick={() => history.push("/user_List")}
                    >
                      Users
                    </a>
                  </div>
                  <div className="col bg-light-warning px-6 py-8 rounded-xl ms-7">
                    <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
                      <a className="text-warning font-weight-bold font-size-h6 mt-2">
                        {accountdata.plan || 0}
                      </a>
                    </span>
                    <a
                      className="text-warning font-weight-bold font-size-h6 mt-2"
                      onClick={() => history.push("/plan")}
                    >
                      Plans
                    </a>
                  </div>
                </div>
              </div>

              <div className="resize-triggers">
                <div className="expand-trigger">
                  <div style={{ width: "411px", height: "461px" }} />
                </div>
                <div className="contract-trigger" />
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}
