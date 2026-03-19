"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ItemModalContent } from "./ItemModalContent";
import type { AnyItem, ModalType } from "../../types";

interface ItemModalProps {
  type: ModalType;
  petName: string;
  items: AnyItem[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ItemModal({
  type,
  petName,
  items,
  isOpen,
  onClose,
  onConfirm,
}: ItemModalProps) {
  if (!type) {
    return null;
  }

  const content = (
    <ItemModalContent
      type={type}
      petName={petName}
      items={items}
      onConfirm={() => {
        onConfirm();
        onClose();
      }}
    />
  );

  return (
    <>
      {/* Mobile: Sheet slides up from bottom */}
      <div className="sm:hidden">
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <SheetContent side="bottom" className="rounded-t-2xl px-4 pb-8 pt-6">
            <SheetTitle className="sr-only">Item selection</SheetTitle>
            {content}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: centered Dialog */}
      <div className="hidden sm:block">
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="max-w-md rounded-2xl p-6">
            <DialogTitle className="sr-only">Item selection</DialogTitle>
            {content}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
