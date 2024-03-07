import React, { useState } from "react";
import { useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NoDataTable from "../../../common/noDataTable";
import { ApiDelete, ApiPost } from "../../../helpers/API/ApiData";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
import Pagination from "@material-ui/lab/Pagination";
import { useLanguage } from '../../../_metronic/i18n/LanguageContext';
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import Category_Edit from "./Expense_Edit";
import { Modal } from "react-bootstrap";



function Expense_List() {
  const { language } = useLanguage();
  const lan = require(`../../../_metronic/i18n/messages/${language}.json`);
  const history = useHistory();
  const [data, setData] = useState([]);
  const [totalpage, settotalpage] = useState(0);
  const [currentpage, setcurrentpage] = useState(1);
  const [pagesize, setpagesize] = useState(10);
  const [searching, setsearching] = useState("");
  const [rowID, setRowID] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState(true);
  const [modal, setModal] = React.useState(false);
  const [Id, setId] = React.useState();


  const columns = [
    {
      dataField: "name",
      text: lan.name,
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell ? cell : "-"}</div>;
      },
    },
    {
      dataField: "description",
      text: lan.description,
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell ? cell : "-"}</div>;
      },
    },
    
    {
      dataField: "type",
      text: lan.type,
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell==0?lan.credit:cell==1?lan.dabit:lan.other}</div>;

      },
    },
    {
      dataField: "action",
      text: lan.action,
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

  const click = (v) => {
    setOpen(!open);
    console.log(v._id);
    setRowID(v._id);
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
    ApiDelete("/expenselist/" + v)
      .then((res) => {
        SuccessToast(lan.successfull_deleted);
        setData(
          data.filter(function (el) {
            return el._id != v;
          })
        );
      })
      .catch(async (err) => {
          ErrorToast(err.message);
      });
    setModal(!modal);
  };
  const handleonchnagespagination = (e) => {
    setpagesize(e.target.value);
    fetchData(currentpage, parseInt(e.target.value), searching);
  };
  const onPaginationChange = (e, i) => {
    setcurrentpage(i);
    fetchData(i, pagesize, searching);
  };
  const handlesearch = (e) => {
    setsearching(e.target.value);
    fetchData(currentpage, pagesize, e.target.value);
  };
  const fetchData = async (page, limit, search) => {
    let body = {
      page,
      limit,
      search,
    };
    await ApiPost("/expenselist/get", body)
      .then((res) => {
        console.log("resData", res?.data);
        setData(res?.data?.data?.expenselist_count);
        settotalpage(res?.data?.data?.state?.page_limit);
      })
      .catch((err) => ErrorToast(err?.message));
  };
  console.log("data", data);
  useEffect(() => {
    fetchData(currentpage, pagesize, searching);
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <div className="title">
          <div className="fs-20px fw-bolder">{lan.sidelist_expense}</div>
          <div>
            <span
              role="button"
              onClick={() => history.push("/dashboard")}
              className="text-hover-info text-muted"
            >
              {lan.home}
            </span>{" "}
            -{" "}
            <span className="text-muted" role="button">
              {" "}
              {lan.sidelist_expense}
            </span>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column flex-column-fluid h-100" id="kt_content">
        <ToastContainer position="top-right" />
        <div class="card card-custom">
        <div class="card-header flex-wrap border-0 pt-6 pb-0">
            <div class="card-title">
              <h3 class="card-label">
              {lan.sidelist_expense} {lan.list}
              </h3>
            </div>
            <div class="card-toolbar">
              <a
                class="btn btn-primary font-weight-bolder"
                onClick={() => openModal()}
              >
                {lan.add} {lan.sidelist_expense}

              </a>
            </div>
          </div>
          <div className="card-body mb-5">
            <div class="row align-items-center">
              <div class="col-lg-12 col-xl-12">
                <div class="row align-items-center">
                  <div class="col-md-3 my-2">
                    <div class="input-icon">
                      <input
                        type="text"
                        class="form-control bg-light"
                        name="searchText"
                        placeholder={lan.Search_by_Name_or_Email}
                        value={searching}
                        onChange={(e) => handlesearch(e)}
                        id="kt_datatable_search_query"
                      />
                      <span>
                        <i class="flaticon2-search-1 text-muted"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <BootstrapTable
              wrapperClasses="table-responsive"
              bordered={false}
              rowClasses="userRow"
              classes="table table-head-custom table-vertical-center overflow-hidden"
              bootstrap4
              keyField="_id"
              data={data}
              columns={columns}
              noDataIndication={() => <NoDataTable />}
            />
            <div class="d-flex justify-content-between  pt-10">
              <div className="my-2">
                <Pagination
                  count={totalpage}
                  page={currentpage}
                  onChange={onPaginationChange}
                  variant="outlined"
                  shape="rounded"
                  className="pagination_"
                />
              </div>
              <div class="my-2">
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
                {lan.delete} {lan.sidelist_expense}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <span>
                {lan.are_you_sure} {lan.sidelist_expense}?
              </span>
            </Modal.Body>
            <Modal.Footer>
              <div>
                <button
                  type="button"
                  onClick={() => setModal(!modal)}
                  className="btn btn-light btn-elevate"
                >
                  {lan.cancel}
                </button>
                <> </>
                <button
                  type="button"
                  onClick={() => deleteTheory(Id)}
                  className="btn btn-primary btn-elevate"
                >
                  {lan.delete}
                </button>
              </div>
            </Modal.Footer>
          </Modal>
      </div>
    </>
  );
}

export default Expense_List;
