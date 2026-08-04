import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../config/firebase";

const CheckAuth = ({ children }) => {
  return <>{children}</>;
};

export default CheckAuth;