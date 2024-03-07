import React, { useEffect, useState } from "react";
import {
  ApiGet,
  ApiPost,
  ApiPut,
  Bucket,
  reftoken,
} from "../../../helpers/API/ApiData";
import { makeStyles } from "@material-ui/styles";

import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Form, Modal } from "react-bootstrap";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
const useStyles = makeStyles((theme) => ({
  card: {
    height: "100%",

    backgroundColor: "#fff",
    border: "none",
    borderRadius: "10px",
  },
}));
const SubCategory_Edit = ({ rowID, setRowID, open, setOpen, fetchDatas, currentpage, pagesize, state, searching }) => {
  console.log(rowID);
  const history = useHistory();
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [update, getUpdate] = useState(true);
  const [errors, setError] = useState({});
  const [videos, setVideo] = useState([]);
  const [mainCategory, setMainCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [button, setbutton] = useState(false);
  const [validated, setValidated] = useState(false);

  const validateForm = () => {
    console.log("valid");
    let errors = {};
    let formIsValid = true;

    if (!data.parentCategory) {
      console.log("a");
      formIsValid = false;
      document.getElementById("validationCustom04").style.border =
        "2px solid #f64e60";
      errors["categoryId"] = "Please Enter Category";
    }
    if (!data.name) {
      console.log("a");
      formIsValid = false;
      document.getElementById("validationCustom03").style.border =
        "2px solid #f64e60";
      errors["name"] = "Please Enter Sub Category Name";
    }
    setError(errors);

    return formIsValid;
  };

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    console.log(name, value);
    if (name === "categoryId") {
      if (value.length > 0) {
        document.getElementById("validationCustom04").style.border =
          "2px solid #1BC5BD";
        // console.log("sssss");
      } else {
        document.getElementById("validationCustom04").style.border =
          "2px solid #f64e60";
        // console.log("rrr");
      }
    }
    if (name === "name") {
      if (value.length > 0) {
        document.getElementById("validationCustom03").style.border =
          "2px solid #1BC5BD";
        // console.log("sssss");
      } else {
        document.getElementById("validationCustom03").style.border =
          "2px solid #f64e60";
        // console.log("rrr");
      }
    }
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  console.log(videos, data);

  const fetchData = (v) => {
    console.log(v);
    ApiGet("/category/" + v)
      .then((res) => {
        console.log(res.data.data);
        // setVideo([res.data.data.video]);
        setData(res.data.data);
      })
      .catch(async (err) => {
        if (err.status == 410) {
          // let ext = await reftoken("ApiGet", "/sub_category/" + v);
          // console.log(ext);
          // setData(ext.data.data[0]);
        } else {
          //   ErrorToast(err.message);
        }
      });
    getUpdate(false);
  };
  // console.log(data.name);

  const onUpdate = async () => {
    if (validateForm()) {
      enableLoading();
      setbutton(true);

      try {
        const body = {
          id: data._id,
          name: data.name,
          type: 1,
          parentCategory:data.parentCategory
        };
        console.log(body);
        ApiPut("/category", body)
        // const body = {
          
        //   name: data.name,
        // };
        // console.log(body);
        // ApiPut("/sub_category", body)
          .then((res) => {
            SuccessToast(res?.message);
            fetchDatas(currentpage, pagesize);
            disableLoading();
            setOpen(!open);
          })
          .catch(async (err) => {
            console.log(err);
            if (err.status == 410) {
              // let ext = await reftoken("ApiPut", "/sub_category", body);
              // SuccessToast(ext.data.message);
              // fetchDatas(currentpage, pagesize, state, searching);
              // disableLoading();
              // setOpen(!open);
              // setbutton(false);
            } else {
              ErrorToast(err.message);
              disableLoading();
              setbutton(false);
            }
          });
      } catch (error) { }
    }
  };
  const handleSubmit = () => {
    if (validateForm()) {
      enableLoading();
      setbutton(true);

      try {
        const body = {
          name: data.name,
          type: 1,
          parentCategory:data.parentCategory
        };
        console.log(body);
        ApiPost("/category", body)
          .then((res) => {
            SuccessToast(res?.message);
            fetchDatas(currentpage, pagesize);
            disableLoading();
            setOpen(!open);
          })
          .catch(async (err) => {
            if (err.status == 410) {
              // let ext = await reftoken("ApiPost", "/sub_category", body);
              // SuccessToast(ext.data.message);
              // fetchDatas(currentpage, pagesize, state, searching);
              // disableLoading();
              // setOpen(!open);
              // setbutton(false);
            } else {
              ErrorToast(err.message);
              disableLoading();
            }
          });
      } catch (error) { }
    }
  };
  useEffect(() => {
    console.log(rowID);
    if (rowID) {
      getUpdate(false);
      fetchData(rowID);

    }
  }, []);
  useEffect(() => {
    let body = {
      limit: 1000,
      page: 1,
      type:0
    };
    
    ApiPost("/category/get", body)
      .then((res) => {
        console.log(res.data.data);
        setMainCategory(res.data.data.category_count);

      })
      .catch(async (err) => {
        if (err.status == 410) {
          // let ext = await reftoken("ApiGet", "/category");
          // console.log(ext);
          // setMainCategory(ext.data.data.menu_categories);
        } else {
          ErrorToast(err.message);
        }
      });
  }, []);
  const clear = () => {
    setOpen(!open);
    setRowID("");
    
  };
  return (
    <>
      <Modal
        show={open}
        centered
        size="lg"
        onHide={() => clear()}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            {update === true ? "Add" : "Edit"} Sub Category{" "}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="overlay overlay-block cursor-default">
          {/* <div className="">hii</div> */}
          <div className="form-group row">
            <div className="col lg-12">
              <Form.Group md="6">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  custom
                  id="validationCustom04"
                  required
                  className="form-control"
                  name="parentCategory"
                  value={data?.parentCategory}
                  onChange={handleChange}
                >
                  <option value="">Select Category Name</option>
                  {mainCategory.map((item, i) => {
                    return <option value={item._id}>{item.name}</option>;
                  })}
                </Form.Control>
                <span className="errorInput">
                  {data?.parentCategory?.length > 0 ? "" : errors["categoryId"]}
                </span>
              </Form.Group>
            </div>
            <div className="col-lg-12">
              <Form.Group md="6">
                <Form.Label>Sub Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Category Name"
                  label="Category Name"
                  id="validationCustom03"
                  required
                  name="name"
                  onChange={handleChange}
                  value={data?.name}
                />
                <span className="errorInput">
                  {data?.name?.length > 0 ? "" : errors["name"]}
                </span>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            onClick={clear}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          {update === true ? (
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary btn-elevate"
            >
              Submit
            </button>
          ) : (
            <button
              type="submit"
              onClick={onUpdate}
              className="btn btn-primary btn-elevate"
            >
              Update
            </button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SubCategory_Edit;
