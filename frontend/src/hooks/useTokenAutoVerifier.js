import { useEffect, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import authService from "../services/authServices";
import throttle from "lodash.throttle";

const useTokenAutoVerifier = ({
  delay = 60000,
  warningDelay = 900000,
  throttleDelay = 3000, // Limita verificación a una vez cada 3 segundos
} = {}) => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);
  const hasRedirectedRef = useRef(false);

  const checkToken = useCallback(async () => {
    try {
      await authService.verifytoken();
    } catch (error) {
      console.error("Token inválido:", error);
      Cookies.remove("token");

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
    }
  }, [navigate]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    timeoutRef.current = setTimeout(() => {
      checkToken();
    }, delay);

    warningRef.current = setTimeout(() => {
      if (hasRedirectedRef.current) return;

      const warningEvent = new CustomEvent("token-expiry-warning", {
        detail: {
          onExtend: () => {
            resetTimer();
            checkToken();
          },
          onLogout: () => {
            Cookies.remove("token");
            navigate("/login");
          },
        },
      });
      window.dispatchEvent(warningEvent);
    }, warningDelay);
  }, [checkToken, delay, warningDelay, navigate]);

  const throttledHandleActivity = useCallback(
    throttle(() => {
      checkToken();
      resetTimer();
    }, throttleDelay),
    [checkToken, resetTimer, throttleDelay]
  );

  useEffect(() => {
    window.addEventListener("mousemove", throttledHandleActivity);
    window.addEventListener("click", throttledHandleActivity);
    window.addEventListener("keydown", throttledHandleActivity);
    window.addEventListener("scroll", throttledHandleActivity);

    checkToken();
    resetTimer();

    return () => {
      window.removeEventListener("mousemove", throttledHandleActivity);
      window.removeEventListener("click", throttledHandleActivity);
      window.removeEventListener("keydown", throttledHandleActivity);
      window.removeEventListener("scroll", throttledHandleActivity);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      throttledHandleActivity.cancel(); // Limpia el throttle
    };
  }, [checkToken, resetTimer, throttledHandleActivity]);

  return null;
};

export default useTokenAutoVerifier;
