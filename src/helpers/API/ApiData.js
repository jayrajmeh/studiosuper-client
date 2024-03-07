import { API } from "../../config/API/api.config";
import Auth from "../Auth";
import CryptoJS from "crypto-js";
import * as authUtil from "../../utils/auth.util";

export const BaseURL = API.endpoint + "/";
export const Bucket = "https://api.harcoskepzoapp.hu/";
const axios = require("axios").default;

const defaultHeaders = {
  isAuth: true,
  AdditionalParams: {},
  isJsonRequest: true,
  api_key: true,
};

export const ApiPostNoAuth = (type, userData) => {
  return new Promise((resolve, reject) => {
    axios
      .post(BaseURL + type, userData, getHttpOptions({ ...defaultHeaders, isAuth: false }))
      .then((responseJson) => {
        resolve(responseJson);
        authUtil.setrefrencetoken();
      })
      .catch((error) => {
        reject(error.response.data || error);
      });
  });
};
export const ApiGetNoAuth = (type) => {
  return new Promise((resolve, reject) => {
    axios
      .get(BaseURL + type, getHttpOptions({ ...defaultHeaders, isAuth: false }))
      .then(async (responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error.response.data || error);
      });
  });
};
export const ApiGet_admin = (type) => {
  const Id = JSON.parse(localStorage.getItem("userinfo"));
  let ext = "user";

  return new Promise((resolve, reject) => {
    axios
      .get(BaseURL + type, getHttpOptions())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error.response.data || error);
      });
  });
};
export const ApiGet = (type) => {
  const Id = JSON.parse(localStorage.getItem("userinfo"));
  let ext = "user";

  return new Promise((resolve, reject) => {
    axios
      .get(BaseURL + ext + type, getHttpOptions())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        // if (
        //   error.response.data.status === 410 ||
        //   error.response.data.status === 403 ||
        //   error.response.data.status === 401
        // ) {
        //   localStorage.clear();
        //   window.location.replace("/");
        // }
        reject(error.response.data || error);
      });
  });
};
export const ApiPost = (type, userData) => {
  return new Promise((resolve, reject) => {
    axios
      .post(BaseURL + "user" + type, userData, getHttpOptions())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        // if (
        //   error.response.data.status === 410 ||
        //   error.response.data.status === 403 ||
        //   error.response.data.status === 401
        // ) {
        //   localStorage.clear();
        //   window.location.replace("/");
        // }
        reject(error.response.data || error);
      });
  });
};
export const ApiPut = (type, userData) => {
  const Id = JSON.parse(localStorage.getItem("userinfo"));
  let ext = "user";

  return new Promise((resolve, reject) => {
    axios
      .put(BaseURL + ext + type, userData, getHttpOptions())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        // if (
        //   error.response.data.status === 410 ||
        //   error.response.data.status === 403 ||
        //   error.response.data.status === 401
        // ) {
        //   localStorage.clear();
        //   window.location.replace("/");
        // }
        reject(error.response.data || error);
      });
  });
};
export const ApiPut1 = (type, userData) => {
  const Id = JSON.parse(localStorage.getItem("userinfo"));
  let ext = "user";

  return new Promise((resolve, reject) => {
    axios
      .put(BaseURL +  type, userData, getHttpOptions())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        // if (
        //   error.response.data.status === 410 ||
        //   error.response.data.status === 403 ||
        //   error.response.data.status === 401
        // ) {
        //   localStorage.clear();
        //   window.location.replace("/");
        // }
        reject(error.response.data || error);
      });
  });
};
export const ApiUpload = (type, userData, AdditionalHeader) => {
  return new Promise((resolve, reject) => {
    axios
      .post(BaseURL + type, userData, {
        ...getHttpOptions(),
        ...AdditionalHeader,
      })
      .then((responseJson) => {
        // resolve(responseJson);
        // console.log("responseJson", responseJson);
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error.response.data || error);
      });
  });
};
export const ApiDelete = (type, userData) => {
  const Id = JSON.parse(localStorage.getItem("userinfo"));
  let ext = "user";

  return new Promise((resolve, reject) => {
    axios
      .delete(BaseURL + ext + type, getHttpOptions())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        // if (
        //   error.response.data.status === 410 ||
        //   error.response.data.status === 403 ||
        //   error.response.data.status === 401
        // ) {
        //   localStorage.clear();
        //   window.location.replace("/");
        // }
        reject(error.response.data || error);
      });
  });
};
export const getHttpOptions = (options = defaultHeaders) => {
  let headers = {};

  if (options.hasOwnProperty("isAuth") && options.isAuth) {
    headers["Authorization"] = Auth.getToken();
    headers["Cache-Control"] = "no-cache";
  }

  if (options.hasOwnProperty("isJsonRequest") && options.isJsonRequest) {
    headers["Content-Type"] = "application/json";
  }

  if (options.hasOwnProperty("AdditionalParams") && options.AdditionalParams) {
    headers = { ...headers, ...options.AdditionalParams };
  }

  // headers["Access-Control-Allow-Origin"] = "*"

  /* setting appId as default */
  // headers['appid'] = 'hummz';

  return { headers };
};
export const ApiPostInce = (type, tokan, body) => {
  return new Promise((resolve, reject) => {
    fetch(BaseURL + type, {
      method: "Post",
      // mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        authorization: tokan,
      },

      body: JSON.stringify(body),
    })
      .then(async (response) => {
        // console.log(body)
        // console.log(response)
        if (response.ok) {
          const body1 = await response.json();
          // console.log(response.headers.get("content-type"));
          // console.log(response);
          return body1;
        } else {
          resolve(null);
        }
      })
      .then((buffer) => {
        resolve(buffer);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};
