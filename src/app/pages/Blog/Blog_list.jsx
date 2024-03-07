import React, { useEffect, useState } from "react";

import { lighten, makeStyles } from "@material-ui/core/styles";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import deleteIcon from "../../../media/icons/delete.png";
import { HiOutlineChevronRight } from "react-icons/hi";
import moment from "moment";
import {
  ApiDelete,
  ApiGet,
  ApiPost,
  ApiPut,
  Bucket,
  reftoken,
} from "../../../helpers/API/ApiData";
import SVG from "react-inlinesvg";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { toast, ToastContainer } from "react-toastify";
// import bookImg from "../../media/icons/bookImg.png";
import { NavLink, useHistory } from "react-router-dom";
import { Form, Modal } from "react-bootstrap";
import Blog_Edit from "./Blog_Edit";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
import { Dropdown } from "react-bootstrap";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Pagination from "@material-ui/lab/Pagination";
import NoDataTable from "../../../common/noDataTable";
// import Category_Edit from "./Category_Edit";

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

export default function Blog_list() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState("running");
  const [state2, setState2] = React.useState("0");
  const [data, setData] = React.useState([]);
  const [searchData, setsearchData] = React.useState([]);
  const [searching, setsearching] = useState("");
  const [modal, setModal] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [Id, setId] = React.useState();
  const [rowID, setRowID] = React.useState();
  const [rowID2, setRowID2] = React.useState();
  const [valll, setvalll] = React.useState("");
  const [picker, setpicker] = React.useState("");
  const [totalpage, settotalpage] = useState(0);
  const [pagesize, setpagesize] = useState(10);
  const [currentpage, setcurrentpage] = useState(1);
  const [block, setBlock] = useState(false);

  const sizePerPageOptionRenderer = ({ text, page, onSizePerPageChange }) => (
    <li key={text} role="presentation" className="dropdown-item">
      <a
        tabIndex="-1"
        role="menuitem"
        data-page={page}
        onMouseDown={(e) => {
          e.preventDefault();
          onSizePerPageChange(page);
        }}
        style={{ color: "red" }}
      >
        {text}
      </a>
    </li>
  );

  const options = {
    sizePerPageOptionRenderer,
  };

  const columns = [
    // {
    //   dataField: "id",
    //   text: "#",
    //   sort: true,
    // },

    {
      dataField: "image",
      // filter: textFilter(),
      text: "image",
      sort: true,
      formatter: (cell, row) => {
        return (
          <div className="symbol symbol-50 symbol-light mr-4">
            {/* {row?.URLs[0]?.includes(".mp4") ? (
              <img src="/media/users/mp4.webp" className="img-fluid" />
            ) : (
              <img src={Bucket + row?.URLs[0]} className="img-fluid" />
            )} */}
          </div>
        );
      },
    },
    {
      dataField: "title",
      // filter: textFilter(),
      text: "Title",
      sort: true,
      formatter: (cell, row) => {
        return (
          <>
            <div className="d-flex">
              <a className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                {row.title}
              </a>
            </div>
          </>
        );
      },
    },
    {
      dataField: "createdAt",
      text: "Created At",
      sort: true,
      formatter: (cell, row) => {
        //
        return moment(row.createdAt).format("DD-MM-YYYY, h:mm a");
      },
    },
    {
      dataField: "date",
      text: "view",
      formatter: (cell, row) => {
        return (
          <a
            class="btn btn-sm btn-primary font-weight-bolder"
            // onClick={() => click(row)}
            onClick={() =>
              history.push({
                pathname: "/Blog_View",
                state: row,
              })
            }
          >
            View
          </a>
        );
      },
    },

    {
      dataField: "action",
      text: "Action",
      headerStyle: {
        display: "flex",
        justifyContent: "center",
        // flexDirection: "column-reverse",
      },
      formatter: (cell, row) => {
        return (
          <div className="d-flex justify-content-center">
            <a
              title="Edit customer"
              className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
              onClick={() => click(row)}
            >
              <span className="svg-icon svg-icon-md svg-icon-primary">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/Write.svg"
                  )}
                />
              </span>
            </a>
            <> </>

            <a
              title="Delete customer"
              className="btn btn-icon btn-light btn-hover-danger btn-sm"
              // onClick={() => openDeleteCustomerDialog(row.id)}
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                  onClick={() => deleted(row._id)}
                />
              </span>
            </a>
          </div>
        );
      },
    },
  ];
  const handlesearch = (e) => {
    console.log(e.target.value);
    fetchData(currentpage, pagesize);
    setsearching(e.target.value);
  };

  const handleonchnagestatus = (e) => {
    // console.log(e.target.value);
    setState(e);
    fetchData(currentpage, pagesize);
  };
  const handleonchnagestatus2 = (e) => {
    console.log(e);
    setState2(e);
    fetchData(currentpage, pagesize);
  };

  const handleChange = (e, i) => {
    console.log(i);
    fetchData(i, pagesize);
  };

  const handleonchnagespagination = (e) => {
    fetchData(
      currentpage,
      parseInt(e.target.value)
    );
  };

  const apply = (event, picker) => {
    console.log(picker, event);
    fetchData(currentpage, pagesize);
    setpicker(picker);
    setvalll(
      `${moment(picker.startDate._d).format("DD-MM-YYYY")}-${moment(
        picker.endDate._d
      ).format("DD-MM-YYYY")}`
    );
    console.log(moment(picker.startDate._d).format("YYYY-MM-DD"));
  };
  const cancel = (event, picker) => {
    console.log(picker, event);
    fetchData(currentpage, pagesize);
    setpicker("");
    setvalll("");
    // console.log(moment(picker.startDate._d).format('YYYY-MM-DD'))
  };

  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];
  const click = (v) => {
    setOpen(!open);
    console.log(v);
    setRowID(v);
    // history.push({
    //   pathname: "/category_Edit",
    //   state: v._id,
    // });
    // setEdited(i);
  };

  const deleted = (v) => {
    console.log(v);
    setModal(!modal);
    setId(v);
  };
  const openModal = () => {
    setRowID();
    setOpen(!open);
  };
  const deleteTheory = (v) => {
    ApiDelete("/blog/" + v)
      .then((res) => {
        SuccessToast(res?.message);

        setData(
          data.filter(function(el) {
            return el._id != v;
          })
        );
        setsearchData(
          searchData.filter(function(el) {
            return el._id != v;
          })
        );
        // fetchData();
      })
      .catch(async (err) => {
        if (err.status == 410) {
          // let ext = await reftoken("ApiDelete", "/category/" + v);
          // console.log(ext);
          // SuccessToast(ext.data.message);

          // setData(
          //   data.filter(function(el) {
          //     return el._id != v;
          //   })
          // );
          // setsearchData(
          //   searchData.filter(function(el) {
          //     return el._id != v;
          //   })
          // );
          //   ErrorToast(err.message);
        } else {
          ErrorToast(err.message);
        }
      });
    setModal(!modal);
  };
  const fetchData = async (page, limit) => {
    const body = {
      page,
      limit
    };
   
    ApiPost("/post/get", body)
      .then((res) => {
        console.log("🚀 ~ file: Blog_list.jsx ~ line 430 ~ .then ~ res", res);
        console.log("/blog/get", res.data);
        setData(res.data?.data.post_count);
        settotalpage(res?.data?.data?.state?.page_limit);
        setcurrentpage(res?.data?.data?.state?.page);
        setpagesize(res?.data?.data?.state?.limit);
      })
      .catch(async (err) => {
        if (err.status == 410) {
          // let ext = await reftoken("ApiGet", "/blog");
          // console.log(ext);
          // setData(ext.data.data);
        } else {
          ErrorToast(err.message);
        }
      });
  };
  useEffect(() => {
    fetchData(currentpage, pagesize);
  }, []);
  const handleBlock = (e, id) => {
    setBlock(e.target.checked);
    blockUser(e.target.checked, id);
  };
  useEffect(() => {
    ApiGet("/dashboard/get_item")
      .then((res) => {
        console.log(
          "🚀 ~ file: Advertisement_list.jsx ~ line 457 ~ .then ~ res",
          res
        );
        setBlock(res?.data?.data[1]?.isStatus);
      })
      .catch(async (err) => {});
  }, [block]);

  const blockUser = (e) => {
    let body = {
      type: 1,
      isStatus: e,
    };
    console.log(
      "🚀 ~ file: Advertisement_list.jsx ~ line 460 ~ blockUser ~ body",
      body
    );
    ApiPut("/dashboard/put_item", body)
      .then((res) => {
        SuccessToast(res?.message);
      })
      .catch(async (err) => {
        ErrorToast(err.message);
      });
  };
  const openModal2 = () => {
    setRowID2();
    setOpen2(!open2);
  };
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
                  <a class="text-muted">Blog</a>
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
        <ToastContainer position="top-right" />
        <div class="card card-custom">
          <div class="card-header flex-wrap border-0 pt-6 pb-0">
            <div class="card-title">
              <h3 class="card-label">
                Blog List
                {/* <span class="d-block text-muted pt-2 font-size-sm">
                Set column width individually
              </span> */}
              </h3>
            </div>
            <div class="card-toolbar">
              <NavLink className="menu-link" to="/Blog_Category_List">
                <div class="card-toolbar pe-4">
                  <a class="btn btn-primary font-weight-bolder me-4PF">
                    View Category
                  </a>
                </div>
              </NavLink>
              <a
                class="btn btn-primary font-weight-bolder"
                onClick={() => openModal()}
              >
                Add Blog
              </a>
            </div>
          </div>

          <div className={`card h-80  d-flex  ${classes.card}`}>
            {/* Body */}
            <div className=" card-body">
              <div class="mb-5">
                <div class="row align-items-center">
                  <div class="col-lg-12 col-xl-12">
                    <div class="row align-items-center">
                      <div class="col-md-3 my-2 my-md-0">
                        <div class="input-icon">
                          <input
                            type="text"
                            class="form-control"
                            name="searchText"
                            placeholder="Search by name"
                            value={searching}
                            onChange={(e) => handlesearch(e)}
                            id="kt_datatable_search_query"
                          />
                          <span>
                            <i class="flaticon2-search-1 text-muted"></i>
                          </span>
                        </div>
                      </div>
                      {/* <div className="col-md-3 my-2 my-md-0 btn-prim">
                        <Dropdown onSelect={handleonchnagestatus}>
                          <Dropdown.Toggle id="dropdown-basic">
                            {state === "running" && "Running"}
                            {state === "upcoming" && "Upcoming"}
                            {state === "expired" && "Expired"}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item eventKey="running">
                              Running
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="upcoming">
                              Upcoming
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="expired">
                              Expired
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div> */}
                      <div className="col-md-3 my-2 my-md-0">
                        <DateRangePicker onApply={apply} onCancel={cancel}>
                          <input
                            type="text"
                            className="form-control"
                            value={valll}
                            placeholder="Select Date Range"
                          />
                        </DateRangePicker>
                      </div>
                      {/* <div className="col-md-3 my-2 my-md-0 btn-prim">
                        <Dropdown onSelect={handleonchnagestatus2}>
                          <Dropdown.Toggle id="dropdown-basic">
                            {state2 === "0" && "Banner"}
                            {state2 === "1" && "Post"}
                            {state2 === "2" && "Slider"}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item eventKey="0">Banner</Dropdown.Item>
                            <Dropdown.Item eventKey="1">Post</Dropdown.Item>
                            <Dropdown.Item eventKey="2">Slider</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                // remote
                keyField="id"
                data={data}
                columns={columns}
                noDataIndication={() => <NoDataTable />}
                // defaultSorted={uiHelpers.defaultSorted}
                // onTableChange={getHandlerTableChange(
                //   customersUIProps.setQueryParams
                // )}
                // pagination={paginationFactory(options)}
              ></BootstrapTable>
              <div class="d-flex justify-content-between  pt-10">
                <div className="my-2">
                  <Pagination
                    count={totalpage}
                    page={currentpage}
                    onChange={handleChange}
                    variant="outlined"
                    shape="rounded"
                    className="pagination_"
                  />
                </div>
                <div class="my-2 my-md-0">
                  <div class="d-flex align-items-center pagination-drpdown">
                    <select
                      class="form-control pagination-drpdown1 dropdownPage"
                      id="kt_datatable_search_status"
                      onChange={(e) => handleonchnagespagination(e)}
                      value={pagesize}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={30}>30</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>

              {open && (
                <Blog_Edit
                  open={open}
                  setOpen={setOpen}
                  rowID={rowID}
                  setRowID={setRowID}
                  fetchDatas={fetchData}
                  currentpage={currentpage}
                  pagesize={pagesize}
                  state={state}
                  searching={searching}
                  state2={state2}
                />
              )}
            </div>
          </div>
          <Modal
            show={modal}
            centered
            onHide={() => setModal(!modal)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                Delete Blog
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <span>
                Are you sure you want to delete this Blog permanently?
                {/* Are you sure to permanently delete this Blog ? */}
              </span>
            </Modal.Body>
            <Modal.Footer>
              <div>
                <button
                  type="button"
                  onClick={() => setModal(!modal)}
                  className="btn btn-light btn-elevate"
                >
                  Cancel
                </button>
                <> </>
                <button
                  type="button"
                  onClick={() => deleteTheory(Id)}
                  className="btn btn-primary btn-elevate"
                >
                  Delete
                </button>
              </div>
            </Modal.Footer>
          </Modal>

          <Modal
            show={open2}
            centered
            size="lg"
            onHide={() => setOpen2(!open2)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                {/* {update === true ? "Add" : "Edit"} Category{" "} */}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body className="overlay overlay-block cursor-default">
              <div className="form-group row">
                <div className="col-lg-12">
                  <Form.Group md="6">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type="text"
                      id="validID"
                      // className={errors["name"] && "chipInputRed"}
                      placeholder="Category Name"
                      label="Category Name"
                      required
                      name="name"
                      onChange={handleChange}
                      value={data?.name}
                    />
                    {/* <span className="errorInput">
                      {data.name?.length > 0 ? "" : errors["name"]}
                    </span> */}
                  </Form.Group>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={() => setOpen2(!open2)}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
              <> </>
              {/* {update === true ? ( */}
              <button
                type="submit"
                // onClick={handleSubmit}
                className="btn btn-primary btn-elevate"
                // disabled={button}
              >
                Submit
              </button>
              {/* ) : ( */}
              <button
                type="submit"
                // onClick={onUpdate}
                // disabled={button}
                className="btn btn-primary btn-elevate"
              >
                Update
              </button>
              {/* )} */}
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
}
