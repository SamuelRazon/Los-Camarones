import { useEffect, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import authService from "../services/authServices";
import throttle from "lodash.throttle";

const useTokenAutoVerifier = ({ throttleDelay = 3000 } = {}) => {
  const navigate = useNavigate();
  const hasRedirectedRef = useRef(false);
  const isVerifyingRef = useRef(false);

  const checkToken = useCallback(async () => {
  if (isVerifyingRef.current) return;

  const token = Cookies.get("token");
  if (!token) {
    console.warn("No hay token en cookies, redirigiendo al login.");

    if (!hasRedirectedRef.current) {
      hasRedirectedRef.current = true;

      const expiredEvent = new CustomEvent("token-expired", {
        detail: {
          message: "Tu sesión ha expirado.",
        },
      });
      window.dispatchEvent(expiredEvent);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }

    return;
  }

  isVerifyingRef.current = true;
  try {
    await authService.verifytoken();
  } catch (error) {
    console.error("Token inválido:", error);

    if (!hasRedirectedRef.current) {
      Cookies.remove("token");
      hasRedirectedRef.current = true;

      const expiredEvent = new CustomEvent("token-expired", {
        detail: {
          message: "Tu sesión ha expirado.",
        },
      });
      window.dispatchEvent(expiredEvent);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  } finally {
    isVerifyingRef.current = false;
  }
}, [navigate]);

  const throttledHandleActivity = useCallback(
    throttle(() => {
      checkToken();
    }, throttleDelay),
    [checkToken, throttleDelay]
  );

  useEffect(() => {
    const initialToken = Cookies.get("token");
    if (initialToken) {
      setTimeout(() => {
        checkToken();
      }, 300);
    }

    window.addEventListener("mousemove", throttledHandleActivity);
    window.addEventListener("click", throttledHandleActivity);
    window.addEventListener("keydown", throttledHandleActivity);
    window.addEventListener("scroll", throttledHandleActivity);

    return () => {
      window.removeEventListener("mousemove", throttledHandleActivity);
      window.removeEventListener("click", throttledHandleActivity);
      window.removeEventListener("keydown", throttledHandleActivity);
      window.removeEventListener("scroll", throttledHandleActivity);

      throttledHandleActivity.cancel();
    };
  }, [checkToken, throttledHandleActivity]);

  return null;
};

export default useTokenAutoVerifier;
