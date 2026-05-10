import { useState } from "react";

interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  variant?: "error" | "success" | "warning" | "info";
}

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "warning" | "info";
}

export function useModal() {
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    title: "",
    message: "",
    variant: "info",
  });

  const [confirm, setConfirm] = useState<ConfirmState>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    variant: "danger",
  });

  const showAlert = (
    title: string,
    message: string,
    variant: AlertState["variant"] = "info",
  ) => {
    setAlert({
      isOpen: true,
      title,
      message,
      variant,
    });
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    variant: ConfirmState["variant"] = "danger",
  ) => {
    setConfirm({
      isOpen: true,
      title,
      message,
      onConfirm,
      variant,
    });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, isOpen: false }));
  };

  const closeConfirm = () => {
    setConfirm((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    alert,
    confirm,
    showAlert,
    showConfirm,
    closeAlert,
    closeConfirm,
  };
}
