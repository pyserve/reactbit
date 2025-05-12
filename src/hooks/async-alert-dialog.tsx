import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { createContext, ReactNode, useContext, useState } from "react";

export type DialogOptionsType = {
  title?: string;
  description?: string;
};

export type AsyncAlertContextType = {
  confirmDialog: (options: DialogOptionsType) => Promise<boolean>;
} | null;

export const AsyncAlertContext = createContext<AsyncAlertContextType>(null);

export const AsyncAlertContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<DialogOptionsType>();
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirmDialog = async (options: DialogOptionsType) => {
    setOptions(options);
    setTimeout(() => {
      setOpen(true);
    }, 100);

    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleCancel = () => {
    setOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
    }
  };

  const handleConfirm = () => {
    setOpen(false);
    if (resolvePromise) {
      resolvePromise(true);
    }
  };

  return (
    <AsyncAlertContext.Provider value={{ confirmDialog }}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {options?.title || "Are you absolutely sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {options?.description ||
                "This action cannot be undone. This will permanently delete it."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              // onSelect={(e) => e.preventDefault()}
              variant={"secondary"}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              // onSelect={(e) => e.preventDefault()}
              variant={"default"}
              onClick={handleConfirm}
            >
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AsyncAlertContext.Provider>
  );
};

export const useConfirmDialog = () => {
  const ctx = useContext(AsyncAlertContext);

  if (!ctx) throw new Error("Must initialize context provider.");
  return ctx;
};
