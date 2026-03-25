import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import api, { setAuthInterceptor } from "../services/api";
import {
  calculateRating,
  calculateChapterTime,
  calculateCourseDuration,
  calculateNoOfLectures,
} from "../utils/courseHelpers";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const { getToken, isLoaded: isAuthLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isEducatorLoading, setIsEducatorLoading] = useState(true);

  // Wire up auth header interceptor once
  useEffect(() => {
    if (isAuthLoaded) setAuthInterceptor(getToken);
  }, [isAuthLoaded, getToken]);

  // ── API Calls ───────────────────────────────────────────────────────────

  const fetchAllCourses = async () => {
    try {
      const { data } = await api.get("/api/course/all");
      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserData = async () => {
    if (user.publicMetadata.role === "educator") {
      setIsEducator(true);
    }
    setIsEducatorLoading(false);

    try {
      const token = await getToken();
      const { data } = await api.get("/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserEnrolledCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get("/api/user/enrolled-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ── Side Effects ────────────────────────────────────────────────────────

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (isAuthLoaded && isUserLoaded) {
      if (user) {
        fetchUserData();
        fetchUserEnrolledCourses();
      } else {
        setIsEducator(false);
        setUserData(null);
        setEnrolledCourses([]);
        setIsEducatorLoading(false);
      }
    }
  }, [user, isAuthLoaded, isUserLoaded]);

  // ── Context Value ─────────────────────────────────────────────────────────

  const value = {
    currency,
    allCourses,
    navigate,
    isEducator,
    setIsEducator,
    isEducatorLoading,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchUserData,
    fetchAllCourses,
    // Utility functions (re-exported for backward compat)
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
