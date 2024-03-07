import React, { useEffect, useRef, useState } from "react";
import {
  ApiGet,
  ApiPost,
  ApiPut,
  ApiUpload,
  Bucket,
  reftoken,
} from "../../../helpers/API/ApiData";
import { makeStyles } from "@material-ui/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Dropdown, Form, Modal } from "react-bootstrap";
import { DropzoneComponent } from "react-dropzone-component";
import uploadIMG from "../../../media/upload.png";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
import { DatePicker } from "antd";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
// import { EditorState } from "draft-js";
// import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import CKEditor from "@ckeditor/ckeditor5-react";
import Editor from "@juniyadi/ckeditor5-custom-build";
import MyStatefulEditor from "./rtc";

const useStyles = makeStyles((theme) => ({
  card: {
    height: "100%",

    backgroundColor: "#fff",
    border: "none",
    borderRadius: "10px",
  },
}));
let extra = [];
const { RangePicker } = DatePicker;
let array = []
const Blog_Edit = ({
  rowID,
  setRowID,
  open,
  setOpen,
  fetchDatas,
  currentpage,
  pagesize,
  state,
  searching,
  state2,
}) => {
  console.log(rowID);
  const history = useHistory();
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [add, setadd] = useState({
    title: "",
    description: "",
    subtitle: ""
  });
  const [position, setposition] = useState([{ name: "Select Your Category" }]);
  const [update, getUpdate] = useState(true);
  const [extrafile, setextrafile] = useState(true);
  const [errors, setError] = useState({});
  const [categoryId, setcategoryId] = useState("");
  const [mainCategory, setMainCategory] = useState([]);
  console.log("mainCategory", mainCategory);
  const [loading, setLoading] = useState(false);
  const [button, setbutton] = useState(false);
  const [thumbnail, setthumbnail] = useState([]);
  console.log("🚀 ~ file: Blog_Edit.jsx ~ line 56 ~ thumbnail", thumbnail);
  const [validated, setValidated] = useState(false);
  // const [setimage, setImage] = useState([]);
  const [valll, setvalll] = React.useState("");
  const [picker, setpicker] = React.useState("");
  // const [state, setstate] = useState("")
  // const [file1, setfile] = useState([]);
  const [image, setimage] = useState([]);
  // const [editorState, setEditorState] = useState(() =>
  //   // EditorState.createEmpty()
  // );
  const [convertedContent, setConvertedContent] = useState(null);
  const [count, setcount] = useState(0);

  // const handleEditorChange = (state) => {
  // setEditorState(state);
  // convertContentToHTML();
  // };
  // const convertContentToHTML = () => {
  //   let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
  //   setConvertedContent(currentContentAsHTML);
  // };
  const emailEditorRef = useRef(null);
  console.log(image)
  const validateForm = () => {
    console.log("valid");
    let errors = {};
    let formIsValid = true;

    // if (image.length === 0) {
    //   console.log("a");
    //   formIsValid = false;
     
    //   errors["image"] = "Please Enter Image";
    // }
    debugger
    if (!add?.title) {
      console.log("a");
      formIsValid = false;
      document.getElementById("title").style.border = "2px solid #f64e60";
      errors["title"] = "Please Enter Title";
    }
    if (!position[0]?._id) {
      console.log("a");
      formIsValid = false;
      // document.getElementById("category").style.border = "2px solid #f64e60";
      errors["category"] = "Please Select Category";
    }
    if (!add?.subtitle) {
      console.log("a");
      formIsValid = false;
      document.getElementById("subtitle").style.border = "2px solid #f64e60";
      errors["subtitle"] = "Please Enter Sub Title";
    }
    // if (!add?.description) {
    //   console.log("a");
    //   formIsValid = false;
    //   document.getElementById("description").style.border = "2px solid #f64e60";
    //   errors["description"] = "Please Enter Description";
    // }
    // if (!add.start_date) {
    //   console.log("a");
    //   formIsValid = false;
    //   document.getElementById("start_date").style.border = "2px solid #f64e60";
    //   errors["start_date"] = "Please Select Start Date";
    // }
    // if (!add.end_date) {
    //   console.log("a");
    //   formIsValid = false;
    //   document.getElementById("end_date").style.border = "2px solid #f64e60";
    //   errors["end_date"] = "Please Select End Date";
    // }

    setError(errors);

    return formIsValid;
  };

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  console.log(setimage);
  const handleChange = (e) => {
    console.log(
      "🚀 ~ file: Blog_Edit.jsx ~ line 133 ~ handleChange ~ e",
      e.target.value
    );
    let { name, value } = e.target;
    console.log(name, value);

    // if (name == "image") {
    //   console.log(e.target.files);
    //   let file = e.target.files[0];

    //   let fileURL = URL.createObjectURL(file);
    //   file.fileURL = fileURL;
    //   // }
    //   setImage([file]);
    if (name == "thumbnail") {
      console.log(e.target.files);
      let file = e.target.files[0];

      let fileURL = URL.createObjectURL(file);
      console.log("🚀 ~ file: Post_Edit.jsx ~ line 255 ~ fileURL", fileURL);
      file.fileURL = fileURL;
      // }
      setthumbnail([file]);
      if (image) {
        document.getElementById("thumbnail").style.border =
          "2px dashed #1BC5BD";
        // console.log("sssss");
      } else {
        document.getElementById("thumbnail").style.border =
          "2px dashed #f64e60";
        // console.log("rrr");
      }
    }
    // }

    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const storeAdd = (e) => {
    const { name, value } = e.target;

    if (add?.title) {
      document.getElementById("title").style.border = "2px dashed #1BC5BD";
    } else {
      document.getElementById("title").style.border = "2px dashed #f64e60";
    }

    if (add?.subtitle) {
      document.getElementById("subtitle").style.border = "2px dashed #1BC5BD";
    } else {
      document.getElementById("subtitle").style.border = "2px dashed #f64e60";
    }

    // if (add?.description) {
    //   document.getElementById("description").style.border =
    //     "2px dashed #1BC5BD";
    // } else {
    //   document.getElementById("description").style.border =
    //     "2px dashed #f64e60";
    // }

    setadd({
      ...add,
      [name]: value,
    });
  };
  const storeDate = (e, t) => {
    console.log(e);
    // console.log(moment(e?._d).format());
    setadd({
      ...add,
      start_date: e[0],
      end_date: e[1],
    });
  };
  useEffect(() => {
    setadd(rowID);
    setData(rowID?.image);
  }, []);

  const fetchData = (v) => {
    console.log(v);
    ApiGet("/blog/" + v._id)
      .then((res) => {
        console.log("...................", res.data.data?.html_json);
        emailEditorRef.current.editor.loadDesign(res.data.data?.html_json);
        setthumbnail([res.data.data.URLs[0]]);
        setData(res.data.data);
        // setposition(JSON.stringify(res?.data?.position))
      })
      .catch(async (err) => {
        if (err.status == 410) {
          // let ext = await reftoken("ApiGet", "/blog/" + v);
          // console.log(ext);
          // setData(ext.data.data);
          // setthumbnail([ext.data.data.URLs[0]]);
          //  ErrorToast(err.message);
        } else {
          //  ErrorToast(err.message);
        }
      });
    getUpdate(false);
  };
  const thumbnailapi = async () => {
    const formData = new FormData();

    let thub;
    if (thumbnail[0].fileURL) {
      formData.append("image", thumbnail[0]);

      await ApiUpload("upload/image/thumbnail", formData)
        .then((res) => {
          console.log("🚀", res);
          thub = res.data.data.image;
        })
        .catch(async (err) => {
          if (err.status == 410) {
            // let ext = await reftoken(
            //   "ApiUpload",
            //   "upload/image/post_image",
            //   formData
            // );
            // console.log(ext);
            // thub = ext.data.data.image;
          } else {
            ErrorToast(err.message);
          }
        });
      return thub;
    } else {
      thub = thumbnail[0];
      return thub;
    }
  };
  const thumbnailapi1 = async (i) => {
    const formData = new FormData();

    let thub;
    if (i) {
      formData.append("image", i);

      await ApiUpload("upload/image/thumbnail", formData)
        .then((res) => {
          console.log("🚀", res);
          thub = res.data.data.image;
        })
        .catch(async (err) => {
          if (err.status == 410) {
            // let ext = await reftoken(
            //   "ApiUpload",
            //   "upload/image/post_image",
            //   formData
            // );
            // console.log(ext);
            // thub = ext.data.data.image;
          } else {
            ErrorToast(err.message);
          }
        });
      return thub;
    } else {
      thub = thumbnail[0];
      return thub;
    }
  };
  console.log("vallllllll", thumbnail[0] ? thumbnail[0].type : "dfggsdgwr");
  console.log("eee", thumbnail[0] ? thumbnail[0].name : "dfggsdgwr");

  const onUpdate = async () => {
    let json = {};
    emailEditorRef.current.editor.saveDesign((design) => {
      json = design;
    });
    emailEditorRef.current.editor.exportHtml(async (data) => {
      const { design, html } = data;
      if (validateForm()) {
        enableLoading();
        setbutton(true);
        try {
          let Thumbnamilarray = await thumbnailapi();
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if(element.key=="image"){
              for (let index1 = 0; index1 < element.content.length; index1++) {
                const element1 = await thumbnailapi1(element.content[index1]);
array[index].content[index1] = element1
                
              }
            }
            
          }
          const body = {
            title: add?.title,
            subtitle: add?.subtitle,
            category: position[0]?._id,
            content:array,
            thumbnail: Thumbnamilarray
          };
          console.log(
            "🚀 ~ file: Blog_Edit.jsx ~ line 296 ~ emailEditorRef.current.editor.exportHtml ~ body",
            body
          );

          
          ApiPut("/blog", body)
            .then((res) => {
              SuccessToast(res?.message);
              fetchDatas(currentpage, pagesize, searching, state2);
              disableLoading();
              setOpen(!open);
            })
            .catch(async (err) => {
              console.log(err);
              if (err.status == 410) {
                // let ext = await reftoken("ApiPut", "/blog", body);
                // SuccessToast(ext.data.message);
                // fetchDatas(currentpage, pagesize, searching, state2);
                // disableLoading();
                // setOpen(!open);
                // setbutton(false);
              } else {
                ErrorToast(err.message);
                disableLoading();
                setbutton(false);
              }
            });
        } catch (error) {}
      }
    });
  };
  const deleteimage = (index) => {
    let extra5 = image.filter((x, i) => i != index);

    setimage(extra5);
    if (extra5.length == 0) {
      document.getElementById("image").style.border = "2px dashed #f64e60";
    }
  };
  const imagearrayapi = async () => {
    let image1 = [];

    for (let i = 0; i < image.length; i++) {
      if (image[i].fileURL) {
        const formData = new FormData();
        formData.append("image", image[i]);

        await ApiUpload("upload/image/post_image", formData)
          .then((res) => {
            image1.push(res.data.data.image);
          })
          .catch(async (err) => {
            if (err.status == 410) {
              // let ext = await reftoken(
              //   "ApiUpload",
              //   "upload/image/post_image",
              //   formData
              // );
              // console.log(ext);
              // image1.push(ext.data.data.image);
            } else {
              ErrorToast(err.message);
            }
          });
      } else {
        image1.push(image[i]);
      }
    }
    return image1;
  };

  const addcontent = (i) =>{
if(i==1){
array.push({key:"text"})
}else{
  array.push({key:"image"})

}
setcount(count+1)
  }
  const handleSubmit = async () => {
    // let json = {};
    // emailEditorRef.current.editor.saveDesign((design) => {
    //   json = design;
    // });
    // emailEditorRef.current.editor.exportHtml(async (data) => {
      // const { design, html } = data;

      if (validateForm()) {
        console.log("Sssssss")
        enableLoading();
        setbutton(true);

        try {
          let Thumbnamilarray = await thumbnailapi();
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if(element.key=="image"){
              for (let index1 = 0; index1 < element.content.length; index1++) {
                const element1 = await thumbnailapi1(element.content[index1]);
array[index].content[index1] = element1
                
              }
            }
            
          }
          const body = {
            title: add?.title,
            subtitle: add?.subtitle,
            category: position[0]?._id,
            content:array,
            thumbnail: Thumbnamilarray
          };
          console.log("body", body);
         
          ApiPost("/post", body)
            .then((res) => {
              console.log("ressssssssssss", res);
              setadd(res?.data);
              SuccessToast(res?.message);
              fetchDatas(currentpage, pagesize, searching, state2);
              disableLoading();
              setOpen(!open);
            })
            .catch(async (err) => {
              if (err.status == 410) {
                // let ext = await reftoken("ApiPost", "/blog", body);
                // SuccessToast(ext.data.message);
                // fetchDatas(currentpage, pagesize, searching, state2);
                // disableLoading();
                // setOpen(!open);
                // setbutton(false);
              } else {
                ErrorToast(err.message);
                disableLoading();
              }
            });
        } catch (error) {}
      }
    // });
  };
  console.log("aaaaaaaaaaaaa", add);
  useEffect(() => {
    if (rowID) {
      fetchData(rowID);
      setposition(rowID?.category);
    }
    let body = {
      limit: 1000,
      page: 1
    };
    
    ApiPost("/category/get", body)
      .then((res) => {
        console.log("sdfsdfsdfsdfsdgDFG", res);
        setMainCategory(res.data.data.category_count);
      })
      .catch(async (err) => {
        ErrorToast(err.message);
      });
  }, []);
  const clear = () => {
    setOpen(!open);
    setRowID("");
  };
  const onChange = (value,i) => {
    console.log(value,i);
    array[i].content = value
    setcount(count+1)
  };
  const handleImageChange = (e,i) =>{
    e.persist();

    console.log(e.target.files,i)
    const files = e.target.files;
    let ttt = array[i].content ? array[i].content : []
    if(ttt.length){
ttt = [...ttt,...Array.from(files)]
    }else{
ttt = [...Array.from(files)]
    }
    array[i].content = ttt
    console.log(array)
    setcount(count+1)
    // Convert the FileList to an array and update state
    // setSelectedImages([...selectedImages, ...Array.from(files)]);
  }
  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf("day");
  }
  const storeAddposition = (e) => {
    console.log(e);
    setposition(
      mainCategory.filter(function(el) {
        return el._id === e;
      })
    );
  };
  console.log("position", position);
  const apply = (event, picker) => {
    console.log(picker, event);
    // fetchData(currentpage, pagesize, state, searching, state2), picker;
    setpicker(picker);
    setvalll(
      `${moment(picker.startDate._d).format("DD-MM-YYYY")}-${moment(
        picker.endDate._d
      ).format("DD-MM-YYYY")}`
    );
    console.log(moment(picker.startDate._d).format("YYYY-MM-DD"));
  };
  console.log(array)
  const cancel = (event, picker) => {
    console.log(picker, event);
    // fetchData(currentpage, pagesize, state, searching, state2), "cancel";
    setpicker("");
    setvalll("");
    // console.log(moment(picker.startDate._d).format('YYYY-MM-DD'))
  };
  const handleDeleteImage = (sub,main) =>{
    array[main].content.splice(sub, 1);
    setcount(count+1)
  }

  return (
    <>
      <Modal
        show={open}
        centered
        size="xl"
        onHide={() => clear()}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            {update === true ? "Add" : "Edit"} Blog{" "}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="overlay overlay-block cursor-default">
          {/* <div className="">hii</div> */}
          <div className="form-group row">
            <div className="col-lg-6">
              <Form.Group md="6">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Title"
                  label="Title"
                  id="title"
                  required
                  name="title"
                  onChange={storeAdd}
                  value={add?.title}
                />
                <span className="errorInput">
                  {add?.title?.length > 0 ? "" : errors["title"]}
                </span>
              </Form.Group>
            </div>
            {/* <div className="col-lg-5 my-2 my-md-0">
              <label>Date</label>
              <DateRangePicker
                onApply={apply}
                onCancel={cancel}
              >
                <input
                  type="text"
                  className="form-control"
                  value={add?.start_date && add?.end_date ? [moment(add?.start_date).format("DD-MM-YYYY"), moment(add?.end_date).format("DD-MM-YYYY")] : valll}
                  placeholder="Select Date Range"
                />
              </DateRangePicker>
            </div> */}

            <div className="col-lg-6">
              <label>Category</label>
              <Dropdown onSelect={storeAddposition}>
                <Dropdown.Toggle id="dropdown-basic">
                  {position[0]?.name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {mainCategory.map((e) => {
                    console.log(
                      "🚀 ~ file: Blog_Edit.jsx ~ line 489 ~ {mainCategory.map ~ e",
                      e
                    );

                    return (
                      <Dropdown.Item eventKey={e?._id}>{e?.name}</Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
              <span className="errorInput">
                  {!position[0]?._id ? errors["category"] : ""}
                </span>
            </div>
            <div className="col-lg-12">
              <Form.Group md="12">
                <Form.Label>Sub Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Sub Title"
                  label="Sub Title"
                  id="subtitle"
                  required
                  name="subtitle"
                  onChange={storeAdd}
                  value={add?.subtitle}
                />
                <span className="errorInput">
                  {add?.subtitle?.length > 0 ? "" : errors["subtitle"]}
                </span>
              </Form.Group>
            </div>
            <div className="col-lg-12">
              <Form.Group md="6" controlId="thumbnail">
                <Form.Label className="">Thumbnail</Form.Label>
                <div className="div w-100">
                  <label
                    // for="formFileMultiple2"
                    class="form-label uploadFile w-100 d-flex align-items-center flex-wrap"
                    id="thumbnail"
                  >
                    <p className="m-0 px-12 py-5 font-weight-bold">
                      Upload your file <br />
                      <span className="font-weight-light text-secondary my-2">
                        The Image has to be jpg, png or mp4.
                      </span>
                      <br />
                      <label for="formFileMultiple2">
                        <span className="text-primary font-weight-bold">
                          Choose File
                        </span>
                      </label>
                    </p>
                    <br />
                    {thumbnail.length === 0 ? (
                      ""
                    ) : (
                      <ul className="ulDelete">
                        <div className="rowRoot">
                          <img
                            src={
                              thumbnail[0]?.name?.includes(".mp4")
                                ? "/media/users/mp4.webp"
                                : thumbnail[0].fileURL
                                ? thumbnail[0].fileURL
                                : Bucket + thumbnail[0]
                            }
                            className="img-fluid rounded position-relative"
                            width="100px"
                            alt=""
                          />

                          <CancelIcon
                            style={{
                              position: "absolute",
                              top: "2px",
                              right: "2px",
                              fontSize: "20px",
                              color: "red",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setthumbnail([]);
                              document.getElementById(
                                "thumbnail"
                              ).style.border = "2px dashed #f64e60";
                            }}
                          ></CancelIcon>
                        </div>
                      </ul>
                    )}
                  </label>
                  <input
                    accept="image/gif, image/jpeg, image/png,video/mp4,video/x-m4v,video/*"
                    class="form-control"
                    type="file"
                    id="formFileMultiple2"
                    hidden
                    name="thumbnail"
                    // value={data.image}
                    onChange={handleChange}
                  />
                  <span className="errorInput">
                    {thumbnail.length ? "" : errors["thumbnail"]}
                  </span>
                </div>
              </Form.Group>
              <span className="errorInput">
                  {image.length > 0 ? "" : errors["image"]}
                </span>
            </div>
<div>
            <button
              type="submit"
              onClick={()=>addcontent(1)}
              className="btn btn-primary btn-elevate"
            >
              Add Text Editor
            </button>

            <button
              type="submit"
              onClick={()=>addcontent(2)}
              className="btn btn-primary btn-elevate"
            >
              Add Media File
            </button>
            </div>     

            
            {array.map((e,i) => {


                    return (
                      
                      e.key=="text" ?   <div className="form-group row">
             <div className="col-lg-12">
            <MyStatefulEditor markup={e.content} onChange={(e)=>onChange(e,i)} />

            </div>

            
          </div> :<div className="form-group row">
          <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e)=>handleImageChange(e,i)}
      />
      <div style={{display:"flex"}}>
        {e?.content?.length>0 && e.content.map((image, index) => (
          <div key={index}>
            <img
              src={image.name ? URL.createObjectURL(image) : ""}
              alt={`Selected ${index}`}
              width="100"
            />
            <button onClick={() => handleDeleteImage(index,i)}>Delete</button>
          </div>
        ))}
      </div>
          </div>
                    );
                  })}      



            {/* <div
              className="preview"
              dangerouslySetInnerHTML={createMarkup(convertedContent)}
            ></div> */}
            {/* <div className="row">
              <div className="col-lg-12">
                <Form.Group md="6">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    type="text"
                    placeholder="Description"
                    label="Description"
                    id="description"
                    required
                    name="description"
                    onChange={storeAdd}
                    value={add?.description}
                  />
                  <span className="errorInput">
                    {add?.description?.length > 0 ? "" : errors["description"]}
                  </span>
                </Form.Group>
              </div>
            </div> */}

            {/* <div className="col-lg-6">
              <Form.Group md="6">
                <Form.Label>End Date</Form.Label>
                <div id="end_date" style={{ borderRadius: "0.42rem" }}>
                  <DatePicker className="form-control" onChange={storeDate} />
                </div>
                <span className="errorInput">
                  {add.end_date?.length > 0 ? "" : errors["end_date"]}
                </span>
              </Form.Group>
            </div> */}
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

export default Blog_Edit;
