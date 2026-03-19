"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 bg-cream border-0 shadow-lg">
        <DialogTitle className="sr-only">Item selection</DialogTitle>
        <ItemModalContent
          type={type}
          petName={petName}
          items={items}
          onConfirm={() => {
            onConfirm();
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
