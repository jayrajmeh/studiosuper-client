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
import Select from 'react-select';


import * as Yup from "yup";

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
const Balancebook_Edit = ({ rowID, setRowID, open, setOpen, fetchDatas, currentpage, pagesize, state, searching }) => {

  const { language } = useLanguage();
  const lan = require(`../../../_metronic/i18n/messages/${language}.json`);
  // console.log(props);
  const history = useHistory();
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [update, getUpdate] = useState(true);
  const [partys, setParty] = useState([]);
  const [options, setOptions] = useState([]);

  
  const [error, setError] = useState({});
  const [images, setImage] = useState([]);
  const [mainCategory, setMainCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [button, setbutton] = useState(false);
  const [validated, setValidated] = useState(false);
  const [newData, setNewData] = useState({
		date: new Date(),
		description: "",
		money: 0,
		type: 0,
    expenseId:"",
	});

  const validateForm = () => {
    console.log("valid");
    let errors = {};
    let formIsValid = true;
    console.log(newData.money)
    if (!newData.money) {
      console.log("sssss")
      formIsValid = false;
      errors["money"] = lan.pleaseenter+" "+lan.money;

    }
    if (!newData.expenseId) {
      formIsValid = false;
      errors["expenseId"] = lan.pleaseenter+" "+lan.expenseId;

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

  const getParty = async () => {
		await ApiGet("/expenselist")
			.then(async (res) => {
				setParty(res?.data?.data)
				const arr = []
				const a = await res?.data?.data?.map((v, i) => {
					arr.push({ value:v?._id, label:`${v?.name}` })
				})
				setOptions(arr)
       

			})
			.catch(err => ErrorToast(err?.message))
	}

  const fetchData = (v) => {
    
    ApiGet("/balancebook/" + v)
      .then((res) => {
        console.log(res.data.data)
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
          date: newData.date?newData.date:new Date(),
          description: newData.description,
          money: newData.money,
          type: newData.type,
          expenseId: newData.expenseId,
         
        };
        console.log(body);
        ApiPut("/balancebook", body)
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
        let body = {
          date: newData.date?newData.date:new Date(),
          description: newData.description,
          money: newData.money,
          type: newData.type,
          expenseId: newData.expenseId,
        }
        if(newData.brokerPartyId){
          body.brokerPartyId = newData.brokerPartyId
        } 

        console.log(body);
        ApiPost("/balancebook", body)
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
    console.log(e)
		const { value, name } = e.target;
		setNewData({ ...newData, [name]: value.trimStart() });
	};
  useEffect(() => {
    console.log(rowID);
    getParty()

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
            {update === true ? lan.add : lan.edit} {lan.sidelist_balancebook}{" "}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="overlay overlay-block cursor-default">
        <div className="row">
        <Form.Group className="col-md-6">
							<Form.Label>{lan.date} <span className="text-danger">*</span></Form.Label>
							<Form.Control
								type="date"
								name="date"
								onChange={handleChange}
								value={newData?.date}
							/>
							
						</Form.Group>
						<Form.Group className="col-md-6">
							<Form.Label>{lan.money} <span className="text-danger">*</span></Form.Label>
							<Form.Control
								type="text"
								placeholder={lan.enter+" " +lan.money}
								name="money"
								onChange={handleChange}
								value={newData?.money}
								// onBlur={() => { if (flag) { validate(newData) } }}
							/>
              {error?.money &&
								<span className="errorInput">
									{error["money"]}
								</span>}
						</Form.Group>
            <Form.Group className="col-md-12">
							<Form.Label>{lan.description} <span className="text-danger">*</span></Form.Label>
							<Form.Control
								as="textarea" rows={3}
								placeholder={lan.enter+" " +lan.description}
								name="description"
								onChange={handleChange}
								value={newData?.description}
								// onBlur={() => { if (flag) { validate(newData) } }}
							/>
							{/* {error?.address &&
								<span className="errorInput">
									{error["address"]}
								</span>} */}
						</Form.Group>
            <Form.Group className="col-md-6">
						<Form.Label>{lan.type} <span className="text-danger">*</span></Form.Label>
							<select
								className="form-select"
								name="discountType"
								onChange={handleChange}
								value={newData?.type}
								role="button"
							>
								<option disabled>{lan.select} {lan.type}</option>
								 <option value={0} >{`(+)`}</option>
								 <option value={1} >{`(-)`}</option>
								
							</select>
							{/* {error?.type &&
								<span className="errorInput">
									{error["type"]}
								</span>} */}
						</Form.Group>
						<Form.Group className="col-md-6">

            <Form.Label>{lan.sidelist_expense} <span className="text-danger">*</span></Form.Label>
            <Select
								className="basic-single"
								value={options.filter(({value}) => value === newData.expenseId)}
								onChange={(e) => setNewData({ ...newData, expenseId: e?.value })}
								placeholder={lan.select+' '+ lan.sidelist_expense}
								isClearable={true}
								isRtl={false}
								isSearchable={true}
								name="expenseId"
								options={options}
								style={{
									control: (provided, state) => ({
										...provided,
										border: state.isActive ? '2px solid red' : provided.border,
									}),
								}}
							/>
							 {error?.expenseId &&
								<span className="errorInput">
									{error["expenseId"]}
								</span>}
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

export default Balancebook_Edit;
