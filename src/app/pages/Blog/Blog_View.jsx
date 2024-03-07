import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Bucket } from "../../../helpers/API/ApiData";
import parse from "html-react-parser";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    boxShadow: "none",
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  card: {
    height: "100%",

    backgroundColor: "#fff",
    border: "none",
    borderRadius: "10px",
  },
}));

const Blog_View = () => {
  const classes = useStyles();
  const history = useHistory();
  const data = history.location.state;
  console.log(
    "🚀 ~ file: Blog_View.jsx ~ line 41 ~ data",
    data?.html_code.replace(/!important/g, "")
  );
  return (
    <>
      <div
        class="subheader py-2 py-lg-6  subheader-transparent "
        id="kt_subheader"
      >
        <div class=" container-fluid  d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
          <div class="d-flex align-items-center flex-wrap mr-1">
            <div class="d-flex align-items-baseline flex-wrap mr-5">
              <ul class="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                <li class="breadcrumb-item">
                  <a
                    class="text-muted"
                    onClick={() => history.push("/dashboard")}
                  >
                    Home
                  </a>
                </li>
                <li class="breadcrumb-item">
                  <a
                    class="text-muted"
                    onClick={() => history.push("/Blog_List")}
                  >
                    Blog List
                  </a>
                </li>
                <li class="breadcrumb-item">
                  <a class="text-muted">Blog View</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        class="content  d-flex flex-column flex-column-fluid  h-100"
        id="kt_content"
      >
        <div class="card card-custom">
          <div className={`card h-80  d-flex  ${classes.card}`}>
            <div className=" card-body">
              <div className="text-center">
                <h1
                  style={{
                    fontSize: "clamp(16px, calc(1rem + 3vw), 52px)",
                    fontWeight: "800",
                    letterSpacing: "-0.04rem",
                    lineHeight: "4.85rem",
                    marginBottom: "50px",
                  }}
                >
                  {data?.title}
                </h1>
                {data?.URLs[0]?.includes(".mp4") ? (
                  <video
                    src={Bucket + data?.URLs[0]}
                    controls
                    style={{ width: "100%" }}
                  ></video>
                ) : (
                  <img
                    src={Bucket + data?.URLs[0]}
                    className="img-fluid mt-5"
                    style={{ width: "100%" }}
                  />
                )}
              </div>
              <div>{parse(data?.html_code.replace(/!important/g, ""))}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog_View;
