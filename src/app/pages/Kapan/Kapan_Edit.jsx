import React, { useEffect, useState } from "react";
import {
  ApiGet,
  ApiPost,
  ApiPut,
  Bucket,
  reftoken,
} from "../../../helpers/API/ApiData";
import { makeStyles } from "@material-ui/styles";
import { MdKeyboardBackspace } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Form, Modal } from "react-bootstrap";

import * as Yup from "yup";
import {
  Input,
  Select,
  DatePickerField,
} from "../../../_metronic/_partials/controls";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
import { useLanguage } from '../../../_metronic/i18n/LanguageContext';


// Validation schema
const CustomerEditSchema = Yup.object().shape({
  category: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Category is required"),
});
const useStyles = makeStyles((theme) => ({
  card: {
    height: "100%",
    marginBottom: "50px",
    marginRight: "40px",
    marginLeft: "40px",
    backgroundColor: "#fff",
    border: "none",
    borderRadius: "10px",
  },
}));
const Kapan_Edit = ({ rowID, setRowID, open, setOpen, fetchDatas, currentpage, pagesize, state, searching }) => {

  const { language } = useLanguage();
  const lan = require(`../../../_metronic/i18n/messages/${language}.json`);
  // console.log(props);
  const history = useHistory();
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [update, getUpdate] = useState(true);
  const [error, setError] = useState({});
  const [images, setImage] = useState([]);
  const [mainCategory, setMainCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [button, setbutton] = useState(false);
  const [validated, setValidated] = useState(false);
  const [newData, setNewData] = useState({
		name: "",
		weight: 0,
		piece: 0,

		type: 0,
	});

  const validateForm = () => {
    console.log("valid");
    let errors = {};
    let formIsValid = true;

    if (!newData.name) {
      formIsValid = false;
      errors["name"] = lan.pleaseenter+" "+lan.name;

    }
    if (!newData.weight) {
      formIsValid = false;
      errors["weight"] = lan.pleaseenter+" "+lan.weight;

    }
    if (!newData.piece) {
      formIsValid = false;
      errors["piece"] = lan.pleaseenter+" "+lan.piece;

    }
    // if (!newData.type && newData.type !== 0) {
    //   formIsValid = false;
    //   errors["type"] = "Please Select Type";
    // }
    setError(errors);
console.log(formIsValid)
    return formIsValid;
  };

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };



  const fetchData = (v) => {
    
    ApiGet("/kapan/" + v)
      .then((res) => {
        setNewData(res.data.data);
      })
      .catch(async (err) => {
       
          ErrorToast(err.message);
        
      });
    getUpdate(false);
  };

  const onUpdate = async () => {
    if (validateForm()) {
      console.log("ssssss")
      enableLoading();
      setbutton(true);

      try {
        const body = {
          id: newData?._id,
          name: newData.name,
          piece: newData.piece,
          weight: newData.weight,
          type: newData.type,
        };
        console.log(body);
        ApiPut("/kapan", body)
          .then((res) => {
            console.log("ressssssssssss", res);
            SuccessToast(lan.successfull_updated);
            fetchDatas(currentpage, pagesize);
            disableLoading();
            setOpen(!open);
            setbutton(false);
          })
          .catch(async (err) => {
            
              ErrorToast(err.message);
              disableLoading();
              setbutton(false);
          
          });
      } catch (error) { }
    }
  };
  const handleSubmit = () => {
    console.log("aaaaa")
    if (validateForm()) {
      console.log("ssssss")
      enableLoading();
      setbutton(true);

      try {
        const body = {
          name: newData.name,
          weight: newData.weight,
          piece: newData.piece,
          type: newData.type,
        };
        console.log(body);
        ApiPost("/kapan", body)
          .then((res) => {
            console.log("ressssssssssss", res);
            SuccessToast(lan.successfull_added);
            fetchDatas(currentpage, pagesize);
            disableLoading();
            setbutton(false);
            setOpen(!open);
          })
          .catch(async (err) => {
              ErrorToast(err.message);
              disableLoading();
              setbutton(false);
            
          });
      } catch (error) { }
    }
  };

  const handleChange = (e) => {
		const { value, name } = e.target;
		setNewData({ ...newData, [name]: value.trimStart() });
	};
  useEffect(() => {
    console.log(rowID);
    if (rowID) {
      fetchData(rowID);
      getUpdate(false);
    }
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
            {update === true ? lan.add : lan.edit} {lan.sidelist_kapan}{" "}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="overlay overlay-block cursor-default">
        <div className="row">
						<Form.Group className="col-md-12">
							<Form.Label>{lan.name} <span className="text-danger">*</span></Form.Label>
							<Form.Control
								type="text"
								placeholder={lan.enter+" " +lan.name}
								name="name"
								onChange={handleChange}
								value={newData?.name}
								// onBlur={() => { if (flag) { validate(newData) } }}
							/>
							{error?.name &&
								<span className="errorInput">
									{error["name"]}
								</span>}
						</Form.Group>
            <Form.Group className="col-md-12">
							<Form.Label>{lan.weight} <span className="text-danger">*</span></Form.Label>
							<Form.Control
								type="text"
								placeholder={lan.enter+" " +lan.weight}
								name="weight"
								onChange={handleChange}
								value={newData?.weight}
								// onBlur={() => { if (flag) { validate(newData) } }}
							/>
							{error?.weight &&
								<span className="errorInput">
									{error["weight"]}
								</span>}
						</Form.Group>
            <Form.Group className="col-md-12">
							<Form.Label>{lan.piece} <span className="text-danger">*</span></Form.Label>
							<Form.Control
								type="text"
								placeholder={lan.enter+" " +lan.piece}
								name="piece"
								onChange={handleChange}
								value={newData?.piece}
								// onBlur={() => { if (flag) { validate(newData) } }}
							/>
							{error?.piece &&
								<span className="errorInput">
									{error["piece"]}
								</span>}
						</Form.Group>
            
            <Form.Group className="col-md-12">
						<Form.Label>{lan.type} <span className="text-danger">*</span></Form.Label>
							<select
								className="form-select"
								name="type"
								onChange={handleChange}
								value={newData?.type}
								role="button"
							>
								<option disabled>{lan.select} {lan.type}</option>
								 <option value={0} >{lan.galaxy}</option>
								 <option value={1} >{lan.manual}</option>
								
							</select>
							{/* {error?.type &&
								<span className="errorInput">
									{error["type"]}
								</span>} */}
						</Form.Group>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            onClick={clear}
            className="btn btn-light btn-elevate"
          >
            {lan.cancel}
          </button>
          <> </>
          {update === true ? (
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary btn-elevate"
              disabled={button}
            >
                          {lan.submit}

            </button>
          ) : (
            <button
              type="submit"
              onClick={onUpdate}
              disabled={button}
              className="btn btn-primary btn-elevate"
            >
              {lan.update}
            </button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Kapan_Edit;
