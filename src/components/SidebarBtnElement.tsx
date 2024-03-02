import React from "react";
import { FormElements ,FormElement,ElementsType} from "@/types/FormElements";

import { Button } from "./ui/button";
// import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import useDesigner from "@/hooks/useDesigner";
import { idGenerator } from "@/lib/idGenerator";

function SidebarBtnElement({ formElement }: { formElement: FormElement }) {
  const { elements, addElement, selectedElement, setSelectedElement, removeElement } = useDesigner();
  const { label, icon: Icon } = formElement.designerBtnElement;
  
  const handleAdd = () => {
    const fieldType = formElement.fieldType
    const newElement = FormElements[fieldType as ElementsType].construct(idGenerator());
    addElement(elements.length, newElement);
    return
  }

  return (
    <Button
      onClick={handleAdd}
      variant={"outline"}
      className={cn(
        "flex flex-col gap-2 h-[120px] w-[120px] cursor-pointer",
        // draggable.isDragging && "ring-2 ring-primary",
      )}
    >
      <Icon className="h-8 w-8 text-primary cursor-pointer" />
      <p className="text-xs">{label}</p>
    </Button>
  );
}

export function SidebarBtnElementDragOverlay({ formElement }: { formElement: FormElement }) {
  const { label, icon: Icon } = formElement.designerBtnElement;

  return (
    <Button variant={"outline"} className="flex flex-col gap-2 h-[120px] w-[120px] cursor-grab">
      <Icon className="h-8 w-8 text-primary cursor-pointer" />
      <p className="text-xs">{label}</p>
    </Button>
  );
}

export default SidebarBtnElement;
