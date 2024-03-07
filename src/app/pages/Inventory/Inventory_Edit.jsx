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
const Inventory_Edit = ({ rowID, setRowID, open, setOpen, fetchDatas, currentpage, pagesize, state, searching }) => {

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
		weight: 0,
		rate: 0,
		totalPayment: 0,
		discount: 0,
		discountType: 0,
    buyerPartyId:"",
    brokerPartyId:"",
    term:0,
    brokerage:0,
    netPayment:0
	});

  const validateForm = () => {
    console.log("valid");
    let errors = {};
    let formIsValid = true;

    if (!newData.weight) {
      formIsValid = false;
      errors["weight"] = lan.pleaseenter+" "+lan.weight;

    }
    if (!newData.rate) {
      formIsValid = false;
      errors["rate"] = lan.pleaseenter+" "+lan.rate;

    }
    if (!newData.buyerPartyId) {
      formIsValid = false;
      errors["buyerPartyId"] = lan.pleaseenter+" "+lan.buyerPartyId;

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
		await ApiGet("/party")
			.then(async (res) => {
				setParty(res?.data?.data)
				const arr = []
				const a = await res?.data?.data?.map((v, i) => {
					arr.push({ value:v?._id, label:`${v?.name}-${v?.companyName}` })
				})
				setOptions(arr)
       

			})
			.catch(err => ErrorToast(err?.message))
	}

  const fetchData = (v) => {
    
    ApiGet("/inventory/" + v)
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
          weight: newData.weight,
          rate: newData.rate,
          totalPayment: newData.rate*newData.weight,
          discount: newData.discount,
          discountType: newData.discountType,
          buyerPartyId: newData.buyerPartyId,
          brokerPartyId: newData.brokerPartyId,
          term: newData.term,
          brokerage: newData.brokerage,
          netPayment: newData.discountType==0?(newData?.rate*newData?.weight)+((newData?.rate*newData?.weight)*(newData?.discount/100))+((newData?.rate*newData?.weight)*(newData?.brokerage/100)):(newData?.rate*newData?.weight)-((newData?.rate*newData?.weight)*(newData?.discount/100))+(newData?.rate*newData?.weight)*(newData?.brokerage/100),

        };
        console.log(body);
        ApiPut("/inventory", body)
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
          weight: newData.weight,
          rate: newData.rate,
          totalPayment: newData.rate*newData.weight,
          discount: newData.discount,
          discountType: newData.discountType,
          buyerPartyId: newData.buyerPartyId,
          term: newData.term,
          brokerage: newData.brokerage,
          netPayment: newData.discountType==0?(newData?.rate*newData?.weight)+((newData?.rate*newData?.weight)*(newData?.discount/100))+((newData?.rate*newData?.weight)*(newData?.brokerage/100)):(newData?.rate*newData?.weight)-((newData?.rate*newData?.weight)*(newData?.discount/100))+(newData?.rate*newData?.weight)*(newData?.brokerage/100),

        }
        if(newData.brokerPartyId){
          body.brokerPartyId = newData.brokerPartyId
        } 

        console.log(body);
        ApiPost("/inventory", body)
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
            {update === true ? lan.add : lan.edit} {lan.sidelist_inventory}{" "}
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
            <Form.Group className="col-md-6">
							<Form.Label>{lan.rate} <span className="text-danger">*</span></Form.Label>
							<Form.Control
								type="text"
								placeholder={lan.rate+" " +lan.rate}
								name="rate"
								onChange={handleChange}
								value={newData?.rate}
								// onBlur={() => { if (flag) { validate(newData) } }}
							/>
               {error?.rate &&
								<span className="errorInput">
									{error["rate"]}
								</span>}
						</Form.Group><Form.Group className="col-md-6">
							<Form.Label>{lan.totalPayment} <span className="text-danger">*</span></Form.Label>
							<Form.Control
								type="text"
								placeholder={lan.enter+" " +lan.totalPayment}
								name="totalPayment"
                disabled
								onChange={handleChange}
								value={newData?.rate*newData?.weight}
								// onBlur={() => { if (flag) { validate(newData) } }}
							/>
						</Form.Group><Form.Group className="col-md-6">
							<Form.Label>{lan.discount} <span className="text-danger">*</span></Form.Label>
							<Form.Control
								type="text"
								placeholder={lan.enter+" " +lan.discount}
								name="discount"
								onChange={handleChange}
								value={newData?.discount}
								// onBlur={() => { if (flag) { validate(newData) } }}
							/>
						</Form.Group>
            <Form.Group className="col-md-6">
						<Form.Label>{lan.discountType} <span className="text-danger">*</span></Form.Label>
							<select
								className="form-select"
								name="discountType"
								onChange={handleChange}
								value={newData?.discountType}
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

            <Form.Label>{lan.buyerPartyId} <span className="text-danger">*</span></Form.Label>
            <Select
								className="basic-single"
								value={options.filter(({value}) => value === newData.buyerPartyId)}
								onChange={(e) => setNewData({ ...newData, buyerPartyId: e?.value })}
								placeholder={lan.select+' '+ lan.buyerPartyId}
								isClearable={true}
								isRtl={false}
								isSearchable={true}
								name="buyerPartyId"
								options={options}
								style={{
									control: (provided, state) => ({
										...provided,
										border: state.isActive ? '2px solid red' : provided.border,
									}),
								}}
							/>
							 {error?.buyerPartyId &&
								<span className="errorInput">
									{error["buyerPartyId"]}
								</span>}
						</Form.Group>
            <Form.Group className="col-md-6">
            <Form.Label>{lan.brokerPartyId} <span className="text-danger">*</span></Form.Label>
            <Select
								className="basic-single"
                value={options.filter(({value}) => value === newData.brokerPartyId)}
								onChange={(e) => setNewData({ ...newData, brokerPartyId: e?.value })}
								placeholder={lan.select+' '+ lan.brokerPartyId}
								isClearable={true}
								isRtl={false}
								isSearchable={true}
								name="brokerPartyId"
								options={options}
								style={{
									control: (provided, state) => ({
										...provided,
										border: state.isActive ? '2px solid red' : provided.border,
									}),
								}}
							/>
						</Form.Group>
            
            
            
            
            <Form.Group className="col-md-6">
							<Form.Label>{lan.term} <span className="text-danger">*</span></Form.Label>
							<Form.Control
								type="text"
								placeholder={lan.enter+" " +lan.term}
								name="term"
								onChange={handleChange}
								value={newData?.term}
								// onBlur={() => { if (flag) { validate(newData) } }}
							/>
						</Form.Group>
            <Form.Group className="col-md-6">
							<Form.Label>{lan.brokerage} <span className="text-danger">*</span></Form.Label>
							<Form.Control
								type="text"
								placeholder={lan.enter+" " +lan.brokerage}
								name="brokerage"
								onChange={handleChange}
								value={newData?.brokerage}
								// onBlur={() => { if (flag) { validate(newData) } }}
							/>
						</Form.Group><Form.Group className="col-md-6">
							<Form.Label>{lan.netPayment} <span className="text-danger">*</span></Form.Label>
							<Form.Control
								type="text"
								placeholder={lan.enter+" " +lan.netPayment}
								name="netPayment"
                disabled
								onChange={handleChange}
								value={newData.discountType==0?(newData?.rate*newData?.weight)+((newData?.rate*newData?.weight)*(newData?.discount/100))+((newData?.rate*newData?.weight)*(newData?.brokerage/100)):(newData?.rate*newData?.weight)-((newData?.rate*newData?.weight)*(newData?.discount/100))+(newData?.rate*newData?.weight)*(newData?.brokerage/100)}
								// onBlur={() => { if (flag) { validate(newData) } }}
							/>
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

export default Inventory_Edit;
