import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
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
import { ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Form as forms, Modal } from "react-bootstrap";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Pagination from "@material-ui/lab/Pagination";
import NoDataTable from "../../../common/noDataTable";
import { DatePicker, Form, Input, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
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

export default function Blog_Category_List() {
  const classes = useStyles();
  const history = useHistory();
  const [data, setData] = React.useState([]);
  const [searchData, setsearchData] = React.useState([]);
  const [searching, setsearching] = useState("");
  const [modal, setModal] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [Id, setId] = React.useState();
  const [rowID, setRowID] = React.useState({});
  const [planmodel, setPlanModel] = React.useState(false);
  const [benifit, setBenifit] = useState([]);
  const [points, setPoints] = useState([]);
  const [editBenifit, setEditBenifit] = useState([]);

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

  const columns = [
    {
      dataField: "name",
      // filter: textFilter(),
      text: "category",
      sort: true,
      formatter: (cell, row) => {
        return (
          <>
            <div className="symbol symbol-50 symbol-light mr-4">
              <a className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg ms-2">
                {row?.name}
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
        return moment(row.createdAt).format("DD-MM-YYYY, h:mm a");
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
              onClick={() => updateStorePoint(row)}
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
              onClick={() => openModel(row?._id)}
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                />
              </span>
            </a>
          </div>
        );
      },
    },
  ];
  const openModel = (v) => {
    setModal(!modal);
    setId(v);
  };
  console.log("v", Id);
  const addNewBenifit = () => {
    setPlanModel(!planmodel);
    setRowID("");
  };
  const removeBenifite = async (v) => {
    ApiDelete("/category/" + v)
      .then(async (res) => {
        setId();
        setModal(!modal);
        console.log(res);
        await showBenifit();
        SuccessToast(res?.message);
      })
      .catch(async (err) => {
        if (err?.status == 410) {
          let ext = await reftoken("ApiDelete", "/category/" + v);
          console.log(ext);
          SuccessToast(ext?.data?.message);
          showBenifit();
        } else {
          ErrorToast(err?.message);
        }
        setModal(!modal);
        setId();
      });
  };
  const storePoint = (e) => {
    let { name, value } = e.target;
    setPoints([...points, value]);
  };
  const updateStorePoint = (e) => {
    setPlanModel(!planmodel);
    setRowID(e);
  };
  console.log("rowID", rowID);
  const updateSubject = (e) => {
    console.log("eeeeeeeee", e?.target?.value);
    const { name, value } = e?.target;
    setRowID({
      ...rowID,
      [name]: value,
    });
  };
  const showBenifit = async () => {
    await ApiGet("/category?blog=true")
      .then((res) => {
        console.log(res?.data?.data);
        setBenifit(res?.data?.data);
        setEditBenifit(res?.data?.data);
      })
      .catch(async (err) => {
        if (err?.status == 502) {
          let ext = await reftoken("ApiGet", "/subject");
          console.log(ext);
          setData(ext?.data?.data);
          // setImage([ext.data.data.image]);
        } else {
          //   ErrorToast(err.message);
        }
      });
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };
  const onFinish = (values) => {
    console.log("Received values of form:", values);
    const dummy = values?.points?.map((e) => {
      return { name: e, categoryType: 2 };
    });
    let body = dummy;
    console.log("🚀 ~ file: Plans.jsx ~ line 287 ~ addbenifite ~ body", body);

    ApiPost("/category/add_blog", body)
      .then((res) => {
        console.log(res?.data);
        // SuccessToast(res?.message);
        setPlanModel(!planmodel);
        showBenifit();
        setPoints("");
      })
      .catch(async (err) => {
        ErrorToast(err?.message);
      });
  };
  const onUpdate = async (e) => {
    const body = {
      name: rowID?.name,
      id: rowID?._id,
    };
    try {
      console.log(body);
      ApiPut("/category", body)
        .then((res) => {
          SuccessToast(res?.message);
          showBenifit();
          setPlanModel(!planmodel);
        })
        .catch(async (err) => {
          if (err?.status == 410) {
            let ext = await reftoken("ApiPut", "/category", body);
            SuccessToast(ext.data.message);
            showBenifit();
            showBenifit();
            setPlanModel(!planmodel);
          } else {
            ErrorToast(err?.message);
          }
        });
    } catch (error) {}
  };
  const click2 = (v) => {
    setPlanModel(!planmodel);
    console.log(v);
    ApiGet("/subject")
      .then((res) => {
        console.log(res?.data?.data);
        setEditBenifit(res?.data?.data);
      })
      .catch(async (err) => {
        if (err?.status == 502) {
          let ext = await reftoken("ApiGet", "/subject");
          console.log(ext);
          setData(ext?.data?.data);
        } else {
        }
      });
  };

  useEffect(() => {
    showBenifit();
  }, []);

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
                  <a class="text-muted">Blog Category List</a>
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
          <div class="">
            {/* <div class="card-title">
                            <h3 class="card-label">
                                Blog Category List
                            </h3>
                        </div> */}
            {/* <div class="card-toolbar">
                            <a
                                
                                class="btn btn-primary font-weight-bolder"
                                onClick={() => openModal()}
                            >
                                Add Featured Categories
                            </a>
                        </div> */}
          </div>
          <div className={`card h-80  d-flex  ${classes.card}`}>
            {/* Body */}
            <div className=" card-body">
              <div class="mb-5">
                <div class="row align-items-center">
                  <div class="d-flex justify-content-between">
                    <div class="row align-items-center">
                      <div class="card-title">
                        <h3 class="card-label">Blog Category List</h3>
                      </div>
                    </div>
                    <div class="card-toolbar pb-4">
                      <a
                        class="btn btn-primary font-weight-bolder btn-sm"
                        onClick={() => addNewBenifit()}
                      >
                        Add
                      </a>
                      {/* <a

                                                class="btn btn-primary font-weight-bolder btn-sm ms-2"
                                                onClick={() => click2()}
                                            >
                                                Edit
                                            </a> */}
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
                data={benifit}
                columns={columns}
                noDataIndication={() => <NoDataTable />}
              ></BootstrapTable>
            </div>
          </div>
          <Modal
            show={planmodel}
            centered
            onHide={() => setPlanModel(!planmodel)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                Add Category
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form
                name="dynamic_form_item"
                {...formItemLayoutWithOutLabel}
                onFinish={onFinish}
                autoComplete="off"
                initialValues={rowID === "" ? { points: [""] } : ""}
              >
                <Form.List name="points" rules={[]}>
                  {(fields, { add, remove }, { errors }) => {
                    return (
                      <>
                        {fields.map((field, index) => (
                          <>
                            {rowID === "" && (
                              <Form.Item
                                {...(index === 0
                                  ? formItemLayout
                                  : formItemLayoutWithOutLabel)}
                                required={false}
                              >
                                <Form.Item
                                  {...field}
                                  validateTrigger={["onChange", "onBlur"]}
                                  rules={[
                                    {
                                      required: true,
                                      whitespace: true,
                                      message: "Please Enter Category",
                                    },
                                  ]}
                                  noStyle
                                >
                                  <forms.Control
                                    style={{ width: "100%", margin: "0" }}
                                    type="text"
                                    placeholder="Enter Category"
                                    label="Enter Title"
                                    id="validationCustom03"
                                    required
                                    onChange={storePoint}
                                    value={points}
                                  />
                                </Form.Item>

                                {fields.length > 0 ? (
                                  <MinusCircleOutlined
                                    className="dynamic-delete-button"
                                    onClick={() => remove(field.name)}
                                  />
                                ) : null}
                              </Form.Item>
                            )}
                          </>
                        ))}
                        <Form.Item>
                          {rowID === "" ? (
                            <button
                              type="dashed"
                              className="btn btn-primary btn-elevate btn-sm float-end"
                              onClick={() => add()}
                            >
                              Add field
                            </button>
                          ) : (
                            <div className="col-12 mb-2 d-flex align-items-center">
                              <forms.Control
                                type="text"
                                placeholder="Enter Category"
                                label="Enter Title"
                                // id="validationCustom03"
                                name="name"
                                required
                                onChange={updateSubject}
                                value={rowID?.name}
                              />
                            </div>
                          )}
                          <Form.ErrorList errors={errors} />
                        </Form.Item>
                      </>
                    );
                  }}
                </Form.List>
                <>
                  <div className="d-flex justify-content-end">
                    {rowID === "" ? (
                      <button
                        type="submit"
                        // onClick={() => addbenifite()}
                        className="btn btn-primary btn-elevate btn-sm float-end me-2 float-right"
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        type="submit"
                        onClick={onUpdate}
                        className="btn btn-primary btn-elevate btn-sm me-2 float-end"
                      >
                        Update
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setPlanModel(!planmodel)}
                      className="btn btn-light btn-elevate btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              </Form>
            </Modal.Body>
            <div></div>
          </Modal>

          <Modal
            show={modal}
            centered
            onHide={() => setModal(!modal)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                Delete cetegory
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-lg-12 my-2">
                  <forms.Group md="6">
                    <forms.Label>
                      Are You Sure Detete This cetegory?
                    </forms.Label>
                  </forms.Group>
                </div>
              </div>
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
                  onClick={() => removeBenifite(Id)}
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
