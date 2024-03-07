import React, { useEffect, useState } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap/dist/css/bootstrap.css";
import { lighten, makeStyles } from "@material-ui/core/styles";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import deleteIcon from "../../../media/icons/delete.png";
import moment from "moment";
import { HiOutlineChevronRight } from "react-icons/hi";
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
import { useHistory } from "react-router-dom";
import { Dropdown, Modal } from "react-bootstrap";
import Category_Edit from "../School/School_Edit";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
import { log } from "async";
import NoDataTable from "../../../common/noDataTable";
import Pagination from "@material-ui/lab/Pagination";

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

export default function Category_List() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [searchData, setsearchData] = React.useState([]);
  const [searching, setsearching] = useState("");
  const [modal, setModal] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [valll, setvalll] = React.useState("");
  const [picker, setpicker] = React.useState("");

  const [Id, setId] = React.useState();
  const [rowID, setRowID] = React.useState();
  const [block, setBlock] = useState(!block);
  const [currentpage, setcurrentpage] = useState(1);
  const [pagesize, setpagesize] = useState(10);
  const [totalpage, settotalpage] = useState(0);

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
      dataField: "name",
      // filter: textFilter(),
      text: "Category name",
      sort: true,
      style: {
        fontWeight: "bold",
      },
      formatter: (cell, row) => {
        return <div className="cursor-pointer">{row.name}</div>;
      },
    },
    // {
    //   dataField: "name",
    //   text: "Category name",
    //   sort: true,

    //   formatter: (cell, row) => {
    //     return (
    //       <div className="d-flex">
    //         <img src={Bucket + row.image} width="50px" />
    //       </div>
    //     );
    //   },
    // },
    {
      dataField: "createdAt",
      text: "Created At",
      sort: true,
      formatter: (cell, row) => {
        return moment(row.createdAt).format("DD-MM-YYYY, h:mm a");
      },
    },

    {
      dataField: "totalUsed",
      text: "No. Of Post",
      sort: true,
      formatter: (cell, row) => {
        return row?.totalUsed;
      },
    },
    {
      dataField: "sub_category",
      text: "No. Of Subcategory",
      sort: true,
      formatter: (cell, row) => {
        return row?.sub_category;
      },
    },
    {
      dataField: "isCategoryActive",
      text: "Status",
      formatter: (cell, row) => {
        return (
          <div className="d-flex">
            {" "}
            <div class="float-right">
              <div
                className="px-1 d-flex w_100_7 mx_10 j_center"
                style={{ width: "80%" }}
              >
                <label className="switch">
                  <input
                    type="checkbox"
                    id="togBtn"
                    onChange={(e) => onUpdate(e, row._id)}
                    // name="isFree"
                    checked={row?.isCategoryActive}
                  // onClick={(e) => onUpdate(e, row._id)}
                  />
                  <div className="slider round">
                    <span className="off"></span>
                    <span className="on"></span>
                  </div>
                </label>
              </div>
            </div>
          </div>
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

  const handleBlock = (e, id) => {
    console.log(id, "id");
    console.log(data);
    // setBlock(e)
    console.log("e", e.target.checked);
  };
  const onUpdate = async (e, id) => {
    console.log(e.target.checked);
    console.log(id);
    try {
      ApiGet(
        `/category/action?categoryId=${id}&isCategoryActive=${e.target.checked}`
      )
        .then((res) => {
          console.log("ressssssssssss", res);
          SuccessToast(res?.data?.message);
          fetchData(currentpage, pagesize);
        })
        .catch(async (err) => {
          console.log(err);
          if (err.status == 410) {
            // let ext = await reftoken(
            //   "ApiGet",
            //   `/category/action?categoryId=${id}&isCategoryActive=${e.target.checked}`
            // );
            // SuccessToast(ext.data.message);
            fetchData(currentpage, pagesize);
          } else {
            ErrorToast(err.message);
          }
        });
    } catch (error) { }
    // }
  };
  const handlesearch = (e) => {
    setsearching(e.target.value);
    fetchData(1, pagesize, state, e.target.value);
  };
  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];
  const click = (v) => {
    setOpen(!open);
    console.log(v._id);
    setRowID(v._id);
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
    ApiDelete("/category/" + v)
      .then((res) => {
        SuccessToast(res?.message);

        setData(
          data.filter(function (el) {
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
          //   data.filter(function (el) {
          //     return el._id != v;
          //   })
          // );
          // setsearchData(
          //   searchData.filter(function (el) {
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
  const apply = (event, picker) => {
    console.log(picker, event);
    fetchData(currentpage, pagesize, state, searching, picker);
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
    fetchData(currentpage, pagesize, state, searching, "cancel");
    setpicker("");
    setvalll("");
    // console.log(moment(picker.startDate._d).format('YYYY-MM-DD'))
  };

  const fetchData = async (s, p) => {
    let body = {
      limit: p,
      page: s,
      type:0
    };
   

    ApiPost("/category/get", body)
      .then((res) => {
        console.log(res);
        setData(res.data.data.category_count);
        settotalpage(res?.data.data.state.page_limit);
        setcurrentpage(res?.data.data.state.page);
        setpagesize(res?.data.data.state.limit);
      })
      .catch(async (err) => {
        // if (err.status == 410) {
        //   let ext = await reftoken("ApiPost", "/category_pagination");
        //   console.log(ext);
        //   setData(ext.data.data.category_data);
        //   //   ErrorToast(err.message);
        // } else {
        ErrorToast(err?.message);
        // }
      });
  };
  const handleChange = (e, i) => {
    console.log(i);
    fetchData(i, pagesize);
  };
  const handleonchnagespagination = (e) => {
    fetchData(1, parseInt(e.target.value));
  };
  useEffect(() => {
    fetchData(currentpage, pagesize);
  }, []);
  const handleonchnagestatus = (e) => {
    // console.log(e.target.value);
    if (e == "Active") {
      setState(true);
      fetchData(currentpage, pagesize);
    } else if (e == "Inactive") {
      setState(false);
      fetchData(currentpage, pagesize);
    }
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
                  <a class="text-muted">Category</a>
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
                Category List
                {/* <span class="d-block text-muted pt-2 font-size-sm">
                Set column width individually
              </span> */}
              </h3>
            </div>
            <div class="card-toolbar">
              <a
                class="btn btn-primary font-weight-bolder"
                onClick={() => openModal()}
              >
                Add Category
              </a>
            </div>
          </div>

          <div className={`card h-80  d-flex  ${classes.card}`}>
            {/* Body */}
            <div className=" card-body">
              <div class="mb-5">
                <div class="row align-items-center">
                  <div class="col-lg-9 col-xl-8">
                    <div class="row align-items-center">
                      <div class="col-md-4 my-2 my-md-0">
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
                      <div className="col-md-4 my-2 my-md-0">
                        <Dropdown onSelect={handleonchnagestatus}>
                          <Dropdown.Toggle id="dropdown-basic">
                            {state === true ? "Active" : "Inactive"}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item eventKey="Active">
                              Active
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="Inactive">
                              Inactive
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      <div className="col-md-4 my-2 my-md-0">
                        <DateRangePicker onApply={apply} onCancel={cancel}>
                          {/* <a
                
                class="btn btn-primary font-weight-bolder"
                // onClick={() => openModal()}
              >
                Date Range 
              </a> */}
                          <input
                            type="text"
                            className="form-control"
                            value={valll}
                            placeholder="Select Date Range"
                          />
                        </DateRangePicker>
                      </div>

                      {/* <div class="col-md-4 my-2 my-md-0">
                      <div class="d-flex align-items-center">
                        <label class="mr-3 mb-0 d-none d-md-block">
                          Status:
                        </label>
                        <select
                          class="form-control"
                          id="kt_datatable_search_status"
                        >
                          <option value="">All</option>
                          <option value="1">Pending</option>
                          <option value="2">Delivered</option>
                          <option value="3">Canceled</option>
                          <option value="4">Success</option>
                          <option value="5">Info</option>
                          <option value="6">Danger</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-4 my-2 my-md-0">
                      <div class="d-flex align-items-center">
                        <label class="mr-3 mb-0 d-none d-md-block">Type:</label>
                        <select
                          class="form-control"
                          id="kt_datatable_search_type"
                        >
                          <option value="">All</option>
                          <option value="1">Online</option>
                          <option value="2">Retail</option>
                          <option value="3">Direct</option>
                        </select>
                      </div>
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
                <Category_Edit
                  open={open}
                  setOpen={setOpen}
                  rowID={rowID}
                  setRowID={setRowID}
                  fetchDatas={fetchData}
                  currentpage={currentpage}
                  pagesize={pagesize}
                  state={state}
                  searching={searching}
                />
              )}
            </div>
          </div>
          <Modal
            centered
            show={modal}
            onHide={() => setModal(!modal)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                Delete Category
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <span>
                Are you sure you want to delete this Category permanently?
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
        </div>
      </div>
    </>
  );
}
