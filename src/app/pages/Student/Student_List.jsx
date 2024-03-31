import React, { useRef, useState } from "react";
import { useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NoDataTable from "../../../common/noDataTable";
import { ApiDelete, ApiPost, ApiPostInce, ApiPut, ApiUpload, Bucket } from "../../../helpers/API/ApiData";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
import Pagination from "@material-ui/lab/Pagination";
import { useLanguage } from '../../../_metronic/i18n/LanguageContext';
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import Student_Edit from "./Student_Edit";
import { Modal } from "react-bootstrap";
import queryString from "query-string";
import * as XLSX from 'xlsx';
import moment from 'moment';




function UserList() {
  const { language } = useLanguage();
  const fileInputRef = useRef(null);
  const lan = require(`../../../_metronic/i18n/messages/${language}.json`);
  const history = useHistory();
  const [data, setData] = useState([]);
  const [totalpage, settotalpage] = useState(0);
  const [currentpage, setcurrentpage] = useState(1);
  const [pagesize, setpagesize] = useState(10);
  const [searching, setsearching] = useState("");
  const [rowID, setRowID] = React.useState();
  const [schoolid, setschoolid] = React.useState();
  const [mainschoolid, setmainschoolid] = React.useState();


  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState(true);
  const [modal, setModal] = React.useState(false);
  const [Id, setId] = React.useState();


  const columns = [
    {
      dataField: "phonenumber",
      text: "Phonenumber",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell ? cell : "-"}</div>;
      },
    },
    {
      dataField: "grno",
      text: "Gr No.",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell ? cell : "-"}</div>;
      },
    },
    {
      dataField: "surname",
      text: "Surname",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell ? cell : "-"}</div>;
      },
    },
    {
      dataField: "studentname",
      text: "Studentname",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell ? cell : "-"}</div>;
      },
    },
    {
      dataField: "fathername",
      text: "Fathername",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell ? cell : "-"}</div>;
      },
    },
    {
      dataField: "mobile",
      text: "Father Mobile",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell ? cell : "-"}</div>;
      },
    },
    {
      dataField: "mobile2",
      text: "Mother Mobile",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell ? cell : "-"}</div>;
      },
    },
    {
      dataField: "address",
      text: "address",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell ? cell : "-"}</div>;
      },
    },
    {
      dataField: "dateofbirth",
      text: "dateofbirth",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell ? moment(cell).format('DD/MM/YYYY')  : "-"}</div>;
      },
    },
    {
      dataField: "bloodgroup",
      text: "Bloodgroup",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell ? cell : "-"}</div>;
      },
    },
    {
      dataField: "photonumber",
      text: "photonumber",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell ? cell : "-"}</div>;
      },
    },
    {
      dataField: "photo",
      text: "photo",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell ?<img src={Bucket+cell} height={50} width={50}  />: "-"}</div>;
      },
    },
    {
      dataField: "status",
      text: "status",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell==0?"PENDING":cell==1?"ADDED":cell==2?"VERIFY MODE":cell==3?"ERROR":cell==4?"SUCCESS":""}</div>;
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
            {/* <a
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
            </a> */}
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
              className="btn btn-icon btn-light btn-hover-danger btn-sm mx-3"
            // onClick={() => openDeleteCustomerDialog(row.id)}
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                  onClick={() => deleted(row._id)}
                />
              </span>
            </a>
            <> </>

            

           

            
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


  const onView = (classId) => {
    // Assuming you have a route like '/customer/:customerId' for viewing customer details
    history.push(`/student/${classId}`);
  };

  const generateExcel = async() => {
    console.log("ssss")
    // Create a workbook
    const wb = XLSX.utils.book_new();
  
    // Define headers
    const headers = [
      'Code',
      'Name',
      'Address',
      'City',
      'Mobile',
      'E-mail',
      'Photo',
      'Division',
      'Profile',
      'Family Photo',
      'Signature',
      'Date of Birth',
      'Blood Group',
      'Status',
      'BarCodeData',
      'BarCode',
      'QRCode',
      'Authority Signature'

      
      // Add the remaining headers from your Excel sheet
    ];

    let body = {
      classid:schoolid
    };
    // if(queries.id)

    // }
    let data1
    await ApiPost("/student/getall", body)
      .then((res) => {
        console.log("resData", res?.data);
        data1 = res?.data?.data?.student_count
        
      })
  
    // Map table data to match headers
    const mappedData = data1.map(item => [
      item.grno,
      item.surname+" "+item.studentname+" "+item.fathername,
      item.address,
      item.mobile2?`${item.mobile2?.slice(0, 5)+" "}${item.mobile2?.slice(5)}`:"",
      item.mobile?`${item.mobile?.slice(0, 5)+" "}${item.mobile?.slice(5)}`:"",
      item.photonumber,
      "",
      "",
      "",
      "",
      "",
      moment(item.dateofbirth).format('DD/MM/YYYY'),
      item.bloodgroup,
      "",
      "",
      "",
      "",
      "",
    ]);

    console.log(mappedData)
  
    // Create a worksheet
    const ws = XLSX.utils.aoa_to_sheet([headers, ...mappedData]);
  
    // Add worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    // Generate Excel file
    XLSX.writeFile(wb, 'student_data.xlsx');
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
    ApiDelete("/student/" + v)
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
    let queries = queryString.parse(window.location.search);
    console.log(queries)
    let body = {
      page,
      limit,
      search,
      classid:queries.id
    };
    // if(queries.id) {
      // body.schoolid = queries.id
      setschoolid(queries.id)
      setmainschoolid(queries.schoolid)

    // }
    await ApiPost("/student/get", body)
      .then((res) => {
        console.log("resData", res?.data);
        setData(res?.data?.data?.student_count);
        settotalpage(res?.data?.data?.state?.page_limit);
      })
      .catch((err) => ErrorToast(err?.message));
  };
  console.log("data", data);
  useEffect(() => {
    let queries = queryString.parse(window.location.search);
      console.log(queries)
    fetchData(currentpage, pagesize, searching);
  }, []);
  const Upload = () =>{

  }

  const AddExcel = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx'; // specify accepted file types if needed

    input.click();

    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        console.log(file)
        if (file) {
            const formData = new FormData();
            formData.append('excel', file);
            formData.append('class', schoolid);
            formData.append('school', mainschoolid);


            ApiPost("/student", formData)
          .then((res) => {
            console.log("ressssssssssss", res);
            SuccessToast(lan.successfull_added);
            fetchData(currentpage, pagesize);
            
          })
          .catch(async (err) => {
              ErrorToast(err.message);
             
            
          });
        }
    });
};

const handleButtonClick = () => {
  fileInputRef.current.click();
};

const handleFileChange = async(event) => {
  const files = event.target.files;
  if (files.length === 0) {
    return;
  }
  const uploadPromises = Array.from(files).map(async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      ApiUpload("upload/compress_image/thumbnail", formData)
          .then((res) => {
            console.log("ressssssssssss", res);
            let photonumber = file.name.split(".")[0]
            let bodys = {
              photonumber:photonumber,
              photo:res.data.data.image,
              class:schoolid
            }
            ApiPut("/update_photo", bodys)
            .then((res) => {
              console.log("ressssssssssss", res);
            })
            // SuccessToast(lan.successfull_added);
            // fetchData(currentpage, pagesize);
            
          })
          .catch(async (err) => {
              ErrorToast(err.message);
             
            
          });
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
    }
  });

  try {
    await Promise.all(uploadPromises);
    console.log('All files uploaded successfully');
  } catch (error) {
    console.error('Error uploading files:', error);
  }
  // Here you can upload the files to your server
  console.log("Selected files:", files);
};

  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <div className="title">
          <div className="fs-20px fw-bolder">{lan.sidelist_student}</div>
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
              {lan.sidelist_student}
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
              {lan.sidelist_student} {lan.list}
              </h3>
            </div>
            <div class="card-toolbar">
            <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <a
                class="btn btn-primary font-weight-bolder"
                onClick={() => handleButtonClick()}
              >
                Upload Images

              </a>
            <a
                class="btn btn-primary font-weight-bolder"
                onClick={() => generateExcel()}
              >
                Make Excel

              </a>
              <a
                class="btn btn-primary font-weight-bolder"
                onClick={() => AddExcel()}
              >
                Add Excel

              </a>
             
            </div>
            {/* <div class="card-toolbar">
              <a
                class="btn btn-primary font-weight-bolder"
                onClick={() => openModal()}
              >
                {lan.add} {lan.sidelist_student}

              </a>
            </div> */}
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
                <Student_Edit
                  open={open}
                  setOpen={setOpen}
                  rowID={rowID}
                  schoolid={schoolid}
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
                {lan.delete} {lan.sidelist_student}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <span>
                {lan.are_you_sure} {lan.sidelist_student}?
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

export default UserList;
